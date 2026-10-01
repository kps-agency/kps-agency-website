<template>
  <div>
    <section class="container head">
      <div class="head__title">
        <div class="eyebrow">{{ t.eyebrow }}</div>
        <h1 class="head__h1">{{ t.h1 }}</h1>
      </div>
      <p class="head__p">{{ t.lead }}</p>
    </section>

    <section class="container">
      <dl class="stats">
        <div v-for="s in t.stats" :key="s.v" class="stats__item"><dt class="sr-only">{{ s.l }}</dt><dd class="stats__v">{{ s.v }}</dd><dd class="stats__l">{{ s.l }}</dd></div>
      </dl>
    </section>

    <section class="container work">
      <div class="work__bar">
        <div class="filters" role="group" :aria-label="t.filterLabel">
          <button v-for="f in t.filters" :key="f.id" type="button" :aria-pressed="filter === f.id" :class="{ 'is-on': filter === f.id }" @click="filter = f.id">{{ f.label }}</button>
        </div>
        <span class="work__count" aria-live="polite">{{ list.length }} {{ t.projects }}</span>
      </div>
      <div class="grid grid-3">
        <ProjectCard v-for="p in list" :key="p.slug" :project="p" bordered />
      </div>
    </section>

    <CtaBand :title="t.ctaTitle" :label="t.ctaLabel" />
  </div>
</template>

<script setup lang="ts">
const { en, link, projects } = useSite()
const t = useLocaleText({
  fr: {
    eyebrow: 'Réalisations', h1: 'Des projets concrets. Des résultats mesurables.', lead: 'Sites corporate, campagnes social media, dispositifs d’acquisition : découvrez comment nous accompagnons des marques en France et à l’international.',
    filterLabel: 'Filtrer les réalisations', filters: [{ id: 'all', label: 'Tous' }, { id: 'Web', label: 'Sites Web' }, { id: 'Social', label: 'Social/Médias' }, { id: 'ADS', label: 'ADS' }],
    projects: 'projets', ctaTitle: 'Votre projet sera notre prochaine référence.', ctaLabel: 'Parler de votre projet',
    stats: [{ v: '5M', l: 'paid reach · YASSIR' }, { v: '6.4M', l: 'impressions · groupado PRO' }, { v: '2.2M', l: 'reach · Tunisia Franchise Show' }, { v: '308.8K', l: 'couverture · ZAYN' }],
    title: 'Réalisations : sites web & campagnes digitales', desc: 'Sites corporate, campagnes Google & Meta Ads et social media : découvrez les projets de KPS Agency pour des marques en France et à l’international.'
  },
  en: {
    eyebrow: 'Our work', h1: 'Real projects. Measurable results.', lead: 'Corporate websites, social media campaigns, acquisition set-ups: see how we support brands in France and internationally.',
    filterLabel: 'Filter projects', filters: [{ id: 'all', label: 'All' }, { id: 'Web', label: 'Websites' }, { id: 'Social', label: 'Social media' }, { id: 'ADS', label: 'Paid ads' }],
    projects: 'projects', ctaTitle: 'Your project could be our next reference.', ctaLabel: 'Discuss your project',
    stats: [{ v: '5M', l: 'paid reach · YASSIR' }, { v: '6.4M', l: 'impressions · groupado PRO' }, { v: '2.2M', l: 'reach · Tunisia Franchise Show' }, { v: '308.8K', l: 'reach · ZAYN' }],
    title: 'Our work: websites & digital campaigns', desc: 'Corporate websites, Google & Meta Ads campaigns and social media: discover the projects KPS Agency has delivered for brands in France and worldwide.'
  }
})
usePageSeo({ title: () => t.value.title, description: () => t.value.desc })
const site = useRuntimeConfig().public.siteUrl as string
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: () => JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage', '@id': `${site}${link.work()}#webpage`, url: `${site}${link.work()}`, name: t.value.title, inLanguage: en.value ? 'en' : 'fr-FR',
      mainEntity: { '@type': 'ItemList', numberOfItems: projects.value.length, itemListElement: projects.value.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${site}${link.project(p.slug)}`, name: `${p.client} — ${p.label}` })) }
    })
  }]
})

const filter = ref('all')
// Le menu « Nos réalisations » ouvre la page sur une catégorie (?cat=Web|Social|ADS) ; appliqué côté navigateur pour garder une seule page statique
const route = useRoute()
const applyCat = () => { const c = String(route.query.cat ?? ''); filter.value = ['Web', 'Social', 'ADS'].includes(c) ? c : 'all' }
onMounted(applyCat)
watch(() => route.query.cat, applyCat)
const list = computed(() => filter.value === 'all' ? projects.value : projects.value.filter(p => p.cat === filter.value))
</script>

<style scoped>
.head { display: flex; justify-content: space-between; align-items: flex-end; gap: 64px; padding-top: 96px; padding-bottom: 64px; }
.head__title { display: flex; flex-direction: column; gap: 24px; max-width: 820px; }
.head__h1 { font-size: 80px; line-height: 1; letter-spacing: -2.6px; font-weight: 900; }
.head__p { font-size: 19px; line-height: 1.55; color: var(--muted); max-width: 400px; }
.stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); margin: 0 0 72px; background: var(--deep); color: var(--white); border-radius: 24px; overflow: hidden; }
.stats__item { display: flex; flex-direction: column; gap: 8px; padding: 36px 32px; border-right: 1px solid var(--dark-line); }
.stats__item:last-child { border-right: none; }
.stats dd { margin: 0; }
.stats__v { font-family: var(--font-display); font-size: 52px; font-weight: 900; letter-spacing: -1.5px; }
.stats__l { font-size: 15px; color: var(--dark-muted); }
.work { padding-bottom: 112px; }
.work__bar { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 32px; flex-wrap: wrap; }
.filters { display: flex; gap: 8px; padding: 6px; background: var(--surface); border: 1px solid var(--line); border-radius: 999px; flex-wrap: wrap; }
.filters button { padding: 10px 18px; border: none; border-radius: 999px; font-size: 14px; font-weight: 600; background: transparent; color: var(--muted); }
.filters button.is-on { background: var(--deep); color: var(--white); }
.work__count { font-size: 15px; color: var(--muted-2); }
@media (max-width: 1180px) {
  .head { flex-direction: column; align-items: flex-start; gap: 24px; }
  .head__h1 { font-size: 56px; letter-spacing: -1.8px; }
  .stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .stats__item:nth-child(2) { border-right: none; }
}
@media (max-width: 720px) {
  .filters { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; max-width: 100%; }
  .filters::-webkit-scrollbar { display: none; }
  .filters button { flex: none; white-space: nowrap; }
  .work__bar { flex-wrap: nowrap; }
  .head { padding-top: 56px; }
  .head__h1 { font-size: 40px; letter-spacing: -1.2px; }
  .stats__v { font-size: 38px; }
  .stats__item { padding: 24px 20px; }
  .work { padding-bottom: 64px; }
}
</style>
