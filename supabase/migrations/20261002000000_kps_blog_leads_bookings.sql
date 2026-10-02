-- Site KPS Agency : articles du blog (lus au build) et données reçues (demandes de contact/devis, demandes d'appel).
-- Lecture publique (clé publishable/anon) limitée aux articles publiés ; demandes et appels accessibles au seul serveur (clé secrète).
-- Script rejouable : il peut être exécuté sur un projet vide ou sur un projet qui contient déjà ces tables.

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

/* ---------------- Blog (s'ajoute aux fichiers Markdown de content/blog ; même langue + slug = l'article Supabase remplace le fichier) ---------------- */
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  lang text not null check (lang in ('fr', 'en')),
  slug text not null check (slug ~ '^[a-z0-9-]+$'),
  title text not null,
  seo_title text,
  description text not null default '',
  date date not null default current_date,
  updated date,
  -- Clé de BLOG_SECTORS (shared/blog.ts)
  sector text not null default 'pme',
  -- Slug FR du service lié (ex. creation-site-web)
  service text,
  tags text[] not null default '{}',
  author text not null default 'KPS Agency',
  cover text,
  cover_alt text,
  -- Slug de la version dans l'autre langue
  translation text,
  -- Contenu en Markdown
  body text not null,
  -- Un article n'est publié que si draft = false et date <= aujourd'hui
  draft boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lang, slug)
);
alter table public.blog_posts alter column author set default 'KPS Agency';
drop trigger if exists blog_posts_updated_at on public.blog_posts;
create trigger blog_posts_updated_at before update on public.blog_posts for each row execute function public.set_updated_at();

/* ---------------- Demandes de contact / devis ---------------- */
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  locale text not null default 'fr',
  services text[] not null default '{}',
  budget text,
  timing text,
  message text,
  name text not null,
  company text,
  email text not null,
  phone text,
  website text,
  consent_at timestamptz,
  status text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'won', 'lost', 'spam'))
);
-- Formulaire d'origine : « contact » (page Contact, 3 étapes) ou « accueil » (formulaire court)
alter table public.leads add column if not exists source text not null default 'contact';
-- Le formulaire court de l'accueil n'a pas de case de consentement
alter table public.leads alter column consent_at drop not null;
create index if not exists leads_created_at on public.leads (created_at desc);

/* ---------------- Demandes d'appel (« Réserver un appel ») ---------------- */
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  start_at timestamptz not null,
  end_at timestamptz not null,
  name text not null,
  email text not null,
  phone text,
  company text,
  mode text not null check (mode in ('visio', 'phone')),
  message text,
  locale text not null default 'fr',
  visitor_tz text,
  meet_link text,
  -- « email » = simple demande envoyée par e-mail ; « ksuite » / « google » = événement créé dans l'agenda
  provider text,
  status text not null default 'booked' check (status in ('booked', 'done', 'no_show', 'cancelled'))
);
create index if not exists bookings_start_at on public.bookings (start_at);

/* ---------------- Accès ---------------- */
alter table public.blog_posts enable row level security;
alter table public.leads enable row level security;
alter table public.bookings enable row level security;

drop policy if exists "Articles publiés lisibles" on public.blog_posts;
create policy "Articles publiés lisibles" on public.blog_posts for select to anon, authenticated using (not draft and date <= current_date);
-- leads et bookings : aucune politique, donc aucun accès avec la clé publique ; le serveur écrit avec la clé secrète.
