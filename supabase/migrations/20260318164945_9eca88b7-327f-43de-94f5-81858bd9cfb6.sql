-- Create prescriptions table
CREATE TABLE public.prescriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_name TEXT NOT NULL,
  hospital_name TEXT NOT NULL,
  date DATE NOT NULL DEFAULT now(),
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create medicines table
CREATE TABLE public.medicines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prescription_id UUID NOT NULL REFERENCES public.prescriptions(id) ON DELETE CASCADE,
  medicine_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  timing TEXT NOT NULL,
  food_instruction TEXT NOT NULL DEFAULT 'N/A',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (no auth yet)
CREATE POLICY "Allow read prescriptions" ON public.prescriptions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow insert prescriptions" ON public.prescriptions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow read medicines" ON public.medicines FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow insert medicines" ON public.medicines FOR INSERT TO anon, authenticated WITH CHECK (true);