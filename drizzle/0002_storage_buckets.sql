-- =============================================================================
-- Stoop storage buckets + object policies
--   avatars       public  (contractor/homeowner profile photos)
--   job-photos    public  (photos attached to a job post)
--   review-photos public  (optional photo on a review)
--   licenses      private (contractor license docs; owner-only read)
-- =============================================================================

insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('job-photos', 'job-photos', true),
  ('review-photos', 'review-photos', true),
  ('licenses', 'licenses', false)
on conflict (id) do nothing;

-- Public read for the public buckets
drop policy if exists "stoop public read" on storage.objects;
create policy "stoop public read" on storage.objects for select
  using (bucket_id in ('avatars', 'job-photos', 'review-photos'));

-- License docs: only the uploading owner may read
drop policy if exists "stoop owner read licenses" on storage.objects;
create policy "stoop owner read licenses" on storage.objects for select
  using (bucket_id = 'licenses' and owner = (select auth.uid()));

-- Any authenticated user may upload into Stoop buckets
drop policy if exists "stoop authed upload" on storage.objects;
create policy "stoop authed upload" on storage.objects for insert
  with check (
    bucket_id in ('avatars', 'job-photos', 'review-photos', 'licenses')
    and (select auth.uid()) is not null
  );

-- Owners may update/replace and delete their own objects
drop policy if exists "stoop owner update" on storage.objects;
create policy "stoop owner update" on storage.objects for update
  using (owner = (select auth.uid())) with check (owner = (select auth.uid()));

drop policy if exists "stoop owner delete" on storage.objects;
create policy "stoop owner delete" on storage.objects for delete
  using (owner = (select auth.uid()));
