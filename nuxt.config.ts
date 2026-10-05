// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-09-01',
  devtools: { enabled: false },
  css: ['@fontsource-variable/dm-sans', '~/assets/css/main.css'],
  runtimeConfig: {
    // Réservation d'appels (serveur uniquement) — voir .env.example
    calendarProvider: 'ksuite', // ksuite (CalDAV Infomaniak) | google
    caldavUrl: '',
    caldavUsername: '',
    caldavPassword: '',
    kmeetBase: 'https://kmeet.infomaniak.com/',
    smtpHost: 'smtp.hostinger.com',
    smtpPort: '465',
    smtpUser: '',
    smtpPassword: '',
    mailFrom: '',
    bookingNotifyEmail: '',
    contactNotifyEmail: '', // destinataire des demandes de contact / devis
    googleServiceAccountEmail: '',
    googlePrivateKey: '',
    googleCalendarId: '',
    googleImpersonate: '',
    bookingAllowedOrigins: '',
    // Supabase : variables SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY (articles et réalisations lus au build, modules/cms.ts)
    // et SUPABASE_SECRET_KEY (demandes enregistrées par le serveur, server/utils/supabase.ts)
    // Admin : Deploy Hook Vercel appelé par le bouton « Publier le site » (NUXT_VERCEL_DEPLOY_HOOK)
    vercelDeployHook: '',
    public: {
      // Admin (/admin) : connexion Supabase Auth depuis le navigateur ; la clé publishable est publique, les droits sont portés par la RLS
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY || '',
      siteUrl: 'https://kps-agency.com',
      // Google Analytics 4 (chargé uniquement après consentement) ; vider NUXT_PUBLIC_GA_ID pour le désactiver
      gaId: 'G-GD7FPT0E0N',
      // Mesure aussi sur localhost (en debug_mode, hors rapports) : NUXT_PUBLIC_GA_LOCAL=true dans .env
      gaLocal: false,
      // Cloudinary : nom du cloud qui sert les images (vide = fichiers locaux de public/images) — voir app/composables/useCloudImage.ts
      cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
      formEndpoint: '', // vide = API interne /api/contact (e-mail SMTP) ; sinon URL d'un service externe
      // URL de l'API de réservation si elle est hébergée ailleurs que le site statique (ex. https://kps-agency.vercel.app)
      bookingApi: ''
    }
  },
  modules: ['@nuxtjs/i18n'],
  i18n: {
    // Français à la racine (/), anglais sous /en, URL traduites (customRoutes)
    locales: [
      { code: 'fr', language: 'fr-FR', name: 'Français' },
      { code: 'en', language: 'en-GB', name: 'English' }
    ],
    defaultLocale: 'fr',
    strategy: 'prefix_except_default',
    baseUrl: 'https://kps-agency.com',
    detectBrowserLanguage: false, // pas de redirection automatique : chaque URL reste stable pour Google
    customRoutes: 'config',
    pages: {
      'services/index': { fr: '/services', en: '/services' },
      'services/[slug]': { fr: '/services/[slug]', en: '/services/[slug]' },
      'realisations/index': { fr: '/realisations', en: '/work' },
      'realisations/[slug]': { fr: '/realisations/[slug]', en: '/work/[slug]' },
      'agence': { fr: '/agence', en: '/about' },
      'contact': { fr: '/contact', en: '/contact' },
      'agence-digitale/[slug]': { fr: '/agence-digitale/[slug]', en: '/digital-agency/[slug]' },
      'cgv': { fr: '/cgv', en: '/terms' },
      'mentions-legales': { fr: '/mentions-legales', en: '/legal-notice' },
      'rendez-vous': { fr: '/rendez-vous', en: '/book-a-call' },
      'blog/index': { fr: '/blog', en: '/blog' },
      'blog/page/[n]': { fr: '/blog/page/[n]', en: '/blog/page/[n]' },
      'blog/[slug]': { fr: '/blog/[slug]', en: '/blog/[slug]' },
      'admin': { en: false } // espace d'administration : une seule URL, non traduite
    },
    experimental: { strictSeo: true }
  },
  app: {
    head: {
      titleTemplate: '%s · KPS Agency',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#020617' }
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/icon-32.png' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/icon-192.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        // Images servies par Cloudinary : connexion ouverte dès le chargement de la page
        ...(process.env.CLOUDINARY_CLOUD_NAME ? [{ rel: 'preconnect', href: 'https://res.cloudinary.com' }] : [])
      ]
    }
  },
  // Cache navigateur des fichiers de public/ (mêmes durées que public/.htaccess) ; /_nuxt/** est déjà versionné et mis en cache 1 an.
  // Ces fichiers ne sont pas versionnés : renommer une image remplacée pour qu'elle soit visible tout de suite.
  routeRules: {
    // En-têtes de sécurité sur toutes les réponses (pas de CSP ici : à introduire d'abord en mode Report-Only)
    '/**': { headers: { 'x-content-type-options': 'nosniff', 'referrer-policy': 'strict-origin-when-cross-origin', 'x-frame-options': 'SAMEORIGIN', 'permissions-policy': 'camera=(), microphone=(), geolocation=()' } },
    ...Object.fromEntries(
      ['/images/**', '/logo-kps.webp', '/logo-kps-150.webp', '/og-image.jpg', '/favicon.ico', '/icon-32.png', '/icon-192.png', '/icon-512.png', '/apple-touch-icon.png']
        .map(path => [path, { headers: { 'cache-control': 'public, max-age=2592000, stale-while-revalidate=86400' } }])
    ),
    // Espace d'administration : rendu dans le navigateur uniquement, jamais indexé
    '/admin': { ssr: false, headers: { 'x-robots-tag': 'noindex, nofollow' } }
  },
  nitro: {
    // Le domaine technique kps-agency-website.vercel.app servait une copie du site : redirection permanente vers le domaine officiel
    vercel: { config: { routes: [{ src: '/(.*)', has: [{ type: 'host', value: 'kps-agency-website.vercel.app' }], status: 308, headers: { Location: 'https://kps-agency.com/$1' } }] } },
    // Articles du blog accessibles côté serveur (sitemap, llms.txt, flux RSS)
    serverAssets: [{ baseName: 'blog', dir: '../content/blog' }],
    prerender: {
      crawlLinks: true,
      routes: ['/', '/en', '/sitemap.xml', '/llms.txt', '/blog/rss.xml', '/en/blog/rss.xml'],
      // /services → services.html (et non services/index.html) : URL sans slash final, servie par public/.htaccess
      autoSubfolderIndex: false
    }
  }
})
