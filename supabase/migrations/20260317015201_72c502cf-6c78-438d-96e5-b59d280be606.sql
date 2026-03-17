CREATE POLICY "CMS users can delete budget submissions"
ON public.budget_submissions
FOR DELETE
TO public
USING (is_cms_user(auth.uid()));