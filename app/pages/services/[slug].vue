<template>
  <div v-if="svc">
    <!-- HERO -->
    <section class="container hero">
      <Breadcrumb :items="[{ label: 'Accueil', to: '/' }, { label: 'Expertises', to: '/services' }, { label: svc.crumb }]" class="hero__crumb" />
      <div class="hero__main">
        <div class="eyebrow hero__eyebrow"><span class="hero__num">{{ svc.num }}</span>{{ svc.eyebrow }}</div>
        <h1 class="hero__h1">{{ svc.h1 }}</h1>
        <p class="lead hero__sub">{{ svc.sub }}</p>
        <div class="hero__ctas">
          <NuxtLink to="/contact" class="btn btn--primary">Parler de votre projet →</NuxtLink>
          <NuxtLink to="/realisations" class="btn btn--ghost">Voir les réalisations</NuxtLink>
        </div>
      </div>
      <div class="hero__offers card">
        <div class="hero__offers-title">Nos offres</div>
        <a v-for="of in svc.offers" :key="of.n" :href="`#offre-${of.n}`" class="hero__offer">{{ of.t }}<span>→</span></a>
      </div>
    </section>

    <!-- OFFRES -->
    <section id="offres" class="bg-white section--96">
      <div class="container">
        <div class="sec-head">
          <h2 class="h2 h2--52 sec-head__h">{{ svc.offersTitle }}</h2>
          <p class="text-18 sec-head__p">{{ svc.offersSub }}</p>
        </div>
        <div class="grid grid-2">
          <article v-for="of in svc.offers" :id="`offre-${of.n}`" :key="of.n" class="offer">
            <span class="offer__n">{{ of.n }}</span>
            <h3 class="offer__t">{{ of.t }}</h3>
            <p class="offer__d">{{ of.d }}</p>
            <div class="offer__tags"><span v-for="t in of.tags" :key="t">{{ t }}</span></div>
          </article>
        </div>
      </div>
    </section>

    <!-- APPROCHE -->
    <section class="container section split">
      <div class="split__head">
        <div class="eyebrow">L’approche KPS</div>
        <h2 class="h2 h2--48">{{ svc.benTitle }}</h2>
      </div>
      <div class="split__body">
        <div v-for="b in svc.benefits" :key="b.t" class="benefit">
          <h3>{{ b.t }}</h3>
          <p>{{ b.d }}</p>
        </div>
      </div>
    </section>

    <!-- METHODE -->
    <section class="bg-dark section--96">
      <div class="container">
        <div class="meth-head">
          <div class="eyebrow">Méthode</div>
          <h2 class="h2 h2--52">{{ svc.methTitle }}</h2>
        </div>
        <ol class="grid grid-4 msteps">
          <li v-for="st in svc.steps" :key="st.n" class="mstep">
            <span class="mstep__n">{{ st.n }}</span>
            <h3>{{ st.t }}</h3>
            <p>{{ st.d }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- REALISATIONS LIEES -->
    <section class="container section">
      <div class="rel-head">
        <h2 class="h2 h2--52">Ils nous ont fait confiance</h2>
        <NuxtLink to="/realisations" class="btn btn--ghost btn--sm">Toutes les réalisations</NuxtLink>
      </div>
      <div class="grid grid-3">
        <template v-if="related.length">
          <ProjectCard v-for="p in related" :key="p.slug" :project="p" compact bordered />
        </template>
        <template v-else>
          <div v-for="(bg, i) in ['#EEF1FF', '#F2E6D8', '#E4EFE9']" :key="i" class="ph card">
            <div class="ph__visual" :style="{ background: bg }">[Projet à ajouter]</div>
            <div class="ph__body"><span>[Secteur]</span><strong>[Résultat]</strong></div>
          </div>
        </template>
      </div>
    </section>

    <!-- FAQ -->
    <section class="bg-white faq-wrap">
      <div class="container section--96 split">
        <h2 class="h2 h2--48">Questions fréquentes</h2>
        <FaqList :items="SERVICE_FAQ" class="split__body split__body--block" />
      </div>
    </section>

    <CtaBand :title="svc.cta" text="Décrivez-nous votre besoin : nous revenons vers vous avec une recommandation claire et un devis personnalisé." white />
  </div>
</template>

<script setup lang="ts">
import { serviceBySlug, projectBySlug, SERVICE_FAQ, type Project } from '~/data/content'

const route = useRoute()
const svc = computed(() => serviceBySlug(String(route.params.slug)))
if (!svc.value) throw createError({ statusCode: 404, statusMessage: 'Page introuvable', fatal: true })

const related = computed(() => (svc.value?.related ?? []).map(projectBySlug).filter(Boolean) as Project[])

useSeoMeta({
  title: () => svc.value?.crumb ?? '',
  description: () => svc.value?.sub ?? '',
  ogTitle: () => `${svc.value?.crumb} · KPS Agency`,
  ogDescription: () => svc.value?.sub ?? ''
})
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: SERVICE_FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
    })
  }]
})
</script>

