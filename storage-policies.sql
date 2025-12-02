-- ============================================
-- STORAGE BUCKET POLICIES FOR ECOSORT
-- Run this AFTER creating the buckets in UI
-- ============================================

-- ============================================
-- POSTS BUCKET POLICIES
-- ============================================

-- Allow authenticated users to upload posts images
CREATE POLICY "Authenticated users can upload posts images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'posts');

-- Allow public to view posts images
CREATE POLICY "Public can view posts images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'posts');

-- Allow users to delete their own posts images
CREATE POLICY "Users can delete own posts images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'posts' AND auth.uid() = owner);

-- Allow users to update their own posts images
CREATE POLICY "Users can update own posts images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'posts' AND auth.uid() = owner);

-- ============================================
-- AVATARS BUCKET POLICIES
-- ============================================

-- Allow authenticated users to upload avatars
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- Allow public to view avatars
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Allow users to update their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid() = owner);

-- Allow users to delete their own avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid() = owner);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if policies were created successfully
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename = 'objects'
ORDER BY policyname;

-- ============================================
-- NOTES
-- ============================================

/*
1. Create buckets FIRST in Supabase Dashboard:
   - Dashboard → Storage → New bucket
   - Name: 'posts' (set as Public)
   - Name: 'avatars' (set as Public)

2. Then run this SQL script

3. Verify policies:
   - Dashboard → Storage → Click bucket → Policies tab
   - Should see 4 policies per bucket

4. File size limits (set in Dashboard):
   - posts: 5MB max
   - avatars: 2MB max

5. Allowed file types:
   - image/jpeg
   - image/png
   - image/webp
   - image/gif (posts only)
*/
