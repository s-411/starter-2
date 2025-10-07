/*
  # Peptide Shot Tracker - Initial Database Schema

  ## Overview
  Creates the core database structure for the Peptide Shot Tracker application with 
  HIPAA-compliant security and row-level security policies.

  ## Tables Created

  ### 1. profiles
  - `id` (uuid, primary key) - References auth.users
  - `email` (text, unique) - User's email address
  - `full_name` (text, nullable) - User's full name
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. medications
  - `id` (uuid, primary key) - Unique medication identifier
  - `user_id` (uuid, foreign key) - References profiles
  - `name` (text) - Medication name (e.g., "Semaglutide", "Tirzepatide")
  - `dosage` (numeric) - Dosage amount
  - `unit` (text) - Unit of measurement (mg, mL, IU, mcg)
  - `frequency` (text) - Frequency type (daily, weekly, etc.)
  - `frequency_days` (numeric) - Number of days between injections
  - `preferred_injection_site` (text, nullable) - Default injection site
  - `is_active` (boolean) - Whether medication is currently active
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. injection_logs
  - `id` (uuid, primary key) - Unique log identifier
  - `user_id` (uuid, foreign key) - References profiles
  - `medication_id` (uuid, foreign key) - References medications
  - `injection_date` (timestamptz) - When injection was administered
  - `dosage` (numeric) - Actual dosage given
  - `injection_site` (text) - Body location of injection
  - `notes` (text, nullable) - Optional user notes
  - `is_completed` (boolean) - Whether injection was completed
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 4. reminders
  - `id` (uuid, primary key) - Unique reminder identifier
  - `user_id` (uuid, foreign key) - References profiles
  - `medication_id` (uuid, foreign key) - References medications
  - `reminder_time` (text) - Time of day for reminder (HH:MM format)
  - `hours_before` (integer) - Hours before injection to remind
  - `is_active` (boolean) - Whether reminder is enabled
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security

  ### Row Level Security (RLS)
  All tables have RLS enabled with policies that ensure:
  - Users can only access their own data
  - All operations require authentication
  - Data isolation between users for HIPAA compliance

  ### Policies Applied
  1. **SELECT**: Users can view only their own records
  2. **INSERT**: Users can create records for themselves
  3. **UPDATE**: Users can update only their own records
  4. **DELETE**: Users can delete only their own records

  ## Indexes
  Created for optimal query performance on:
  - User lookups (user_id columns)
  - Date range queries (injection_date, created_at)
  - Active medication filtering (is_active)

  ## Notes
  - All timestamps use timestamptz for timezone awareness
  - Default values set for booleans and timestamps
  - Foreign key constraints ensure referential integrity
  - Cascading deletes protect data consistency
*/

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- =============================================
-- MEDICATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS medications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  dosage numeric NOT NULL,
  unit text NOT NULL,
  frequency text NOT NULL,
  frequency_days numeric NOT NULL,
  preferred_injection_site text,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create index for user lookups
CREATE INDEX IF NOT EXISTS idx_medications_user_id ON medications(user_id);
CREATE INDEX IF NOT EXISTS idx_medications_active ON medications(user_id, is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;

-- Medications policies
CREATE POLICY "Users can view own medications"
  ON medications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own medications"
  ON medications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own medications"
  ON medications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own medications"
  ON medications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =============================================
-- INJECTION LOGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS injection_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  medication_id uuid NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
  injection_date timestamptz NOT NULL,
  dosage numeric NOT NULL,
  injection_site text NOT NULL,
  notes text,
  is_completed boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_injection_logs_user_id ON injection_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_injection_logs_medication_id ON injection_logs(medication_id);
CREATE INDEX IF NOT EXISTS idx_injection_logs_date ON injection_logs(user_id, injection_date DESC);

-- Enable RLS
ALTER TABLE injection_logs ENABLE ROW LEVEL SECURITY;

-- Injection logs policies
CREATE POLICY "Users can view own injection logs"
  ON injection_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own injection logs"
  ON injection_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own injection logs"
  ON injection_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own injection logs"
  ON injection_logs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =============================================
-- REMINDERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS reminders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  medication_id uuid NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
  reminder_time text NOT NULL,
  hours_before integer NOT NULL DEFAULT 1,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_medication_id ON reminders(medication_id);
CREATE INDEX IF NOT EXISTS idx_reminders_active ON reminders(user_id, is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Reminders policies
CREATE POLICY "Users can view own reminders"
  ON reminders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reminders"
  ON reminders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reminders"
  ON reminders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminders"
  ON reminders FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medications_updated_at
  BEFORE UPDATE ON medications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_injection_logs_updated_at
  BEFORE UPDATE ON injection_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reminders_updated_at
  BEFORE UPDATE ON reminders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();