<template>
  <div class="home">
    <!-- TOP BAR -->
    <div class="topbar">
      <span>Devis gratuit sous 48 h</span><span class="topbar__dot">·</span><span>Sans engagement</span><span class="topbar__dot">·</span><span>Une équipe basée à Paris</span>
    </div>

    <SiteHeader />

    <main id="contenu">
      <!-- HERO -->
      <section class="container hero">
        <div class="hero__text">
          <h1 class="hero__badge"><span class="hero__badge-dot" aria-hidden="true" />Agence digitale à Paris pour PME &amp; TPE</h1>
          <p class="h1 hero__title">Votre croissance digitale, gérée de A&nbsp;à&nbsp;Z.</p>
          <p class="lead hero__lead">Site web, application sur mesure, référencement Google &amp; IA, publicité en ligne : une seule équipe pour vous rendre visible, attirer des clients et les convertir.</p>
          <div class="hero__ctas">
            <NuxtLink to="/contact" class="btn btn--primary">Demander un devis gratuit <IconArrow /></NuxtLink>
            <NuxtLink to="/realisations" class="btn btn--ghost">Voir nos réalisations</NuxtLink>
          </div>
          <ul class="hero__trust">
            <li><IconCheck />Réponse sous 48 h</li>
            <li><IconCheck />Interlocuteur dédié</li>
            <li><IconCheck />Sans engagement</li>
          </ul>
        </div>
        <div class="hero__visual" aria-hidden="true">
          <div class="browser">
            <div class="browser__bar"><span /><span /><span /><em>votre-entreprise.fr</em></div>
            <div class="browser__body">
              <i style="width: 70%; height: 22px; background: var(--ink)" /><i style="width: 50%; height: 22px; background: var(--ink)" />
              <i style="width: 60%; height: 10px; background: var(--accent-tint-2); margin-top: 8px" /><i style="width: 45%; height: 10px; background: var(--accent-tint-2)" />
              <i style="width: 140px; height: 36px; border-radius: 99px; background: var(--accent); margin-top: 10px" />
            </div>
          </div>
          <div class="float float--seo">
            <div class="float__label">Référencement Google</div>
            <div class="float__row"><span class="float__big">Top 3</span><span class="float__kw">sur votre mot-clé</span></div>
            <div class="float__bars"><i style="height: 20%; background: var(--accent-tint)" /><i style="height: 35%; background: var(--accent-tint)" /><i style="height: 45%; background: var(--accent-tint-2)" /><i style="height: 62%; background: var(--accent-light)" /><i style="height: 80%; background: var(--accent-mid)" /><i style="height: 100%; background: var(--accent)" /></div>
          </div>
          <div class="float float--ads">
            <div class="float__label">Campagne ADS · YASSIR</div>
            <div class="float__big float__big--40">5M</div>
            <div class="float__sub">de portée payante sur Meta</div>
          </div>
        </div>
      </section>

      <!-- LOGOS -->
      <section class="container logos">
        <p class="logos__title">Ils nous ont fait confiance en France et à l'international</p>
        <ul class="logos__list">
          <li v-for="l in logos" :key="l">{{ l }}</li>
        </ul>
      </section>

      <!-- SERVICES -->
      <section id="services" class="bg-white section--96">
        <div class="container">
          <div class="sec-head">
            <div class="sec-head__title">
              <div class="eyebrow">Nos services</div>
              <h2 class="h2">Tout ce qu'il faut pour exister et vendre en ligne.</h2>
            </div>
            <p class="text-18 sec-head__p">Choisissez un service ou combinez-les. Chaque projet est piloté par un chef de projet unique, du brief au lancement.</p>
          </div>
          <div class="grid grid-3 svc-grid">
            <NuxtLink v-for="s in services" :key="s.num" :to="s.to" class="svc" :class="`svc--${s.theme}`">
              <div class="svc__top"><span class="svc__num">{{ s.num }}</span><span class="svc__tag">{{ s.tag }}</span></div>
              <h3 class="svc__title">{{ s.title }}</h3>
              <p class="svc__desc">{{ s.desc }}</p>
              <div class="svc__pills"><span v-for="i in s.items" :key="i">{{ i }}</span></div>
              <span class="svc__cta">{{ s.cta }} <IconArrow :size="16" /></span>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- METHODE -->
      <section id="methode" class="container section">
        <div class="center-head">
          <div class="eyebrow">Comment ça marche</div>
          <h2 class="h2">Simple, rapide, transparent.</h2>
          <p class="text-18">Pas de jargon, pas de réunion inutile. Un process en 4 étapes, et vous validez tout avant la mise en ligne.</p>
        </div>
        <ol class="grid grid-4 steps">
          <li v-for="st in steps" :key="st.n" class="card step">
            <div class="step__top"><span class="step__n">{{ st.n }}</span><span class="step__time">{{ st.time }}</span></div>
            <h3 class="step__title">{{ st.title }}</h3>
            <p class="step__desc">{{ st.desc }}</p>
          </li>
        </ol>
      </section>

      <!-- REALISATIONS -->
      <section id="realisations" class="bg-dark section">
        <div class="container">
          <div class="sec-head">
            <div class="sec-head__title">
              <div class="eyebrow">Réalisations</div>
              <h2 class="h2">Des projets concrets,<br>des résultats mesurés.</h2>
            </div>
            <div class="filters" role="group" aria-label="Filtrer les réalisations">
              <button v-for="f in filters" :key="f.id" type="button" :aria-pressed="filter === f.id" :class="{ 'is-on': filter === f.id }" @click="filter = f.id">{{ f.label }}</button>
            </div>
          </div>
          <div class="grid grid-3 work">
            <NuxtLink v-for="p in projects" :key="p.client" :to="p.to" class="work__card">
              <div class="work__visual" :style="{ background: p.bg }">
                <img :src="thumb(p.img)" :srcset="`${thumb(p.img)} 800w, ${p.img} 1600w`" sizes="(max-width: 720px) 100vw, (max-width: 1180px) 50vw, 420px" :alt="`Réalisation ${p.client} — ${p.title}`" class="work__img" loading="lazy" decoding="async" width="800" height="450">
                <span class="work__cat">{{ p.cat }}</span>
              </div>
              <div class="work__body">
                <div class="work__sector">{{ p.client }} · {{ p.sector }}</div>
                <div class="work__title">{{ p.title }}</div>
                <div class="work__foot"><span class="work__metric">{{ p.metric }}</span><span class="work__more">Voir le cas →</span></div>
              </div>
            </NuxtLink>
          </div>
          <div class="work__all"><NuxtLink to="/realisations" class="btn btn--outline-dark">Voir toutes les réalisations</NuxtLink></div>
        </div>
      </section>

      <!-- COMPARATIF -->
      <section class="container section">
        <div class="center-head">
          <div class="eyebrow">Pourquoi KPS</div>
          <h2 class="h2 compare__h">Le meilleur des deux mondes : la réactivité d'un freelance, la force d'une agence.</h2>
        </div>
        <div class="compare-wrap">
          <table class="compare">
            <caption class="sr-only">Comparatif KPS Agency, freelance, agence classique et recrutement interne</caption>
            <thead>
              <tr>
                <td />
                <th scope="col" class="compare__kps"><img src="/icon-192.png" alt="" width="28" height="28" class="compare__k">KPS Agency</th>
                <th scope="col">Freelance</th>
                <th scope="col">Agence classique</th>
                <th scope="col">Recrutement interne</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in compare" :key="r.label">
                <th scope="row">{{ r.label }}</th>
                <td v-for="(c, i) in r.cells" :key="i" :class="{ 'compare__hi': i === 0 }">
                  <span class="compare__cell">
                    <IconCheck v-if="c[0] === 'y'" :size="18" />
                    <svg v-else-if="c[0] === 'n'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B42318" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
                    <span v-if="c[0] === 'y' && !c[1]" class="sr-only">Oui</span>
                    <span v-if="c[0] === 'n' && !c[1]" class="sr-only">Non</span>
                    <span>{{ c[1] }}</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- TEMOIGNAGES -->
      <section id="avis" class="bg-white section--96">
        <div class="container">
          <div class="sec-head">
            <div class="sec-head__title">
              <div class="eyebrow">Avis clients</div>
              <h2 class="h2">Ils en parlent mieux que nous.</h2>
            </div>
            <a :href="GOOGLE_REVIEWS_URL" target="_blank" rel="noopener" class="rating">
              <svg class="rating__g" width="28" height="28" viewBox="0 0 48 48" aria-hidden="true"><path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.8-2.1 5.1-4.4 6.7v5.6h7.1c4.2-3.8 6.6-9.5 6.6-16.3z" /><path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.3-9H4.4v5.7C8 41.1 15.4 46 24 46z" /><path fill="#FBBC05" d="M11.7 28.3c-.4-1.3-.7-2.8-.7-4.3s.3-3 .7-4.3V14H4.4C2.9 17 2 20.4 2 24s.9 7 2.4 10z" /><path fill="#EA4335" d="M24 10.7c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.2 29.9 2 24 2 15.4 2 8 6.9 4.4 14l7.3 5.7c1.8-5.2 6.6-9 12.3-9z" /></svg>
              <span class="rating__v">{{ REVIEWS_AVG.toFixed(1).replace('.', ',') }}</span>
              <span class="rating__t">
                <span class="review__stars" :aria-label="`${REVIEWS_AVG} étoiles sur 5`"><svg v-for="n in 5" :key="n" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path :d="STAR" /></svg></span>
                <span>{{ REVIEWS.length }} avis Google · <u>Voir la fiche</u></span>
              </span>
            </a>
          </div>
          <ReviewCarousel :reviews="REVIEWS" />
        </div>
      </section>

      <!-- FAQ -->
      <section id="ressources" class="container section faq-sec">
        <div class="faq-sec__head">
          <div class="eyebrow">FAQ</div>
          <h2 class="h2">Vos questions, nos réponses.</h2>
          <p class="faq-sec__p">Une autre question ? Écrivez-nous, on répond sous 24 h ouvrées.</p>
          <NuxtLink to="/contact" class="btn btn--ghost btn--sm">Poser une question</NuxtLink>
        </div>
        <FaqList :items="faq" numbered class="faq-sec__list" />
      </section>

      <!-- CTA + FORM -->
      <section id="contact" class="container final">
        <div class="final__box">
          <div class="final__text">
            <h2 class="final__h">Parlons de votre projet.</h2>
            <p class="final__p">30 minutes pour comprendre vos besoins et vous proposer la bonne solution. Sans jargon, sans pression, sans engagement.</p>
            <ul class="final__list">
              <li><IconCheck :size="18" color="#FFFFFF" />Devis détaillé et gratuit sous 48 h</li>
              <li><IconCheck :size="18" color="#FFFFFF" />Un chef de projet dédié du début à la fin</li>
              <li><IconCheck :size="18" color="#FFFFFF" />Vous restez propriétaire de votre site et de vos comptes</li>
            </ul>
            <NuxtLink to="/contact" class="final__call">Ou réserver un appel directement →</NuxtLink>
          </div>
          <form class="final__form" @submit.prevent="submit">
            <div class="final__row">
              <label>Nom<input v-model="form.name" type="text" autocomplete="name" placeholder="Jean Dupont" required></label>
              <label>Entreprise<input v-model="form.company" type="text" autocomplete="organization" placeholder="Votre société"></label>
            </div>
            <label>E-mail professionnel<input v-model="form.email" type="email" autocomplete="email" placeholder="vous@entreprise.fr" required></label>
            <fieldset class="final__needs">
              <legend>Votre besoin</legend>
              <div><button v-for="n in needs" :key="n" type="button" :aria-pressed="need === n" :class="{ 'is-on': need === n }" @click="need = n">{{ n }}</button></div>
            </fieldset>
            <label>Votre projet en quelques mots<textarea v-model="form.msg" rows="3" placeholder="Objectifs, délais, budget indicatif…" /></label>
            <button type="submit" class="final__submit">{{ sent ? 'Merci, demande envoyée' : sending ? 'Envoi…' : 'Recevoir mon devis gratuit' }}</button>
            <span class="final__note">Vos données restent confidentielles. Réponse sous 48 h ouvrées.</span>
          </form>
        </div>
      </section>
    </main>

    <!-- FOOTER (version home v1) -->
    <footer class="hfoot">
      <div class="container hfoot__inner">
        <div class="hfoot__grid">
          <div class="hfoot__brand">
            <SiteLogo light />
            <p>Agence digitale à Paris : création de sites, applications sur mesure, SEO &amp; GEO, publicité en ligne pour les PME et TPE.</p>
            <address>{{ CONTACT.address }} Paris<br><a :href="`mailto:${CONTACT.email}`">{{ CONTACT.email }}</a></address>
          </div>
          <div v-for="col in footer" :key="col.title" class="hfoot__col">
            <div class="hfoot__title">{{ col.title }}</div>
            <NuxtLink v-for="[l, to] in col.links" :key="l" :to="to">{{ l }}</NuxtLink>
          </div>
        </div>
        <div class="hfoot__tags">
          <div><span>Agence digitale :</span><NuxtLink v-for="[label, to] in FOOTER_LOCAL" :key="label" :to="to" class="hfoot__pill">{{ label }}</NuxtLink></div>
        </div>
        <div class="hfoot__bottom">
          <span>© 2026 KPS Agency · Paris, France</span>
          <div><NuxtLink to="/mentions-legales">Mentions légales</NuxtLink><NuxtLink to="/mentions-legales#article-7">Confidentialité</NuxtLink><NuxtLink to="/cgv">CGV</NuxtLink></div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { CONTACT, REVIEWS, REVIEWS_AVG, GOOGLE_REVIEWS_URL, FOOTER_LOCAL, organizationSchema, thumb } from '~/data/content'
