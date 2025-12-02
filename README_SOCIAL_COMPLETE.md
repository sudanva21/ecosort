# 🌱 EcoSort - Complete Social Media Platform

## 🎉 What's New

Your EcoSort app now has a **full-featured social media platform** where users can:

- 👤 **Create & customize profiles** with avatars and bios
- 📝 **Share posts** with images, locations, and hashtags
- ❤️ **Like and comment** on posts
- 👥 **Follow/unfollow** other eco-warriors
- 📍 **Discover nearby users** based on location (10-100km radius)
- 🌍 **Build a sustainable community** together

---

## 📦 What Has Been Installed

### New Files Created:

#### ⚡ Backend (Supabase)
- **`supabase-social-schema.sql`** - Complete database schema with all tables, triggers, and functions
- **`storage-policies.sql`** - Storage bucket policies for images

#### 💻 Frontend (React)
**Pages:**
- `src/pages/Social.jsx` - Main community feed
- `src/pages/Profile.jsx` - User profiles
- `src/pages/EditProfile.jsx` - Profile editing
- `src/pages/NearbyUsers.jsx` - Location-based user discovery

**Components:**
- `src/components/PostCard.jsx` - Post display with interactions
- `src/components/CreatePostModal.jsx` - Create new posts
- `src/components/FallingLeaves.jsx` - Enhanced realistic animation

**Services:**
- `src/services/socialService.js` - All API functions for social features

#### 📚 Documentation
- `SOCIAL_MEDIA_SETUP_GUIDE.md` - Complete setup instructions
- `SOCIAL_MEDIA_SUMMARY.md` - Feature summary
- `README_SOCIAL_COMPLETE.md` - This file

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Run Database Schema

1. Open **Supabase Dashboard**: https://app.supabase.com
2. Select your project: `vylvkjfejsxjervfxzsm`
3. Go to **SQL Editor** → Click **+ New Query**
4. Copy entire contents of **`supabase-social-schema.sql`**
5. Paste and click **Run** (Ctrl+Enter)

✅ This creates all tables, triggers, and functions

### Step 2: Create Storage Buckets

1. Go to **Storage** in Supabase Dashboard
2. Click **New bucket**
3. Create **`posts`** bucket:
   - Name: `posts`
   - Public: ✅ Yes
4. Create **`avatars`** bucket:
   - Name: `avatars`
   - Public: ✅ Yes

### Step 3: Set Storage Policies

1. Go to **SQL Editor** again
2. Copy contents of **`storage-policies.sql`**
3. Paste and click **Run**

✅ This allows users to upload images

### Step 4: Verify Setup

**Check Tables:**
- Go to **Table Editor**
- Should see: `profiles`, `posts`, `likes`, `comments`, `follows`, `notifications`

**Check Storage:**
- Go to **Storage**
- Should see: `posts` and `avatars` buckets

### Step 5: Start App

```bash
npm run dev
```

Navigate to **http://localhost:5173** (or the port shown)

---

## 🎯 Using the Social Features

### 1. **Update Your Profile**

1. Click your username in the header
2. Click **Edit Profile**
3. Upload an avatar
4. Add bio, location, website
5. Click **Save Changes**

### 2. **Create Your First Post**

1. Click **Community** in navigation
2. Click the **+** button or text input
3. Write your post: "Just started my zero-waste journey! 🌍"
4. (Optional) Add a photo
5. (Optional) Click **Get Location**
6. (Optional) Add tags: `zerowaste, sustainability`
7. Click **Post**

### 3. **Interact with Posts**

- **Like**: Click the ❤️ icon
- **Comment**: Click 💬 icon, write comment, click Post
- **View Profile**: Click username or avatar

### 4. **Follow Users**

1. Click on any username
2. View their profile
3. Click **Follow** button
4. See their posts in your feed

### 5. **Find Nearby Eco-Warriors**

1. Go to **Community** page
2. See "Nearby Eco-Warriors" sidebar
3. Or click **View All** → Select radius
4. Allow location access
5. See users within your selected radius

---

## 📱 Features Overview

