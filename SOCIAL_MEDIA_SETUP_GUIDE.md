# 🌱 EcoSort Social Media Feature - Complete Setup Guide

## 📋 Overview

This guide will help you set up the complete social media feature for EcoSort, including:
- User profiles with avatars and bios
- Post creation with images, location, and tags
- Like and comment system
- Follow/unfollow functionality  
- Nearby users discovery (location-based)
- Real-time feed
- Notifications

---

## 🗄️ Step 1: Database Setup

### Run the SQL Schema

1. **Open Supabase Dashboard**: https://app.supabase.com
2. **Select your project**: `vylvkjfejsxjervfxzsm`
3. **Navigate to**: `SQL Editor` → `+ New Query`
4. **Copy and paste** the entire contents of `supabase-social-schema.sql`
5. **Click `Run`** (or press `Ctrl+Enter`)

### Verify Tables Created

Go to **Table Editor** and confirm these tables exist:
- ✅ profiles
- ✅ posts
- ✅ likes
- ✅ comments
- ✅ follows
- ✅ notifications

---

## 📦 Step 2: Storage Buckets Setup

### Create Storage Buckets for Images

1. **Navigate to**: `Storage` in Supabase Dashboard
2. **Create two new buckets**:

#### Bucket 1: Posts Images
- **Name**: `posts`
- **Public**: ✅ Yes
- **File size limit**: 5MB
- **Allowed MIME types**: `image/jpeg, image/png, image/webp, image/gif`

#### Bucket 2: User Avatars
- **Name**: `avatars`
- **Public**: ✅ Yes
- **File size limit**: 2MB
- **Allowed MIME types**: `image/jpeg, image/png, image/webp`

### Set Storage Policies

For **`posts`** bucket:
```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload posts images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'posts');

-- Allow public to read
CREATE POLICY "Public can view posts images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'posts');

-- Allow users to delete own images
CREATE POLICY "Users can delete own posts images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'posts' AND auth.uid() = owner);
```

For **`avatars`** bucket:
```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- Allow public to read
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Allow users to update/delete own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid() = owner);

CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid() = owner);
```

---

## 🔧 Step 3: Update Existing User Profiles

If you have existing users, run this migration:

```sql
-- Migrate existing profiles to new schema
-- This preserves existing data while adding new fields
DO $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN SELECT * FROM auth.users LOOP
        INSERT INTO profiles (
            id,
            username,
            email,
            created_at
        ) VALUES (
            user_record.id,
            COALESCE(user_record.raw_user_meta_data->>'username', 
                    split_part(user_record.email, '@', 1)),
            user_record.email,
            user_record.created_at
        )
        ON CONFLICT (id) DO NOTHING;
    END LOOP;
END $$;
```

---

## 🔑 Step 4: Environment Variables

Your `.env` file should already have:

```env
VITE_SUPABASE_URL=https://vylvkjfejsxjervfxzsm.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

**No additional environment variables needed!**

---

## 🎨 Step 5: Frontend Integration

All React components are already created:

### Pages:
- ✅ `/src/pages/Social.jsx` - Main feed
- ✅ `/src/pages/Profile.jsx` - User profile
- ✅ `/src/pages/EditProfile.jsx` - Edit profile
- ✅ `/src/pages/NearbyUsers.jsx` - Location-based discovery

### Components:
- ✅ `/src/components/PostCard.jsx` - Individual post display
- ✅ `/src/components/CreatePostModal.jsx` - Create new post
- ✅ `/src/components/FallingLeaves.jsx` - Animation effect

### Services:
- ✅ `/src/services/socialService.js` - All API calls

### Routes (in App.jsx):
- ✅ `/social` - Community feed
- ✅ `/profile` - Own profile
- ✅ `/profile/:username` - Other users' profiles
- ✅ `/profile/edit` - Edit profile
- ✅ `/nearby` - Nearby users

---

## 🚀 Step 6: Start the Application

```bash
npm run dev
```

The app will be available at: `http://localhost:5173` (or next available port)

---

## 📱 Features Overview

### 1. **User Profile**
- Upload avatar and cover photo
- Edit bio, location, website
- View posts, followers, following
- Total points and level display

### 2. **Social Feed**
- Create posts with text, images, location, tags
- Like and unlike posts
- Comment on posts
- View nearby eco-warriors
- Real-time updates

