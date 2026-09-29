// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-09-01',
  devtools: { enabled: false },
  css: ['@fontsource-variable/bricolage-grotesque', '@fontsource-variable/geist', '~/assets/css/main.css'],
  runtimeConfig: { public: { siteUrl: 'https://kps-agency.com', formEndpoint: '' } },
  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      titleTemplate: '%s · KPS Agency',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#17123D' }
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/icon-32.png' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/icon-192.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
      ]
    }
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/sitemap.xml'],
      // /services → services.html (et non services/index.html) : URL sans slash final, servie par public/.htaccess
      autoSubfolderIndex: false
    }
  }
})
