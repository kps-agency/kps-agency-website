<template>
  <div>
    <section class="container head">
      <Breadcrumb :items="[{ label: t.home, to: link.home() }, { label: t.crumb }]" />
      <h1 class="eyebrow">{{ t.h1seo }}</h1>
      <p class="head__h1 display">{{ t.h1 }}</p>
      <p class="lead head__p">{{ t.lead }}</p>
    </section>
    <!-- Entrée par le besoin : oriente le visiteur qui ne connaît pas encore le nom de l'expertise -->
    <section class="container needs">
      <h2 class="needs__h">{{ t.needsTitle }}</h2>
      <ul class="needs__list">
        <li v-for="n in t.needs" :key="n.slug"><NuxtLink :to="link.service(n.slug)" class="need"><span>{{ n.q }}</span><strong>{{ byslug(n.slug)?.crumb }} →</strong></NuxtLink></li>
      </ul>
    </section>

    <section v-for="g in groups" :key="g.title" class="container fam">
      <div class="fam__head">
        <h2 class="h2 h2--48">{{ g.title }}</h2>
        <p class="fam__p">{{ g.text }}</p>
      </div>
      <div class="grid grid-3 m-swipe">
        <div v-for="sv in g.items" :key="sv.slug" class="item card-link">
          <span class="item__num"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="serviceIconPath(sv.key)" /></svg></span>
          <h3 class="item__t"><NuxtLink :to="link.service(sv.slug)" class="card-link__a">{{ sv.crumb }}</NuxtLink></h3>
          <p class="item__d">{{ sv.sub }}</p>
          <div class="item__pills"><span v-for="of in sv.offers" :key="of.n">{{ of.t }}</span></div>
          <span class="item__cta">{{ t.more }} →</span>
        </div>
      </div>
    </section>

    <TechStack />

    <section class="container proof">
      <div class="proof__head">
        <h2 class="h2 h2--48">{{ t.proof }}</h2>
        <NuxtLink :to="link.work()" class="btn btn--ghost btn--sm">{{ t.allWork }}</NuxtLink>
      </div>
      <div class="grid grid-3 m-swipe">
        <ProjectCard v-for="p in proofs" :key="p.slug" :project="p" compact bordered />
      </div>
    </section>

    <!-- Conditions communes à toutes les prestations : affichées ici une seule fois -->
    <section class="bg-white">
      <div class="container section--96 terms">
        <h2 class="h2 h2--48">{{ t.faq }}</h2>
        <FaqList :items="serviceFaq" class="terms__list" />
      </div>
    </section>
    <CtaBand :title="t.ctaTitle" :text="t.ctaText" />
  </div>
</template>

<script setup lang="ts">
import { serviceIconPath } from '~/data/serviceIcons'
import { SERVICE_FAMILIES } from '~/data/content'
const { en, link, services, projects, serviceFaq, serviceSeo } = useSite()
const byslug = (slug: string) => services.value.find(sv => sv.slug === slug)
// Les neuf expertises regroupées en trois familles (SERVICE_FAMILIES, source unique du regroupement)
// Une réalisation par famille, dans le même ordre : site web, application, campagne d'acquisition
const proofs = computed(() => ['powercell-group', 'karoo', 'yassir'].map(slug => projects.value.find(p => p.slug === slug)).filter(Boolean) as typeof projects.value)
const groups = computed(() => SERVICE_FAMILIES.map(f => ({ title: f.title[en.value ? 'en' : 'fr'], text: f.text[en.value ? 'en' : 'fr'], items: f.slugs.map(byslug).filter(Boolean) as typeof services.value })))
const t = useLocaleText({
  fr: {
    home: 'Accueil', crumb: 'Expertises', h1seo: 'Nos expertises : sites web, applications, SEO et publicité', h1: 'Neuf expertises. Une seule équipe. Un objectif : votre croissance.',
    lead: 'Chaque expertise se mobilise seule ou en synergie. C’est dans leur articulation — un site bien référencé, nourri par des campagnes rentables et des contenus engageants — que naît la performance durable.',
    more: 'Découvrir', faq: 'Nos conditions, en clair', proof: 'Ils nous ont fait confiance', allWork: 'Toutes les réalisations',
    needsTitle: 'Vous ne savez pas par où commencer ? Partez de votre besoin.',
    needs: [
      { q: 'Je n’ai pas encore de site, ou il ne me ressemble plus', slug: 'creation-site-web' },
      { q: 'Mon site ne m’apporte pas de demandes', slug: 'refonte-site-web' },
      { q: 'Je veux être trouvé sur Google et cité par les IA', slug: 'referencement-seo-geo' },
      { q: 'J’ai besoin de demandes rapidement', slug: 'marketing-digital-ads' },
      { q: 'Mes équipes perdent du temps dans des fichiers Excel', slug: 'application-metier' },
      { q: 'J’ai une idée de produit en ligne à lancer', slug: 'creation-saas' }
    ],
    ctaTitle: 'Un projet en tête ?', ctaText: 'Décrivez-nous votre besoin : nous revenons vers vous avec une recommandation claire et un devis personnalisé.',
    title: 'Agence web & marketing digital : nos expertises', desc: 'Création, refonte et maintenance de sites, applications métier, SaaS et mobiles, SEO & GEO, publicité en ligne et social media : neuf expertises à Paris.'
  },
  en: {
    home: 'Home', crumb: 'Services', h1seo: 'Our services: websites, applications, SEO and advertising', h1: 'Nine areas of expertise. One team. One goal: your growth.',
    lead: 'Each service works on its own or in synergy with the others. Lasting performance comes from how they fit together — a well-ranked website, fuelled by profitable campaigns and engaging content.',
    more: 'Discover', faq: 'How we work, in plain terms', proof: 'They trusted us', allWork: 'All our work',
    needsTitle: 'Not sure where to start? Begin with what you need.',
    needs: [
      { q: 'I have no website yet, or it no longer reflects my business', slug: 'creation-site-web' },
      { q: 'My website brings me no enquiries', slug: 'refonte-site-web' },
      { q: 'I want to be found on Google and cited by AI tools', slug: 'referencement-seo-geo' },
      { q: 'I need enquiries quickly', slug: 'marketing-digital-ads' },
      { q: 'My team wastes time in Excel files', slug: 'application-metier' },
      { q: 'I have an online product idea to launch', slug: 'creation-saas' }
    ],
    ctaTitle: 'Got a project in mind?', ctaText: 'Tell us what you need: we’ll come back to you with a clear recommendation and a tailored quote.',
    title: 'Web & digital marketing agency: our services', desc: 'Website design, redesign and maintenance, business software, SaaS and mobile apps, SEO & GEO, paid ads and social media: nine areas of expertise in Paris.'
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
        {
          '@type': 'CollectionPage', '@id': `${site}${link.services()}#webpage`, url: `${site}${link.services()}`, name: t.value.title, inLanguage: en.value ? 'en-GB' : 'fr-FR',
          mainEntity: { '@type': 'ItemList', itemListElement: services.value.map((sv, i) => ({ '@type': 'ListItem', position: i + 1, url: `${site}${link.service(sv.slug)}`, name: serviceSeo.value[sv.slug]?.h1 ?? sv.crumb })) }
        },
        faqSchema(`${site}${link.services()}`, serviceFaq.value, en.value)
      ]
    })
  }]
})
</script>

