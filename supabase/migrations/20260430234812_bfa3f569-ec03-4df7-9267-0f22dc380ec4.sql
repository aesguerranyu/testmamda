
DROP VIEW IF EXISTS public.promise_signal_stats;

CREATE VIEW public.promise_signal_stats
WITH (security_invoker = true) AS
SELECT
  promise_id,
  COUNT(*) FILTER (WHERE is_priority = true) AS priority_count,
  COUNT(*) FILTER (WHERE doability = 'doable') AS doable_count,
  COUNT(*) FILTER (WHERE doability = 'unrealistic') AS unrealistic_count,
  COUNT(*) FILTER (WHERE doability = 'unsure') AS unsure_count,
  COUNT(*) FILTER (WHERE doability IS NOT NULL) AS doability_total,
  COUNT(*) FILTER (WHERE is_priority = true AND created_at > now() - interval '7 days') AS priority_count_week
FROM public.promise_signals
GROUP BY promise_id;

GRANT SELECT ON public.promise_signal_stats TO anon, authenticated;
