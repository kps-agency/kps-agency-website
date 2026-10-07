-- Site KPS Agency : promotion affichée en fenêtre (composant PromoPopup) et adresses e-mail recueillies.
-- Script rejouable. À exécuter après 20261007000000_kps_dashboard.sql.

/* ---------------- Promotions : texte de présentation sous le titre ---------------- */
alter table public.promos
  add column if not exists details text,
  add column if not exists details_en text;

/* ---------------- Adresses recueillies par la fenêtre de promotion ---------------- */
create table if not exists public.promo_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  -- Promotion affichée au moment de l'inscription ; son titre est recopié pour rester lisible si elle est supprimée
  promo_id uuid references public.promos (id) on delete set null,
  promo_text text,
  locale text not null default 'fr',
  -- Page sur laquelle la fenêtre s'est affichée
  page text,
  -- Le visiteur valide le formulaire en ayant sous les yeux la mention d'information : date de cet accord
  consent_at timestamptz not null default now(),
  -- Une même adresse ne s'inscrit qu'une fois à une promotion
  unique (email, promo_id)
);
create index if not exists promo_signups_created_at on public.promo_signups (created_at desc);

/* ---------------- Accès : écriture par le serveur (clé secrète), lecture et suppression par les comptes de l'admin ---------------- */
alter table public.promo_signups enable row level security;
drop policy if exists "Administrateur : gérer les inscriptions" on public.promo_signups;
create policy "Administrateur : gérer les inscriptions" on public.promo_signups for all to authenticated using (public.is_admin()) with check (public.is_admin());
grant select, delete on public.promo_signups to authenticated;
-- Aucun droit pour la clé publique : les adresses ne sont jamais lisibles depuis le navigateur d'un visiteur
revoke all on public.promo_signups from anon;
