-- Fix missing columns in existing profiles table
alter table profiles add column if not exists website text;
alter table profiles add column if not exists full_name text;
alter table profiles add column if not exists avatar_url text;
alter table profiles add column if not exists username text;

-- Ensure username constraint exists
do $$ 
begin 
    if not exists (select 1 from pg_constraint where conname = 'username_length') then
        alter table profiles add constraint username_length check (char_length(username) >= 3);
    end if;
end $$;
