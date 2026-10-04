<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <CookieConsent v-if="!$route.path.startsWith('/admin')" />
</template>

<script setup lang="ts">
// lang="fr-FR"/"en", canonical, hreflang (fr, en, x-default), og:url et og:locale sont posés automatiquement
// par @nuxtjs/i18n (experimental.strictSeo) à partir des URL traduites et de baseUrl.
useSeoMeta({ ogSiteName: 'KPS Agency' })
</script>
