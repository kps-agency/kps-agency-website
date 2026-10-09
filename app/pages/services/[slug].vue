<template>
  <div v-if="svc">
    <!-- HERO -->
    <section class="container hero">
      <Breadcrumb :items="[{ label: t.home, to: link.home() }, { label: t.crumb, to: link.services() }, { label: svc.crumb }]" class="hero__crumb" />
      <div class="hero__main">
        <div class="hero__eyebrow"><span class="hero__num" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path :d="serviceIconPath(svc.key)" /></svg></span><h1 class="eyebrow hero__kw">{{ seo.h1 }}</h1></div>
        <p class="hero__h1">{{ svc.h1 }}</p>
        <p class="lead hero__sub">{{ svc.sub }}</p>
        <div class="hero__ctas">
          <NuxtLink :to="link.contact()" class="btn btn--primary">{{ t.talk }} →</NuxtLink>
          <NuxtLink :to="link.work()" class="btn btn--ghost">{{ t.seeWork }}</NuxtLink>
        </div>
        <p v-if="svc.from" class="hero__from">{{ t.from }} <strong>{{ svc.from }}</strong></p>
      </div>
      <div class="hero__offers card">
        <div class="hero__offers-title">{{ t.offers }}</div>
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
        <div class="grid grid-2 m-swipe">
          <article v-for="(of, i) in svc.offers" :id="`offre-${of.n}`" :key="of.n" class="offer">
            <span class="offer__icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="offerIconPath(svc.key, i)" /></svg></span>
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
        <div class="eyebrow">{{ t.approach }}</div>
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
          <div class="eyebrow">{{ t.method }}</div>
          <h2 class="h2 h2--52">{{ svc.methTitle }}</h2>
        </div>
        <ol class="grid grid-4 msteps m-swipe">
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
      <!-- Avis Google en rapport avec cette expertise (SERVICE_REVIEW), repris tel quel -->
      <figure v-if="review" class="proof">
        <span class="proof__stars" role="img" :aria-label="`${review.rating} / 5`">{{ '★'.repeat(review.rating) }}</span>
        <blockquote class="proof__q">« {{ review.text }} »</blockquote>
        <figcaption class="proof__who"><strong>{{ review.name }}</strong> · <a :href="GOOGLE_REVIEWS_URL" target="_blank" rel="noopener">{{ en ? 'Google review' : 'Avis Google' }}</a></figcaption>
      </figure>
      <div class="rel-head">
        <h2 class="h2 h2--52">{{ t.trusted }}</h2>
        <NuxtLink :to="link.work()" class="btn btn--ghost btn--sm">{{ t.allWork }}</NuxtLink>
      </div>
      <div class="grid grid-3 m-swipe">
        <ProjectCard v-for="p in related" :key="p.slug" :project="p" compact bordered />
      </div>
    </section>

    <!-- GUIDES LIES : articles du blog rattachés à cette expertise -->
    <section v-if="guides.length" class="container section guides">
      <div class="rel-head">
        <h2 class="h2 h2--52">{{ t.guides }}</h2>
        <NuxtLink :to="link.blog()" class="btn btn--ghost btn--sm">{{ t.allGuides }}</NuxtLink>
      </div>
      <div class="grid grid-3 m-swipe">
        <NuxtLink v-for="a in guides" :key="a.slug" :to="link.article(a.slug)" class="guide">
          <h3 class="guide__t">{{ a.title }}</h3>
          <p class="guide__d">{{ a.description }}</p>
          <span class="guide__more">{{ t.read }} · {{ a.readingMinutes }} min →</span>
        </NuxtLink>
      </div>
    </section>

    <!-- FAQ -->
    <section class="bg-white faq-wrap">
      <div class="container section--96 split">
        <h2 class="h2 h2--48">{{ t.faq }}</h2>
        <LazyFaqList hydrate-on-visible :items="faq" class="split__body split__body--block" />
      </div>
    </section>

    <CtaBand :title="svc.cta" :text="t.ctaText" white />
  </div>
</template>