definePageMeta({ layout: false })
usePageSeo({
  title: 'Agence digitale à Paris : site web, SEO & Ads',
  description: 'Agence digitale à Paris pour PME et TPE : création de site web, application sur mesure, référencement Google & IA et publicité en ligne. Devis sous 48 h.'
})
const site = useRuntimeConfig().public.siteUrl as string
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        organizationSchema(site),
        { '@type': 'WebSite', '@id': `${site}/#website`, url: `${site}/`, name: 'KPS Agency', inLanguage: 'fr-FR', publisher: { '@id': `${site}/#organization` } },
        { '@type': 'WebPage', '@id': `${site}/#webpage`, url: `${site}/`, name: 'Agence digitale à Paris : site web, SEO & Ads', isPartOf: { '@id': `${site}/#website` }, about: { '@id': `${site}/#organization` }, inLanguage: 'fr-FR' }
      ]
    })
  }]
})

const logos = ['KPMG', 'Cushman & Wakefield', 'YASSIR', 'PowerCell', 'Copenhagen Energy', 'Fibbl', 'ZAYN', 'Galeries LIVE']

const services = [
  { num: '01', tag: 'Le plus demandé', title: 'Création de site web', desc: 'Des sites rapides, beaux et pensés pour convertir vos visiteurs en clients.', items: ['Site vitrine', 'E-commerce', 'Landing page', 'Blog'], cta: 'Découvrir', theme: 'dark', to: '/services/creation-site-web' },
  { num: '02', tag: 'Sur mesure', title: 'Application métier', desc: 'Automatisez vos process avec un outil taillé pour votre activité : CRM, back-office, portail client.', items: ['CRM', 'Back-office', 'Portail client', 'SaaS'], cta: 'Découvrir', theme: 'light', to: '/services/application-metier' },
  { num: '03', tag: 'Google + IA', title: 'Référencement SEO & GEO', desc: 'Soyez trouvé sur Google et cité par ChatGPT, Gemini et Perplexity.', items: ['Audit SEO', 'SEO local', 'Contenu', 'GEO / IA'], cta: 'Découvrir', theme: 'light', to: '/services/referencement-seo-geo' },
  { num: '04', tag: 'iOS & Android', title: 'Application mobile', desc: 'Des apps natives ou cross-platform, de la maquette à la publication sur les stores.', items: ['iOS', 'Android', 'Flutter', 'React Native'], cta: 'Découvrir', theme: 'light', to: '/services/application-mobile' },
  { num: '05', tag: 'Acquisition', title: 'Marketing digital & ADS', desc: 'Des campagnes rentables sur Google, Meta et TikTok, pilotées par la donnée.', items: ['Google Ads', 'Meta Ads', 'TikTok Ads', 'Social media'], cta: 'Découvrir', theme: 'light', to: '/services/marketing-digital-ads' },
  { num: '?', tag: 'Gratuit', title: 'Pas sûr de ce qu’il vous faut ?', desc: 'On analyse votre présence en ligne et on vous dit exactement par où commencer.', items: ['Audit offert', '30 min', 'Sans engagement'], cta: 'Demander mon audit', theme: 'soft', to: '/contact' }
]

