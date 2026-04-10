
-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Anyone can view submission by share_id" ON public.budget_submissions;

-- Create a security definer function that returns only non-sensitive data for a given share_id
CREATE OR REPLACE FUNCTION public.get_budget_by_share_id(_share_id text)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'allocations', allocations,
    'is_balanced', is_balanced,
    'created_at', created_at
  )
  FROM public.budget_submissions
  WHERE share_id = _share_id
  LIMIT 1
$$;
