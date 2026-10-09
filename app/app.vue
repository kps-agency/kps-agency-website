<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <CookieConsent v-if="!$route.path.startsWith('/admin')" />
</template>

<script setup lang="ts">
import { organizationSchema } from '~/data/content'

// lang="fr-FR"/"en", canonical, hreflang (fr, en, x-default), og:url et og:locale sont posés automatiquement
// par @nuxtjs/i18n (experimental.strictSeo) à partir des URL traduites et de baseUrl.
useSeoMeta({ ogSiteName: 'KPS Agency' })

// Données structurées communes à toutes les pages : l'agence (Organization) et le site (WebSite), dans la langue de la page.
// Sur l'accueil et la page Paris, l'agence est décrite comme établissement (ProfessionalService : coordonnées, horaires, plan) ;
// la note Google n'est déclarée que sur l'accueil, où les avis sont affichés.
const route = useRoute()
const { locale } = useI18n()
const baseName = useRouteBaseName()
const site = useRuntimeConfig().public.siteUrl as string
useJsonLd(() => {
  const lang = locale.value === 'en' ? 'en' : 'fr'
  const name = baseName(route)
  const home = name === 'index'
  const paris = name === 'agence-digitale-slug' && route.params.slug === 'paris'
  return [
    organizationSchema(site, lang, { local: home || paris, rating: home }),
    {
      '@type': 'WebSite', '@id': `${site}/#website`, url: `${site}/`, name: 'KPS Agency', inLanguage: ['fr-FR', 'en-GB'], publisher: { '@id': `${site}/#organization` },
      description: lang === 'en' ? 'Website of KPS Agency, a digital agency based in Paris.' : 'Site de KPS Agency, agence digitale à Paris.'
    }
  ]
})
</script>