const steps = [
  { n: '1', time: 'Jour 1', title: 'Le brief', desc: 'Un appel de 30 min pour comprendre votre activité, vos objectifs et votre budget.' },
  { n: '2', time: 'Sous 48 h', title: 'La proposition', desc: 'Un devis clair, un planning et une maquette de principe. Vous validez, on démarre.' },
  { n: '3', time: 'Production', title: 'La création', desc: 'Design, développement ou campagne : vous suivez l’avancement et validez chaque étape.' },
  { n: '4', time: 'Lancement', title: 'La croissance', desc: 'Mise en ligne, suivi des résultats et optimisation continue. On reste à vos côtés.' }
]

const all = [
  { cat: 'Web', client: 'PowerCell', sector: 'Énergie renouvelable', title: 'Site corporate international', metric: '[Résultat]', bg: '#DDE3FF', fg: '#1A2A8A', to: '/realisations/powercell-group' },
  { cat: 'ADS', client: 'YASSIR', sector: 'Mobilité & livraison', title: 'Campagne ADS multi-plateforme', metric: '5M reach', bg: '#0E1726', fg: '#FFFFFF', to: '/realisations/yassir' },
  { cat: 'Social', client: 'ZAYN', sector: 'Retail', title: 'Campagne social media intégrée', metric: '308,8K couverture', bg: '#F2E6D8', fg: '#6B3E12', to: '/realisations/zayn' },
  { cat: 'Web', client: 'Cushman & W.', sector: 'Immobilier', title: 'Site Cushman & Wakefield Veritas', metric: '[Résultat]', bg: '#E4EFE9', fg: '#14532D', to: '/realisations/cushman-wakefield-veritas' },
  { cat: 'ADS', client: 'groupado PRO', sector: 'E-commerce B2B', title: 'Campagne ADS performance', metric: '6,4M impressions', bg: '#EDE7F6', fg: '#4C1D95', to: '/realisations/groupado-pro' },
  { cat: 'Social', client: 'KPMG', sector: 'Audit & conseil', title: 'Audit et analyse d’audience', metric: '[Résultat]', bg: '#E6ECF5', fg: '#0B3A75', to: '/realisations/kpmg' },
  { cat: 'Web', client: 'Fibbl', sector: 'SaaS B2B', title: 'Site produit SaaS', metric: '[Résultat]', bg: '#FFF1E6', fg: '#9A3412', to: '/realisations/fibbl' },
  { cat: 'Web', client: 'Copenhagen Energy', sector: 'Énergie', title: 'Site institutionnel', metric: '[Résultat]', bg: '#E0F2FE', fg: '#075985', to: '/realisations/copenhagen-energy' },
  { cat: 'ADS', client: 'Brasileia', sector: 'Beauté', title: 'Campagne produit beauté', metric: '1,8M vues', bg: '#FCE7F3', fg: '#9D174D', to: '/realisations/brasileia-cosmetics' },
  { cat: 'ADS', client: 'Tunisia Franchise Show', sector: 'Événementiel', title: 'Campagne événementielle', metric: '2,2M reach', bg: '#FEF3C7', fg: '#92400E', to: '/realisations/tunisia-franchise-show' },
  { cat: 'Social', client: 'Jardins de Carthage', sector: 'Santé', title: 'Branding & communication santé', metric: '[Résultat]', bg: '#DCFCE7', fg: '#166534', to: '/realisations/jardins-de-carthage' },
  { cat: 'Web', client: 'Dunstan', sector: 'Animalier', title: 'Site e-commerce', metric: '[Résultat]', bg: '#F5F5F4', fg: '#44403C', to: '/realisations/dunstan' }
].map(p => ({ ...p, img: `/images/realisations/${p.to.split('/').pop()}.webp`, metric: p.metric.startsWith('[') ? '' : p.metric }))
const filters = [{ id: 'all', label: 'Tous' }, { id: 'Web', label: 'Sites & apps' }, { id: 'Social', label: 'Social media' }, { id: 'ADS', label: 'Publicité' }]
const filter = ref('all')
const projects = computed(() => (filter.value === 'all' ? all : all.filter(p => p.cat === filter.value)).slice(0, 6))

