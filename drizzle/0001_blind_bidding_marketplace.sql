-- =============================================================================
-- Stoop v2: blind-bidding marketplace
--
-- Reshapes the schema from the v0.1 "post + browse" model to the full MVP:
-- contractor profiles, blind bidding (48h window / 5-bid cap), escrow contracts,
-- multi-dimensional reviews, Q&A, and notifications.
--
-- Security model:
--   * Tables are owned by `postgres`, which BYPASSES RLS. Privileged server
--     logic (Drizzle / service role) uses that connection.
--   * The Supabase client connects as `authenticated` / `anon`, which is
--     subject to the RLS policies below. Blind bidding is enforced HERE, in the
--     database, not in app code.
--   * Exact job coordinates are never selectable by browsing contractors. They
--     read open jobs through SECURITY DEFINER feed functions that return only
--     approximate (rounded) coordinates. Precise location is visible only to the
--     homeowner and the hired contractor (jobs RLS).
--
-- Safe to run once on the v0.1 database: it preserves `users` + `waitlist`
-- (which hold real signups) and drops/recreates only the marketplace tables
-- (test data only).
-- =============================================================================

set search_path = public, extensions;

begin;

-- ---------------------------------------------------------------------------
-- 0. Drop the old marketplace tables (test data only). Keep users + waitlist.
-- ---------------------------------------------------------------------------
drop table if exists reviews cascade;
drop table if exists bids cascade;
drop table if exists jobs cascade;
drop table if exists tradesperson_profiles cascade;
drop table if exists homeowner_profiles cascade;

-- ---------------------------------------------------------------------------
-- 1. Enums
-- ---------------------------------------------------------------------------

-- A user can act as homeowner and/or contractor. `role` is just the default
-- surface; "is a contractor" is really "has a contractor_profiles row".
do $$ begin
  if exists (select 1 from pg_enum e join pg_type t on t.oid = e.enumtypid
             where t.typname = 'user_role' and e.enumlabel = 'tradesperson') then
    alter type user_role rename value 'tradesperson' to 'contractor';
  end if;
end $$;

drop type if exists job_status cascade;
create type job_status as enum (
  'open', 'bidding_closed', 'hired', 'in_progress', 'completed', 'reviewed', 'cancelled'
);

drop type if exists bid_status cascade;
create type bid_status as enum ('pending', 'won', 'lost', 'withdrawn');

drop type if exists job_urgency cascade;

drop type if exists escrow_status cascade;
create type escrow_status as enum ('pending', 'held', 'released', 'refunded', 'disputed');

-- ---------------------------------------------------------------------------
-- 2. users: extend for phone-first auth + dual role
-- ---------------------------------------------------------------------------
alter table users alter column role set default 'homeowner';
alter table users alter column email drop not null;
alter table users add column if not exists photo_url text;
alter table users add column if not exists phone_verified boolean not null default false;
alter table users add column if not exists email_verified boolean not null default false;

-- avatar_url -> photo_url (only if the legacy column exists)
do $$ begin
  if exists (select 1 from information_schema.columns
             where table_schema='public' and table_name='users' and column_name='avatar_url') then
    update users set photo_url = coalesce(photo_url, avatar_url);
    alter table users drop column avatar_url;
  end if;
end $$;

drop index if exists users_email_idx;
create unique index if not exists users_email_key on users (email) where email is not null;
create unique index if not exists users_phone_key on users (phone) where phone is not null;

