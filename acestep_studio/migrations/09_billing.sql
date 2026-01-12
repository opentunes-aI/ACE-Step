-- 1. Create Wallets Table (The Current State)
create table if not exists public.wallets (
  user_id uuid references auth.users on delete cascade not null primary key,
  balance int default 0 not null,
  is_pro boolean default false,
  next_refill_at timestamp with time zone default now() + interval '1 day',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. Create Transactions Table (The Ledger / History)
create table if not exists public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  amount int not null, -- Negative for spend, Positive for buy
  reason text not null, -- 'signup_bonus', 'daily_grant', 'generation', 'purchase'
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

-- 3. RLS Policies
alter table public.wallets enable row level security;
alter table public.transactions enable row level security;

-- Users can view their own wallet
create policy "Users can view own wallet"
  on public.wallets for select
  using ( auth.uid() = user_id );

-- Users can view their own transactions
create policy "Users can view own transactions"
  on public.transactions for select
  using ( auth.uid() = user_id );

-- (Only Postgres/Service Role can update wallets to prevent hacking)

-- 4. Update the User Onboarding Trigger
-- We assume public.handle_new_user() already exists from 02_profiles.sql
-- We will REPLACE it to include the wallet creation.

create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- 1. Create Profile
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');

  -- 2. Create Wallet with Welcome Bonus (50 Credits)
  insert into public.wallets (user_id, balance, is_pro)
  values (new.id, 50, false);

  -- 3. Record the Transaction
  insert into public.transactions (user_id, amount, reason)
  values (new.id, 50, 'signup_bonus');

  return new;
end;
$$ language plpgsql security definer;

-- 5. Backfill Existing Users (One-time)
insert into public.wallets (user_id, balance)
select id, 50 from auth.users
on conflict (user_id) do nothing;