const compare: { label: string; cells: [string, string][] }[] = [
  { label: 'Tous les services digitaux au même endroit', cells: [['y', ''], ['n', ''], ['y', ''], ['n', 'Plusieurs profils']] },
  { label: 'Interlocuteur unique et dédié', cells: [['y', ''], ['y', ''], ['n', 'Commercial + équipe'], ['y', '']] },
  { label: 'Délai de démarrage', cells: [['y', 'Sous 1 semaine'], ['-', 'Variable'], ['n', '3 à 6 semaines'], ['n', '2 à 3 mois']] },
  { label: 'Continuité si absence', cells: [['y', 'Équipe'], ['n', ''], ['y', ''], ['n', '']] },
  { label: 'Coût adapté aux PME', cells: [['y', 'Sur devis'], ['y', ''], ['n', 'Élevé'], ['n', 'Salaire + charges']] },
  { label: 'Vous restez propriétaire de tout', cells: [['y', ''], ['-', 'Selon contrat'], ['-', 'Selon contrat'], ['y', '']] }
]

const STAR = 'M12 2l3 7 7 .6-5.3 4.7 1.6 7.2L12 17.8 5.7 21.5l1.6-7.2L2 9.6 9 9z'

const faq: [string, string][] = [
  ['Combien coûte un site internet ?', 'Chaque projet est différent : nous établissons un devis gratuit et détaillé sous 48 h, après un appel pour comprendre vos besoins. Aucun frais caché, et le devis reste valable 30 jours.'],
  ['Comment se passe le paiement ?', '50 % à la commande, 50 % à la livraison, par virement ou carte bancaire. Les conditions précises figurent toujours dans votre devis.'],
  ['En combien de temps mon site sera-t-il en ligne ?', 'Cela dépend de la complexité du projet et de la transmission de vos contenus. Un planning indicatif, jalonné d’étapes de validation, figure dans votre devis, et nous vous tenons informé de l’avancement.'],
  ['Combien de modifications sont incluses ?', 'Chaque prestation comprend deux cycles de révision. Au-delà, les modifications font l’objet d’un complément de devis.'],
  ['Qu’est-ce que le GEO ?', 'Le Generative Engine Optimization consiste à optimiser votre contenu pour être cité par les IA comme ChatGPT, Gemini ou Perplexity, en complément du SEO classique.'],
  ['Puis-je modifier mon site moi-même ?', 'Oui. Nous livrons un site facile à administrer et nous vous formons à son utilisation.'],
  ['Suis-je propriétaire de mon site et de mes comptes publicitaires ?', 'Oui. Les créations vous appartiennent dès le paiement intégral, et le nom de domaine, les contenus et les comptes ADS sont à votre nom.'],
  ['Proposez-vous un suivi après la mise en ligne ?', 'Oui. 12 mois de maintenance technique sont inclus pour chaque site, e-commerce, application ou agent IA. Ensuite, un abonnement optionnel couvre les mises à jour de sécurité, le suivi des performances et l’optimisation SEO ou ADS.'],
  ['Travaillez-vous uniquement à Paris ?', 'Nous sommes basés à Paris et accompagnons des entreprises partout en France et à l’international, en visio ou sur place.']
]

