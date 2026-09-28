# KPS Agency — site vitrine

Site de l'agence digitale KPS (Paris), développé avec **Nuxt 4 / Vue 3** à partir des maquettes du canevas « KPS Agency — Refonte du site ».

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
npm run generate   # site statique dans .output/public (hébergement type Netlify, Vercel, OVH…)
npm run build      # build serveur (Node) si besoin de SSR
```

Node 20 ou plus récent requis.

## Pages

| Route | Page |
| --- | --- |
| `/` | Accueil (design v1) |
| `/services` | Liste des expertises |
| `/services/:slug` | Pages service : `creation-site-web`, `application-metier`, `referencement-seo-geo`, `application-mobile`, `marketing-digital-ads`, `social-media` |
| `/realisations` | Portfolio filtrable (Sites Web / Social/Médias / ADS) |
| `/realisations/:slug` | Fiche projet (étude de cas complète pour `yassir`) |
| `/agence` | L'agence : ADN, méthode, équipe |
| `/contact` | Demande de devis en 3 étapes |
| `/agence-digitale/:slug` | Landing pages SEO locales : `paris`, `energie` |
| `/cgv`, `/mentions-legales` | Pages légales (contenu à fournir) |

## Où modifier les contenus

- `app/data/content.ts` : projets, services, landing pages locales, liens du pied de page, coordonnées.
- `app/pages/index.vue` : contenus de la page d'accueil.
- `app/assets/css/main.css` : couleurs, typographie, boutons (design tokens).

Les textes entre crochets `[...]` sont des emplacements à compléter (témoignages, résultats, adresse, téléphone, visuels…).

## Formulaires

Les formulaires (accueil et `/contact`) n'envoient rien tant qu'aucun service n'est branché. Définissez la variable
`NUXT_PUBLIC_FORM_ENDPOINT` (URL d'un service comme Formspree, Brevo ou d'une API interne acceptant un POST JSON) pour activer l'envoi depuis `/contact`.

## Notes techniques

- Polices auto-hébergées (`@fontsource-variable`) : pas d'appel à Google Fonts, conforme RGPD.
- SEO : balises title/description par page, données structurées (fil d'Ariane, FAQ, ProfessionalService), `robots.txt`.
- Responsive : maquettes desktop 1440 px, adaptations tablette (≤ 1180 px) et mobile (≤ 720 px).
