/*
  # Create Quotes Table for Versioned Proposal Quotes

  1. New Tables
    - `quotes`
      - `id` (uuid, primary key) — unique quote identifier
      - `quote_number` (text, unique, not null) — human-readable sequential number, e.g. MEC-WEB-0001
      - `version` (integer, default 1) — version counter; v1 for originals, v2+ for revisions
      - `parent_quote_id` (uuid, nullable, FK → quotes.id) — NULL for originals, references parent for revisions
      - `discovery_config_id` (uuid, FK → discovery_configs.id) — links to the discovery form that generated this quote
      - `practice_name` (text, not null) — practice name at time of quote
      - `contact_email` (text, not null) — contact email at time of quote
      - `config_snapshot` (jsonb) — frozen copy of DiscoveryConfig at quote creation
      - `proposal_snapshot` (jsonb) — frozen copy of ConfiguredProposal at quote creation
      - `customizations` (jsonb, nullable) — customer overrides from the Interactive Quote Builder
      - `status` (text, default 'draft') — lifecycle state: draft, sent, accepted, expired
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)
      - `expires_at` (timestamptz, nullable) — optional expiration date

  2. New Functions
    - `generate_quote_number()` — BEFORE INSERT trigger function that auto-generates
      sequential quote numbers (MEC-WEB-0001, MEC-WEB-0002, ...) for new quotes,
      and versioned suffixes (MEC-WEB-0001-v2, MEC-WEB-0001-v3) for revisions.
      Uses advisory lock to prevent race conditions.
    - `protect_quote_immutable_columns()` — BEFORE UPDATE trigger function that
      prevents anon users from modifying columns other than customizations, status,
      and updated_at.

  3. Modified Tables
    - `discovery_configs`
      - Added `latest_quote_id` (uuid, nullable, FK → quotes.id) — back-reference
        to the most recent quote generated from this config

  4. Security
    - Enable RLS on `quotes` table
    - Anon can INSERT new draft quotes (public form submission)
    - Anon can SELECT non-expired quotes (for loading by quote number or URL)
    - Anon can UPDATE non-expired quotes (restricted to customizations, status, updated_at by trigger)

  5. Indexes
    - `idx_quotes_discovery_config_id` on discovery_config_id for FK lookups
    - `idx_quotes_parent_quote_id` on parent_quote_id for version chain lookups
    - `idx_quotes_status` on status for filtered queries
*/

-- 1. Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number text UNIQUE NOT NULL DEFAULT '',
  version integer NOT NULL DEFAULT 1,
  parent_quote_id uuid REFERENCES quotes(id),
  discovery_config_id uuid NOT NULL REFERENCES discovery_configs(id),
  practice_name text NOT NULL,
  contact_email text NOT NULL,
  config_snapshot jsonb,
  proposal_snapshot jsonb,
  customizations jsonb,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  CONSTRAINT quotes_status_check CHECK (status IN ('draft', 'sent', 'accepted', 'expired'))
);

-- 2. Indexes
CREATE INDEX IF NOT EXISTS idx_quotes_discovery_config_id ON quotes(discovery_config_id);
CREATE INDEX IF NOT EXISTS idx_quotes_parent_quote_id ON quotes(parent_quote_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);

-- 3. Sequential numbering function
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TRIGGER AS $$
DECLARE
  next_seq integer;
  base_number text;
  next_version integer;
BEGIN
  IF NEW.quote_number IS NOT NULL AND NEW.quote_number != '' THEN
    RETURN NEW;
  END IF;

  IF NEW.parent_quote_id IS NULL THEN
    PERFORM pg_advisory_xact_lock(hashtext('quote_number_seq'));

    SELECT COALESCE(MAX(
      substring(q.quote_number from 'MEC-WEB-(\d{4})')::integer
    ), 0) + 1
    INTO next_seq
    FROM quotes q
    WHERE q.quote_number ~ '^MEC-WEB-\d{4}$';

    NEW.quote_number := 'MEC-WEB-' || lpad(next_seq::text, 4, '0');
    NEW.version := 1;
  ELSE
    SELECT q.quote_number INTO base_number
    FROM quotes q
    WHERE q.id = NEW.parent_quote_id;

    base_number := regexp_replace(base_number, '-v\d+$', '');

    SELECT COALESCE(MAX(q.version), 1) + 1
    INTO next_version
    FROM quotes q
    WHERE q.id = NEW.parent_quote_id
       OR q.parent_quote_id = NEW.parent_quote_id;

    NEW.quote_number := base_number || '-v' || next_version;
    NEW.version := next_version;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_quote_number
  BEFORE INSERT ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION generate_quote_number();

-- 4. Protect immutable columns on update for anon users
CREATE OR REPLACE FUNCTION protect_quote_immutable_columns()
RETURNS TRIGGER AS $$
BEGIN
  IF COALESCE(current_setting('request.jwt.claims', true)::jsonb->>'role', 'anon') = 'anon' THEN
    NEW.id := OLD.id;
    NEW.quote_number := OLD.quote_number;
    NEW.version := OLD.version;
    NEW.parent_quote_id := OLD.parent_quote_id;
    NEW.discovery_config_id := OLD.discovery_config_id;
    NEW.practice_name := OLD.practice_name;
    NEW.contact_email := OLD.contact_email;
    NEW.config_snapshot := OLD.config_snapshot;
    NEW.proposal_snapshot := OLD.proposal_snapshot;
    NEW.created_at := OLD.created_at;
    NEW.expires_at := OLD.expires_at;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_protect_quote_immutable_columns
  BEFORE UPDATE ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION protect_quote_immutable_columns();

-- 5. Enable RLS
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon can create draft quotes"
  ON quotes FOR INSERT
  TO anon
  WITH CHECK (status = 'draft');

CREATE POLICY "Anon can view non-expired quotes"
  ON quotes FOR SELECT
  TO anon
  USING (status != 'expired');

CREATE POLICY "Anon can update non-expired quotes"
  ON quotes FOR UPDATE
  TO anon
  USING (status != 'expired')
  WITH CHECK (status != 'expired');

-- 6. Add latest_quote_id back-reference to discovery_configs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'discovery_configs' AND column_name = 'latest_quote_id'
  ) THEN
    ALTER TABLE discovery_configs ADD COLUMN latest_quote_id uuid REFERENCES quotes(id);
  END IF;
END $$;
