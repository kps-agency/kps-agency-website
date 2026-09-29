<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// URL canonique unique par page : domaine de production, sans paramètres ni slash final
const route = useRoute()
const site = useRuntimeConfig().public.siteUrl as string
const canonical = computed(() => site + (route.path === '/' ? '/' : route.path.replace(/\/+$/, '')))

useHead({ link: [{ rel: 'canonical', href: canonical }] })
useSeoMeta({ ogUrl: canonical, ogSiteName: 'KPS Agency', ogLocale: 'fr_FR' })
</script>
