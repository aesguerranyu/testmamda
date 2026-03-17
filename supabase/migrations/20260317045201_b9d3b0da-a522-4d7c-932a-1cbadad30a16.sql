
ALTER TABLE public.budget_submissions
  ADD COLUMN IF NOT EXISTS is_balanced boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS wants_membership boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS share_id text UNIQUE DEFAULT gen_random_uuid()::text;

-- Allow public to read a single submission by share_id (for shared card)
CREATE POLICY "Anyone can view submission by share_id"
  ON public.budget_submissions
  FOR SELECT
  TO public
  USING (share_id IS NOT NULL);
