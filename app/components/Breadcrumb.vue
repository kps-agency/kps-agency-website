<template>
  <nav class="crumb" aria-label="Fil d’Ariane">
    <template v-for="(it, i) in items" :key="i">
      <NuxtLink v-if="it.to" :to="it.to">{{ it.label }}</NuxtLink>
      <span v-else :class="{ 'crumb__current': i === items.length - 1 }" :aria-current="i === items.length - 1 ? 'page' : undefined">{{ it.label }}</span>
      <span v-if="i < items.length - 1" class="crumb__sep" aria-hidden="true">/</span>
    </template>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{ items: { label: string; to?: string }[] }>()
const site = useRuntimeConfig().public.siteUrl as string
const route = useRoute()

// Données structurées : chaque étape pointe vers une vraie URL (la dernière = page courante) ;
// les étapes intermédiaires sans page sont ignorées pour rester conformes aux exigences Google.
const crumbs = computed(() => props.items
  .map((it, i) => ({ name: it.label, url: it.to ? site + it.to : i === props.items.length - 1 ? site + route.path : null }))
  .filter(c => c.url))

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: () => JSON.stringify({
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: crumbs.value.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url }))
    })
  }]
})
</script>

<style scoped>
.crumb { display: flex; flex-wrap: wrap; gap: 10px; font-size: 14px; color: var(--muted-2); }
.crumb a { color: var(--muted-2); }
.crumb a:hover { color: var(--accent); }
.crumb__current { color: var(--ink); font-weight: 500; }
</style>
