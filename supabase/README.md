# Supabase — articles, réalisations et demandes reçues

| Donnée | Table | Quand elle est lue ou écrite |
| --- | --- | --- |
| Articles du blog | `blog_posts` | Lue **au build** (`modules/cms.ts`), **en plus** des fichiers `content/blog/*.md` (même langue + slug : l'article Supabase remplace le fichier) |
| Réalisations | `projects` | Lue **au build** (`modules/cms.ts`) : dès que la table contient une réalisation, elle **remplace** la liste de `app/data/content.ts` |
| Comptes autorisés sur `/admin` | `admins` | Lue à chaque connexion à l'admin et par les routes `/api/admin` |
| Expertises (textes modifiés) | `services` | Lue **au build** : les textes enregistrés s'appliquent **par-dessus** ceux de `app/data/content.ts` |
| Promotions (fenêtre du site) | `promos` | Lue **au build** ; la période d'affichage est recalculée dans le navigateur |
| Adresses laissées dans la fenêtre de promotion | `promo_signups` | Écrite à l'exécution par `POST /api/promo` (migration `20261008000000_kps_promo_popup.sql`) |
| Avis clients | `reviews` | Lue **au build** : dès que la table contient un avis, elle **remplace** la liste de `app/data/content.ts` |
| Mesures de performance | `perf_snapshots` | Écrite par l'admin à chaque mesure PageSpeed (rubrique Performances) |
| Demandes de contact / devis | `leads` | Écrite à l'exécution par `POST /api/contact` (page Contact et formulaire de l'accueil) |
| Demandes d'appel | `bookings` | Écrite à l'exécution par `POST /api/booking/book` |

Chaque demande est **aussi** envoyée par e-mail à l'équipe : elle est acceptée dès qu'elle est enregistrée ou envoyée, l'un peut échouer sans perdre le contact.
Sans variables Supabase, rien ne change : le blog n'utilise que les fichiers Markdown et les demandes partent uniquement par e-mail.

## Mise en place

1. Créer un projet sur supabase.com (région Europe, pour le RGPD).
2. SQL Editor → exécuter, dans l'ordre, les fichiers de `migrations/`.
   Avec la CLI : `npx supabase link --project-ref <ref>` puis `npx supabase db push`.
3. Renseigner dans `.env` en local **et** dans Vercel (Settings → Environment Variables) :
   - `SUPABASE_URL` : adresse du projet (`https://<ref>.supabase.co`) ;
   - `SUPABASE_PUBLISHABLE_KEY` : clé publishable (ou ancienne clé « anon »), lue au build pour les articles publiés ;
   - `SUPABASE_SECRET_KEY` : clé secrète (ou ancienne « service_role »), utilisée par le serveur pour enregistrer les demandes.
4. Redéployer : le journal de build affiche `Supabase : N articles`.

La clé secrète ne doit jamais être préfixée `NUXT_PUBLIC_` ni utilisée côté navigateur.

## Espace d'administration (`/admin`)

Articles et réalisations se gèrent sur `https://kps-agency.com/admin` : connexion par e-mail et mot de passe (Supabase Auth), réservée aux comptes de la table `admins`.

1. Exécuter `migrations/20261003000000_kps_admin_projects.sql` (tables `admins` et `projects`, droits d'écriture, reprise des réalisations existantes).
2. Créer un compte : `node --env-file=.env scripts/create-admin.mjs email@exemple.com "mot de passe"`. Pour retirer un accès : supprimer la ligne de `admins`.
3. Dans Supabase → Authentication → Sign In / Providers, désactiver « Allow new users to sign up » : seuls les comptes créés par l'équipe existent.
4. Dans Vercel → Settings → Git → Deploy Hooks, créer un hook sur `main` et le renseigner dans la variable `NUXT_VERCEL_DEPLOY_HOOK` : c'est lui qu'appelle le bouton « Publier le site ».
5. Renseigner aussi dans Vercel `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` et `CLOUDINARY_API_SECRET` : les images envoyées depuis l'admin vont sur Cloudinary (`kps/blog/…`, `kps/realisations/…`).

Le site est figé au build : une modification enregistrée dans l'admin n'apparaît en ligne qu'après « Publier le site » (deux à trois minutes). En local, redémarrer `npm run dev`.

## Tableau de bord complet

`migrations/20261007000000_kps_dashboard.sql` ajoute ce dont le tableau de bord a besoin : rôles (`admin` gère aussi les comptes, `editor` uniquement les contenus et les demandes), lecture et suivi des demandes et des rendez-vous par les comptes de `admins`, tables `promos`, `reviews`, `services` et `perf_snapshots`. Tant qu'elle n'est pas exécutée, les rubriques concernées affichent « Base de données à mettre à jour » et le site reste inchangé.

| Rubrique | Source | À configurer |
| --- | --- | --- |
| Vue d'ensemble, Demandes, Rendez-vous | Tables `leads` et `bookings` | La migration ci-dessus |
| Articles, Réalisations, Expertises, Promotions, Avis clients | Tables Supabase, mises en ligne par « Publier le site » | La migration ci-dessus |
| Audience | Google Analytics 4 (Data API) | `NUXT_GA_PROPERTY_ID` + compte de service Google |
| Référencement | Search Console + contrôle des balises des contenus | `NUXT_GSC_SITE_URL` + compte de service Google (le contrôle des contenus fonctionne sans) |
| Performances | PageSpeed Insights, disponibilité des pages, déploiements Vercel | Facultatif : `NUXT_PUBLIC_PAGESPEED_API_KEY`, `NUXT_VERCEL_TOKEN`, `NUXT_VERCEL_PROJECT_ID` |
| Utilisateurs | Table `admins` + Supabase Auth, via `/api/admin/users` (rôle `admin`) | `SUPABASE_SECRET_KEY` |

Le détail des variables figure dans `.env.example`. La rubrique Réglages de l'admin indique lesquelles manquent.

## Publier un article sans l'admin

Ajouter une ligne dans `blog_posts` : `lang` (`fr` ou `en`), `slug`, `title`, `description`, `sector` (clé de `BLOG_SECTORS` dans `shared/blog.ts`), corps en Markdown dans `body`.
L'article n'est publié que si `draft = false` et `date` ≤ aujourd'hui. `translation` = slug de la version dans l'autre langue.

Les pages du blog sont figées au build : il faut **redéployer** pour qu'un nouvel article apparaisse. Pour l'automatiser, créer dans Supabase un *Database Webhook* (Database → Webhooks) sur `blog_posts` (insert / update / delete) qui appelle un *Deploy Hook* Vercel (Settings → Git → Deploy Hooks). En local, redémarrer `npm run dev`.

## Demandes et appels

Consultables dans Table Editor (`leads`, `bookings`) ; la colonne `status` sert au suivi (`new` → `contacted` → `quoted` → `won` / `lost`).
Elles contiennent des données personnelles : accès au projet Supabase limité à l'équipe, et durée de conservation à indiquer dans la politique de confidentialité (mentions légales, article 7).
