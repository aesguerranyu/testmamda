CREATE POLICY "CMS users can update memberships"
ON public.memberships
FOR UPDATE
TO public
USING (is_cms_user(auth.uid()))
WITH CHECK (is_cms_user(auth.uid()));