<style scoped>
.head { display: flex; flex-direction: column; gap: 24px; padding-top: 40px; padding-bottom: 64px; }
.head .eyebrow { margin-top: 32px; }
.head__h1 { font-size: 72px; line-height: 1.02; letter-spacing: -2.4px; font-weight: 900; max-width: 1100px; }
.head__p { max-width: 760px; }
.needs { padding-bottom: 72px; }
.needs__h { font-size: 24px; letter-spacing: -.4px; font-weight: 700; margin-bottom: 24px; }
.needs__list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.need { display: flex; justify-content: space-between; align-items: center; gap: 24px; padding: 18px 22px; background: var(--surface); border: 1px solid var(--line); border-radius: 14px; color: var(--ink); font-size: 16px; line-height: 1.4; transition: border-color .2s ease; }
.need:hover { border-color: var(--accent); color: var(--ink); }
.need span { color: var(--muted); }
.need strong { flex-shrink: 0; font-weight: 600; color: var(--accent-light); }
.fam { padding-bottom: 80px; }
.fam__head { display: flex; justify-content: space-between; align-items: flex-end; gap: 48px; margin-bottom: 32px; }
.fam__p { max-width: 460px; font-size: 16px; line-height: 1.55; color: var(--muted); }
.proof { padding-top: var(--section-y); padding-bottom: var(--section-y); }
.proof__head { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; margin-bottom: 40px; flex-wrap: wrap; }
.terms { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 64px; }
.terms__list { grid-column: span 2; }
.item { display: flex; flex-direction: column; gap: 16px; padding: 32px; min-height: 360px; background: var(--surface); border: 1px solid var(--line); border-radius: 20px; color: var(--ink); transition: transform .2s ease; }
.item:hover { transform: translateY(-3px); color: var(--ink); }
.item__num { display: flex; align-items: center; justify-content: center; width: 52px; height: 52px; border-radius: 16px; background: var(--accent-soft); border: 1px solid var(--accent-tint); color: var(--accent-light); }
.item__t { font-size: 26px; letter-spacing: -.6px; font-weight: 700; }
.item__d { font-size: 16px; line-height: 1.55; color: var(--muted); }
.item__pills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: auto; }
.item__pills span { font-size: 13px; padding: 6px 10px; border-radius: 8px; background: var(--bg); }
.item__cta { font-size: 16px; font-weight: 600; }
@media (max-width: 1180px) { .head__h1 { font-size: 52px; letter-spacing: -1.6px; } .terms { grid-template-columns: minmax(0, 1fr); gap: 32px; } .terms__list { grid-column: auto; } .fam__head { flex-direction: column; align-items: flex-start; gap: 12px; } }
@media (max-width: 720px) { .head__h1 { font-size: 38px; letter-spacing: -1px; } .needs { padding-bottom: 48px; } .needs__list { grid-template-columns: minmax(0, 1fr); } .need { flex-direction: column; align-items: flex-start; gap: 6px; } .fam { padding-bottom: 56px; } .proof { padding-bottom: 64px; } }
</style>
