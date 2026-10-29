-- Trading_APK initial schema.
-- Run this migration on a development Supabase project first.
-- Paper trading only: this schema intentionally contains no brokerage integration.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  preferred_currency text not null default 'INR' check (preferred_currency ~ '^[A-Z]{3}$'),
  timezone text not null default 'Asia/Kolkata',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute procedure public.handle_new_user();

create table if not exists public.paper_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'My paper session',
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  starting_cash_minor bigint not null check (starting_cash_minor > 0),
  cash_balance_minor bigint not null check (cash_balance_minor >= 0),
  status text not null default 'active' check (status in ('active', 'closed')),
  created_at timestamptz not null default now(),
  closed_at timestamptz
);
create index if not exists paper_sessions_user_created_idx
  on public.paper_sessions (user_id, created_at desc);

create table if not exists public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid not null references public.paper_sessions(id) on delete cascade,
  entry_type text not null check (entry_type in ('opening', 'simulated_buy', 'simulated_sell', 'fee', 'adjustment')),
  amount_minor bigint not null,
  description text not null,
  idempotency_key text,
  created_at timestamptz not null default now(),
  unique (session_id, idempotency_key)
);
create index if not exists ledger_entries_session_created_idx
  on public.ledger_entries (session_id, created_at desc);

create table if not exists public.strategies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  original_prompt text not null check (char_length(original_prompt) between 12 and 5000),
  market text not null check (char_length(market) between 2 and 120),
  symbol text,
  specification jsonb,
  status text not null default 'draft' check (status in ('draft', 'active', 'paused')),
  version integer not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists strategies_user_created_idx
  on public.strategies (user_id, created_at desc);
create index if not exists strategies_active_idx
  on public.strategies (status, updated_at)
  where status = 'active';

create table if not exists public.monitor_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  strategy_id uuid not null references public.strategies(id) on delete cascade,
  strategy_version integer not null,
  status text not null check (status in ('running', 'completed', 'insufficient_data', 'error')),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  details jsonb not null default '{}'::jsonb
);
create index if not exists monitor_runs_strategy_started_idx
  on public.monitor_runs (strategy_id, started_at desc);

create table if not exists public.signals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  strategy_id uuid not null references public.strategies(id) on delete cascade,
  strategy_version integer not null,
  symbol text,
  outcome text not null check (outcome in ('match', 'no_match', 'insufficient_data')),
  evidence jsonb not null default '{}'::jsonb,
  source_timestamp timestamptz,
  evaluated_at timestamptz not null default now(),
  deduplication_key text not null unique
);
create index if not exists signals_user_evaluated_idx
  on public.signals (user_id, evaluated_at desc);

create table if not exists public.device_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  expo_push_token text not null,
  platform text not null check (platform in ('android', 'ios', 'web')),
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  unique (user_id, expo_push_token)
);

create table if not exists public.notification_outbox (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  signal_id uuid references public.signals(id) on delete cascade,
  deduplication_key text not null unique,
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed')),
  attempts integer not null default 0 check (attempts >= 0),
  last_error text,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

-- Each exposed user-owned table has RLS. Writes to money, scans, signals and outbox
-- remain server/RPC controlled; clients can read only their own rows.
alter table public.profiles enable row level security;
alter table public.paper_sessions enable row level security;
alter table public.ledger_entries enable row level security;
alter table public.strategies enable row level security;
alter table public.monitor_runs enable row level security;
alter table public.signals enable row level security;
alter table public.device_tokens enable row level security;
alter table public.notification_outbox enable row level security;

create policy "profiles read own" on public.profiles
  for select to authenticated using (id = auth.uid());
create policy "profiles update own" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "paper sessions read own" on public.paper_sessions
  for select to authenticated using (user_id = auth.uid());
create policy "ledger entries read own" on public.ledger_entries
  for select to authenticated using (user_id = auth.uid());

create policy "strategies read own" on public.strategies
  for select to authenticated using (user_id = auth.uid());
create policy "users insert strategy drafts only" on public.strategies
  for insert to authenticated
  with check (user_id = auth.uid() and status = 'draft' and specification is null and version = 1);
create policy "users update strategy drafts only" on public.strategies
  for update to authenticated
  using (user_id = auth.uid() and status = 'draft' and specification is null)
  with check (user_id = auth.uid() and status = 'draft' and specification is null);

create policy "monitor runs read own" on public.monitor_runs
  for select to authenticated using (user_id = auth.uid());
create policy "signals read own" on public.signals
  for select to authenticated using (user_id = auth.uid());
create policy "device tokens read own" on public.device_tokens
  for select to authenticated using (user_id = auth.uid());
create policy "users add own device tokens" on public.device_tokens
  for insert to authenticated with check (user_id = auth.uid());
create policy "users delete own device tokens" on public.device_tokens
  for delete to authenticated using (user_id = auth.uid());
-- No client policies are defined for notification_outbox: it is backend-only.

create or replace function public.create_paper_session(
  p_name text,
  p_currency text,
  p_starting_cash_minor bigint
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_session_id uuid;
  v_currency text := upper(trim(p_currency));
  v_name text := trim(p_name);
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  if p_starting_cash_minor is null or p_starting_cash_minor <= 0 or p_starting_cash_minor > 100000000000000 then
    raise exception 'Invalid virtual starting amount' using errcode = '22023';
  end if;
  if v_currency !~ '^[A-Z]{3}$' then
    raise exception 'Currency must be a three-letter code' using errcode = '22023';
  end if;
  if v_name is null or length(v_name) < 2 or length(v_name) > 80 then
    raise exception 'Session name must be between 2 and 80 characters' using errcode = '22023';
  end if;

  insert into public.paper_sessions (user_id, name, currency, starting_cash_minor, cash_balance_minor)
  values (v_user_id, v_name, v_currency, p_starting_cash_minor, p_starting_cash_minor)
  returning id into v_session_id;

  insert into public.ledger_entries (user_id, session_id, entry_type, amount_minor, description, idempotency_key)
  values (v_user_id, v_session_id, 'opening', p_starting_cash_minor, 'Opening virtual capital', 'opening:' || v_session_id::text);

  return v_session_id;
end;
$$;

revoke all on function public.create_paper_session(text, text, bigint) from public;
grant execute on function public.create_paper_session(text, text, bigint) to authenticated;
