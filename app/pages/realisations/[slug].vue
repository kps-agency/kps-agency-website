<template>
  <div v-if="project">
    <section class="container head">
      <Breadcrumb :items="[{ label: 'Accueil', to: '/' }, { label: 'Réalisations', to: '/realisations' }, { label: project.client }]" class="head__crumb" />
      <div class="head__tags">
        <span class="head__tag head__tag--dark">{{ CAT_LABEL[project.cat] }}</span>
        <span class="head__tag">{{ project.label }}</span>
      </div>
      <h1 class="head__h1">{{ c.title }}</h1>
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
        </div>
      </div>
    </section>

    <section class="container gallery">
      <div class="grid grid-2">
        <div class="gallery__ph" style="background: #E6ECF5">{{ c.gallery[0] }}</div>
        <div class="gallery__ph" style="background: #F2E6D8">{{ c.gallery[1] }}</div>
      </div>
    </section>

    <section class="container quote-wrap">
      <figure class="quote">
        <blockquote>« [Citation du client sur le projet] »</blockquote>
        <figcaption>[Prénom Nom] · <span>[Poste], {{ project.client }}</span></figcaption>
      </figure>
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
import { PROJECTS, CAT_LABEL, projectBySlug } from '~/data/content'

const route = useRoute()
const project = computed(() => projectBySlug(String(route.params.slug)))
if (!project.value) throw createError({ statusCode: 404, statusMessage: 'Projet introuvable', fatal: true })

interface Case { title: string; sub: string; kpis: { v: string; l: string }[]; blocks: { k: string; t: string; d: string }[]; gallery: [string, string] }
const DETAILS: Record<string, Case> = {
  yassir: {
    title: 'YASSIR : une stratégie ADS intégrée à grande échelle.',
    sub: 'Stratégie ADS intégrée avec reach massif et benchmarking compétitif pour une optimisation continue.',
    kpis: [{ v: '5M', l: 'Paid reach' }, { v: '3.9M', l: 'Reach Facebook' }, { v: '1.4M', l: 'Reach Instagram' }],
    blocks: [
      { k: 'Le contexte', t: '[Titre du contexte]', d: '[Présentation du client, de son marché et de sa situation avant le projet.]' },
      { k: 'Notre réponse', t: 'Une stratégie ADS intégrée et multi-plateforme.', d: 'Déploiement coordonné des campagnes sur Facebook et Instagram, appuyé par un benchmarking compétitif pour optimiser la diffusion en continu.' },
      { k: 'Les résultats', t: 'Une portée massive sur les deux plateformes.', d: '3.9M de reach sur Facebook, 1.4M sur Instagram et 5M de paid reach au total. [Résultats business complémentaires à ajouter.]' }
    ],
    gallery: ['[Visuel campagne Facebook]', '[Visuel campagne Instagram]']
  }
}

const c = computed<Case>(() => {
  const p = project.value!
  return DETAILS[p.slug] ?? {
    title: `${p.client} : ${p.label.toLowerCase()}.`,
    sub: p.desc,
    kpis: p.metric.startsWith('[') ? [] : [{ v: p.metric.split(' ')[0], l: p.metric.split(' ').slice(1).join(' ') }],
    blocks: [
      { k: 'Le contexte', t: '[Titre du contexte]', d: '[Présentation du client, de son marché et de sa situation avant le projet.]' },
      { k: 'Notre réponse', t: '[Titre de la solution]', d: p.desc.startsWith('[') ? '[Description de la solution apportée.]' : p.desc },
      { k: 'Les résultats', t: '[Titre des résultats]', d: '[Résultats obtenus.]' }
    ],
    gallery: ['[Visuel du projet]', '[Visuel du projet]']
  }
})

const next = computed(() => {
  const i = PROJECTS.findIndex(x => x.slug === project.value!.slug)
  return PROJECTS[(i + 1) % PROJECTS.length]!
})

useSeoMeta({
  title: () => `${project.value?.client} — ${project.value?.label}`,
  description: () => c.value.sub.startsWith('[') ? `Découvrez le projet ${project.value?.client} réalisé par KPS Agency.` : c.value.sub
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
.visual { margin: 0; border-radius: 28px; overflow: hidden; border: 1px solid var(--line); box-shadow: 0 30px 60px -30px rgba(14, 23, 38, .25); }
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
.gallery { padding-bottom: 96px; }
.gallery__ph { height: 420px; border-radius: 24px; display: flex; align-items: center; justify-content: center; color: var(--muted-2); font-size: 15px; }
.quote-wrap { padding-bottom: 96px; }
.quote { display: flex; flex-direction: column; gap: 20px; padding: 56px; background: var(--white); border: 1px dashed var(--line-3); border-radius: 24px; }
.quote blockquote { font-family: var(--font-display); font-size: 30px; line-height: 1.4; color: var(--muted); }
.quote figcaption { font-size: 15px; font-weight: 600; }
.quote figcaption span { color: var(--muted-2); font-weight: 400; }
.next-wrap { padding-bottom: 96px; }
.next { display: flex; justify-content: space-between; align-items: center; gap: 24px; padding: 48px 56px; border-radius: 28px; background: var(--ink); color: var(--white); }
.next:hover { color: var(--white); background: #16223A; }
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
  .gallery__ph { height: 260px; }
  .quote { padding: 32px 24px; }
  .quote blockquote { font-size: 22px; }
  .next { padding: 32px 24px; }
  .next__t { font-size: 28px; }
}
</style>
