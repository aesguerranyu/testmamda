
-- Fix memberships: restrict CMS policies from {public} to {authenticated}
DROP POLICY IF EXISTS "CMS users can view memberships" ON public.memberships;
CREATE POLICY "CMS users can view memberships" ON public.memberships FOR SELECT TO authenticated USING (is_cms_user(auth.uid()));

DROP POLICY IF EXISTS "CMS users can delete memberships" ON public.memberships;
CREATE POLICY "CMS users can delete memberships" ON public.memberships FOR DELETE TO authenticated USING (is_cms_user(auth.uid()));

DROP POLICY IF EXISTS "CMS users can update memberships" ON public.memberships;
CREATE POLICY "CMS users can update memberships" ON public.memberships FOR UPDATE TO authenticated USING (is_cms_user(auth.uid())) WITH CHECK (is_cms_user(auth.uid()));

-- Fix appointments: restrict CMS policies from {public} to {authenticated}
DROP POLICY IF EXISTS "CMS users can view all appointments" ON public.appointments;
CREATE POLICY "CMS users can view all appointments" ON public.appointments FOR SELECT TO authenticated USING (is_cms_user(auth.uid()));

DROP POLICY IF EXISTS "CMS users can insert appointments" ON public.appointments;
CREATE POLICY "CMS users can insert appointments" ON public.appointments FOR INSERT TO authenticated WITH CHECK (is_cms_user(auth.uid()));

DROP POLICY IF EXISTS "CMS users can update appointments" ON public.appointments;
CREATE POLICY "CMS users can update appointments" ON public.appointments FOR UPDATE TO authenticated USING (is_cms_user(auth.uid()));

DROP POLICY IF EXISTS "CMS users can delete appointments" ON public.appointments;
CREATE POLICY "CMS users can delete appointments" ON public.appointments FOR DELETE TO authenticated USING (is_cms_user(auth.uid()));

-- Fix budget_submissions: restrict CMS policies from {public} to {authenticated}
DROP POLICY IF EXISTS "CMS users can view submissions" ON public.budget_submissions;
CREATE POLICY "CMS users can view submissions" ON public.budget_submissions FOR SELECT TO authenticated USING (is_cms_user(auth.uid()));

DROP POLICY IF EXISTS "CMS users can delete budget submissions" ON public.budget_submissions;
CREATE POLICY "CMS users can delete budget submissions" ON public.budget_submissions FOR DELETE TO authenticated USING (is_cms_user(auth.uid()));

-- Fix first100_activities: restrict CMS policies from {public} to {authenticated}
DROP POLICY IF EXISTS "CMS users can view all activities" ON public.first100_activities;
CREATE POLICY "CMS users can view all activities" ON public.first100_activities FOR SELECT TO authenticated USING (is_cms_user(auth.uid()));

DROP POLICY IF EXISTS "CMS users can insert activities" ON public.first100_activities;
CREATE POLICY "CMS users can insert activities" ON public.first100_activities FOR INSERT TO authenticated WITH CHECK (is_cms_user(auth.uid()));

DROP POLICY IF EXISTS "CMS users can update activities" ON public.first100_activities;
CREATE POLICY "CMS users can update activities" ON public.first100_activities FOR UPDATE TO authenticated USING (is_cms_user(auth.uid()));

DROP POLICY IF EXISTS "CMS users can delete activities" ON public.first100_activities;
CREATE POLICY "CMS users can delete activities" ON public.first100_activities FOR DELETE TO authenticated USING (is_cms_user(auth.uid()));

-- Fix first100_days: restrict CMS policies from {public} to {authenticated}
DROP POLICY IF EXISTS "CMS users can view all days" ON public.first100_days;
CREATE POLICY "CMS users can view all days" ON public.first100_days FOR SELECT TO authenticated USING (is_cms_user(auth.uid()));

DROP POLICY IF EXISTS "CMS users can insert days" ON public.first100_days;
CREATE POLICY "CMS users can insert days" ON public.first100_days FOR INSERT TO authenticated WITH CHECK (is_cms_user(auth.uid()));

DROP POLICY IF EXISTS "CMS users can update days" ON public.first100_days;
CREATE POLICY "CMS users can update days" ON public.first100_days FOR UPDATE TO authenticated USING (is_cms_user(auth.uid()));

DROP POLICY IF EXISTS "CMS users can delete days" ON public.first100_days;
CREATE POLICY "CMS users can delete days" ON public.first100_days FOR DELETE TO authenticated USING (is_cms_user(auth.uid()));
