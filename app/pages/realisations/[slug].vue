<template>
  <div v-if="project">
    <section class="container head">
      <Breadcrumb :items="[{ label: 'Accueil', to: '/' }, { label: 'Réalisations', to: '/realisations' }, { label: project.client }]" class="head__crumb" />
      <div class="head__tags">
        <span class="head__tag head__tag--dark">{{ CAT_LABEL[project.cat] }}</span>
        <span class="head__tag">{{ project.label }}</span>
      </div>
      <h1 class="head__h1">{{ project.client }} — {{ project.label }}</h1>
      <p class="lead head__sub">{{ c.sub }}</p>
      <a v-if="project.url" :href="project.url" target="_blank" rel="noopener" class="btn btn--dark head__site">Voir le site {{ project.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') }} ↗</a>
    </section>

    <section class="container">
      <figure class="visual" :style="{ background: project.bg }">
        <img :src="project.img" :alt="project.alt" width="1600" height="900" fetchpriority="high">
      </figure>
    </section>

    <section v-if="c.kpis.length" class="container kpis">
      <div class="grid grid-3">
        <div v-for="k in c.kpis" :key="k.l" class="card kpi"><span class="kpi__v">{{ k.v }}</span><span class="kpi__l">{{ k.l }}</span></div>
      </div>
    </section>

    <section class="container blocks">
      <div v-for="b in c.blocks" :key="b.k" class="block">
        <div class="eyebrow block__k">{{ b.k }}</div>
        <div class="block__body">
          <h2 class="block__t">{{ b.t }}</h2>
          <p class="block__d">{{ b.d }}</p>
          <NuxtLink v-if="b.link" :to="b.link.to" class="block__link">{{ b.link.label }} →</NuxtLink>
        </div>
      </div>
    </section>

    <section class="container next-wrap">
      <NuxtLink :to="`/realisations/${next.slug}`" class="next">
        <div class="next__text"><span class="next__k">Projet suivant</span><span class="next__t">{{ next.client }}<template v-if="!next.metric.startsWith('[')"> · {{ next.metric }}</template></span></div>
        <span class="next__arrow" aria-hidden="true">→</span>
      </NuxtLink>
    </section>
  </div>
</template>

<script setup lang="ts">
import { PROJECTS, CAT_LABEL, projectBySlug, serviceByKey, type ProjectCat } from '~/data/content'

const route = useRoute()
const project = computed(() => projectBySlug(String(route.params.slug)))
if (!project.value) throw createError({ statusCode: 404, statusMessage: 'Projet introuvable', fatal: true })

// Indicateurs publiés sur kps-agency.com (public/realisations.json)
const KPIS: Record<string, { v: string; l: string }[]> = {
  yassir: [{ v: '5M', l: 'paid reach' }, { v: '3.9M', l: 'reach Facebook' }, { v: '1.4M', l: 'reach Instagram' }],
  zayn: [{ v: '308.8K', l: 'couverture' }, { v: '6.5K', l: 'interactions' }],
  'groupado-pro': [{ v: '6.4M', l: 'impressions' }, { v: '1.7M', l: 'reach payante' }],
  'brasileia-cosmetics': [{ v: '1.8M', l: 'vues' }, { v: '996K', l: 'couverture' }],
  'tunisia-franchise-show': [{ v: '2.2M', l: 'reach' }, { v: '2.9K', l: 'interactions' }]
}

// Service mobilisé selon le type de projet : maillage interne vers la page d'expertise
const SERVICE_BY_CAT: Record<ProjectCat, string> = { Web: 'web', ADS: 'ads', Social: 'social' }

interface Block { k: string; t: string; d: string; link?: { to: string; label: string } }
const c = computed(() => {
  const p = project.value!
  const svc = serviceByKey(SERVICE_BY_CAT[p.cat])
  const hasDesc = !p.desc.startsWith('[')
  const sub = hasDesc
    ? p.desc
    : `Réalisation web de KPS Agency pour ${p.client}, acteur du secteur ${p.label.toLowerCase()}${p.url ? ' : découvrez le site en ligne' : ''}.`
  const blocks: Block[] = [{ k: 'Expertise mobilisée', t: svc.crumb, d: svc.sub, link: { to: `/services/${svc.slug}`, label: `Découvrir notre offre ${svc.crumb.toLowerCase()}` } }]
  return { sub, kpis: KPIS[p.slug] ?? [], blocks, hasDesc }
})

const next = computed(() => {
  const i = PROJECTS.findIndex(x => x.slug === project.value!.slug)
  return PROJECTS[(i + 1) % PROJECTS.length]!
})

const site = useRuntimeConfig().public.siteUrl as string
const metaDesc = computed(() => {
  const p = project.value!
  if (c.value.hasDesc && p.desc.length >= 110) return p.desc
  const long = c.value.hasDesc
    ? `${p.desc} Projet ${CAT_LABEL[p.cat].toLowerCase()} réalisé par KPS Agency, agence digitale à Paris.`
    : `Réalisation web de KPS Agency pour ${p.client} (${p.label.toLowerCase()}) : découvrez le projet et le site en ligne. Agence de création de site web à Paris.`
  const short = c.value.hasDesc ? p.desc : `Réalisation web de KPS Agency pour ${p.client} (${p.label.toLowerCase()}) : découvrez le projet et le site en ligne.`
  return long.length <= 160 ? long : short
})
// Titre ≤ 60 caractères avec la marque : libellé complet si possible, sinon le type de projet
const pageTitle = computed(() => {
  const p = project.value!
  const full = `${p.client} — ${p.label}`
  return full.length <= 47 ? full : `${p.client} — ${CAT_LABEL[p.cat]}`
})

// Tant qu'une étude de cas n'est pas rédigée (description réelle), la page reste hors index mais ses liens sont suivis
usePageSeo({
  title: () => pageTitle.value,
  description: metaDesc,
  image: () => project.value!.img,
  noindex: () => !c.value.hasDesc,
  type: 'article'
})
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: () => JSON.stringify({
      '@context': 'https://schema.org', '@type': 'CreativeWork', '@id': `${site}${route.path}#projet`,
      name: `${project.value!.client} — ${project.value!.label}`, description: metaDesc.value, url: `${site}${route.path}`,
      image: site + project.value!.img, inLanguage: 'fr-FR', genre: CAT_LABEL[project.value!.cat],
      creator: { '@id': `${site}/#organization` }, ...(project.value!.url ? { sameAs: project.value!.url } : {})
    })
  }]
})
</script>

