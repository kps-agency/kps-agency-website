<template>
  <div v-if="page">
    <section class="container hero">
      <Breadcrumb :items="[{ label: 'Accueil', to: '/' }, { label: page.crumbParent }, { label: page.crumb }]" class="hero__crumb" />
      <div class="eyebrow">{{ page.eyebrow }}</div>
      <h1 class="hero__h1">{{ page.h1 }}</h1>
      <p class="lead hero__sub">{{ page.sub }}</p>
      <div class="hero__ctas">
        <NuxtLink to="/contact" class="btn btn--primary">Parler de votre projet →</NuxtLink>
        <NuxtLink to="/realisations" class="btn btn--ghost">Voir les réalisations</NuxtLink>
      </div>
    </section>

    <section class="bg-white section--96">
      <div class="container">
        <h2 class="h2 h2--52 svc-h">{{ page.svcTitle }}</h2>
        <div class="grid grid-3">
          <NuxtLink v-for="s in SERVICES" :key="s.slug" :to="`/services/${s.slug}`" class="svc">
            <span class="svc__n">{{ s.num }}</span>
            <h3 class="svc__t">{{ s.crumb }}</h3>
            <p class="svc__d">{{ short[s.key] }}</p>
            <span class="svc__more">En savoir plus →</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="container section split">
      <h2 class="h2 h2--48">{{ page.whyTitle }}</h2>
      <div class="split__body">
        <div v-for="w in page.why" :key="w.t" class="benefit"><h3>{{ w.t }}</h3><p>{{ w.d }}</p></div>
      </div>
    </section>

    <section class="bg-dark section--96">
      <div class="container">
        <h2 class="h2 h2--52 refs-h">{{ page.refTitle }}</h2>
        <div class="grid grid-3">
          <ProjectCard v-for="p in refs" :key="p.slug" :project="p" compact />
        </div>
      </div>
    </section>

    <section class="container section split">
      <h2 class="h2 h2--48">Questions fréquentes</h2>
      <FaqList :items="page.faq" class="split__faq" />
    </section>

    <CtaBand :title="page.cta" />
  </div>
</template>

<script setup lang="ts">
import { SERVICES, localBySlug, projectBySlug, organizationSchema, type Project } from '~/data/content'

const route = useRoute()
const page = computed(() => localBySlug(String(route.params.slug)))
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Page introuvable', fatal: true })
const refs = computed(() => (page.value?.refs ?? []).map(projectBySlug).filter(Boolean) as Project[])

const short: Record<string, string> = {
  web: 'Vitrine, blog, landing page, e-commerce.', app: 'Des outils sur mesure pour vos équipes.', seo: 'Visibilité sur Google et les IA génératives.',
  mobile: 'iOS et Android, de l’UX aux stores.', ads: 'Des campagnes pilotées par la donnée.', social: 'Visuel, vidéo et stratégie éditoriale.'
}

usePageSeo({ title: () => page.value?.title ?? '', description: () => page.value?.description ?? '' })

const site = useRuntimeConfig().public.siteUrl as string
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: () => JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        organizationSchema(site),
        {
          '@type': 'WebPage', '@id': `${site}${route.path}#webpage`, url: `${site}${route.path}`, name: page.value?.title, description: page.value?.description,
          inLanguage: 'fr-FR', about: { '@id': `${site}/#organization` }, isPartOf: { '@id': `${site}/#website` }
        },
        {
          '@type': 'FAQPage', '@id': `${site}${route.path}#faq`,
          mainEntity: (page.value?.faq ?? []).map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
        }
      ]
    })
  }]
})
</script>

<style scoped>
.hero { display: flex; flex-direction: column; gap: 28px; padding-top: 40px; padding-bottom: 96px; }
.hero__crumb { margin-bottom: 40px; }
.hero__h1 { font-size: 84px; line-height: 1; letter-spacing: -2.8px; font-weight: 800; max-width: 1100px; }
.hero__sub { max-width: 760px; }
.hero__ctas { display: flex; gap: 14px; flex-wrap: wrap; }
.svc-h { max-width: 900px; margin-bottom: 40px; }
.svc { display: flex; flex-direction: column; gap: 12px; padding: 28px; min-height: 200px; background: var(--bg); border: 1px solid var(--line); border-radius: 20px; color: var(--ink); transition: transform .2s ease; }
.svc:hover { color: var(--ink); transform: translateY(-3px); }
.svc__n { font-family: var(--font-display); font-size: 15px; font-weight: 800; color: var(--accent); }
.svc__t { font-size: 24px; font-weight: 700; letter-spacing: -.4px; }
.svc__d { font-size: 15px; line-height: 1.55; color: var(--muted); }
.svc__more { margin-top: auto; font-size: 14px; font-weight: 600; }
.split { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 64px; }
.split__body { grid-column: span 2; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 40px 48px; }
.split__faq { grid-column: span 2; }
.benefit { display: flex; flex-direction: column; gap: 12px; padding-top: 24px; border-top: 2px solid var(--ink); }
.benefit h3 { font-size: 24px; font-weight: 700; }
.benefit p { font-size: 16px; line-height: 1.6; color: var(--muted); }
.refs-h { margin-bottom: 40px; }
@media (max-width: 1180px) {
  .hero__h1 { font-size: 60px; letter-spacing: -2px; }
  .split { grid-template-columns: minmax(0, 1fr); gap: 40px; }
  .split__body, .split__faq { grid-column: auto; }
}
@media (max-width: 720px) {
  .hero { padding-bottom: 64px; }
  .hero__crumb { margin-bottom: 24px; }
  .hero__h1 { font-size: 42px; letter-spacing: -1.2px; }
  .split__body { grid-template-columns: minmax(0, 1fr); }
}
</style>
