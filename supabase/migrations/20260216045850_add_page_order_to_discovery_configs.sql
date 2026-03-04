/*
  # Add page_order field to discovery configs

  1. Changes
    - The page_order field is already part of the JSONB config_data column
    - No schema changes needed as JSONB is flexible
    - This migration documents the new field in config_data structure
  
  2. Notes
    - Existing records will automatically work with the new field
    - Default page order: ['Home', 'Services', 'About', 'Doctors', 'Forms', 'Contact']
    - Additional pages will be appended to this order
    - Users can drag and drop to reorder pages
*/

-- This is a documentation-only migration
-- The page_order field is stored in the JSONB config_data column
-- No database structure changes are required

SELECT 1; -- No-op query to make migration valid
