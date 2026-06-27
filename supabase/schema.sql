-- ================================================
-- Portfolio CMS Schema for Supabase
-- Run this in: Supabase Dashboard > SQL Editor
-- ================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============ PROJECTS TABLE ============
create table if not exists public.projects (
  id         uuid primary key default uuid_generate_v4(),
  title      text not null,
  description text,
  image_url  text,
  link       text,
  tags       text[] default '{}',
  "order"    integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============ SKILLS TABLE ============
create table if not exists public.skills (
  id          uuid primary key default uuid_generate_v4(),
  category    text not null,
  description text,
  icons       jsonb default '[]',
  "order"     integer default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ============ CERTIFICATES TABLE ============
create table if not exists public.certificates (
  id         uuid primary key default uuid_generate_v4(),
  title      text not null,
  image_url  text not null,
  "order"    integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============ UPDATED_AT TRIGGER ============
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.handle_updated_at();

drop trigger if exists skills_updated_at on public.skills;
create trigger skills_updated_at
  before update on public.skills
  for each row execute function public.handle_updated_at();

drop trigger if exists certificates_updated_at on public.certificates;
create trigger certificates_updated_at
  before update on public.certificates
  for each row execute function public.handle_updated_at();

-- ============ ROW LEVEL SECURITY ============
alter table public.projects     enable row level security;
alter table public.skills       enable row level security;
alter table public.certificates enable row level security;

-- Public can SELECT all rows (portfolio visitors)
drop policy if exists "Public can view projects" on public.projects;
create policy "Public can view projects"
  on public.projects for select using (true);

drop policy if exists "Public can view skills" on public.skills;
create policy "Public can view skills"
  on public.skills for select using (true);

drop policy if exists "Public can view certificates" on public.certificates;
create policy "Public can view certificates"
  on public.certificates for select using (true);

-- NOTE: Create/Update/Delete is handled via service_role key on the server.
-- No extra policies needed — service_role bypasses RLS.

-- ============ SEED DATA (optional, remove if you prefer to add via admin panel) ============

insert into public.projects (title, description, image_url, link, tags, "order") values
  ('Campus Lost Tracker', 'A web application to help students track lost items on campus.', '/Poster PPM.png', 'https://github.com/Hana-nas/Campus-Lost-Tracker', ARRAY['Web', 'PHP'], 1),
  ('Seruni Coffee Website', 'Landing page for Seruni Coffee, a local coffee shop brand.', '/Seruni coffee website Sprintcamp project.JPG', 'https://www.serunicoffe.store/', ARRAY['HTML', 'CSS', 'JS'], 2),
  ('Digital Image Processing', 'Image histogram specification project using Python.', '/Histogram Spesifikasi PC.jpg', 'https://github.com/Hana-nas/Image-Processing-Histogram-Spesifikasi', ARRAY['Python', 'OpenCV'], 3),
  ('Distributed File System', 'A distributed file system implementation for OS course.', '/DFS Sister.png', 'https://github.com/SatriaRidhoRamadana/Distribution-File-System-Updated-', ARRAY['Python', 'Networking'], 4)
on conflict do nothing;

insert into public.skills (category, description, icons, "order") values
  ('Front-End Development', 'Building engaging and user-friendly web interfaces using modern frameworks and technologies with expertise.', '[{"name":"HTML","color":"#E34F26"},{"name":"JS","color":"#F7DF1E"},{"name":"TS","color":"#3178C6"}]', 1),
  ('Programming Languages', 'Proficient in problem-solving and applying programming languages to implement efficient data structures and algorithms.', '[{"name":"Py","color":"#3776AB"},{"name":"C","color":"#A8B9CC"},{"name":"C++","color":"#00599C"}]', 2),
  ('Styling & Design', 'Crafting visually appealing and responsive designs with advanced styling tools and frameworks.', '[{"name":"CSS","color":"#264de4"},{"name":"Tw","color":"#38B2AC"}]', 3)
on conflict do nothing;

insert into public.certificates (title, image_url, "order") values
  ('Certificate 1', '/sertifikat.png', 1),
  ('Certificate 2', '/sertifikat Hana Syakira-1.png', 2),
  ('Certificate 3', '/SERTIFIKAT SPRINTCAMP.png', 3)
on conflict do nothing;
