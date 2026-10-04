-- Site KPS Agency : espace d'administration (/admin) — comptes autorisés, réalisations gérées en base, droits d'écriture.
-- Les articles et les réalisations restent lus au build (modules/cms.ts) : une modification apparaît en ligne après une publication.
-- Script rejouable.

/* ---------------- Administrateurs (comptes Supabase Auth autorisés à gérer le site) ---------------- */
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

-- security definer : lit la table admins sans dépendre de ses politiques
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()))
$$;

drop policy if exists "Administrateur : lire sa propre ligne" on public.admins;
create policy "Administrateur : lire sa propre ligne" on public.admins for select to authenticated using (user_id = (select auth.uid()));
-- Aucune politique d'écriture : les administrateurs sont ajoutés avec la clé secrète (scripts/create-admin.mjs) ou dans le SQL Editor.

/* ---------------- Réalisations (remplacent la liste de app/data/content.ts dès que la table en contient) ---------------- */
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  cat text not null check (cat in ('Web', 'ADS', 'Social')),
  client text not null,
  -- Type de projet ou secteur (ex. « Énergie », « Campagne ADS Performance »)
  label text not null,
  -- Étude de cas : vide = page du projet en noindex et absente du sitemap
  description text,
  -- Résultat chiffré (ex. « 6.4M impressions »)
  metric text,
  -- Couleurs de la carte : fond du visuel et texte
  bg text not null default '#E6ECF5',
  fg text not null default '#0B3A75',
  -- /images/realisations/<slug>.webp : servi par Cloudinary (kps/realisations/<slug>) ou par public/
  img text not null,
  -- Site du client (réalisations web)
  url text,
  -- Version anglaise (vide = texte français)
  label_en text,
  description_en text,
  metric_en text,
  -- Ordre d'affichage (croissant)
  position integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at before update on public.projects for each row execute function public.set_updated_at();

/* ---------------- Accès ---------------- */
alter table public.projects enable row level security;

drop policy if exists "Réalisations publiées lisibles" on public.projects;
create policy "Réalisations publiées lisibles" on public.projects for select to anon, authenticated using (published);

drop policy if exists "Administrateur : gérer les réalisations" on public.projects;
create policy "Administrateur : gérer les réalisations" on public.projects for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Administrateur : gérer les articles" on public.blog_posts;
create policy "Administrateur : gérer les articles" on public.blog_posts for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects, public.blog_posts to authenticated;
grant select on public.blog_posts, public.admins to authenticated;

