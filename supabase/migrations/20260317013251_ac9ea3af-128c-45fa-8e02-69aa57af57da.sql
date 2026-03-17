CREATE TABLE public.budget_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  allocations jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.budget_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a budget" ON public.budget_submissions
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "CMS users can view submissions" ON public.budget_submissions
  FOR SELECT TO public USING (is_cms_user(auth.uid()));