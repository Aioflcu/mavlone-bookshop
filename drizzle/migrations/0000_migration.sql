create type public.app_role as enum ('admin', 'user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

-- First account to sign up becomes admin
create or replace function public.handle_first_admin()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end; $$;
create trigger on_auth_user_created_admin after insert on auth.users
for each row execute function public.handle_first_admin();

create table public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null default '',
  description text not null default '',
  category text not null default 'General',
  format text not null default 'ebook',
  price numeric(10,2) not null default 0,
  old_price numeric(10,2),
  cover_url text,
  purchase_url text,
  pages integer,
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.books to anon, authenticated;
grant insert, update, delete on public.books to authenticated;
grant all on public.books to service_role;
alter table public.books enable row level security;
create policy "Public reads published books" on public.books for select to anon, authenticated using (published or public.has_role(auth.uid(), 'admin'));
create policy "Admins insert books" on public.books for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins update books" on public.books for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete books" on public.books for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

create table public.site_settings (
  id int primary key default 1 check (id = 1),
  hero_title text not null default 'Books that stay with you.',
  hero_subtitle text not null default 'Handpicked ebooks and paperbacks, delivered instantly.',
  hero_image_url text,
  contact_email text,
  whatsapp text
);
grant select on public.site_settings to anon, authenticated;
grant update, insert on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "Public reads settings" on public.site_settings for select to anon, authenticated using (true);
create policy "Admins update settings" on public.site_settings for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins insert settings" on public.site_settings for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
insert into public.site_settings (id) values (1);

insert into public.books (title, author, description, category, price, old_price, featured) values
('The Quiet Ascent', 'Amara Okafor', 'A meditation on ambition, patience and the slow work of becoming.', 'Self-Growth', 12.99, 19.99, true),
('Money Without Noise', 'Daniel Mensah', 'A calm, practical guide to building wealth in an anxious world.', 'Finance', 14.50, null, true),
('Rivers of Lagos', 'Chidi Eze', 'A sweeping novel of family, faith and the city that never sleeps.', 'Fiction', 9.99, 15.00, true),
('Deep Focus', 'Lena Hart', 'Reclaim your attention and do the work that matters.', 'Productivity', 11.00, null, false);

create policy "Admins upload covers" on storage.objects for insert to authenticated with check (bucket_id = 'covers' and public.has_role(auth.uid(), 'admin'));
create policy "Admins update covers" on storage.objects for update to authenticated using (bucket_id = 'covers' and public.has_role(auth.uid(), 'admin'));
create policy "Admins delete covers" on storage.objects for delete to authenticated using (bucket_id = 'covers' and public.has_role(auth.uid(), 'admin'));
create policy "Public read covers" on storage.objects for select using (bucket_id = 'covers');