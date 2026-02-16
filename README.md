# Smart Bookmark App

A real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS. Features Google OAuth authentication, private bookmark collections, and instant real-time sync across tabs.

## Live Demo

**Vercel URL**: [Coming soon]

## Features

- **Google OAuth** — One-click sign in/out with Google. No email/password.
- **Add Bookmarks** — Save any URL with a title to your private collection.
- **Private Collections** — Bookmarks are isolated per user via Row Level Security.
- **Real-time Sync** — Add or delete a bookmark in one tab and it appears/disappears in all other tabs instantly (Supabase Realtime).
- **Delete Bookmarks** — Remove bookmarks with one click.
- **Live Stats** — Dashboard shows total bookmarks, added today, and this week counts in real-time.
- **Responsive UI** — Dark glassmorphism design with smooth Framer Motion animations, optimized for mobile and desktop.

## Tech Stack

| Layer       | Technology                          |
| ----------- | ----------------------------------- |
| Framework   | Next.js 16 (App Router)             |
| Language    | TypeScript                          |
| Database    | Supabase (PostgreSQL)               |
| Auth        | Supabase Auth + Google OAuth        |
| Realtime    | Supabase Realtime (postgres_changes)|
| Styling     | Tailwind CSS v4                     |
| Animations  | Framer Motion                       |
| Icons       | Lucide React                        |
| Deployment  | Vercel                              |

## Setup Instructions

### 1. Clone & Install

```bash
git clone <repo-url>
cd smart-bookmark-app
npm install
```

### 2. Supabase Setup

Create a project at [supabase.com](https://supabase.com) and run the following SQL in the SQL Editor:

```sql
create table bookmarks (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  url text not null,
  title text not null
);

alter table bookmarks enable row level security;

create policy "Users can see only their own bookmarks"
  on bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own bookmarks"
  on bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own bookmarks"
  on bookmarks for delete
  using (auth.uid() = user_id);
```

Also enable **Realtime** for the `bookmarks` table in the Supabase Dashboard (Database → Replication).

### 3. Google OAuth

1. Go to Supabase Dashboard → Authentication → Providers → Google.
2. Enable it and provide your Google Client ID and Secret from [Google Cloud Console](https://console.cloud.google.com/).
3. Add the Supabase redirect URL to your Google OAuth consent screen.

### 4. Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push to GitHub.
2. Import the repo on [vercel.com](https://vercel.com).
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as environment variables.
4. Deploy.

## Problems Encountered & Solutions

1. **Project folder name with spaces** — `create-next-app` failed due to spaces in "Smart Bookmark App". Initialized in a temp directory and moved files to the root.

2. **Real-time subscription filtering** — Needed to filter real-time events to only the logged-in user's bookmarks. Used Supabase channel filter `user_id=eq.${userId}` to ensure privacy and efficiency.

3. **CSS theme mismatch** — Initial globals.css defined a light theme while components used dark theme classes. Rebuilt the entire CSS system with a cohesive dark glassmorphism theme using custom utility classes (`glass-panel`, `card-hover`, `btn-primary`, `gradient-text`, etc.).

4. **Hardcoded stats** — StatsOverview component had hardcoded values. Refactored to fetch live counts from Supabase with real-time updates via a separate channel subscription.

5. **Favicon loading for bookmarks** — Used Google's favicon service (`google.com/s2/favicons`) with error handling for URLs that don't have favicons. Added try-catch for URL parsing to handle malformed URLs gracefully.
