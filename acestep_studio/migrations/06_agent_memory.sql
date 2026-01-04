-- Enable pgvector extension
create extension if not exists vector;

-- Create agent_memory table
create table if not exists public.agent_memory (
  id uuid default gen_random_uuid() primary key,
  content text not null, -- The text content (prompt or lyrics)
  type text not null check (type in ('audio_prompt', 'lyrics')),
  embedding vector(384), -- 384 dimensions for all-MiniLM-L6-v2
  metadata jsonb default '{}'::jsonb, -- Store extra info like { "rating": 5, "genre": "pop", "song_id": "..." }
  created_at timestamp with time zone default now() not null
);

-- Enable RLS
alter table public.agent_memory enable row level security;

-- Policy: Everyone can read (for Agents)
create policy "Public Agent Memory Read"
on public.agent_memory for select
to public
using (true);

-- Policy: Service Role can insert (The Backend)
create policy "Service Role Insert"
on public.agent_memory for insert
to service_role
with check (true);

-- Index for fast similarity search
create index on public.agent_memory using ivfflat (embedding vector_cosine_ops)
with (lists = 100);
