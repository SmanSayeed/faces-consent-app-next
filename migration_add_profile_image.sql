-- Add image_url column to profiles table
alter table public.profiles 
add column if not exists image_url text;

-- Update RLS if necessary (existing policy is "for all using (true)", so it covers new column)
