# Supabase — articles du blog et demandes reçues

| Donnée | Table | Quand elle est lue ou écrite |
| --- | --- | --- |
| Articles du blog | `blog_posts` | Lue **au build** (`modules/cms.ts`), **en plus** des fichiers `content/blog/*.md` (même langue + slug : l'article Supabase remplace le fichier) |
| Demandes de contact / devis | `leads` | Écrite à l'exécution par `POST /api/contact` (page Contact et formulaire de l'accueil) |
| Demandes d'appel | `bookings` | Écrite à l'exécution par `POST /api/booking/book` |

Chaque demande est **aussi** envoyée par e-mail à l'équipe : elle est acceptée dès qu'elle est enregistrée ou envoyée, l'un peut échouer sans perdre le contact.
Sans variables Supabase, rien ne change : le blog n'utilise que les fichiers Markdown et les demandes partent uniquement par e-mail.

## Mise en place

1. Créer un projet sur supabase.com (région Europe, pour le RGPD).
2. SQL Editor → exécuter `migrations/20261002000000_kps_blog_leads_bookings.sql`.
   Avec la CLI : `npx supabase link --project-ref <ref>` puis `npx supabase db push`.
3. Renseigner dans `.env` en local **et** dans Vercel (Settings → Environment Variables) :
   - `SUPABASE_URL` : adresse du projet (`https://<ref>.supabase.co`) ;
   - `SUPABASE_PUBLISHABLE_KEY` : clé publishable (ou ancienne clé « anon »), lue au build pour les articles publiés ;
   - `SUPABASE_SECRET_KEY` : clé secrète (ou ancienne « service_role »), utilisée par le serveur pour enregistrer les demandes.
4. Redéployer : le journal de build affiche `Supabase : N articles`.

La clé secrète ne doit jamais être préfixée `NUXT_PUBLIC_` ni utilisée côté navigateur.

## Publier un article

Ajouter une ligne dans `blog_posts` : `lang` (`fr` ou `en`), `slug`, `title`, `description`, `sector` (clé de `BLOG_SECTORS` dans `shared/blog.ts`), corps en Markdown dans `body`.
L'article n'est publié que si `draft = false` et `date` ≤ aujourd'hui. `translation` = slug de la version dans l'autre langue.

Les pages du blog sont figées au build : il faut **redéployer** pour qu'un nouvel article apparaisse. Pour l'automatiser, créer dans Supabase un *Database Webhook* (Database → Webhooks) sur `blog_posts` (insert / update / delete) qui appelle un *Deploy Hook* Vercel (Settings → Git → Deploy Hooks). En local, redémarrer `npm run dev`.

## Demandes et appels

Consultables dans Table Editor (`leads`, `bookings`) ; la colonne `status` sert au suivi (`new` → `contacted` → `quoted` → `won` / `lost`).
Elles contiennent des données personnelles : accès au projet Supabase limité à l'équipe, et durée de conservation à indiquer dans la politique de confidentialité (mentions légales, article 7).