<script setup lang="ts">
import { offerIconPath, serviceIconPath } from '~/data/serviceIcons'
import { GOOGLE_REVIEWS_URL, REVIEWS, SERVICE_REVIEW, type Project } from '~/data/content'
import { SERVICE_FAQS } from '~/data/serviceFaq'
import { blogArticles } from '~/data/blog'

const route = useRoute()
const { en, link, allServices, projects, serviceFaq, serviceSeo, serviceSlug } = useSite()

// Le slug doit correspondre à la langue de l'URL (/services/creation-site-web ↔ /en/services/website-design)
const svc = computed(() => allServices.value.find(s => serviceSlug(s.slug) === String(route.params.slug)))
if (!svc.value) throw createError({ statusCode: 404, statusMessage: 'Page introuvable', fatal: true })
useSetI18nParams()({ fr: { slug: svc.value.slug }, en: { slug: serviceSlug(svc.value.slug, 'en') } })
// Questions propres à l'expertise : chaque page a sa FAQ (les conditions communes sont sur /services)
const faq = computed(() => SERVICE_FAQS[svc.value!.slug]?.[en.value ? 'en' : 'fr'] ?? serviceFaq.value)

const t = useLocaleText({
  fr: { home: 'Accueil', crumb: 'Expertises', talk: 'Parler de votre projet', from: 'À partir de', seeWork: 'Voir les réalisations', offers: 'Nos offres', approach: 'L’approche KPS', method: 'Méthode', trusted: 'Ils nous ont fait confiance', allWork: 'Toutes les réalisations', faq: 'Questions fréquentes', guides: 'Nos guides sur le sujet', allGuides: 'Tous les articles', read: 'Lire', ctaText: 'Décrivez-nous votre besoin : nous revenons vers vous avec une recommandation claire et un devis personnalisé.' },
  en: { home: 'Home', crumb: 'Services', talk: 'Discuss your project', from: 'From', seeWork: 'See our work', offers: 'What we offer', approach: 'The KPS approach', method: 'Method', trusted: 'They trusted us', allWork: 'All our work', faq: 'Frequently asked questions', guides: 'Our guides on the topic', allGuides: 'All articles', read: 'Read', ctaText: 'Tell us what you need: we’ll come back to you with a clear recommendation and a tailored quote.' }
})

// Projets liés au service ; à défaut, les réalisations les plus récentes (jamais de carte vide)
const related = computed(() => {
  const own = (svc.value?.related ?? []).map(slug => projects.value.find(p => p.slug === slug)).filter(Boolean) as Project[]
  return own.length ? own : projects.value.slice(0, 3)
})

// Six articles les plus récents rattachés à l'expertise (champ « service » de l'article)
// Les avis sont en français : rien sur la version anglaise
const review = computed(() => (en.value ? undefined : REVIEWS.find(r => r.name === SERVICE_REVIEW[svc.value!.slug])))
const guides = computed(() => blogArticles(en.value ? 'en' : 'fr').filter(a => a.service === svc.value!.slug).slice(0, 6))

const seo = computed(() => serviceSeo.value[svc.value!.slug]!)
usePageSeo({ title: () => seo.value.title, description: () => seo.value.desc })
const site = useRuntimeConfig().public.siteUrl as string
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: () => {
      const url = `${site}${link.service(svc.value!.slug)}`
      const lang = en.value ? 'en-GB' : 'fr-FR'
      return JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Service', '@id': `${url}#service`,
            name: seo.value.h1, serviceType: svc.value!.crumb, description: seo.value.desc, url, inLanguage: lang,
            provider: { '@id': `${site}/#organization` },
            // Zone desservie : Madagascar pour la page qui lui est dédiée, Paris et la France pour les autres
            areaServed: svc.value!.slug === 'agence-seo-madagascar' ? [{ '@type': 'Country', name: 'Madagascar' }] : [{ '@type': 'City', name: 'Paris' }, { '@type': 'Country', name: 'France' }],
            hasOfferCatalog: {
              '@type': 'OfferCatalog', name: svc.value!.offersTitle,
              itemListElement: svc.value!.offers.map(of => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: of.t, description: of.d } }))
            }
          },
          faqSchema(url, faq.value, en.value)
        ]
      })
    }
  }]
})
</script>

