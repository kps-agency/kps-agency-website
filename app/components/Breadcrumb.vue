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
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: props.items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.label, ...(it.to ? { item: site + it.to } : {}) }))
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