const needs = ['Site web', 'Application', 'SEO / GEO', 'App mobile', 'Publicité']
const need = ref('Site web')
const form = reactive({ name: '', company: '', email: '', msg: '' })
const sent = ref(false)
const sending = ref(false)
const config = useRuntimeConfig()
async function submit() {
  const endpoint = config.public.formEndpoint as string
  if (!endpoint) { await navigateTo('/contact'); return } // aucun service branché : on redirige vers le formulaire complet
  sending.value = true
  try { await $fetch(endpoint, { method: 'POST', body: { ...form, need: need.value } }); sent.value = true }
  catch { await navigateTo('/contact') }
  finally { sending.value = false }
}

const S = '/services/'
const footer: { title: string; links: [string, string][] }[] = [
  { title: 'Sites web', links: [['Site vitrine', S + 'creation-site-web'], ['Site e-commerce', S + 'creation-site-web'], ['Landing page', S + 'creation-site-web'], ['Blog', S + 'creation-site-web'], ['Refonte de site', S + 'creation-site-web'], ['Maintenance', S + 'creation-site-web']] },
  { title: 'Apps & SEO', links: [['Application métier', S + 'application-metier'], ['Application mobile', S + 'application-mobile'], ['Audit SEO', S + 'referencement-seo-geo'], ['SEO local', S + 'referencement-seo-geo'], ['GEO / IA', S + 'referencement-seo-geo'], ['Rédaction web', S + 'referencement-seo-geo']] },
  { title: 'Marketing', links: [['Google Ads', S + 'marketing-digital-ads'], ['Meta Ads', S + 'marketing-digital-ads'], ['TikTok Ads', S + 'marketing-digital-ads'], ['Social media', S + 'social-media'], ['Création de contenu', S + 'social-media']] },
  { title: 'L’agence', links: [['À propos', '/agence'], ['Méthode', '/agence'], ['Réalisations', '/realisations'], ['Avis clients', '/#avis'], ['Blog', '/agence'], ['Contact', '/contact']] }
]
</script>

