
-- Add status column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN status TEXT DEFAULT 'available';