-- ---------------------------------------------------------------------------
-- 3. contractor_profiles
-- ---------------------------------------------------------------------------
create table contractor_profiles (
  user_id uuid primary key references users (id) on delete cascade,
  business_name text,
  bio text,
  trade_categories text[] not null default '{}',
  service_radius_km integer not null default 8,
  lat double precision,
  lng double precision,
  home_base geography(Point, 4326) generated always as (
    case when lat is not null and lng is not null
      then st_setsrid(st_makepoint(lng, lat), 4326)::geography
    end
  ) stored,
  license_url text,
  avg_response_time_mins integer,
  completion_rate numeric(5, 2),
  rating_avg numeric(3, 2),
  jobs_completed integer not null default 0,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index contractor_profiles_home_base_idx on contractor_profiles using gist (home_base);

-- ---------------------------------------------------------------------------
-- 4. jobs
-- ---------------------------------------------------------------------------
create table jobs (
  id uuid primary key default gen_random_uuid(),
  homeowner_id uuid not null references users (id) on delete cascade,
  title text not null,
  category trade_category not null,
  description text not null,
  photo_urls text[] not null default '{}',
  lat double precision not null,
  lng double precision not null,
  neighborhood text,
  location geography(Point, 4326) generated always as (
    st_setsrid(st_makepoint(lng, lat), 4326)::geography
  ) stored,
  budget_min numeric(10, 2),
  budget_max numeric(10, 2),
  status job_status not null default 'open',
  bid_window_closes_at timestamptz not null default (now() + interval '48 hours'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index jobs_homeowner_idx on jobs (homeowner_id);
create index jobs_status_idx on jobs (status);
create index jobs_category_idx on jobs (category);
create index jobs_location_idx on jobs using gist (location);

-- ---------------------------------------------------------------------------
-- 5. bids
-- ---------------------------------------------------------------------------
create table bids (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs (id) on delete cascade,
  contractor_id uuid not null references users (id) on delete cascade,
  price numeric(10, 2) not null,
  start_date date,
  est_completion_days integer,
  pitch text,
  status bid_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_id, contractor_id)
);
create index bids_job_idx on bids (job_id);
create index bids_contractor_idx on bids (contractor_id);

-- ---------------------------------------------------------------------------
-- 6. contracts (escrow)
-- ---------------------------------------------------------------------------
create table contracts (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null unique references jobs (id) on delete cascade,
  winning_bid_id uuid not null references bids (id),
  contractor_id uuid not null references users (id),
  homeowner_id uuid not null references users (id),
  amount numeric(10, 2) not null,
  platform_fee numeric(10, 2) not null default 0,
  escrow_payment_intent_id text,
  escrow_status escrow_status not null default 'pending',
  started_at timestamptz,
  completed_at timestamptz,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index contracts_contractor_idx on contracts (contractor_id);
create index contracts_homeowner_idx on contracts (homeowner_id);

-- ---------------------------------------------------------------------------
-- 7. reviews (multi-dimensional + neighbor-distance signal)
-- ---------------------------------------------------------------------------
create table reviews (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs (id) on delete set null,
  reviewer_id uuid not null references users (id) on delete cascade,
  reviewee_id uuid not null references users (id) on delete cascade,
  quality integer not null check (quality between 1 and 5),
  punctuality integer not null check (punctuality between 1 and 5),
  cleanliness integer not null check (cleanliness between 1 and 5),
  communication integer not null check (communication between 1 and 5),
  comment text,
  photo_url text,
  reviewer_location geography(Point, 4326),
  created_at timestamptz not null default now(),
  unique (job_id, reviewer_id)
);
create index reviews_reviewee_idx on reviews (reviewee_id);
create index reviews_reviewer_idx on reviews (reviewer_id);

-- ---------------------------------------------------------------------------
-- 8. questions (lightweight Q&A, not full chat)
-- ---------------------------------------------------------------------------
create table questions (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs (id) on delete cascade,
  asker_id uuid not null references users (id) on delete cascade,
  body text not null,
  answer_body text,
  answered_at timestamptz,
  created_at timestamptz not null default now()
);
create index questions_job_idx on questions (job_id);

-- ---------------------------------------------------------------------------
-- 9. notifications
-- ---------------------------------------------------------------------------
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  type text not null,
  payload jsonb not null default '{}',
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index notifications_user_idx on notifications (user_id, read);

-- ---------------------------------------------------------------------------
-- 10. updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger trg_users_updated before update on users
  for each row execute function set_updated_at();
create trigger trg_contractor_profiles_updated before update on contractor_profiles
  for each row execute function set_updated_at();
create trigger trg_jobs_updated before update on jobs
  for each row execute function set_updated_at();
create trigger trg_bids_updated before update on bids
  for each row execute function set_updated_at();
create trigger trg_contracts_updated before update on contracts
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- 11. Blind-bidding enforcement (window + 5-bid cap), at the DB layer
-- ---------------------------------------------------------------------------
create or replace function enforce_bid_rules() returns trigger
language plpgsql as $$
declare
  j jobs%rowtype;
  bid_count integer;
begin
  select * into j from jobs where id = new.job_id for update;
  if not found then
    raise exception 'job % does not exist', new.job_id;
  end if;
  if j.status <> 'open' or j.bid_window_closes_at <= now() then
    raise exception 'bidding is closed for this job';
  end if;
  select count(*) into bid_count from bids where job_id = new.job_id;
  if bid_count >= 5 then
    raise exception 'this job already has the maximum of 5 bids';
  end if;
  return new;
end $$;

create trigger trg_enforce_bid_rules before insert on bids
  for each row execute function enforce_bid_rules();

-- Close the window automatically when the 5th bid lands.
create or replace function close_job_when_full() returns trigger
language plpgsql as $$
begin
  if (select count(*) from bids where job_id = new.job_id) >= 5 then
    update jobs set status = 'bidding_closed'
      where id = new.job_id and status = 'open';
  end if;
  return null;
end $$;

create trigger trg_close_job_when_full after insert on bids
  for each row execute function close_job_when_full();

-- Cron-able: flip jobs whose 48h window elapsed. Also safe to call lazily.
create or replace function close_expired_bid_windows() returns integer
language sql as $$
  with updated as (
    update jobs set status = 'bidding_closed'
    where status = 'open' and bid_window_closes_at <= now()
    returning 1
  )
  select count(*)::int from updated;
$$;

-- ---------------------------------------------------------------------------
-- 12. Contractor stats recompute
-- ---------------------------------------------------------------------------
create or replace function recompute_contractor_stats(target uuid) returns void
language plpgsql as $$
begin
  update contractor_profiles cp set
    rating_avg = (
      select round(avg((quality + punctuality + cleanliness + communication) / 4.0), 2)
      from reviews where reviewee_id = target
    ),
    jobs_completed = (
      select count(*) from contracts
      where contractor_id = target and completed_at is not null
    ),
    completion_rate = (
      select case when count(*) = 0 then null
        else round(100.0 * count(*) filter (where completed_at is not null) / count(*), 2)
      end
      from contracts where contractor_id = target
    ),
    avg_response_time_mins = (
      select round(avg(extract(epoch from (b.created_at - j.created_at)) / 60.0))
      from bids b join jobs j on j.id = b.job_id
      where b.contractor_id = target
    )
  where cp.user_id = target;
end $$;

create or replace function trg_review_recompute() returns trigger
language plpgsql as $$
begin
  perform recompute_contractor_stats(new.reviewee_id);
  return null;
end $$;
create trigger trg_reviews_recompute after insert on reviews
  for each row execute function trg_review_recompute();

create or replace function trg_contract_recompute() returns trigger
language plpgsql as $$
begin
  perform recompute_contractor_stats(new.contractor_id);
  return null;
end $$;
create trigger trg_contracts_recompute after insert or update on contracts
  for each row execute function trg_contract_recompute();

-- ---------------------------------------------------------------------------
-- 13. Row Level Security
-- ---------------------------------------------------------------------------
alter table users enable row level security;
alter table contractor_profiles enable row level security;
alter table jobs enable row level security;
alter table bids enable row level security;
alter table contracts enable row level security;
alter table reviews enable row level security;
alter table questions enable row level security;
alter table notifications enable row level security;
alter table waitlist enable row level security;

-- users: self only (public identity is exposed via the public_profiles view)
create policy users_select_self on users for select
  using ((select auth.uid()) = id);
create policy users_insert_self on users for insert
  with check ((select auth.uid()) = id);
create policy users_update_self on users for update
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- contractor_profiles: world-readable cards; writable by self
create policy contractor_profiles_select_all on contractor_profiles for select
  using (true);
create policy contractor_profiles_insert_self on contractor_profiles for insert
  with check ((select auth.uid()) = user_id);
create policy contractor_profiles_update_self on contractor_profiles for update
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- jobs: precise rows readable only by the homeowner or the hired contractor.
-- (Browsing contractors read open jobs via get_job_feed(), which hides the
--  exact location.)
create policy jobs_select_homeowner on jobs for select
  using ((select auth.uid()) = homeowner_id);
create policy jobs_select_hired_contractor on jobs for select
  using (exists (
    select 1 from contracts c
    where c.job_id = jobs.id and c.contractor_id = (select auth.uid())
  ));
create policy jobs_insert_homeowner on jobs for insert
  with check ((select auth.uid()) = homeowner_id);
create policy jobs_update_homeowner on jobs for update
  using ((select auth.uid()) = homeowner_id) with check ((select auth.uid()) = homeowner_id);

-- bids: THE blind-bidding boundary.
--   * a contractor always sees their own bid
--   * the homeowner sees bids ONLY after the window has closed (status <> open)
--   * nobody else sees anything
create policy bids_select_own on bids for select
  using ((select auth.uid()) = contractor_id);
create policy bids_select_homeowner_after_close on bids for select
  using (exists (
    select 1 from jobs j
    where j.id = bids.job_id
      and j.homeowner_id = (select auth.uid())
      and j.status <> 'open'
  ));
create policy bids_insert_contractor on bids for insert
  with check (
    (select auth.uid()) = contractor_id
    and exists (
      select 1 from jobs j
      where j.id = job_id and j.status = 'open' and j.bid_window_closes_at > now()
    )
    and (select count(*) from bids b where b.job_id = job_id) < 5
    and exists (
      select 1 from contractor_profiles cp, jobs j2
      where cp.user_id = (select auth.uid())
        and j2.id = job_id
        and cp.home_base is not null
        and st_dwithin(j2.location, cp.home_base, cp.service_radius_km * 1000)
    )
  );
create policy bids_update_withdraw on bids for update
  using ((select auth.uid()) = contractor_id and status = 'pending')
  with check ((select auth.uid()) = contractor_id);

-- contracts: visible to the two parties; writes happen via service role only
create policy contracts_select_parties on contracts for select
  using ((select auth.uid()) in (homeowner_id, contractor_id));

-- reviews: public social proof; insertable by a party to a finished job
create policy reviews_select_all on reviews for select using (true);
create policy reviews_insert_party on reviews for insert
  with check (
    (select auth.uid()) = reviewer_id
    and exists (
      select 1 from jobs j join contracts c on c.job_id = j.id
      where j.id = job_id
        and j.status in ('completed', 'reviewed')
        and (select auth.uid()) in (c.homeowner_id, c.contractor_id)
    )
  );

-- questions: readable by any authenticated user; answerable only by the homeowner
create policy questions_select_authed on questions for select
  using ((select auth.uid()) is not null);
create policy questions_insert_asker on questions for insert
  with check ((select auth.uid()) = asker_id);
create policy questions_answer_homeowner on questions for update
  using (exists (select 1 from jobs j where j.id = job_id and j.homeowner_id = (select auth.uid())))
  with check (exists (select 1 from jobs j where j.id = job_id and j.homeowner_id = (select auth.uid())));

-- notifications: strictly your own
create policy notifications_select_own on notifications for select
  using ((select auth.uid()) = user_id);
create policy notifications_update_own on notifications for update
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- waitlist: no client access (inserts go through the service-role API route)

-- ---------------------------------------------------------------------------
-- 14. Public-safe views + feed functions
-- ---------------------------------------------------------------------------

-- Only safe identity columns, regardless of users RLS (view runs as owner).
create or replace view public_profiles as
  select id, name, photo_url from users;
grant select on public_profiles to anon, authenticated;

-- Contractor feed: open jobs within the caller's service radius, with the
-- exact location stripped to ~neighborhood precision. SECURITY DEFINER so it
-- can read precise job coords to compute distance, but only returns approx.
create or replace function get_job_feed(category_filter trade_category default null)
returns table (
  id uuid, title text, category trade_category, description text,
  photo_urls text[], neighborhood text, approx_lat double precision,
  approx_lng double precision, distance_km double precision,
  budget_min numeric, budget_max numeric, bid_window_closes_at timestamptz,
  bid_count integer, created_at timestamptz
)
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform close_expired_bid_windows();
  return query
  select
    j.id, j.title, j.category, j.description, j.photo_urls, j.neighborhood,
    round(j.lat::numeric, 2)::double precision as approx_lat,
    round(j.lng::numeric, 2)::double precision as approx_lng,
    round((st_distance(j.location, cp.home_base) / 1000.0)::numeric, 2)::double precision as distance_km,
    j.budget_min, j.budget_max, j.bid_window_closes_at,
    (select count(*)::int from bids b where b.job_id = j.id) as bid_count,
    j.created_at
  from jobs j
  join contractor_profiles cp on cp.user_id = auth.uid()
  where j.status = 'open'
    and j.bid_window_closes_at > now()
    and cp.home_base is not null
    and st_dwithin(j.location, cp.home_base, cp.service_radius_km * 1000)
    and (category_filter is null or j.category = category_filter)
    and (category_filter is not null or j.category::text = any(cp.trade_categories) or cp.trade_categories = '{}')
  order by j.created_at desc;
end $$;
grant execute on function get_job_feed(trade_category) to authenticated;

-- Neighborhood feed: completed jobs near a point, with contractor card + rating.
create or replace function get_neighborhood_feed(
  center_lat double precision, center_lng double precision, radius_km double precision default 5
)
returns table (
  job_id uuid, title text, category trade_category, photo_urls text[],
  neighborhood text, approx_lat double precision, approx_lng double precision,
  contractor_id uuid, contractor_name text, contractor_photo_url text,
  rating_avg numeric, completed_at timestamptz
)
language sql security definer set search_path = public, extensions as $$
  select
    j.id as job_id, j.title, j.category, j.photo_urls, j.neighborhood,
    round(j.lat::numeric, 2)::double precision as approx_lat,
    round(j.lng::numeric, 2)::double precision as approx_lng,
    ct.contractor_id, u.name as contractor_name, u.photo_url as contractor_photo_url,
    cp.rating_avg, ct.completed_at
  from contracts ct
  join jobs j on j.id = ct.job_id
  join users u on u.id = ct.contractor_id
  left join contractor_profiles cp on cp.user_id = ct.contractor_id
  where ct.completed_at is not null
    and j.status in ('completed', 'reviewed')
    and st_dwithin(
      j.location,
      st_setsrid(st_makepoint(center_lng, center_lat), 4326)::geography,
      radius_km * 1000
    )
  order by ct.completed_at desc
  limit 50;
$$;
grant execute on function get_neighborhood_feed(double precision, double precision, double precision) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 15. Realtime
-- ---------------------------------------------------------------------------
do $$ begin
  alter publication supabase_realtime add table bids;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table jobs;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table notifications;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table questions;
exception when duplicate_object then null; end $$;

commit;