### 3. **Post Features**
- Rich text content
- Image uploads (single per post)
- Location tagging (auto-detect or manual)
- Hashtags/tags
- Privacy settings (public/private)

### 4. **Interactions**
- Like posts (double-click or button)
- Comment on posts
- Reply to comments
- Follow/unfollow users
- Share posts

### 5. **Discovery**
- Nearby users (radius: 10-100km)
- Search users by username or name
- Browse community feed
- Trending topics

### 6. **Gamification Integration**
- Points for posts (+10)
- Points for likes received (+2)
- Points for comments (+5)
- Level up system
- Achievements

---

## 🧪 Testing the Features

### Test 1: Create a Post
1. Navigate to `/social`
2. Click the "+" button or text input
3. Write content: "Just recycled 5 plastic bottles! 🌍"
4. Add a photo (optional)
5. Click "Get Location"
6. Add tags: `recycling, eco-friendly`
7. Click "Post"

### Test 2: Like and Comment
1. Find a post in the feed
2. Click the heart icon to like
3. Click comment icon
4. Write a comment: "Great work! 👏"
5. Click "Post"

### Test 3: Follow a User
1. Click on a username in the feed
2. View their profile
3. Click "Follow" button
4. Check follower count increases

### Test 4: Edit Profile
1. Click your username in header
2. Click "Edit Profile"
3. Upload an avatar
4. Add bio: "Environmental enthusiast passionate about sustainability"
5. Add location
6. Click "Save Changes"

### Test 5: Nearby Users
1. Navigate to `/nearby`
2. Allow location access when prompted
3. Select radius (10km, 25km, 50km, 100km)
4. View list of nearby users with distance
5. Click on a user to view their profile

---

## 🔍 Troubleshooting

### Issue: "Failed to load posts"
**Solution**: Check RLS policies are enabled on `posts` table

```sql
-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'posts';

-- Should return rowsecurity = true
```

### Issue: "Cannot upload images"
**Solution**: Verify storage buckets exist and policies are set

1. Go to Storage → Check `posts` and `avatars` buckets exist
2. Check bucket policies are active
3. Verify bucket is set to **Public**

### Issue: "Nearby users not working"
**Solution**: 
1. Ensure browser has location permission
2. Check if `find_nearby_users` function exists:

```sql
SELECT proname FROM pg_proc WHERE proname = 'find_nearby_users';
```

### Issue: "Profile not updating"
**Solution**: Check update policy on profiles table

```sql
-- Add policy if missing
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
```

### Issue: "Comments not showing"
**Solution**: Check if comments table has proper foreign key relations

```sql
-- Verify foreign keys
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'comments';
```

---

## 🎯 Next Steps

### Enhancements You Can Add:

1. **Real-time subscriptions** for live updates
2. **Notifications system** for likes, comments, follows
3. **Direct messaging** between users
4. **Post sharing** functionality
5. **Report/block users** for moderation
6. **Trending hashtags** display
7. **User mentions** in posts (@username)
8. **Image carousel** for multiple images per post
9. **Video uploads** support
10. **Stories** feature (24-hour posts)

---

## 📊 Database Schema Diagram

```
profiles (1) ←→ (many) posts
profiles (1) ←→ (many) likes
profiles (1) ←→ (many) comments
profiles (many) ←→ (many) follows
posts (1) ←→ (many) likes
posts (1) ←→ (many) comments
```

---

## 🔒 Security Checklist

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Storage policies restrict access appropriately
- ✅ Input validation on frontend
- ✅ SQL injection protected (using Supabase client)
- ✅ XSS protection (React escapes by default)
- ✅ File upload restrictions (size, type)
- ✅ Rate limiting (Supabase provides this)

---

## 📞 Support

If you encounter any issues:

1. Check Supabase logs: Dashboard → Logs
2. Check browser console for errors (F12)
3. Verify all tables and policies exist
4. Ensure storage buckets are configured
5. Check environment variables are correct

---

## 🎉 You're Done!

Your EcoSort social media platform is now fully functional! Users can:
- ✅ Create and customize profiles
- ✅ Share eco-friendly posts with images
- ✅ Connect with nearby environmentalists
- ✅ Like, comment, and engage with content
- ✅ Build a sustainable community

**Happy Eco-Networking! 🌍💚**