<style scoped>
.head { display: flex; flex-direction: column; gap: 28px; padding-top: 40px; padding-bottom: 64px; }
.head__crumb { margin-bottom: 32px; }
.head__tags { display: flex; gap: 10px; flex-wrap: wrap; }
.head__tag { font-size: 13px; font-weight: 600; padding: 7px 12px; border-radius: 999px; border: 1px solid var(--line-3); }
.head__tag--dark { background: var(--ink); color: var(--white); border-color: var(--ink); }
.head__h1 { font-size: 88px; line-height: 1; letter-spacing: -3px; font-weight: 800; max-width: 1100px; }
.head__sub { max-width: 760px; }
.head__site { align-self: flex-start; }
.visual { margin: 0; border-radius: 28px; overflow: hidden; border: 1px solid var(--line); box-shadow: 0 30px 60px -30px rgba(23, 18, 61, .25); }
.visual img { display: block; width: 100%; height: auto; }
.kpis { padding-top: 64px; }
.kpi { display: flex; flex-direction: column; gap: 8px; padding: 36px; }
.kpi__v { font-family: var(--font-display); font-size: 64px; font-weight: 800; letter-spacing: -2px; color: var(--accent); }
.kpi__l { font-size: 16px; color: var(--muted); }
.blocks { display: flex; flex-direction: column; gap: 64px; padding-top: 128px; padding-bottom: 96px; }
.block { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: 24px; }
.block__k { grid-column: span 4; padding-top: 10px; }
.block__body { grid-column: span 8; display: flex; flex-direction: column; gap: 14px; }
.block__t { font-size: 36px; letter-spacing: -1px; font-weight: 700; }
.block__d { font-size: 18px; line-height: 1.65; color: var(--muted); }
.block__link { align-self: flex-start; font-size: 16px; font-weight: 600; color: var(--accent); }
.block__link:hover { color: var(--accent-hover); text-decoration: underline; }
.next-wrap { padding-bottom: 96px; }
.next { display: flex; justify-content: space-between; align-items: center; gap: 24px; padding: 48px 56px; border-radius: 28px; background: var(--ink); color: var(--white); }
.next:hover { color: var(--white); background: var(--ink-hover); }
.next__text { display: flex; flex-direction: column; gap: 8px; }
.next__k { font-size: 14px; color: var(--dark-muted-2); text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; }
.next__t { font-family: var(--font-display); font-size: 44px; font-weight: 800; letter-spacing: -1.2px; }
.next__arrow { display: flex; align-items: center; justify-content: center; width: 64px; height: 64px; flex-shrink: 0; border-radius: 99px; background: var(--accent); font-size: 26px; }
@media (max-width: 1180px) {
  .head__h1 { font-size: 60px; letter-spacing: -2px; }
  .block__k { grid-column: 1 / -1; margin-bottom: 12px; }
  .block__body { grid-column: 1 / -1; }
}
@media (max-width: 720px) {
  .head__h1 { font-size: 40px; letter-spacing: -1.2px; }
  .visual { border-radius: 18px; }
  .blocks { padding-top: 64px; gap: 40px; }
  .block__t { font-size: 28px; }
  .next { padding: 32px 24px; }
  .next__t { font-size: 28px; }
}
</style>
