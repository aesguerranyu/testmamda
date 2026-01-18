-- Create the update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  appointee_name TEXT NOT NULL DEFAULT '',
  former_role TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  editorial_state TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Public can view published appointments
CREATE POLICY "Anyone can view published appointments"
ON public.appointments
FOR SELECT
USING (editorial_state = 'published');

-- CMS users can view all appointments
CREATE POLICY "CMS users can view all appointments"
ON public.appointments
FOR SELECT
USING (is_cms_user(auth.uid()));

-- CMS users can insert appointments
CREATE POLICY "CMS users can insert appointments"
ON public.appointments
FOR INSERT
WITH CHECK (is_cms_user(auth.uid()));

-- CMS users can update appointments
CREATE POLICY "CMS users can update appointments"
ON public.appointments
FOR UPDATE
USING (is_cms_user(auth.uid()));

-- CMS users can delete appointments
CREATE POLICY "CMS users can delete appointments"
ON public.appointments
FOR DELETE
USING (is_cms_user(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();