<style scoped>
.hero__from { font-size: 16px; color: var(--muted); }
.hero__from strong { font-size: 20px; color: var(--ink); }
.hero { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: 24px; padding-top: 40px; padding-bottom: var(--section-y); }
.hero__crumb { grid-column: 1 / -1; margin-bottom: 56px; }
.hero__main { grid-column: span 7; display: flex; flex-direction: column; gap: 28px; }
.hero__eyebrow { display: flex; align-items: center; gap: 12px; }
.hero__kw { font-family: var(--font-body); }
.hero__num { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 12px; background: var(--accent); color: var(--on-accent); font-family: var(--font-display); font-size: 14px; letter-spacing: 0; }
.hero__h1 { font-family: var(--font-display); font-size: 72px; line-height: 1.02; letter-spacing: -2.4px; font-weight: 900; }
.hero__sub { max-width: 640px; }
.hero__ctas { display: flex; gap: 14px; flex-wrap: wrap; }
.hero__offers { grid-column: 9 / span 4; align-self: end; display: flex; flex-direction: column; gap: 10px; padding: 28px; }
.hero__offers-title { font-size: 13px; font-weight: 600; color: var(--muted-2); text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 6px; }
.hero__offer { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid var(--line-soft); font-size: 16px; font-weight: 600; }
.hero__offer span { color: var(--accent); }

.sec-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 48px; margin-bottom: 48px; }
.sec-head__h { max-width: 760px; }
.sec-head__p { max-width: 420px; }
.offer { display: flex; flex-direction: column; gap: 16px; padding: 36px; min-height: 250px; background: var(--bg); border: 1px solid var(--line); border-radius: 20px; scroll-margin-top: 110px; }
.offer__icon { display: flex; align-items: center; justify-content: center; width: 52px; height: 52px; border-radius: 16px; background: var(--accent-soft); border: 1px solid var(--accent-tint); color: var(--accent-light); }
.offer__t { font-size: 32px; letter-spacing: -.6px; font-weight: 700; }
.offer__d { font-size: 16px; line-height: 1.6; color: var(--muted); }
.offer__tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: auto; }
.offer__tags span { font-size: 13px; padding: 6px 10px; border-radius: 8px; background: var(--surface); border: 1px solid var(--line); }

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
.mstep__n { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 999px; background: var(--accent); font-weight: 600; }
.mstep h3 { font-size: 23px; font-weight: 700; }
.mstep p { font-size: 16px; line-height: 1.6; color: var(--dark-muted); }

/* Nombre impair d'offres : la dernière occupe toute la largeur au lieu de laisser une case vide */
.grid-2 > .offer:last-child:nth-child(odd) { grid-column: 1 / -1; min-height: 0; }
.proof { display: flex; flex-direction: column; gap: 14px; max-width: 900px; margin-bottom: 64px; padding: 32px 36px; border: 1px solid var(--line); border-left: 3px solid var(--accent); border-radius: 0 20px 20px 0; background: var(--surface); }
.proof__stars { color: #FBBF24; letter-spacing: 3px; font-size: 18px; }
.proof__q { font-size: 20px; line-height: 1.6; color: var(--ink); }
.proof__who { font-size: 15px; color: var(--muted-2); }
.proof__who strong { color: var(--ink); }
.proof__who a { text-decoration: underline; text-underline-offset: 3px; }
.rel-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; margin-bottom: 40px; flex-wrap: wrap; }
.faq-wrap { border-bottom: none; }
.guides { padding-top: 0; }
.guide { display: flex; flex-direction: column; gap: 12px; padding: 28px; background: var(--surface); border: 1px solid var(--line); border-radius: 20px; color: var(--ink); transition: transform .2s ease; }
.guide:hover { transform: translateY(-3px); color: var(--ink); }
.guide__t { font-size: 21px; line-height: 1.25; letter-spacing: -.3px; font-weight: 700; }
.guide__d { font-size: 15px; line-height: 1.55; color: var(--muted); }
.guide__more { margin-top: auto; font-size: 15px; font-weight: 600; color: var(--accent-light); }

@media (max-width: 1180px) {
  .hero__h1 { font-size: 52px; letter-spacing: -1.8px; }
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
