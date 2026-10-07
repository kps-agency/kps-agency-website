-- Site KPS Agency : tableau de bord (/admin) — rôles, suivi des demandes et des rendez-vous, promotions, avis clients,
-- textes des expertises, historique des mesures de performance.
-- Script rejouable. À exécuter après les migrations précédentes.

/* ---------------- Rôles : « admin » gère aussi les utilisateurs, « editor » gère uniquement les contenus et les demandes ---------------- */
alter table public.admins add column if not exists role text not null default 'admin' check (role in ('admin', 'editor'));

/* ---------------- Demandes et rendez-vous : consultables et suivis depuis l'admin ---------------- */
-- Notes internes de suivi (jamais affichées sur le site)
alter table public.leads add column if not exists notes text;

drop policy if exists "Administrateur : gérer les demandes" on public.leads;
create policy "Administrateur : gérer les demandes" on public.leads for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Administrateur : gérer les rendez-vous" on public.bookings;
create policy "Administrateur : gérer les rendez-vous" on public.bookings for all to authenticated using (public.is_admin()) with check (public.is_admin());
grant select, update, delete on public.leads, public.bookings to authenticated;

/* ---------------- Promotions (bandeau affiché en haut du site, entre deux dates) ---------------- */
create table if not exists public.promos (
  id uuid primary key default gen_random_uuid(),
  -- Texte du bandeau (ex. « Audit SEO offert jusqu'au 31 octobre »)
  text text not null,
  text_en text,
  -- Bouton facultatif
  cta_label text,
  cta_label_en text,
  cta_url text,
  -- Période d'affichage (vide = sans limite)
  starts_on date,
  ends_on date,
  active boolean not null default true,
  -- La première promotion active (ordre croissant) est affichée
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists promos_updated_at on public.promos;
create trigger promos_updated_at before update on public.promos for each row execute function public.set_updated_at();

/* ---------------- Avis clients (remplacent la liste de app/data/content.ts dès que la table en contient) ---------------- */
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  -- Mois de l'avis : AAAA-MM
  month text not null check (month ~ '^\d{4}-\d{2}$'),
  rating integer not null default 5 check (rating between 1 and 5),
  -- Texte copié tel quel depuis la fiche Google
  text text not null,
  -- Avis coupé par Google (« … Plus ») / avis traduit
  truncated boolean not null default false,
  translated boolean not null default false,
  position integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists reviews_updated_at on public.reviews;
create trigger reviews_updated_at before update on public.reviews for each row execute function public.set_updated_at();

/* ---------------- Expertises : textes modifiés depuis l'admin, appliqués par-dessus app/data/content.ts ---------------- */
create table if not exists public.services (
  -- Slug français de l'expertise (ex. creation-site-web) : la liste des expertises reste définie dans le code
  slug text primary key check (slug ~ '^[a-z0-9-]+$'),
  -- Textes par langue : titres, offres, bénéfices, méthode, appel à l'action, balises SEO (voir CmsServiceText, shared/cms.ts)
  fr jsonb not null default '{}',
  en jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
drop trigger if exists services_updated_at on public.services;
create trigger services_updated_at before update on public.services for each row execute function public.set_updated_at();

/* ---------------- Mesures de performance (PageSpeed Insights) lancées depuis l'admin ---------------- */
create table if not exists public.perf_snapshots (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  url text not null,
  strategy text not null check (strategy in ('mobile', 'desktop')),
  -- Scores Lighthouse sur 100
  performance integer, accessibility integer, best_practices integer, seo integer,
  -- Mesures de laboratoire
  lcp_ms integer, tbt_ms integer, fcp_ms integer, cls numeric,
  -- Mesures réelles des visiteurs (Chrome UX Report), absentes tant que le trafic est trop faible
  field_lcp_ms integer, field_inp_ms integer, field_cls numeric
);
create index if not exists perf_snapshots_created_at on public.perf_snapshots (created_at desc);

/* ---------------- Accès ---------------- */
alter table public.promos enable row level security;
alter table public.reviews enable row level security;
alter table public.services enable row level security;
alter table public.perf_snapshots enable row level security;

drop policy if exists "Promotions actives lisibles" on public.promos;
create policy "Promotions actives lisibles" on public.promos for select to anon, authenticated using (active);
drop policy if exists "Avis publiés lisibles" on public.reviews;
create policy "Avis publiés lisibles" on public.reviews for select to anon, authenticated using (published);
drop policy if exists "Expertises lisibles" on public.services;
create policy "Expertises lisibles" on public.services for select to anon, authenticated using (true);

drop policy if exists "Administrateur : gérer les promotions" on public.promos;
create policy "Administrateur : gérer les promotions" on public.promos for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Administrateur : gérer les avis" on public.reviews;
create policy "Administrateur : gérer les avis" on public.reviews for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Administrateur : gérer les expertises" on public.services;
create policy "Administrateur : gérer les expertises" on public.services for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Administrateur : gérer les mesures" on public.perf_snapshots;
create policy "Administrateur : gérer les mesures" on public.perf_snapshots for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant select on public.promos, public.reviews, public.services to anon, authenticated;
grant insert, update, delete on public.promos, public.reviews, public.services to authenticated;
grant select, insert, delete on public.perf_snapshots to authenticated;

/* ---------------- Avis existants (repris de app/data/content.ts ; rien n'est ajouté si la table contient déjà des avis) ---------------- */
insert into public.reviews (name, month, rating, text, truncated, translated, position)
select * from (values
  ('Amine', '2026-09', 5, 'Intervention rapide et extrêmement efficace sur mon site WordPress. En quelques jours, mon score de performance a grimpé à 81/100 et tout mon référencement local est enfin en place (fiche Google, pages villes, données structurées). Le prestataire est d’une grande honnêteté intellectuelle, fournit des rapports précis et respecte scrupuleusement les délais.', false, false, 10),
  ('Sofia Jacobs', '2026-04', 5, 'Super content du rendu du site, process clair, suivi régulier et pas de mauvaises surprises. Le projet a été livré dans les délais et conforme à nos attentes. Je recommande', false, false, 20),
  ('ali Khan', '2026-08', 5, 'Équipe professionnelle ! Ils m’ont fait mon site pour mon restaurant au top ! Prix super accessible, je vous le conseille', false, false, 30),
  ('nelly varenne', '2026-04', 5, 'En tant qu’architecte, j’accorde beaucoup d’importance a l’image, la communication et la façon dont une entreprise met en valeur son savoir faire. J’ai eu l’occasion de travailler avec KPS et j’ai particulièrement apprécié leur', true, false, 40),
  ('Julien Chantemesse', '2026-04', 5, 'Super agence. La team KPS agency est sérieuse et à l’écoute. Projet de site web rapide et efficace.', false, false, 50),
  ('Axel Schafers', '2026-04', 5, 'Professionnel, efficace et créatif. Résultats rapides sur Instagram et Facebook. 100 % recommandé.', true, true, 60),
  ('NeedyMindSet', '2026-05', 5, 'Très pro et réactif – Site web parfait, bon accompagnement. Je recommande.', false, false, 70),
  ('Malaine Kougbeadjo', '2026-04', 5, 'super agence de marketing dynamique et réactive! Je recommande!', false, false, 80)
) as v where not exists (select 1 from public.reviews);
