
-- Create storage bucket for profile images
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true);

-- Create policy to allow authenticated users to upload their own images
CREATE POLICY "Users can upload their own profile images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow anyone to view profile images (since they're public)
CREATE POLICY "Anyone can view profile images"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-images');

-- Create policy to allow users to update their own profile images
CREATE POLICY "Users can update their own profile images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profile-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow users to delete their own profile images
CREATE POLICY "Users can delete their own profile images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profile-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
