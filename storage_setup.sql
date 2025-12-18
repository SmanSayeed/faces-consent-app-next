-- Create the 'images' bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- Drop existing policies to avoid conflicts
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Authenticated Upload" on storage.objects;
drop policy if exists "Authenticated Update" on storage.objects;
drop policy if exists "Authenticated Delete" on storage.objects;
drop policy if exists "Public Upload" on storage.objects;

-- Create permissive policies for development (Matches your other tables)

-- 1. Allow public access to view images
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'images' );

-- 2. Allow public uploads (Development Mode)
create policy "Public Upload"
  on storage.objects for insert
  with check ( bucket_id = 'images' );

-- 3. Allow public updates (Development Mode)
create policy "Public Update"
  on storage.objects for update
  using ( bucket_id = 'images' );

-- 4. Allow public delete (Development Mode)
create policy "Public Delete"
  on storage.objects for delete
  using ( bucket_id = 'images' );
