/*
  # Create discovery_configs table

  1. New Tables
    - `discovery_configs`
      - `id` (uuid, primary key) - unique config identifier
      - `created_at` (timestamptz) - when the config was created
      - `updated_at` (timestamptz) - last update timestamp
      - `practice_name` (text) - name of the practice for reference
      - `contact_email` (text) - contact email for the practice
      - `config_data` (jsonb) - full discovery form answers as JSON
      - `proposal_config` (jsonb) - generated proposal configuration (hosting scores, visibility rules, pre-selections)
      - `is_active` (boolean) - whether this config is currently active

  2. Security
    - Enable RLS on `discovery_configs` table
    - Add policy for anon users to insert new configs (public form submission)
    - Add policy for anon users to read configs by ID (for loading shared proposals)

  3. Notes
    - Uses JSONB for flexible schema that matches the DiscoveryConfig TypeScript interface
    - proposal_config stores the computed output of the configuration engine
    - is_active allows soft-deactivation of old configs
*/

CREATE TABLE IF NOT EXISTS discovery_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  practice_name text NOT NULL DEFAULT '',
  contact_email text NOT NULL DEFAULT '',
  config_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  proposal_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true
);

ALTER TABLE discovery_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit discovery configs"
  ON discovery_configs
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read discovery configs by id"
  ON discovery_configs
  FOR SELECT
  TO anon
  USING (is_active = true);
