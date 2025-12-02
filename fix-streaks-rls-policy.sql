-- Fix RLS Policy for Streaks Table  
-- Run this in Supabase SQL Editor  
  
DROP POLICY IF EXISTS \"Users can view their own streak\" ON public.streaks;  
  
CREATE POLICY \"Authenticated users can view all streaks\"  
  ON public.streaks FOR SELECT  
  TO authenticated  
  USING (true); 
