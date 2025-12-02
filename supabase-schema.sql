-- EcoSort Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Classifications table
CREATE TABLE IF NOT EXISTS public.classifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Recyclable', 'Wet', 'Dry')),
  confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  description TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Streaks table
CREATE TABLE IF NOT EXISTS public.streaks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  count INTEGER DEFAULT 0 NOT NULL CHECK (count >= 0),
  last_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leaderboard view (materialized for performance)
CREATE MATERIALIZED VIEW IF NOT EXISTS public.leaderboard AS
SELECT 
  p.id,
  p.username,
  p.avatar_url,
  COALESCE(s.count, 0) as streak_count,
  COUNT(c.id) as classification_count,
  CASE 
    WHEN COALESCE(s.count, 0) >= 30 THEN 'Zero-Waste Hero'
    WHEN COALESCE(s.count, 0) >= 10 THEN 'Green Warrior'
    ELSE 'Eco Rookie'
  END as badge
FROM public.profiles p
LEFT JOIN public.streaks s ON p.id = s.user_id
LEFT JOIN public.classifications c ON p.id = c.user_id
GROUP BY p.id, p.username, p.avatar_url, s.count
ORDER BY s.count DESC NULLS LAST, classification_count DESC;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_classifications_user_id ON public.classifications(user_id);
CREATE INDEX IF NOT EXISTS idx_classifications_created_at ON public.classifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_streaks_user_id ON public.streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_streaks_count ON public.streaks(count DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- RLS Policies for classifications
CREATE POLICY "Users can view their own classifications" 
  ON public.classifications FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own classifications" 
  ON public.classifications FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for streaks
CREATE POLICY "Users can view their own streak" 
  ON public.streaks FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own streak" 
  ON public.streaks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streak" 
  ON public.streaks FOR UPDATE 
  USING (auth.uid() = user_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for streaks updated_at
DROP TRIGGER IF EXISTS update_streaks_updated_at ON public.streaks;
CREATE TRIGGER update_streaks_updated_at
  BEFORE UPDATE ON public.streaks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to refresh leaderboard materialized view
CREATE OR REPLACE FUNCTION public.refresh_leaderboard()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW public.leaderboard;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Create a scheduled job to refresh leaderboard (requires pg_cron extension)
-- Uncomment if pg_cron is enabled in your Supabase instance
-- SELECT cron.schedule('refresh-leaderboard', '*/15 * * * *', 'SELECT public.refresh_leaderboard()');

-- Sample data insertion (optional - remove in production)
-- This will help test the leaderboard
/*
INSERT INTO public.profiles (id, username, email) VALUES
  ('00000000-0000-0000-0000-000000000001', 'EcoWarrior2024', 'eco1@example.com'),
  ('00000000-0000-0000-0000-000000000002', 'GreenThumb', 'eco2@example.com'),
  ('00000000-0000-0000-0000-000000000003', 'RecycleKing', 'eco3@example.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.streaks (user_id, count, last_date) VALUES
  ('00000000-0000-0000-0000-000000000001', 45, CURRENT_DATE),
  ('00000000-0000-0000-0000-000000000002', 38, CURRENT_DATE),
  ('00000000-0000-0000-0000-000000000003', 32, CURRENT_DATE)
ON CONFLICT (user_id) DO NOTHING;
*/

-- Refresh the materialized view after schema creation
SELECT public.refresh_leaderboard();
