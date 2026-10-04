# Supabase — articles, réalisations et demandes reçues

| Donnée | Table | Quand elle est lue ou écrite |
| --- | --- | --- |
| Articles du blog | `blog_posts` | Lue **au build** (`modules/cms.ts`), **en plus** des fichiers `content/blog/*.md` (même langue + slug : l'article Supabase remplace le fichier) |
| Réalisations | `projects` | Lue **au build** (`modules/cms.ts`) : dès que la table contient une réalisation, elle **remplace** la liste de `app/data/content.ts` |
| Comptes autorisés sur `/admin` | `admins` | Lue à chaque connexion à l'admin et par les routes `/api/admin` |
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

## Publier un article sans l'admin

Ajouter une ligne dans `blog_posts` : `lang` (`fr` ou `en`), `slug`, `title`, `description`, `sector` (clé de `BLOG_SECTORS` dans `shared/blog.ts`), corps en Markdown dans `body`.
L'article n'est publié que si `draft = false` et `date` ≤ aujourd'hui. `translation` = slug de la version dans l'autre langue.

Les pages du blog sont figées au build : il faut **redéployer** pour qu'un nouvel article apparaisse. Pour l'automatiser, créer dans Supabase un *Database Webhook* (Database → Webhooks) sur `blog_posts` (insert / update / delete) qui appelle un *Deploy Hook* Vercel (Settings → Git → Deploy Hooks). En local, redémarrer `npm run dev`.

## Demandes et appels

Consultables dans Table Editor (`leads`, `bookings`) ; la colonne `status` sert au suivi (`new` → `contacted` → `quoted` → `won` / `lost`).
Elles contiennent des données personnelles : accès au projet Supabase limité à l'équipe, et durée de conservation à indiquer dans la politique de confidentialité (mentions légales, article 7).
