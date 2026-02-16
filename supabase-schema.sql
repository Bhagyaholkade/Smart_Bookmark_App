-- Create bookmarks table
create table bookmarks (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  url text not null,
  title text not null
);

-- Enable Row Level Security
alter table bookmarks enable row level security;

-- Policy: Users can see only their own bookmarks
create policy "Users can see only their own bookmarks"
  on bookmarks for select
  using (auth.uid() = user_id);

-- Policy: Users can insert their own bookmarks
create policy "Users can insert their own bookmarks"
  on bookmarks for insert
  with check (auth.uid() = user_id);

-- Policy: Users can delete their own bookmarks
create policy "Users can delete their own bookmarks"
  on bookmarks for delete
  using (auth.uid() = user_id);
