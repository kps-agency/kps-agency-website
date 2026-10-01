<template>
  <NuxtLayout>
    <section class="container err">
      <div class="eyebrow">{{ t.error }} {{ error?.statusCode }}</div>
      <h1 class="err__h1">{{ t.h1 }}</h1>
      <NuxtLink :to="link.home()" class="btn btn--primary" @click.prevent="clearError({ redirect: link.home() })">{{ t.back }}</NuxtLink>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'
defineProps<{ error: NuxtError }>()
const { link } = useSite()
const t = useLocaleText({
  fr: { error: 'Erreur', h1: 'Cette page n’existe pas (ou plus).', back: 'Revenir à l’accueil', title: 'Page introuvable' },
  en: { error: 'Error', h1: 'This page doesn’t exist (or no longer exists).', back: 'Back to home', title: 'Page not found' }
})
useSeoMeta({ title: () => t.value.title, robots: 'noindex, follow' })
</script>

<style scoped>
.err { display: flex; flex-direction: column; align-items: flex-start; gap: 24px; padding-top: 120px; padding-bottom: 160px; }
.err__h1 { font-size: 64px; line-height: 1.02; letter-spacing: -2px; font-weight: 900; max-width: 900px; }
@media (max-width: 720px) { .err__h1 { font-size: 38px; } }
</style>
