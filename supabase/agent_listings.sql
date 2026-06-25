-- Run this in Supabase SQL Editor to create the agent_listings table

create table if not exists public.agent_listings (
  id                uuid        default gen_random_uuid() primary key,
  seller_email      text        not null,
  seller_name       text        not null default '',
  agent_name        text        not null,
  tagline           text        not null default '',
  description       text        not null default '',
  category          text        not null default '',
  icon              text        not null default '🤖',
  badge             text,
  price             integer     not null default 0,
  price_type        text        not null default 'tháng',
  features          jsonb       not null default '[]',
  system_prompt     text        not null default '',
  demo_greeting     text        not null default '',
  demo_suggestions  jsonb       not null default '[]',
  bank_name         text        not null default '',
  bank_account      text        not null default '',
  bank_holder       text        not null default '',
  status            text        not null default 'pending',   -- pending | active | rejected
  rejection_reason  text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  total_sales       integer     not null default 0,
  total_revenue     bigint      not null default 0,
  pending_payout    bigint      not null default 0,
  total_payout      bigint      not null default 0
);

-- Index for seller lookups
create index if not exists agent_listings_seller_email_idx on public.agent_listings (seller_email);
-- Index for marketplace listing (active agents)
create index if not exists agent_listings_status_idx on public.agent_listings (status);

-- Enable Row Level Security
alter table public.agent_listings enable row level security;

-- Allow service role (used by getSupabaseAdmin) full access
create policy "Service role full access" on public.agent_listings
  for all
  using (true)
  with check (true);

-- Trigger to update updated_at on change
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger agent_listings_updated_at
  before update on public.agent_listings
  for each row execute function update_updated_at();