/* ---------------- Réalisations existantes (reprises de app/data/content.ts ; une réalisation déjà en base n'est pas modifiée) ---------------- */
insert into public.projects (slug, cat, client, label, description, metric, bg, fg, img, url, label_en, description_en, metric_en, position) values
  ('powercell-group', 'Web', 'PowerCell Group', 'Énergie Renouvelable', null, null, '#DDE3FF', '#1A2A8A', '/images/realisations/powercell-group.webp', 'https://powercellgroup.com/', 'Renewable energy', null, null, 10),
  ('yassir', 'ADS', 'YASSIR', 'Campagne ADS Multi-plateforme', 'Stratégie ADS intégrée avec reach massif (3.9M Facebook, 1.4M Instagram, 5M paid reach) et benchmarking compétitif pour optimisation continue.', '5M paid reach', '#0E1726', '#FFFFFF', '/images/realisations/yassir.webp', null, 'Multi-platform ad campaign', 'Integrated paid-ads strategy with massive reach (3.9M on Facebook, 1.4M on Instagram, 5M paid reach) and competitive benchmarking for continuous optimisation.', '5M paid reach', 20),
  ('zayn', 'Social', 'ZAYN', 'Campagne Social/Médias', 'Campagne intégrée avec visuels produits premium, stratégie de contenu multi-format et résultats mesurables (308.8K couverture, 6.5K interactions).', '308.8K couverture', '#F2E6D8', '#6B3E12', '/images/realisations/zayn.webp', null, 'Social media campaign', 'Integrated campaign with premium product visuals, a multi-format content strategy and measurable results (308.8K reach, 6.5K interactions).', '308.8K reach', 30),
  ('cushman-wakefield-veritas', 'Web', 'Cushman & Wakefield Veritas', 'Immobilier', null, null, '#E4EFE9', '#14532D', '/images/realisations/cushman-wakefield-veritas.webp', 'https://cushwake.ge/', 'Real estate', null, null, 40),
  ('groupado-pro', 'ADS', 'groupado PRO', 'Campagne ADS Performance', 'Campagne d’acquisition avec focus sur ad trends, reach payante (1.7M) et impressions massives (6.4M) pour maximiser la visibilité.', '6.4M impressions', '#EDE7F6', '#4C1D95', '/images/realisations/groupado-pro.webp', null, 'Performance ad campaign', 'Acquisition campaign focused on ad trends, paid reach (1.7M) and massive impressions (6.4M) to maximise visibility.', '6.4M impressions', 50),
  ('kpmg', 'Social', 'KPMG', 'Audit & Analyse Audience', 'Rapport d’analyse audience détaillé avec insights sur la couverture organique vs payante, performance de contenu et engagement utilisateur.', null, '#E6ECF5', '#0B3A75', '/images/realisations/kpmg.webp', null, 'Audience audit & analysis', 'Detailed audience analysis report with insights on organic vs paid reach, content performance and user engagement.', null, 60),
  ('fibbl', 'Web', 'Fibbl', 'SaaS B2B', null, null, '#FFF1E6', '#9A3412', '/images/realisations/fibbl.webp', 'https://fibbl.com/', 'B2B SaaS', null, null, 70),
  ('brasileia-cosmetics', 'ADS', 'Brasileia Cosmetics', 'Campagne ADS Beauté', 'Campagne produit beauté avec visuels premium, messaging ciblé et analytics détaillées (1.8M views, 996K coverage).', '1.8M views', '#FCE7F3', '#9D174D', '/images/realisations/brasileia-cosmetics.webp', null, 'Beauty ad campaign', 'Beauty product campaign with premium visuals, targeted messaging and detailed analytics (1.8M views, 996K reach).', '1.8M views', 80),
  ('br-finanzen', 'Social', 'BR Finanzen', 'Stratégie Financière Digital', 'Campagne de communication financière avec design premium, conseils d’épargne et branding cohérent pour services bancaires.', null, '#E0F2FE', '#075985', '/images/realisations/br-finanzen.webp', null, 'Digital financial strategy', 'Financial communication campaign with premium design, savings advice and consistent branding for banking services.', null, 90),
  ('copenhagen-energy', 'Web', 'Copenhagen Energy', 'Énergie', null, null, '#E0F2FE', '#075985', '/images/realisations/copenhagen-energy.webp', 'https://copenhagen-energy.com/', 'Energy', null, null, 100),
  ('tunisia-franchise-show', 'ADS', 'Tunisia Franchise Show', 'Campagne ADS Événementielle', 'Campagne événementielle avec reach massif (2.2M), engagement ciblé (2.9K interactions) et traffic multi-plateforme.', '2.2M reach', '#FEF3C7', '#92400E', '/images/realisations/tunisia-franchise-show.webp', null, 'Event ad campaign', 'Event campaign with massive reach (2.2M), targeted engagement (2.9K interactions) and multi-platform traffic.', '2.2M reach', 110),
  ('campagnes-beaute-sante', 'Social', 'Campagnes Beauté & Santé', 'Multi-marques Beauté/Santé', 'Gestion de campagnes intégrées pour marques beauté et santé avec dashboards analytics, visuels produits et stratégie de contenu premium.', null, '#FCE7F3', '#9D174D', '/images/realisations/campagnes-beaute-sante.webp', null, 'Multi-brand beauty & health', 'Management of integrated campaigns for beauty and health brands, with analytics dashboards, product visuals and a premium content strategy.', null, 120),
  ('foscolo', 'Web', 'Coaching und Therapie Foscolo', 'Services Professionnels', null, null, '#F5F5F4', '#44403C', '/images/realisations/foscolo.webp', 'https://www.foscolo.ch/', 'Professional services', null, null, 130),
  ('lore-and-heart', 'ADS', 'LORE & HEART', 'Campagne ADS Social', 'Campagne d’acquisition sur Facebook et Instagram avec analyse détaillée de l’engagement, identification des posts performants et optimisation de la portée.', null, '#F5F5F4', '#44403C', '/images/realisations/lore-and-heart.webp', null, 'Social ad campaign', 'Facebook and Instagram acquisition campaign with detailed engagement analysis, top-performing post identification and reach optimisation.', null, 140),
  ('jardins-de-carthage', 'Social', 'Laboratoire Jardins de Carthage', 'Branding & Communication Santé', 'Campagne de communication santé avec branding premium, visuels médicaux et stratégie de contenu pour laboratoire pharmaceutique.', null, '#DCFCE7', '#166534', '/images/realisations/jardins-de-carthage.webp', null, 'Healthcare branding & communication', 'Healthcare communication campaign with premium branding, medical visuals and a content strategy for a pharmaceutical laboratory.', null, 150),
  ('dunstan', 'Web', 'Dunstan', 'Animaliers', null, null, '#FEF3C7', '#92400E', '/images/realisations/dunstan.webp', 'https://dunstan.se/', 'Pet products', null, null, 160),
  ('galeries-live', 'ADS', 'Galeries LIVE', 'Campagne ADS Engagement', 'Stratégie ADS combinant reach organique et payante avec analyse des posts top-performing pour optimiser le ROI.', null, '#E4EFE9', '#14532D', '/images/realisations/galeries-live.webp', null, 'Engagement ad campaign', 'Paid-ads strategy combining organic and paid reach, with analysis of top-performing posts to optimise ROI.', null, 170),
  ('radiumhemmets-forskningsfonder', 'Web', 'Radiumhemmets Forskningsfonder', 'Recherche', null, null, '#FCE7F3', '#9D174D', '/images/realisations/radiumhemmets-forskningsfonder.webp', 'https://rahfo.se/', 'Research', null, null, 180),
  ('quartz-conciergerie', 'Web', 'Quartz Conciergerie', 'Conciergerie Airbnb', null, null, '#F3EBDD', '#6B4E2E', '/images/realisations/quartz-conciergerie.webp', 'https://quartzconciergerie.com/', 'Airbnb concierge', null, null, 190),
  ('founa-com-by-smg', 'ADS', 'Founa.com by SMG', 'Campagne ADS Acquisition', 'Campagne d’acquisition structurée avec dashboard analytics complet, suivi des KPIs et optimisation des performances.', null, '#E0F2FE', '#075985', '/images/realisations/founa-com-by-smg.webp', null, 'Acquisition ad campaign', 'Structured acquisition campaign with a complete analytics dashboard, KPI tracking and performance optimisation.', null, 200),
  ('prostarseo', 'ADS', 'ProstarSEO', 'Campagne ADS Digital/SEO', 'Campagne d’acquisition digital avec analyse d’autorité, traffic organique et distribution géographique pour ciblage optimisé.', null, '#EDE7F6', '#4C1D95', '/images/realisations/prostarseo.webp', null, 'Digital/SEO ad campaign', 'Digital acquisition campaign with authority analysis, organic traffic and geographic distribution for optimised targeting.', null, 210)
on conflict (slug) do nothing;
