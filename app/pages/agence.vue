<template>
  <div>
    <section class="container intro">
      <div class="eyebrow">{{ t.eyebrow }}</div>
      <h1 class="intro__h1">{{ t.h1 }}</h1>
      <div class="intro__cols">
        <p class="intro__lead">{{ t.lead }}</p>
        <p class="intro__p">{{ t.intro }}</p>
      </div>
    </section>

    <section class="bg-white section--96">
      <div class="container">
        <div class="head">
          <div class="eyebrow">{{ t.adnEyebrow }}</div>
          <h2 class="h2 h2--52">{{ t.adnH2 }}</h2>
        </div>
        <div class="grid grid-3 m-swipe">
          <div v-for="a in t.adn" :key="a.n" class="adn">
            <span class="adn__n">{{ a.n }}</span>
            <h3 class="adn__t">{{ a.t }}</h3>
            <p class="adn__d">{{ a.d }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="container section">
      <div class="head head--row">
        <div class="head__col">
          <div class="eyebrow">{{ t.methodEyebrow }}</div>
          <h2 class="h2 h2--52">{{ t.methodH2 }}</h2>
        </div>
        <p class="text-18 head__p">{{ t.methodP }}</p>
      </div>
      <ol class="method">
        <li v-for="s in t.steps" :key="s.n" class="method__row">
          <span class="method__n">{{ s.n }}</span>
          <h3 class="method__t">{{ s.t }}</h3>
          <p class="method__d">{{ s.d }}</p>
        </li>
      </ol>
    </section>

    <section class="bg-dark section--96">
      <div class="container">
        <div class="head">
          <div class="eyebrow">{{ t.whyEyebrow }}</div>
          <h2 class="h2 h2--52">{{ t.whyH2 }}</h2>
        </div>
        <div class="grid grid-4 m-swipe">
          <div v-for="w in t.why" :key="w.tag" class="why">
            <span class="why__tag">{{ w.tag }}</span>
            <h3 class="why__t">{{ w.t }}</h3>
            <p class="why__d">{{ w.d }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="container section">
      <div class="eyebrow">{{ t.reviewsEyebrow }}</div>
      <h2 class="h2 h2--52 team__h">{{ t.reviewsH2 }}</h2>
      <ReviewCarousel :reviews="REVIEWS" />
    </section>

    <CtaBand :title="t.ctaTitle" :label="t.ctaLabel" />
  </div>
</template>

<script setup lang="ts">
import { REVIEWS, organizationSchema } from '~/data/content'

const { en, link } = useSite()
const t = useLocaleText({
  fr: {
    title: 'L’agence KPS : équipe digitale basée à Paris', desc: 'KPS Agency, agence digitale basée à Paris 8e : neuf expertises (web, apps, SEO & GEO, Ads, social media) réunies dans une même équipe pour faire grandir les PME.',
    eyebrow: 'L’agence', h1: 'Plus qu’une agence, votre co-pilote digital.',
    lead: 'Nous combinons créativité humaine et intelligence data pour construire des présences digitales qui font grandir les entreprises.',
    intro: 'Basée à Paris, KPS réunit au sein d’une même équipe neuf expertises complémentaires : création, refonte et maintenance de sites, applications métier, SaaS, applications mobiles, référencement SEO & GEO, marketing digital et social media. Une organisation pensée pour que stratégie, design, technologie et acquisition avancent dans la même direction.',
    adnEyebrow: 'Notre ADN', adnH2: 'Trois convictions guident chacun de nos projets.',
    adn: [
      { n: '01', t: 'Vision stratégique', d: 'Nous ne nous contentons pas d’exécuter. Nous construisons une feuille de route précise pour vous aider à dominer votre marché.' },
      { n: '02', t: 'Le Crew KPS', d: 'Une équipe de passionnés qui devient l’extension directe de votre marque et s’engage sur vos objectifs.' },
      { n: '03', t: 'Croissance accélérée', d: 'Des résultats tangibles : plus de visibilité, plus d’engagement, plus de conversions.' }
    ],
    methodEyebrow: 'Méthode', methodH2: 'Une méthode claire, du brief au décollage.', methodP: 'Un cadre précis, des étapes validées ensemble, aucune zone d’ombre.',
    steps: [
      { n: '01', t: 'Cadrage', d: 'Nous analysons votre marché, vos concurrents et vos objectifs pour définir ensemble les priorités et le périmètre du projet.' },
      { n: '02', t: 'Stratégie & conception', d: 'Parcours utilisateurs, maquettes, plan média : la stratégie prend forme et vous la validez avant toute production.' },
      { n: '03', t: 'Production', d: 'Design, développement, contenus ou campagnes : nos équipes produisent avec exigence et vous associent à chaque jalon.' },
      { n: '04', t: 'Lancement & croissance', d: 'Mise en ligne, mesure des performances, optimisation continue. Un projet digital ne s’arrête pas le jour de sa livraison.' }
    ],
    whyEyebrow: 'Pourquoi KPS', whyH2: 'L’exigence d’une grande agence, l’agilité d’une équipe engagée.',
    why: [
      { tag: '# 360°', t: 'Une vision globale', d: 'Site, référencement, publicité et contenus conçus ensemble, pour une présence cohérente.' },
      { tag: '# DATA', t: 'Des décisions fondées sur la donnée', d: 'Audits, analyses d’audience, suivi des KPIs : des recommandations appuyées sur des chiffres.' },
      { tag: '# RÉACTIVITÉ', t: 'Le rythme du digital', d: 'Le digital n’attend pas. Nous livrons vite pour que vous gardiez une longueur d’avance.' },
      { tag: '# EXIGENCE', t: 'Une qualité premium', d: 'L’image de votre marque est sacrée. Chaque livrable est pensé, relu et optimisé.' }
    ],
    reviewsEyebrow: 'Avis Google', reviewsH2: 'Ce que nos clients disent de nous.', ctaTitle: 'Envie de travailler avec nous ?', ctaLabel: 'Parler de votre projet'
  },
  en: {
    title: 'About KPS: a Paris-based digital team', desc: 'KPS Agency, a digital agency in Paris 8th: nine areas of expertise (web, apps, SEO & GEO, ads, social media) in one team, helping SMEs grow online.',
    eyebrow: 'About us', h1: 'More than an agency, your digital co-pilot.',
    lead: 'We combine human creativity and data intelligence to build digital presences that help companies grow.',
    intro: 'Based in Paris, KPS brings nine complementary areas of expertise together in one team: website design, redesign and maintenance, business software, SaaS, mobile apps, SEO & GEO, digital marketing and social media. An organisation designed so that strategy, design, technology and acquisition move in the same direction.',
    adnEyebrow: 'Our DNA', adnH2: 'Three convictions guide every project we take on.',
    adn: [
      { n: '01', t: 'Strategic vision', d: 'We don’t just execute. We build a precise roadmap to help you lead your market.' },
      { n: '02', t: 'The KPS crew', d: 'A passionate team that becomes a direct extension of your brand and commits to your goals.' },
      { n: '03', t: 'Accelerated growth', d: 'Tangible results: more visibility, more engagement, more conversions.' }
    ],
    methodEyebrow: 'Method', methodH2: 'A clear method, from brief to take-off.', methodP: 'A precise framework, steps agreed together, no grey areas.',
    steps: [
      { n: '01', t: 'Scoping', d: 'We analyse your market, competitors and goals to agree on priorities and project scope together.' },
      { n: '02', t: 'Strategy & design', d: 'User journeys, mock-ups, media plan: the strategy takes shape and you approve it before anything is produced.' },
      { n: '03', t: 'Production', d: 'Design, development, content or campaigns: our team delivers to a high standard and involves you at every milestone.' },
      { n: '04', t: 'Launch & growth', d: 'Go-live, performance tracking, continuous optimisation. A digital project doesn’t end on delivery day.' }
    ],
    whyEyebrow: 'Why KPS', whyH2: 'The standards of a large agency, the agility of a committed team.',
    why: [
      { tag: '# 360°', t: 'A global view', d: 'Website, SEO, advertising and content designed together for a consistent presence.' },
      { tag: '# DATA', t: 'Data-driven decisions', d: 'Audits, audience analysis, KPI tracking: recommendations backed by numbers.' },
      { tag: '# SPEED', t: 'Digital pace', d: 'Digital doesn’t wait. We deliver fast so you stay one step ahead.' },
      { tag: '# QUALITY', t: 'Premium quality', d: 'Your brand image matters. Every deliverable is thought through, reviewed and optimised.' }
    ],
    reviewsEyebrow: 'Google reviews', reviewsH2: 'What our clients say about us.', ctaTitle: 'Want to work with us?', ctaLabel: 'Discuss your project'
  }
})

usePageSeo({ title: () => t.value.title, description: () => t.value.desc })
const site = useRuntimeConfig().public.siteUrl as string
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: () => JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        organizationSchema(site, en.value ? 'en' : 'fr'),
        { '@type': 'AboutPage', '@id': `${site}${link.about()}#webpage`, url: `${site}${link.about()}`, name: t.value.title, inLanguage: en.value ? 'en' : 'fr-FR', about: { '@id': `${site}/#organization` }, mainEntity: { '@id': `${site}/#organization` } }
      ]
    })
  }]
})
</script>

