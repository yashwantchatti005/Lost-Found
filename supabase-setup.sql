-- ═══════════════════════════════════════════════════════
--  Run this ONCE in Supabase → SQL Editor → New query
-- ═══════════════════════════════════════════════════════

create table if not exists public.found_items (
  id          bigint generated always as identity primary key,
  item_name   text not null,
  category    text not null,
  location    text not null,
  description text,
  image_path  text,
  status      text not null default 'Available' check (status in ('Available','Claimed')),
  found_date  date not null default current_date,
  created_at  timestamptz not null default now()
);

alter table public.found_items enable row level security;

-- Anyone can browse and report items
create policy "public read"   on public.found_items for select using (true);
create policy "public insert" on public.found_items for insert with check (status = 'Available');

-- Only logged-in admins can update / delete
create policy "admin update" on public.found_items for update to authenticated using (true) with check (true);
create policy "admin delete" on public.found_items for delete to authenticated using (true);

-- Image storage bucket (public read)
insert into storage.buckets (id, name, public) values ('item-images','item-images', true)
on conflict (id) do nothing;

create policy "public image read"   on storage.objects for select using (bucket_id = 'item-images');
create policy "public image upload" on storage.objects for insert with check (bucket_id = 'item-images');
create policy "admin image delete"  on storage.objects for delete to authenticated using (bucket_id = 'item-images');
