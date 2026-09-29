<template>
  <div>
    <section class="container head">
      <div class="head__title">
        <div class="eyebrow">Réalisations</div>
        <h1 class="head__h1">Des projets concrets. Des résultats mesurables.</h1>
      </div>
      <p class="head__p">Sites corporate, campagnes social media, dispositifs d’acquisition : découvrez comment nous accompagnons des marques en France et à l’international.</p>
    </section>

    <section class="container">
      <dl class="stats">
        <div v-for="s in stats" :key="s.v" class="stats__item"><dt class="sr-only">{{ s.l }}</dt><dd class="stats__v">{{ s.v }}</dd><dd class="stats__l">{{ s.l }}</dd></div>
      </dl>
    </section>

    <section class="container work">
      <div class="work__bar">
        <div class="filters" role="group" aria-label="Filtrer les réalisations">
          <button v-for="f in filters" :key="f.id" type="button" :aria-pressed="filter === f.id" :class="{ 'is-on': filter === f.id }" @click="filter = f.id">{{ f.label }}</button>
        </div>
        <span class="work__count" aria-live="polite">{{ list.length }} projets</span>
      </div>
      <div class="grid grid-3">
        <ProjectCard v-for="p in list" :key="p.slug" :project="p" bordered />
      </div>
    </section>

    <CtaBand title="Votre projet sera notre prochaine référence." label="Parler de votre projet" />
  </div>
</template>

<script setup lang="ts">
import { PROJECTS } from '~/data/content'
usePageSeo({ title: 'Réalisations : sites web & campagnes digitales', description: 'Sites corporate, campagnes Google & Meta Ads et social media : découvrez les projets de KPS Agency pour des marques en France et à l’international.' })
const site = useRuntimeConfig().public.siteUrl as string
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage', '@id': `${site}/realisations#webpage`, url: `${site}/realisations`, name: 'Réalisations', inLanguage: 'fr-FR',
          mainEntity: { '@type': 'ItemList', numberOfItems: PROJECTS.length, itemListElement: PROJECTS.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${site}/realisations/${p.slug}`, name: `${p.client} — ${p.label}` })) }
        }
      ]
    })
  }]
})

const filters = [{ id: 'all', label: 'Tous' }, { id: 'Web', label: 'Sites Web' }, { id: 'Social', label: 'Social/Médias' }, { id: 'ADS', label: 'ADS' }]
const filter = ref('all')
const list = computed(() => filter.value === 'all' ? PROJECTS : PROJECTS.filter(p => p.cat === filter.value))
const stats = [{ v: '5M', l: 'paid reach · YASSIR' }, { v: '6.4M', l: 'impressions · groupado PRO' }, { v: '2.2M', l: 'reach · Tunisia Franchise Show' }, { v: '308.8K', l: 'couverture · ZAYN' }]
</script>

<style scoped>
.head { display: flex; justify-content: space-between; align-items: flex-end; gap: 64px; padding-top: 96px; padding-bottom: 64px; }
.head__title { display: flex; flex-direction: column; gap: 24px; max-width: 820px; }
.head__h1 { font-size: 80px; line-height: 1; letter-spacing: -2.6px; font-weight: 800; }
.head__p { font-size: 19px; line-height: 1.55; color: var(--muted); max-width: 400px; }
.stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); margin: 0 0 72px; background: var(--ink); color: var(--white); border-radius: 24px; overflow: hidden; }
.stats__item { display: flex; flex-direction: column; gap: 8px; padding: 36px 32px; border-right: 1px solid var(--dark-line); }
.stats__item:last-child { border-right: none; }
.stats dd { margin: 0; }
.stats__v { font-family: var(--font-display); font-size: 52px; font-weight: 800; letter-spacing: -1.5px; }
.stats__l { font-size: 15px; color: var(--dark-muted); }
.work { padding-bottom: 112px; }
.work__bar { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 32px; flex-wrap: wrap; }
.filters { display: flex; gap: 8px; padding: 6px; background: var(--white); border: 1px solid var(--line); border-radius: 999px; flex-wrap: wrap; }
.filters button { padding: 10px 18px; border: none; border-radius: 999px; font-size: 14px; font-weight: 600; background: transparent; color: var(--muted); }
.filters button.is-on { background: var(--ink); color: var(--white); }
.work__count { font-size: 15px; color: var(--muted-2); }
@media (max-width: 1180px) {
  .head { flex-direction: column; align-items: flex-start; gap: 24px; }
  .head__h1 { font-size: 56px; letter-spacing: -1.8px; }
  .stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .stats__item:nth-child(2) { border-right: none; }
}
@media (max-width: 720px) {
  .head { padding-top: 56px; }
  .head__h1 { font-size: 40px; letter-spacing: -1.2px; }
  .stats__v { font-size: 38px; }
  .stats__item { padding: 24px 20px; }
  .work { padding-bottom: 64px; }
}
</style>
