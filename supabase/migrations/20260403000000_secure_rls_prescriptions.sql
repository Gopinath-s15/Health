-- Add user_id column to prescriptions table
ALTER TABLE public.prescriptions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id column to medicines table (optional but good for direct RLS)
ALTER TABLE public.medicines ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add duration column to medicines table to fix TypeScript and insert errors
ALTER TABLE public.medicines ADD COLUMN IF NOT EXISTS duration TEXT;

-- Drop insecure policies
DROP POLICY IF EXISTS "Allow read prescriptions" ON public.prescriptions;
DROP POLICY IF EXISTS "Allow insert prescriptions" ON public.prescriptions;
DROP POLICY IF EXISTS "Allow read medicines" ON public.medicines;
DROP POLICY IF EXISTS "Allow insert medicines" ON public.medicines;

-- Create secure policies for prescriptions
CREATE POLICY "Users can read own prescriptions" ON public.prescriptions 
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own prescriptions" ON public.prescriptions 
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prescriptions" ON public.prescriptions 
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own prescriptions" ON public.prescriptions 
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create secure policies for medicines
CREATE POLICY "Users can read own medicines" ON public.medicines 
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own medicines" ON public.medicines 
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own medicines" ON public.medicines 
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own medicines" ON public.medicines 
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
