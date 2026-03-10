/*
  # Create discovery_drafts table

  1. New Tables
    - `discovery_drafts`
      - `id` (uuid, primary key) - unique identifier for the draft
      - `session_token` (text, unique) - browser-generated token to identify the session
      - `config_data` (jsonb) - the full discovery config state
      - `current_step` (integer) - which step the user was on
      - `practice_name` (text) - practice name if entered
      - `contact_email` (text) - contact email if entered
      - `created_at` (timestamptz) - when the draft was first created
      - `updated_at` (timestamptz) - when the draft was last updated

  2. Security
    - Enable RLS on `discovery_drafts` table
    - Allow anonymous users to insert new drafts
    - Allow anonymous users to select their own drafts by session_token
    - Allow anonymous users to update their own drafts by session_token

  3. Notes
    - Uses a session_token (UUID generated in the browser) rather than auth.uid()
      because discovery is a public-facing form for prospective clients
    - Drafts can be resumed by revisiting the URL with the draft parameter
*/

CREATE TABLE IF NOT EXISTS discovery_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token text NOT NULL,
  config_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  current_step integer NOT NULL DEFAULT 0,
  practice_name text NOT NULL DEFAULT '',
  contact_email text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_discovery_drafts_session_token
  ON discovery_drafts (session_token);

ALTER TABLE discovery_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon can insert discovery drafts"
  ON discovery_drafts
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can select own drafts by session token"
  ON discovery_drafts
  FOR SELECT
  TO anon
  USING (session_token = current_setting('request.header.x-session-token', true));

CREATE POLICY "Anon can update own drafts by session token"
  ON discovery_drafts
  FOR UPDATE
  TO anon
  USING (session_token = current_setting('request.header.x-session-token', true))
  WITH CHECK (session_token = current_setting('request.header.x-session-token', true));

CREATE POLICY "Authenticated users can manage all drafts"
  ON discovery_drafts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
