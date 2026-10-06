-- Site KPS Agency : études de cas de cinq réalisations (ACOI Groupe, Karoo, Stackello, YASSIR, PowerCell Group).
-- À exécuter APRÈS la migration 20261006000000_kps_case_studies.sql, puis « Publier le site » dans l'admin.
--
-- Ces textes sont rédigés uniquement à partir de ce qui est déjà publié sur le site (présentation de chaque projet,
-- chiffres des campagnes) : ils sont à relire par l'équipe qui a mené le projet.
-- Volontairement laissés vides, parce qu'ils ne se devinent pas : résultats des sites web, durée, témoignage du client.
-- Ils se complètent dans l'admin (/admin → Réalisations).
--
-- Script rejouable : un champ déjà rempli dans l'admin n'est jamais écrasé (coalesce).

/* ---------------- ACOI Groupe ---------------- */
update public.projects set
  context = coalesce(context, $$Le Groupe ACOI est un cabinet d’expertise comptable, de conseil et d’audit présent à Versailles et à La Réunion. Il s’adresse à des entreprises très différentes, de la TPE à la grande entreprise, en métropole comme dans l’océan Indien.
Son site doit donc présenter une offre large à des visiteurs qui n’ont pas les mêmes besoins, sans les perdre en route, et les amener à prendre rendez-vous avec le cabinet.$$),
  work = coalesce(work, $$Nous avons conçu et développé un site vitrine organisé autour des services du cabinet, pour que chaque visiteur trouve rapidement celui qui le concerne.
Des pages dédiées présentent le groupe, ses valeurs et sa dimension internationale, qui distinguent ACOI d’un cabinet local.
Le parcours conduit vers la prise de rendez-vous. Les clients existants accèdent depuis le site à leur espace réservé et au service de facturation électronique.$$),
  context_en = coalesce(context_en, $$Groupe ACOI is an accounting, advisory and audit firm based in Versailles and on Réunion Island. It works with very different companies, from small businesses to large corporations, in mainland France and across the Indian Ocean.
Its website therefore has to present a broad offering to visitors with different needs, without losing them along the way, and lead them to book an appointment with the firm.$$),
  work_en = coalesce(work_en, $$We designed and built a showcase website organised around the firm’s services, so that each visitor quickly finds the one that concerns them.
Dedicated pages present the group, its values and its international reach, which set ACOI apart from a local firm.
The journey leads to booking an appointment. Existing clients reach their private area and the e-invoicing service from the website.$$)
where slug = 'acoi-groupe';

/* ---------------- Karoo ---------------- */
update public.projects set
  context = coalesce(context, $$Karoo est une place de marché automobile à Madagascar : on y achète, on y vend et on y compare des véhicules neufs et d’occasion.
Une place de marché ne vaut que si les acheteurs trouvent vite une annonce qui leur correspond, et si les vendeurs publient la leur sans difficulté. L’application devait servir ces deux publics à la fois.$$),
  work = coalesce(work, $$Nous avons développé une application web complète. Côté acheteur, la recherche se fait par marque, par modèle et par ville, et l’on peut parcourir le catalogue marque par marque.
Côté vendeur, chaque utilisateur crée un compte, publie ses annonces et les gère depuis un tableau de bord.
Deux services complètent la plateforme : une estimation de la valeur de son véhicule et une rubrique de conseils.$$),
  context_en = coalesce(context_en, $$Karoo is a car marketplace in Madagascar, where people buy, sell and compare new and used vehicles.
A marketplace only works if buyers quickly find a listing that suits them and sellers can publish theirs without difficulty. The application had to serve both audiences at once.$$),
  work_en = coalesce(work_en, $$We built a complete web application. For buyers, search works by make, model and city, and the catalogue can be browsed make by make.
For sellers, each user creates an account, publishes listings and manages them from a dashboard.
Two services round off the platform: a valuation of your own vehicle and an advice section.$$)
where slug = 'karoo';

