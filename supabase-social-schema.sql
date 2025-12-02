-- ============================================
-- ECOSORT SOCIAL MEDIA & PROFILE SCHEMA
-- Complete database setup for social features
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For location-based features

-- ============================================
-- 1. ENHANCED PROFILES TABLE
-- ============================================

-- Drop existing profiles if needed and recreate with more fields
DROP TABLE IF EXISTS profiles CASCADE;

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    cover_photo_url TEXT,
    location TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    website TEXT,
    total_points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ============================================
-- 2. POSTS TABLE
-- ============================================

CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    image_url TEXT,
    location TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT true,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policies for posts
CREATE POLICY "Public posts are viewable by everyone"
    ON posts FOR SELECT
    USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create own posts"
    ON posts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
    ON posts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
    ON posts FOR DELETE
    USING (auth.uid() = user_id);

-- Indexes for posts
CREATE INDEX posts_user_id_idx ON posts(user_id);
CREATE INDEX posts_created_at_idx ON posts(created_at DESC);
CREATE INDEX posts_tags_idx ON posts USING GIN(tags);

-- ============================================
-- 3. LIKES TABLE
-- ============================================

CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, post_id)
);

-- Enable RLS
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Policies for likes
CREATE POLICY "Likes are viewable by everyone"
    ON likes FOR SELECT
    USING (true);

CREATE POLICY "Users can create own likes"
    ON likes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes"
    ON likes FOR DELETE
    USING (auth.uid() = user_id);

-- Indexes for likes
CREATE INDEX likes_user_id_idx ON likes(user_id);
CREATE INDEX likes_post_id_idx ON likes(post_id);

-- ============================================
-- 4. COMMENTS TABLE
-- ============================================

CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Policies for comments
CREATE POLICY "Comments are viewable by everyone"
    ON comments FOR SELECT
    USING (true);

CREATE POLICY "Users can create own comments"
    ON comments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
    ON comments FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
    ON comments FOR DELETE
    USING (auth.uid() = user_id);

-- Indexes for comments
CREATE INDEX comments_post_id_idx ON comments(post_id);
CREATE INDEX comments_user_id_idx ON comments(user_id);
CREATE INDEX comments_created_at_idx ON comments(created_at DESC);

-- ============================================
-- 5. FOLLOWS TABLE (Follower/Following)
-- ============================================

CREATE TABLE follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

-- Enable RLS
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- Policies for follows
CREATE POLICY "Follows are viewable by everyone"
    ON follows FOR SELECT
    USING (true);

CREATE POLICY "Users can follow others"
    ON follows FOR INSERT
    WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
    ON follows FOR DELETE
    USING (auth.uid() = follower_id);

-- Indexes for follows
CREATE INDEX follows_follower_id_idx ON follows(follower_id);
CREATE INDEX follows_following_id_idx ON follows(following_id);

-- ============================================
-- 6. NOTIFICATIONS TABLE
-- ============================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'like', 'comment', 'follow', 'mention'
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies for notifications
CREATE POLICY "Users can view own notifications"
    ON notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
    ON notifications FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update own notifications"
    ON notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- Indexes for notifications
CREATE INDEX notifications_user_id_idx ON notifications(user_id);
CREATE INDEX notifications_created_at_idx ON notifications(created_at DESC);
CREATE INDEX notifications_is_read_idx ON notifications(is_read);

-- ============================================
-- 7. TRIGGERS & FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to increment likes count on posts
CREATE OR REPLACE FUNCTION increment_post_likes()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE posts
    SET likes_count = likes_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_liked
    AFTER INSERT ON likes
    FOR EACH ROW
    EXECUTE FUNCTION increment_post_likes();

-- Function to decrement likes count on posts
CREATE OR REPLACE FUNCTION decrement_post_likes()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE posts
    SET likes_count = likes_count - 1
    WHERE id = OLD.post_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_unliked
    AFTER DELETE ON likes
    FOR EACH ROW
    EXECUTE FUNCTION decrement_post_likes();

-- Function to increment comments count
CREATE OR REPLACE FUNCTION increment_post_comments()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE posts
    SET comments_count = comments_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_commented
    AFTER INSERT ON comments
    FOR EACH ROW
    EXECUTE FUNCTION increment_post_comments();