<style scoped>
/* Top bar */
.topbar { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px 32px; padding: 10px 20px; background: var(--ink); color: var(--dark-muted); font-size: 13px; }
.topbar__dot { color: var(--muted-2); }

/* Hero */
.hero { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 64px; padding-top: 96px; padding-bottom: 88px; align-items: center; }
.hero__text { display: flex; flex-direction: column; gap: 28px; }
.hero__badge { display: inline-flex; align-items: center; gap: 10px; align-self: flex-start; padding: 8px 14px; background: var(--white); border: 1px solid var(--line); border-radius: 999px; font-family: var(--font-body); font-size: 14px; font-weight: 500; letter-spacing: 0; line-height: 1.4; }
.hero__title { font-family: var(--font-display); }
.hero__badge-dot { width: 8px; height: 8px; border-radius: 99px; background: var(--accent); }
.hero__lead { max-width: 560px; }
.hero__ctas { display: flex; gap: 14px; flex-wrap: wrap; }
.hero__trust { list-style: none; padding: 8px 0 0; margin: 0; display: flex; flex-wrap: wrap; gap: 12px 28px; font-size: 14px; color: var(--muted); }
.hero__trust li { display: flex; align-items: center; gap: 8px; }
.hero__visual { position: relative; height: 560px; }
.browser { position: absolute; top: 0; left: 40px; right: 0; height: 400px; background: var(--white); border: 1px solid var(--line); border-radius: 20px; box-shadow: 0 30px 60px -30px rgba(23, 18, 61,.25); display: flex; flex-direction: column; overflow: hidden; }
.browser__bar { display: flex; align-items: center; gap: 6px; padding: 14px 16px; border-bottom: 1px solid var(--line-soft); }
.browser__bar > span { width: 10px; height: 10px; border-radius: 99px; background: var(--line); }
.browser__bar em { margin-left: 16px; padding: 2px 12px; background: var(--surface-hover); border-radius: 6px; font-size: 12px; color: var(--muted-2); font-style: normal; }
.browser__body { flex-grow: 1; display: flex; flex-direction: column; justify-content: center; gap: 14px; padding: 36px; background: var(--accent-soft); }
.browser__body i { display: block; border-radius: 6px; }
.float { position: absolute; padding: 22px; border-radius: 18px; display: flex; flex-direction: column; }
.float--seo { left: 0; bottom: 20px; width: 290px; gap: 10px; background: var(--white); border: 1px solid var(--line); box-shadow: 0 24px 48px -24px rgba(23, 18, 61,.3); }
.float--ads { right: 24px; bottom: 0; width: 270px; gap: 6px; background: var(--ink); color: var(--white); }
.float__label { font-size: 13px; color: var(--muted-2); font-weight: 500; }
.float--ads .float__label { color: var(--dark-muted-2); }
.float__row { display: flex; align-items: baseline; gap: 8px; }
.float__big { font-family: var(--font-display); font-size: 34px; font-weight: 800; }
.float__big--40 { font-size: 40px; letter-spacing: -1px; }
.float__kw { font-size: 14px; color: var(--green); font-weight: 600; }
.float__sub { font-size: 14px; color: var(--dark-muted); }
.float__bars { display: flex; align-items: flex-end; gap: 6px; height: 48px; }
.float__bars i { flex-grow: 1; border-radius: 4px; display: block; }

/* Logos */
.logos { display: flex; flex-direction: column; align-items: center; gap: 24px; padding-top: 40px; padding-bottom: 64px; }
.logos__title { font-size: 14px; color: var(--muted-2); font-weight: 500; letter-spacing: .3px; text-align: center; }
.logos__list { list-style: none; margin: 0; padding: 0; width: 100%; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 16px 32px; font-family: var(--font-display); font-weight: 700; font-size: 24px; color: var(--muted-3); letter-spacing: -.3px; }

/* Section heads */
.sec-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 48px; margin-bottom: 48px; }
.sec-head__title { display: flex; flex-direction: column; gap: 16px; max-width: 720px; }
.sec-head__p { max-width: 420px; }
.center-head { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px; margin-bottom: 56px; }
.center-head .text-18 { max-width: 620px; }

