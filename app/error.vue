<template>
  <NuxtLayout>
    <section class="container err">
      <div class="eyebrow">Erreur {{ error?.statusCode }}</div>
      <h1 class="err__h1">Cette page n’existe pas (ou plus).</h1>
      <NuxtLink to="/" class="btn btn--primary" @click.prevent="clearError({ redirect: '/' })">Revenir à l’accueil</NuxtLink>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'
defineProps<{ error: NuxtError }>()
useSeoMeta({ title: 'Page introuvable', robots: 'noindex' })
</script>

<style scoped>
.err { display: flex; flex-direction: column; align-items: flex-start; gap: 24px; padding-top: 120px; padding-bottom: 160px; }
.err__h1 { font-size: 64px; line-height: 1.02; letter-spacing: -2px; font-weight: 800; max-width: 900px; }
@media (max-width: 720px) { .err__h1 { font-size: 38px; } }
</style>
