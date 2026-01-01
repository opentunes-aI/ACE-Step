-- Allow anyone to read songs (for Public Share Links)
-- Note: Run this in Supabase SQL Editor

-- Drop strict policy
drop policy if exists "Users can view own songs" on public.songs;

-- Create permissive policy
create policy "Public can view songs" 
on public.songs for select 
using (true);

-- Ensure storage is publicly readable (already set, but reinforcing)
-- create policy "Storage Public Access" on storage.objects for select using ( bucket_id = 'music' );
