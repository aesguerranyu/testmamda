-- Create storage bucket for First 100 Days images
INSERT INTO storage.buckets (id, name, public)
VALUES ('first100days-images', 'first100days-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Anyone can view images (public bucket)
CREATE POLICY "Anyone can view first100days images"
ON storage.objects FOR SELECT
USING (bucket_id = 'first100days-images');

-- Policy: CMS users can upload images
CREATE POLICY "CMS users can upload first100days images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'first100days-images' AND is_cms_user(auth.uid()));

-- Policy: CMS users can update images
CREATE POLICY "CMS users can update first100days images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'first100days-images' AND is_cms_user(auth.uid()));

-- Policy: CMS users can delete images
CREATE POLICY "CMS users can delete first100days images"
ON storage.objects FOR DELETE
USING (bucket_id = 'first100days-images' AND is_cms_user(auth.uid()));