<style scoped>
.hero { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: 24px; padding-top: 40px; padding-bottom: 96px; }
.hero__crumb { grid-column: 1 / -1; margin-bottom: 56px; }
.hero__main { grid-column: span 7; display: flex; flex-direction: column; gap: 28px; }
.hero__eyebrow { display: flex; align-items: center; gap: 12px; }
.hero__num { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 10px; background: var(--accent); color: var(--white); font-family: var(--font-display); font-size: 14px; letter-spacing: 0; }
.hero__h1 { font-size: 72px; line-height: 1.02; letter-spacing: -2.4px; font-weight: 800; }
.hero__sub { max-width: 640px; }
.hero__ctas { display: flex; gap: 14px; flex-wrap: wrap; }
.hero__offers { grid-column: 9 / span 4; align-self: end; display: flex; flex-direction: column; gap: 10px; padding: 28px; }
.hero__offers-title { font-size: 13px; font-weight: 600; color: var(--muted-2); text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 6px; }
.hero__offer { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid var(--line-soft); font-size: 17px; font-weight: 600; }
.hero__offer span { color: var(--accent); }

.sec-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 48px; margin-bottom: 48px; }
.sec-head__h { max-width: 760px; }
.sec-head__p { max-width: 420px; }
.offer { display: flex; flex-direction: column; gap: 16px; padding: 36px; min-height: 250px; background: var(--bg); border: 1px solid var(--line); border-radius: 20px; scroll-margin-top: 110px; }
.offer__n { font-family: var(--font-display); font-size: 15px; font-weight: 800; color: var(--accent); }
.offer__t { font-size: 30px; letter-spacing: -.6px; font-weight: 700; }
.offer__d { font-size: 17px; line-height: 1.6; color: var(--muted); }
.offer__tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: auto; }
.offer__tags span { font-size: 13px; padding: 6px 10px; border-radius: 8px; background: var(--white); border: 1px solid var(--line); }

.split { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 64px; }
.split__head { display: flex; flex-direction: column; gap: 16px; }
.split__body { grid-column: span 2; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 40px 48px; }
.split__body--block { display: flex; }
.benefit { display: flex; flex-direction: column; gap: 12px; padding-top: 24px; border-top: 2px solid var(--ink); }
.benefit h3 { font-size: 24px; letter-spacing: -.4px; font-weight: 700; }
.benefit p { font-size: 16px; line-height: 1.6; color: var(--muted); }

.meth-head { display: flex; flex-direction: column; gap: 16px; margin-bottom: 48px; }
.msteps { list-style: none; margin: 0; padding: 0; }
.mstep { display: flex; flex-direction: column; gap: 14px; padding: 32px 28px; min-height: 240px; background: var(--dark-2); border-radius: 20px; }
.mstep__n { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 99px; background: var(--accent); font-weight: 600; }
.mstep h3 { font-size: 23px; font-weight: 700; }
.mstep p { font-size: 15px; line-height: 1.6; color: var(--dark-muted); }

.rel-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; margin-bottom: 40px; flex-wrap: wrap; }
.ph { overflow: hidden; display: flex; flex-direction: column; }
.ph__visual { height: 200px; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 28px; font-weight: 800; color: var(--muted-2); }
.ph__body { display: flex; flex-direction: column; gap: 8px; padding: 22px 24px; }
.ph__body span { font-size: 13px; color: var(--muted-2); font-weight: 500; }
.ph__body strong { font-family: var(--font-display); font-size: 20px; font-weight: 800; color: var(--accent); }
.faq-wrap { border-bottom: none; }

@media (max-width: 1180px) {
  .hero__h1 { font-size: 56px; letter-spacing: -1.8px; }
  .hero__main { grid-column: 1 / -1; }
  .hero__offers { grid-column: 1 / -1; margin-top: 48px; }
  .sec-head { flex-direction: column; align-items: flex-start; }
  .split { grid-template-columns: minmax(0, 1fr); gap: 40px; }
  .split__body { grid-column: auto; }
}
@media (max-width: 720px) {
  .hero { padding-bottom: 64px; }
  .hero__crumb { margin-bottom: 32px; }
  .hero__h1 { font-size: 40px; letter-spacing: -1.2px; }
  .split__body { grid-template-columns: minmax(0, 1fr); }
  .offer { padding: 28px; }
  .offer__t { font-size: 24px; }
}
</style>
