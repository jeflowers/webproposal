/*
  # Create Patient Forms and Referral Tables

  1. New Tables
    - `patient_registrations` - New patient intake data (name, DOB, phone, email, address, reason)
    - `medical_histories` - Eye conditions, surgeries, medications, allergies, diabetes, family history
    - `insurance_info` - Provider, policy/group numbers, policyholder, secondary insurance
    - `consent_forms` - HIPAA acknowledgment, treatment consent, signature
    - `doctor_referrals` - Physician info, patient info, urgency, reason, status tracking
    - `contact_messages` - General inquiries from the contact form

  2. Security
    - RLS enabled on all tables
    - Anonymous users can submit forms (INSERT only)
    - Authenticated staff can view submissions (SELECT only)
    - Authenticated staff can update referral status
*/

-- Patient Registrations
CREATE TABLE IF NOT EXISTS patient_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  date_of_birth date,
  phone text DEFAULT '',
  email text DEFAULT '',
  street_address text DEFAULT '',
  city text DEFAULT '',
  state text DEFAULT '',
  zip text DEFAULT '',
  reason_for_visit text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE patient_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to submit patient registrations"
  ON patient_registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated staff can view patient registrations"
  ON patient_registrations
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Medical Histories
CREATE TABLE IF NOT EXISTS medical_histories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_registration_id uuid REFERENCES patient_registrations(id),
  eye_conditions text DEFAULT '',
  previous_surgeries text DEFAULT '',
  current_medications text DEFAULT '',
  drug_allergies text DEFAULT '',
  has_diabetes text DEFAULT '',
  family_eye_disease text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE medical_histories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to submit medical histories"
  ON medical_histories
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated staff can view medical histories"
  ON medical_histories
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Insurance Info
CREATE TABLE IF NOT EXISTS insurance_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_registration_id uuid REFERENCES patient_registrations(id),
  insurance_provider text DEFAULT '',
  policy_number text DEFAULT '',
  group_number text DEFAULT '',
  policyholder_name text DEFAULT '',
  relationship_to_patient text DEFAULT '',
  secondary_insurance text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE insurance_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to submit insurance info"
  ON insurance_info
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated staff can view insurance info"
  ON insurance_info
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Consent Forms
CREATE TABLE IF NOT EXISTS consent_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_registration_id uuid REFERENCES patient_registrations(id),
  hipaa_acknowledged boolean DEFAULT false,
  treatment_consent boolean DEFAULT false,
  signature_name text DEFAULT '',
  signature_date date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE consent_forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to submit consent forms"
  ON consent_forms
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated staff can view consent forms"
  ON consent_forms
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Doctor Referrals
CREATE TABLE IF NOT EXISTS doctor_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  physician_name text NOT NULL DEFAULT '',
  practice_name text DEFAULT '',
  physician_phone text DEFAULT '',
  physician_fax text DEFAULT '',
  patient_name text NOT NULL DEFAULT '',
  patient_dob date,
  patient_phone text DEFAULT '',
  urgency_level text DEFAULT 'routine',
  reason_for_referral text DEFAULT '',
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE doctor_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to submit doctor referrals"
  ON doctor_referrals
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated staff can view doctor referrals"
  ON doctor_referrals
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated staff can update doctor referrals"
  ON doctor_referrals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Contact Messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  phone text DEFAULT '',
  email text DEFAULT '',
  subject text DEFAULT '',
  message text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to submit contact messages"
  ON contact_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated staff can view contact messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);