/* ---------------- Stackello ---------------- */
update public.projects set
  context = coalesce(context, $$Stackello met en relation des agences et des développeurs freelances. Une agence publie une mission et reçoit une sélection de profils ; un freelance accède à des missions qualifiées.
Le produit repose sur deux parcours distincts, qui n’ont ni les mêmes attentes ni la même offre commerciale, et sur un modèle par abonnement.$$),
  work = coalesce(work, $$Nous avons développé la plateforme avec Next.js. Les agences et les freelances disposent chacun de leur type de compte et de leur parcours.
La mise en relation s’appuie sur un matching par IA, complété par une recherche avancée de profils.
Trois formules d’abonnement structurent l’offre : Freelance Free, Freelance Pro et Agency Pro. Une FAQ et un blog accompagnent le produit.$$),
  context_en = coalesce(context_en, $$Stackello connects agencies with freelance developers. An agency posts a project and receives a shortlist of profiles; a freelancer gets access to qualified projects.
The product rests on two distinct journeys, with different expectations and different pricing, and on a subscription model.$$),
  work_en = coalesce(work_en, $$We built the platform with Next.js. Agencies and freelancers each have their own account type and their own journey.
Matching relies on AI, backed by an advanced profile search.
Three subscription plans structure the offer: Freelance Free, Freelance Pro and Agency Pro. An FAQ and a blog support the product.$$)
where slug = 'stackello';

/* ---------------- YASSIR ---------------- */
update public.projects set
  context = coalesce(context, $$YASSIR est une application de mobilité et de livraison. Sur ce marché, plusieurs acteurs se disputent la même audience sur les mêmes réseaux sociaux.
La campagne devait donc toucher un public large sur Facebook et Instagram, tout en gardant un œil sur ce que faisaient les concurrents.$$),
  work = coalesce(work, $$Nous avons mené une campagne publicitaire sur les deux plateformes, en suivant les performances de chacune séparément plutôt qu’en bloc.
Un comparatif avec les concurrents a accompagné la diffusion : il a servi à ajuster les campagnes en continu.$$),
  results = coalesce(results, $$La campagne a touché 5 millions de personnes par la diffusion payante. La portée a atteint 3,9 millions de personnes sur Facebook et 1,4 million sur Instagram.$$),
  kpis = coalesce(kpis, $$5M | personnes touchées en diffusion payante
3,9M | portée sur Facebook
1,4M | portée sur Instagram$$),
  context_en = coalesce(context_en, $$YASSIR is a mobility and delivery app. In this market, several players compete for the same audience on the same social networks.
The campaign therefore had to reach a broad audience on Facebook and Instagram while keeping an eye on what competitors were doing.$$),
  work_en = coalesce(work_en, $$We ran an advertising campaign on both platforms, tracking the performance of each one separately rather than as a whole.
A competitor benchmark ran alongside the campaign and was used to adjust it continuously.$$),
  results_en = coalesce(results_en, $$The campaign reached 5 million people through paid distribution. Reach came to 3.9 million people on Facebook and 1.4 million on Instagram.$$),
  kpis_en = coalesce(kpis_en, $$5M | people reached through paid distribution
3.9M | reach on Facebook
1.4M | reach on Instagram$$)
where slug = 'yassir';

/* ---------------- PowerCell Group ---------------- */
update public.projects set
  context = coalesce(context, $$PowerCell Group conçoit des piles à combustible à hydrogène pour l’aviation, le maritime, le ferroviaire, la production d’électricité et les véhicules.
Son site s’adresse à des publics qui ne cherchent pas la même chose : des industriels qui évaluent une technologie, des investisseurs qui suivent une société cotée, des candidats et des journalistes. Il doit aussi rendre lisible une technologie complexe.$$),
  work = coalesce(work, $$Nous avons réalisé un site corporate en anglais. L’offre y est organisée de deux façons, par segment de marché et par solution (systèmes, stacks, services d’ingénierie), pour que chaque industriel entre par son propre besoin.
Des contenus dédiés expliquent la technologie.
Un espace investisseurs complet réunit les communiqués, les rapports, le calendrier financier et les informations sur l’action. Le site comprend aussi des pages carrières et événements, ainsi que des articles de fond.$$),
  context_en = coalesce(context_en, $$PowerCell Group designs hydrogen fuel cells for aviation, marine, rail, power generation and vehicles.
Its website speaks to audiences who are not looking for the same thing: manufacturers assessing a technology, investors following a listed company, candidates and journalists. It also has to make a complex technology understandable.$$),
  work_en = coalesce(work_en, $$We delivered a corporate website in English. The offering is organised in two ways, by market segment and by solution (systems, stacks, engineering services), so that each manufacturer starts from their own need.
Dedicated content explains the technology.
A full investor area brings together press releases, reports, the financial calendar and share information. The website also includes careers and events pages, as well as in-depth articles.$$)
where slug = 'powercell-group';
