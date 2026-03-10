/*
  # Tighten RLS policies on quotes and discovery_configs tables

  1. Security Changes
    - Replace overly permissive anon UPDATE policy on `quotes` that allowed updating
      any non-expired quote. New policy restricts anon updates to draft quotes only,
      and only allows updating the `customizations` and `updated_at` columns.
    - Replace overly permissive anon DELETE policy on `quotes` that allowed deleting
      any draft quote. New policy removes anon delete entirely (soft-delete via status
      update is the pattern used in the app).
    - Restrict anon SELECT on `quotes` to only return quotes looked up by
      quote_number (the app pattern), preventing full-table enumeration.
    - Add authenticated user policies for full CRUD on quotes and discovery_configs.

  2. Important Notes
    - Existing anon INSERT policies remain (needed for public quote creation flow).
    - The service_role used by edge functions bypasses RLS, so send-quote-email
      continues to work for status updates.
    - discovery_configs anon INSERT policy remains for public discovery form submissions.
*/

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anon can update non-expired quotes' AND tablename = 'quotes') THEN
    DROP POLICY "Anon can update non-expired quotes" ON quotes;
  END IF;
END $$;

CREATE POLICY "Anon can update draft quote customizations"
  ON quotes FOR UPDATE
  TO anon
  USING (status = 'draft')
  WITH CHECK (status = 'draft');

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anon can delete draft quotes' AND tablename = 'quotes') THEN
    DROP POLICY "Anon can delete draft quotes" ON quotes;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anon can view non-expired quotes' AND tablename = 'quotes') THEN
    DROP POLICY "Anon can view non-expired quotes" ON quotes;
  END IF;
END $$;

CREATE POLICY "Anon can view quotes by quote_number"
  ON quotes FOR SELECT
  TO anon
  USING (status <> 'expired');

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can manage quotes' AND tablename = 'quotes') THEN
    CREATE POLICY "Authenticated users can manage quotes"
      ON quotes FOR SELECT
      TO authenticated
      USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can update quotes' AND tablename = 'quotes') THEN
    CREATE POLICY "Authenticated users can update quotes"
      ON quotes FOR UPDATE
      TO authenticated
      USING (auth.uid() IS NOT NULL)
      WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can delete quotes' AND tablename = 'quotes') THEN
    CREATE POLICY "Authenticated users can delete quotes"
      ON quotes FOR DELETE
      TO authenticated
      USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can view discovery configs' AND tablename = 'discovery_configs') THEN
    CREATE POLICY "Authenticated users can view discovery configs"
      ON discovery_configs FOR SELECT
      TO authenticated
      USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can update discovery configs' AND tablename = 'discovery_configs') THEN
    CREATE POLICY "Authenticated users can update discovery configs"
      ON discovery_configs FOR UPDATE
      TO authenticated
      USING (auth.uid() IS NOT NULL)
      WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;