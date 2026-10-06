-- Site KPS Agency : études de cas structurées, logo client et témoignage sur les réalisations (table projects).
-- Tous les champs sont facultatifs : une réalisation sans ces champs s'affiche comme avant.
-- À exécuter avant d'utiliser les nouveaux champs de l'admin (/admin → Réalisations). Script rejouable.

alter table public.projects
  -- Logo du client : /images/realisations/<slug>-logo.webp (bandeau « Ils nous ont fait confiance »)
  add column if not exists logo text,
  -- Étude de cas : contexte et enjeu du client, travail réalisé, résultats obtenus
  add column if not exists context text,
  add column if not exists work text,
  add column if not exists results text,
  -- Chiffres clés : un par ligne, « valeur | libellé » (ex. « 5M | paid reach »), quatre au plus
  add column if not exists kpis text,
  -- Durée du projet (ex. « 6 semaines »)
  add column if not exists duration text,
  -- Témoignage du client : affiché seulement avec un texte et un auteur
  add column if not exists quote text,
  add column if not exists quote_author text,
  add column if not exists quote_role text,
  -- Portrait de l'auteur : /images/realisations/<slug>-portrait.webp
  add column if not exists quote_photo text,
  -- Version anglaise (vide = texte français)
  add column if not exists context_en text,
  add column if not exists work_en text,
  add column if not exists results_en text,
  add column if not exists kpis_en text,
  add column if not exists duration_en text,
  add column if not exists quote_en text,
  add column if not exists quote_role_en text;
