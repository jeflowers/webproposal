/*
  # Add expires_at column to quotes table

  1. Changes
    - Add `expires_at` column (timestamptz, nullable)
    - Quotes expire 30 days after being sent
    - Existing quotes will have null expires_at
*/

ALTER TABLE quotes
ADD COLUMN IF NOT EXISTS expires_at timestamptz;
