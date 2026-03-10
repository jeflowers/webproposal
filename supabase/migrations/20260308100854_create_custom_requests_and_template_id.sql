/*
  # Create custom_requests table and add template_id to quotes

  1. New Tables
    - `custom_requests`
      - `id` (uuid, primary key, auto-generated)
      - `name` (text, required) - contact name
      - `email` (text, required) - contact email
      - `phone` (text, optional) - contact phone
      - `practice_name` (text, optional) - name of the practice
      - `vision_description` (text, required) - description of desired website
      - `preferred_style` (text, optional) - preferred template category
      - `reference_urls` (text, optional) - reference website URLs
      - `status` (text, default 'new') - request status tracking
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)

  2. Modified Tables
    - `quotes` - adds `template_id` column to track which template was chosen

  3. Security
    - Enable RLS on `custom_requests`
    - Allow anonymous inserts (customer-facing form)
    - Allow authenticated reads (admin access)
*/

CREATE TABLE IF NOT EXISTS custom_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  practice_name TEXT,
  vision_description TEXT NOT NULL,
  preferred_style TEXT,
  reference_urls TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE custom_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous custom request inserts"
  ON custom_requests
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated custom request reads"
  ON custom_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'template_id'
  ) THEN
    ALTER TABLE quotes ADD COLUMN template_id TEXT;
  END IF;
END $$;
