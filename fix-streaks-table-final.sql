-- Complete Fix for Streaks Table
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/vylvkjfejsxjervfxzsm/sql

-- Drop existing table if exists (comment out if you have production data you want to keep)
DROP TABLE IF EXISTS public.streaks CASCADE;

-- Create streaks table with correct schema
CREATE TABLE public.streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create indexes for performance
CREATE INDEX idx_streaks_user_id ON public.streaks(user_id);
CREATE INDEX idx_streaks_current_streak ON public.streaks(current_streak DESC);

-- Enable Row Level Security
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all streaks" ON public.streaks;
DROP POLICY IF EXISTS "Users can insert own streak" ON public.streaks;
DROP POLICY IF EXISTS "Users can update own streak" ON public.streaks;

-- RLS Policy: Allow all authenticated users to view streaks (for leaderboard)
CREATE POLICY "Users can view all streaks" 
  ON public.streaks FOR SELECT 
  TO authenticated
  USING (true);

-- RLS Policy: Allow users to insert their own streak
CREATE POLICY "Users can insert own streak" 
  ON public.streaks FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Allow users to update their own streak
CREATE POLICY "Users can update own streak" 
  ON public.streaks FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS update_streaks_updated_at ON public.streaks;
CREATE TRIGGER update_streaks_updated_at
  BEFORE UPDATE ON public.streaks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON public.streaks TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Verify the table was created
SELECT 'Streaks table created successfully!' as status;
