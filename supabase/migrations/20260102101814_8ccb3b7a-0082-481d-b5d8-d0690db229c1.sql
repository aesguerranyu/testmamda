-- Create memberships table to store form submissions
CREATE TABLE public.memberships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  last_name TEXT DEFAULT '',
  email TEXT NOT NULL,
  borough TEXT NOT NULL,
  city TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (no auth required for signup)
CREATE POLICY "Anyone can submit membership" 
ON public.memberships 
FOR INSERT 
WITH CHECK (true);

-- Only CMS users can view memberships
CREATE POLICY "CMS users can view memberships" 
ON public.memberships 
FOR SELECT 
USING (is_cms_user(auth.uid()));

-- Only CMS users can delete memberships
CREATE POLICY "CMS users can delete memberships" 
ON public.memberships 
FOR DELETE 
USING (is_cms_user(auth.uid()));