| Feature | Description | Status |
|---------|-------------|--------|
| User Profiles | Avatar, bio, location, followers | ✅ |
| Create Posts | Text, images, location, tags | ✅ |
| Like Posts | Heart icon, like count | ✅ |
| Comment System | Add, view, delete comments | ✅ |
| Follow/Unfollow | Build connections | ✅ |
| Nearby Users | Location-based (10-100km) | ✅ |
| Community Feed | See all public posts | ✅ |
| Image Uploads | Posts and avatars | ✅ |
| Search Users | Find by username/name | ✅ |
| Responsive Design | Mobile, tablet, desktop | ✅ |
| Animations | Realistic falling leaves | ✅ |

---

## 🗺️ Navigation

| Page | Route | Description |
|------|-------|-------------|
| Community Feed | `/social` | View and create posts |
| Your Profile | `/profile` | View your profile |
| Edit Profile | `/profile/edit` | Update your profile |
| User Profile | `/profile/:username` | View other users |
| Nearby Users | `/nearby` | Location-based discovery |

---

## 🔒 Security & Privacy

- ✅ **Row Level Security** enabled on all tables
- ✅ **Only authenticated users** can create/edit content
- ✅ **Users can only edit/delete own content**
- ✅ **Public posts** visible to everyone
- ✅ **Private posts** (future feature) visible only to followers
- ✅ **Image uploads** restricted to authenticated users
- ✅ **File size limits** enforced (5MB posts, 2MB avatars)

---

## 🛠️ Troubleshooting

### "Cannot create post"
**Fix**: Make sure you ran `supabase-social-schema.sql`

### "Image upload failed"
**Fix**: 
1. Check buckets exist (Storage → should see `posts` and `avatars`)
2. Run `storage-policies.sql`
3. Make buckets public in Settings

### "Nearby users not working"
**Fix**: Allow location access in browser when prompted

### "Profile not found"
**Fix**: 
1. Log out and log back in (creates profile automatically)
2. Or run this SQL:
```sql
INSERT INTO profiles (id, username, email)
SELECT id, COALESCE(raw_user_meta_data->>'username', split_part(email, '@', 1)), email
FROM auth.users
WHERE id = auth.uid()
ON CONFLICT (id) DO NOTHING;
```

---

## 📊 Database Schema

```
auth.users (Supabase Auth)
    ↓
profiles (user data)
    ↓ ← ← ← ← ← ← ← ← ↓
    ↓                 ↓
posts ←→ likes    follows
    ↓                 
comments
    ↓
notifications
```

**Key Tables:**
- **profiles**: User information, stats
- **posts**: User posts with content, images, location
- **likes**: Post likes (unique per user/post)
- **comments**: Post comments
- **follows**: User relationships
- **notifications**: Activity alerts (ready to use)

---

## 🎨 Tech Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router 6
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend**: Supabase PostgreSQL
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Real-time**: Ready to enable

---

## 🚀 Future Enhancements

Want to add more features? Here are some ideas:

- 🔲 **Real-time updates** - Live post feed
- 🔲 **Notifications** - Get alerts for likes, comments, follows
- 🔲 **Direct Messages** - Chat with other users
- 🔲 **Stories** - 24-hour temporary posts
- 🔲 **Video uploads** - Share video content
- 🔲 **User mentions** - Tag users with @username
- 🔲 **Trending hashtags** - See what's popular
- 🔲 **Report/Block** - Moderation tools
- 🔲 **Post sharing** - Repost content
- 🔲 **Multiple images** - Image carousel per post

---

## 📞 Need Help?

1. **Check logs**: Supabase Dashboard → Logs
2. **Browser console**: Press F12 → Console tab
3. **Verify setup**:
   - Tables exist in Table Editor
   - Buckets exist in Storage
   - Policies are set
   - .env has correct credentials

---

## ✅ Verification Checklist

Before testing, ensure:

- [ ] Ran `supabase-social-schema.sql` successfully
- [ ] Created `posts` and `avatars` storage buckets
- [ ] Ran `storage-policies.sql` successfully
- [ ] Set buckets to **Public**
- [ ] `.env` has correct Supabase URL and anon key
- [ ] Restarted dev server (`npm run dev`)
- [ ] Browser allows location access (for nearby users)

---

## 🎉 You're All Set!

Your EcoSort platform now has a complete social network! 🌍

**Try it out:**
1. Update your profile
2. Create your first post
3. Like and comment on others' posts
4. Follow some eco-warriors
5. Find nearby users
6. Build your sustainable community!

**Dev Server Running:** http://localhost:5174/

---

**Happy Eco-Networking! 💚🌱**

*Building a greener future, together.*
