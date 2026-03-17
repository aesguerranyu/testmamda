
CREATE OR REPLACE FUNCTION public.get_budget_aggregates()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH agency_stats AS (
    SELECT
      key AS agency,
      AVG((value->>'pct')::numeric) AS avg_pct,
      PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY (value->>'pct')::numeric)::numeric AS median_pct,
      MIN((value->>'pct')::numeric) AS min_pct,
      MAX((value->>'pct')::numeric) AS max_pct
    FROM public.budget_submissions, jsonb_each(allocations)
    GROUP BY key
  )
  SELECT jsonb_build_object(
    'total_submissions', (SELECT count(*) FROM public.budget_submissions),
    'balanced_submissions', (SELECT count(*) FROM public.budget_submissions WHERE is_balanced = true),
    'agencies', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'agency', agency,
          'avg_pct', ROUND(avg_pct, 1),
          'median_pct', ROUND(median_pct, 1),
          'min_pct', ROUND(min_pct, 1),
          'max_pct', ROUND(max_pct, 1)
        )
        ORDER BY avg_pct DESC
      )
      FROM agency_stats
    )
  )
$$;
