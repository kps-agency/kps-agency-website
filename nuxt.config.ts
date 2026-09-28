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
        { name: 'theme-color', content: '#0E1726' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },
  nitro: {
    prerender: { crawlLinks: true, routes: ['/'] }
  }
})