-- Function to decrement comments count
CREATE OR REPLACE FUNCTION decrement_post_comments()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE posts
    SET comments_count = comments_count - 1
    WHERE id = OLD.post_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_comment_deleted
    AFTER DELETE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION decrement_post_comments();

-- Function to update follower/following counts
CREATE OR REPLACE FUNCTION update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
    -- Increment following count for follower
    UPDATE profiles
    SET following_count = following_count + 1
    WHERE id = NEW.follower_id;
    
    -- Increment followers count for following
    UPDATE profiles
    SET followers_count = followers_count + 1
    WHERE id = NEW.following_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_followed
    AFTER INSERT ON follows
    FOR EACH ROW
    EXECUTE FUNCTION update_follow_counts();

-- Function to update follower/following counts on unfollow
CREATE OR REPLACE FUNCTION update_unfollow_counts()
RETURNS TRIGGER AS $$
BEGIN
    -- Decrement following count for follower
    UPDATE profiles
    SET following_count = following_count - 1
    WHERE id = OLD.follower_id;
    
    -- Decrement followers count for following
    UPDATE profiles
    SET followers_count = followers_count - 1
    WHERE id = OLD.following_id;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_unfollowed
    AFTER DELETE ON follows
    FOR EACH ROW
    EXECUTE FUNCTION update_unfollow_counts();

-- Function to increment posts count
CREATE OR REPLACE FUNCTION increment_user_posts()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles
    SET posts_count = posts_count + 1
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_created
    AFTER INSERT ON posts
    FOR EACH ROW
    EXECUTE FUNCTION increment_user_posts();

-- Function to decrement posts count
CREATE OR REPLACE FUNCTION decrement_user_posts()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles
    SET posts_count = posts_count - 1
    WHERE id = OLD.user_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_deleted
    AFTER DELETE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION decrement_user_posts();

-- ============================================
-- 8. FUNCTIONS FOR NEARBY USERS
-- ============================================

-- Function to find nearby users (within specified radius in km)
CREATE OR REPLACE FUNCTION find_nearby_users(
    user_lat DECIMAL,
    user_lng DECIMAL,
    radius_km INTEGER DEFAULT 50
)
RETURNS TABLE (
    id UUID,
    username TEXT,
    full_name TEXT,
    avatar_url TEXT,
    location TEXT,
    distance_km DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.username,
        p.full_name,
        p.avatar_url,
        p.location,
        ROUND(
            (6371 * acos(
                cos(radians(user_lat)) * 
                cos(radians(p.latitude)) * 
                cos(radians(p.longitude) - radians(user_lng)) + 
                sin(radians(user_lat)) * 
                sin(radians(p.latitude))
            ))::numeric, 
            2
        ) as distance_km
    FROM profiles p
    WHERE 
        p.latitude IS NOT NULL 
        AND p.longitude IS NOT NULL
        AND p.id != auth.uid()
        AND (6371 * acos(
            cos(radians(user_lat)) * 
            cos(radians(p.latitude)) * 
            cos(radians(p.longitude) - radians(user_lng)) + 
            sin(radians(user_lat)) * 
            sin(radians(p.latitude))
        )) <= radius_km
    ORDER BY distance_km ASC
    LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 9. VIEWS FOR COMMON QUERIES
-- ============================================

-- View for post feed with user info
CREATE OR REPLACE VIEW post_feed AS
SELECT 
    p.id,
    p.content,
    p.image_url,
    p.location,
    p.likes_count,
    p.comments_count,
    p.shares_count,
    p.created_at,
    pr.id as user_id,
    pr.username,
    pr.full_name,
    pr.avatar_url
FROM posts p
JOIN profiles pr ON p.user_id = pr.id
WHERE p.is_public = true
ORDER BY p.created_at DESC;

-- ============================================
-- 10. SAMPLE DATA (OPTIONAL - FOR TESTING)
-- ============================================

-- Insert sample tags for environmental posts
-- You can add these as default values or let users create them

-- ============================================
-- SETUP COMPLETE
-- ============================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