/* Services */
.svc { display: flex; flex-direction: column; gap: 18px; padding: 32px; min-height: 330px; border: 1px solid var(--line); border-radius: 20px; transition: transform .2s ease; }
.svc:hover { transform: translateY(-3px); }
.svc--dark { background: var(--ink); color: var(--white); } .svc--dark:hover { color: var(--white); }
.svc--light { background: var(--bg); color: var(--ink); } .svc--light:hover { color: var(--ink); }
.svc--soft { background: var(--accent-soft); color: var(--ink); } .svc--soft:hover { color: var(--ink); }
.svc__top { display: flex; justify-content: space-between; align-items: center; }
.svc__num { display: flex; align-items: center; justify-content: center; width: 52px; height: 52px; border-radius: 14px; font-family: var(--font-display); font-weight: 800; font-size: 18px; background: var(--white); color: var(--ink); }
.svc--dark .svc__num, .svc--soft .svc__num { background: var(--accent); color: var(--white); }
.svc__tag { font-size: 13px; font-weight: 600; padding: 6px 12px; border-radius: 999px; border: 1px solid var(--line-2); }
.svc--dark .svc__tag { border-color: var(--dark-line-2); }
.svc--soft .svc__tag { border-color: var(--accent-tint-2); }
.svc__title { font-size: 28px; line-height: 1.15; letter-spacing: -.6px; font-weight: 700; }
.svc__desc { font-size: 16px; line-height: 1.55; color: var(--muted); }
.svc--dark .svc__desc { color: var(--dark-muted); }
.svc__pills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: auto; }
.svc__pills span { font-size: 13px; padding: 6px 10px; border-radius: 8px; background: var(--white); }
.svc--dark .svc__pills span { background: var(--dark-2); }
.svc__cta { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; }

/* Steps */
.steps { list-style: none; margin: 0; padding: 0; }
.step { display: flex; flex-direction: column; gap: 16px; padding: 32px 28px; min-height: 280px; }
.step__top { display: flex; align-items: center; gap: 12px; }
.step__n { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 99px; background: var(--ink); color: var(--white); font-weight: 600; }
.step__time { font-size: 13px; font-weight: 600; color: var(--muted-2); }
.step__title { font-size: 24px; letter-spacing: -.4px; font-weight: 700; }
.step__desc { font-size: 16px; line-height: 1.55; color: var(--muted); }

/* Work */
.filters { display: flex; gap: 8px; padding: 6px; background: var(--dark-2); border-radius: 999px; flex-wrap: wrap; }
.filters button { padding: 10px 18px; border: none; border-radius: 999px; font-size: 14px; font-weight: 600; background: transparent; color: var(--dark-muted); }
.filters button.is-on { background: var(--white); color: var(--ink); }
.work { margin-top: 40px; }
.work__card { display: flex; flex-direction: column; background: var(--white); color: var(--ink); border-radius: 20px; overflow: hidden; transition: transform .2s ease; }
.work__card:hover { color: var(--ink); transform: translateY(-3px); }
.work__visual { position: relative; aspect-ratio: 16 / 9; overflow: hidden; }
.work__img { width: 100%; height: 100%; object-fit: cover; object-position: top center; transition: transform .4s ease; }
.work__card:hover .work__img { transform: scale(1.04); }
.work__cat { position: absolute; left: 16px; top: 16px; font-size: 12px; font-weight: 600; padding: 5px 10px; border-radius: 999px; background: var(--white); color: var(--ink); box-shadow: 0 4px 12px -4px rgba(23, 18, 61,.3); }
.work__body { display: flex; flex-direction: column; gap: 8px; padding: 22px 24px 24px; }
.work__sector { font-size: 13px; color: var(--muted-2); font-weight: 500; }
.work__title { font-size: 18px; font-weight: 600; line-height: 1.35; }
.work__foot { display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid var(--line-soft); margin-top: 6px; }
.work__metric { font-family: var(--font-display); font-size: 22px; font-weight: 800; color: var(--accent); }
.work__more { font-size: 14px; font-weight: 600; }
.work__all { display: flex; justify-content: center; margin-top: 40px; }

/* Compare */
.compare__h { max-width: 900px; }
.compare-wrap { position: relative; overflow-x: auto; background: var(--white); border: 1px solid var(--line); border-radius: 24px; }
.compare { width: 100%; min-width: 900px; border-collapse: collapse; table-layout: fixed; font-size: 15px; }
.compare thead th, .compare thead td { padding: 22px 28px; font-weight: 600; text-align: left; border-bottom: 1px solid var(--line); }
.compare__kps { background: var(--ink); color: var(--white); }
.compare__k { display: inline-block; width: 28px; height: 28px; margin-right: 10px; vertical-align: middle; }
.compare tbody th { padding: 20px 28px; font-weight: 500; text-align: left; }
.compare tbody td { padding: 20px 28px; color: var(--muted); }
.compare tbody tr { border-bottom: 1px solid var(--line-soft); }
.compare tbody tr:last-child { border-bottom: none; }
.compare__hi { background: var(--accent-soft); color: var(--ink) !important; font-weight: 600; }
.compare__cell { display: flex; align-items: center; gap: 10px; }

