create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  timezone text not null default 'Asia/Kolkata',
  preferred_currency text not null default 'INR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.paper_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (length(name) between 1 and 80),
  currency char(3) not null default 'INR',
  starting_cash_minor bigint not null check (starting_cash_minor > 0),
  cash_balance_minor bigint not null check (cash_balance_minor >= 0),
  status text not null default 'active' check (status in ('active','paused','closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.strategies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  original_prompt text not null check (length(original_prompt) between 12 and 4000),
  market text,
  symbol text,
  strategy_spec jsonb,
  version integer not null default 1 check (version > 0),
  status text not null default 'draft' check (status in ('draft','active','paused')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.monitor_runs (
  id uuid primary key default gen_random_uuid(),
  strategy_id uuid references public.strategies(id) on delete cascade,
  strategy_version integer,
  status text not null check (status in ('match','no_match','insufficient_data','error')),
  source_timestamp timestamptz,
  details jsonb not null default '{}'::jsonb,
  idempotency_key text unique,
  created_at timestamptz not null default now()
);

create table if not exists public.signals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  strategy_id uuid not null references public.strategies(id) on delete cascade,
  strategy_version integer not null,
  status text not null check (status in ('match','no_match','insufficient_data')),
  evidence jsonb not null default '{}'::jsonb,
  source_timestamp timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists paper_sessions_user_created_idx on public.paper_sessions(user_id, created_at desc);
create index if not exists strategies_user_status_idx on public.strategies(user_id, status);
create index if not exists signals_user_created_idx on public.signals(user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.paper_sessions enable row level security;
alter table public.strategies enable row level security;
alter table public.monitor_runs enable row level security;
alter table public.signals enable row level security;

create policy "profiles_select_own" on public.profiles for select to authenticated using (id = (select auth.uid()));
create policy "profiles_update_own" on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy "paper_sessions_select_own" on public.paper_sessions for select to authenticated using (user_id = (select auth.uid()));
create policy "strategies_select_own" on public.strategies for select to authenticated using (user_id = (select auth.uid()));
create policy "strategies_insert_own_draft" on public.strategies for insert to authenticated with check (user_id = (select auth.uid()) and status = 'draft');
create policy "strategies_update_own" on public.strategies for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "signals_select_own" on public.signals for select to authenticated using (user_id = (select auth.uid()));
-- Monitor runs are backend-only. No client policies are intentionally defined.

create or replace function public.bootstrap_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'avatar_url')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_bootstrap_profile on auth.users;
create trigger on_auth_user_created_bootstrap_profile
after insert on auth.users
for each row execute procedure public.bootstrap_profile();

-- Session creation and ledger changes should be implemented through reviewed server-side
-- RPCs/functions before production. The client is intentionally not given write policies
-- for balances or simulated fills.
