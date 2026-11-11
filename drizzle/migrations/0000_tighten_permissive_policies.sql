DROP POLICY IF EXISTS "Anyone can submit membership" ON public.memberships;
CREATE POLICY "Anyone can submit valid membership" ON public.memberships FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(btrim(name)) BETWEEN 1 AND 100
  AND char_length(email) BETWEEN 3 AND 255
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND char_length(btrim(borough)) BETWEEN 1 AND 50
  AND coalesce(char_length(last_name), 0) <= 100
  AND coalesce(char_length(city), 0) <= 100
);

DROP POLICY IF EXISTS "Anyone can submit a budget" ON public.budget_submissions;
CREATE POLICY "Anyone can submit a valid budget" ON public.budget_submissions FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(btrim(name)) BETWEEN 1 AND 100
  AND char_length(email) BETWEEN 3 AND 255
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND jsonb_typeof(allocations) = 'object'
  AND pg_column_size(allocations) < 20000
);

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view site settings" ON public.site_settings;
CREATE POLICY "Anyone can view enabled site settings" ON public.site_settings FOR SELECT TO anon, authenticated
USING (enabled = true);
CREATE POLICY "Admins can view all site settings" ON public.site_settings FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Anyone can view signals" ON public.promise_signals;
CREATE POLICY "Users can view own signals" ON public.promise_signals FOR SELECT TO authenticated
USING (auth.uid() = user_id);
-- aggregate-only view keeps public stats working without exposing individual rows
ALTER VIEW public.promise_signal_stats SET (security_invoker = false);
GRANT SELECT ON public.promise_signal_stats TO anon, authenticated;