<style scoped>
.intro { display: flex; flex-direction: column; gap: 32px; padding-top: 112px; padding-bottom: 80px; }
.intro__h1 { font-size: 96px; line-height: .98; letter-spacing: -3.2px; font-weight: 900; max-width: 1180px; }
.intro__cols { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 64px; margin-top: 24px; }
.intro__lead { font-size: 22px; line-height: 1.5; }
.intro__p { font-size: 18px; line-height: 1.65; color: var(--muted); }
.head { display: flex; flex-direction: column; gap: 16px; margin-bottom: 48px; }
.head--row { flex-direction: row; justify-content: space-between; align-items: flex-end; gap: 48px; }
.head__col { display: flex; flex-direction: column; gap: 16px; }
.head__p { max-width: 440px; }
.adn { display: flex; flex-direction: column; gap: 16px; padding: 40px 36px; min-height: 280px; background: var(--bg); border: 1px solid var(--line); border-radius: 20px; }
.adn__n { font-family: var(--font-display); font-size: 44px; font-weight: 900; color: var(--accent); }
.adn__t { font-size: 28px; letter-spacing: -.6px; font-weight: 700; }
.adn__d { font-size: 17px; line-height: 1.6; color: var(--muted); }
.method { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--line-2); }
.method__row { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: 24px; padding: 32px 0; border-bottom: 1px solid var(--line-2); align-items: baseline; }
.method__n { grid-column: span 1; font-family: var(--font-display); font-size: 28px; font-weight: 900; color: var(--accent); }
.method__t { grid-column: span 4; font-size: 30px; letter-spacing: -.6px; font-weight: 700; }
.method__d { grid-column: span 7; font-size: 17px; line-height: 1.6; color: var(--muted); }
.why { display: flex; flex-direction: column; gap: 14px; padding: 32px 28px; min-height: 230px; background: var(--dark-2); border-radius: 20px; }
.why__tag { align-self: flex-start; font-size: 12px; font-weight: 700; letter-spacing: 1.2px; padding: 6px 10px; border-radius: 999px; background: var(--dark-line); color: var(--accent-tint-2); }
.why__t { font-size: 23px; font-weight: 700; }
.why__d { font-size: 15px; line-height: 1.6; color: var(--dark-muted); }
.team__h { margin-bottom: 40px; }
@media (max-width: 1180px) {
  .intro__h1 { font-size: 64px; letter-spacing: -2px; }
  .intro__cols { grid-template-columns: minmax(0, 1fr); gap: 24px; }
  .head--row { flex-direction: column; align-items: flex-start; }
  .method__n { grid-column: span 2; }
  .method__t { grid-column: span 10; }
  .method__d { grid-column: 3 / -1; margin-top: 10px; }
}
@media (max-width: 720px) {
  .intro { padding-top: 64px; }
  .intro__h1 { font-size: 42px; letter-spacing: -1.2px; }
  .method__t { font-size: 24px; }
  .method__d { grid-column: 1 / -1; }
}
</style>