/* Reviews */
.rating { display: flex; align-items: center; gap: 14px; padding: 14px 20px; border: 1px solid var(--line); border-radius: 16px; background: var(--white); color: var(--ink); transition: border-color .15s, box-shadow .15s; }
.rating:hover { color: var(--ink); border-color: var(--line-3); box-shadow: 0 12px 24px -16px rgba(23, 18, 61, .3); }
.rating__v { font-family: var(--font-display); font-size: 32px; font-weight: 800; }
.rating__t { display: flex; flex-direction: column; gap: 4px; font-size: 13px; color: var(--muted); }
.rating__t u { text-underline-offset: 2px; }
.review__stars { display: flex; gap: 4px; color: #C27803; }

/* FAQ */
.faq-sec { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 64px; }
.faq-sec__head { display: flex; flex-direction: column; gap: 16px; align-items: flex-start; }
.faq-sec__p { font-size: 17px; line-height: 1.55; color: var(--muted); }
.faq-sec__head .btn { margin-top: 8px; }
.faq-sec__list { grid-column: span 2; }

/* Final CTA */
.final { padding-bottom: 112px; }
.final__box { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 64px; padding: 72px; border-radius: 32px; background: var(--accent); color: var(--white); }
.final__text { display: flex; flex-direction: column; gap: 24px; }
.final__h { font-size: 60px; line-height: 1.02; letter-spacing: -2px; font-weight: 800; }
.final__p { font-size: 19px; line-height: 1.55; color: var(--accent-soft); max-width: 480px; }
.final__list { list-style: none; margin: 8px 0 0; padding: 0; display: flex; flex-direction: column; gap: 12px; font-size: 16px; }
.final__list li { display: flex; align-items: center; gap: 10px; }
.final__call { align-self: flex-start; margin-top: 12px; padding: 16px 24px; border: 1px solid rgba(255,255,255,.5); border-radius: 999px; color: var(--white); font-weight: 600; }
.final__call:hover { color: var(--white); background: rgba(255,255,255,.1); }
.final__form { display: flex; flex-direction: column; gap: 16px; padding: 32px; background: var(--white); color: var(--ink); border-radius: 20px; }
.final__row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.final__form label, .final__needs legend { display: flex; flex-direction: column; gap: 6px; font-size: 14px; font-weight: 500; }
.final__form input, .final__form textarea { padding: 14px; border: 1px solid var(--line-2); border-radius: 10px; font-size: 15px; font-family: inherit; resize: none; color: var(--ink); }
.final__needs { border: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.final__needs legend { margin-bottom: 8px; }
.final__needs div { display: flex; flex-wrap: wrap; gap: 8px; }
.final__needs button { padding: 9px 14px; border-radius: 999px; font-size: 14px; font-weight: 500; background: var(--white); color: var(--ink); border: 1px solid var(--line-2); }
.final__needs button.is-on { background: var(--ink); color: var(--white); border-color: var(--ink); }
.final__submit { padding: 18px; background: var(--ink); color: var(--white); border: none; border-radius: 999px; font-size: 16px; font-weight: 600; }
.final__submit:hover { background: var(--ink-hover); }
.final__note { font-size: 12px; color: var(--muted-2); text-align: center; }

/* Footer home */
.hfoot { background: var(--ink); color: var(--dark-muted); }
.hfoot__inner { display: flex; flex-direction: column; gap: 56px; padding-top: 80px; padding-bottom: 40px; }
.hfoot__grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 32px; }
.hfoot__brand { grid-column: span 2; display: flex; flex-direction: column; gap: 18px; padding-right: 40px; }
.hfoot__brand p { font-size: 15px; line-height: 1.6; color: var(--dark-muted-2); }
.hfoot__brand address { font-style: normal; font-size: 15px; line-height: 1.7; }
.hfoot__brand address a { color: var(--white); }
.hfoot__col { display: flex; flex-direction: column; gap: 12px; font-size: 14px; }
.hfoot__col a, .hfoot__pill { color: var(--dark-muted-2); }
.hfoot__col a:hover, .hfoot__pill:hover, .hfoot__bottom a:hover { color: var(--white); }
.hfoot__title { font-weight: 600; color: var(--white); font-size: 15px; margin-bottom: 4px; }
.hfoot__tags { display: flex; flex-direction: column; gap: 14px; padding-top: 32px; border-top: 1px solid var(--dark-line); }
.hfoot__tags > div { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; font-size: 13px; }
.hfoot__tags > div > span { color: var(--white); font-weight: 600; width: 190px; }
.hfoot__pill { padding: 5px 10px; border: 1px solid var(--dark-line); border-radius: 999px; }
.hfoot__bottom { display: flex; justify-content: space-between; gap: 16px; font-size: 13px; color: var(--dark-muted-3); padding-top: 24px; border-top: 1px solid var(--dark-line); }
.hfoot__bottom > div { display: flex; gap: 24px; flex-wrap: wrap; }
.hfoot__bottom a { color: var(--dark-muted-3); }

/* Responsive */
@media (max-width: 1180px) {
  .hero { grid-template-columns: minmax(0, 1fr); padding-top: 64px; }
  .hero__visual { max-width: 640px; width: 100%; }
  .sec-head { flex-direction: column; align-items: flex-start; }
  .faq-sec { grid-template-columns: minmax(0, 1fr); gap: 40px; }
  .faq-sec__list { grid-column: auto; }
  .final__box { grid-template-columns: minmax(0, 1fr); padding: 56px 40px; }
  .hfoot__grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .hfoot__brand { grid-column: span 4; padding-right: 0; }
}
@media (max-width: 720px) {
  .hero__visual { height: 460px; }
  .browser { left: 0; height: 320px; }
  .float--seo { width: 240px; }
  .float--ads { width: 210px; right: 0; }
  .logos__list { justify-content: center; font-size: 19px; }
  .final__h { font-size: 40px; }
  .final__box { padding: 40px 22px; }
  .final__row { grid-template-columns: minmax(0, 1fr); }
  .hfoot__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .hfoot__brand { grid-column: span 2; }
  .hfoot__tags > div > span { width: 100%; }
  .hfoot__bottom { flex-direction: column; }
}
</style>
