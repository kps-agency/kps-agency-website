<template>
  <div class="home">
    <PromoPopup />
    <!-- TOP BAR -->
    <div class="topbar" role="region" :aria-label="en ? 'Key information' : 'Informations clés'">
      <template v-for="(b, i) in t.topbar" :key="b"><span v-if="i" class="topbar__dot">·</span><span>{{ b }}</span></template>
    </div>

    <SiteHeader />

    <main id="contenu">
      <!-- HERO (mise en page de la maquette kps-agency.com : centré, logo, titre en dégradé, vague) -->
      <div class="hero-wrap">
        <div class="hero__blobs" aria-hidden="true"><i /><i /><i /></div>
        <section class="container hero">
          <h1 class="hero__badge"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="ICON_WAVES" />{{ t.hero.badge }}</h1>
          <p class="h1 hero__title">{{ heroTitle[0] }}<span v-if="heroTitle[1]" class="text-gradient">{{ heroTitle[1] }}</span></p>
          <p class="lead hero__lead">{{ t.hero.lead }}</p>
          <div class="hero__ctas">
            <NuxtLink :to="link.contact()" class="btn btn--primary"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="ICON_SPARKLES" />{{ t.hero.cta }}</NuxtLink>
            <NuxtLink :to="link.work()" class="btn btn--ghost">{{ t.hero.cta2 }} <IconArrow /></NuxtLink>
          </div>
          <!-- Preuves immédiates : note Google, réalisations, expertises -->
          <ul class="hero__proof">
            <li><a href="#avis"><span class="hero__stars" aria-hidden="true">★★★★★</span><strong>{{ en ? REVIEWS_AVG.toFixed(1) : REVIEWS_AVG.toFixed(1).replace('.', ',') }}</strong> {{ t.proof.google }}</a></li>
            <li><strong>{{ projects.length }}</strong> {{ t.proof.projects }}</li>
            <li><strong>{{ services.length }}</strong> {{ t.proof.expertise }}</li>
          </ul>
          <ul class="hero__trust">
            <li v-for="x in t.hero.trust" :key="x"><IconCheck />{{ x }}</li>
          </ul>
          <HeroShowcase v-if="SHOW_HERO_SHOWCASE" class="hero__visual" />
        </section>
        <div class="hero__wave" aria-hidden="true"><svg viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" /></svg></div>
      </div>

      <!-- LOGOS -->
      <TrustBar />

      <!-- SERVICES -->
      <section id="services" class="bg-white section theme-light">
        <div class="container">
          <div class="center-head">
            <div class="center-head__title">
              <div class="eyebrow">{{ t.services.eyebrow }}</div>
              <h2 class="h2 h2--plain">{{ hl(t.services.h2)[0] }}<span class="text-gradient">{{ hl(t.services.h2)[1] }}</span>{{ hl(t.services.h2)[2] }}</h2>
            </div>
            <p class="text-18">{{ t.services.p }}</p>
          </div>
          <!-- Une carte par famille d'expertises (SERVICE_FAMILIES), chaque expertise mène à sa page -->
          <div class="grid grid-3 fams">
            <article v-for="f in families" :key="f.key" class="fam">
              <div class="fam__head">
                <span class="fam__i"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="serviceIconPath(f.key)" /></svg></span>
                <h3 class="fam__t">{{ f.title }}</h3>
              </div>
              <p class="fam__d">{{ f.text }}</p>
              <ul class="fam__list">
                <li v-for="sv in f.items" :key="sv.slug">
                  <NuxtLink :to="link.service(sv.slug)" class="fam__link">
                    <span class="fam__txt">
                      <span class="fam__name">{{ sv.title }}</span>
                      <span class="fam__desc">{{ sv.desc }}</span>
                      <span v-if="svcFrom(sv.slug)" class="fam__from">{{ t.services.from }} <strong>{{ svcFrom(sv.slug) }}</strong></span>
                    </span>
                    <IconArrow :size="16" class="fam__a" />
                  </NuxtLink>
                </li>
              </ul>
            </article>
          </div>
          <NuxtLink v-if="svcUnsure" :to="link.audit()" class="mini mini--soft">
            <span class="mini__i"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="serviceIconPath(undefined)" /></svg></span>
            <span class="mini__txt"><span class="mini__t">{{ svcUnsure.title }}</span><span class="mini__d">{{ svcUnsure.desc }}</span></span>
            <span class="mini__cta">{{ svcUnsure.cta }} <IconArrow :size="16" /></span>
          </NuxtLink>
          <!-- Argument de vente : une solution pour chaque budget -->
          <div class="budget">
            <div class="budget__text">
              <span class="budget__tag">{{ t.services.budget.tag }}</span>
              <p class="budget__title">{{ t.services.budget.title }} <span class="text-gradient">{{ t.services.budget.hi }}</span></p>
              <p class="budget__p">{{ t.services.budget.p }}</p>
            </div>
            <NuxtLink :to="link.contact()" class="btn btn--primary">{{ t.services.budget.cta }} <IconArrow /></NuxtLink>
          </div>
        </div>
      </section>

      <!-- REALISATIONS : sélection de 6 projets, onglets par type (cartes au style de la maquette kps-agency.com) -->
      <section id="realisations" class="pf">
        <div class="pf__blobs" aria-hidden="true"><i /><i /></div>
        <div class="container pf__inner">
          <div class="pf__head">
            <div class="pf__badge"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="ICON_SPARKLES" />{{ t.portfolio.badge }}</div>
            <h2 class="pf__h">{{ t.portfolio.title }} <span>{{ t.portfolio.hi }}</span></h2>
            <p class="pf__p">{{ t.portfolio.p }}</p>
          </div>
          <div class="pf__tabs" role="group" :aria-label="t.portfolio.tabsLabel">
            <button v-for="id in PF_TABS" :key="id" type="button" :aria-pressed="pfTab === id" :class="{ 'is-on': pfTab === id }" @click="pfTab = id">{{ t.portfolio.tabs[id] }}</button>
          </div>
          <Transition name="pf-swap" mode="out-in" appear>
            <div :key="pfTab" class="pf__grid m-swipe">
              <NuxtLink v-for="(pr, i) in pfShown" :key="pr.slug" :to="link.project(pr.slug)" class="pf__card" :style="{ '--i': i }">
                <div class="pf__visual">
                  <picture style="display: contents">
                    <source v-if="avifSet(pr.img)" type="image/avif" :srcset="avifSet(pr.img)" sizes="(max-width: 720px) calc(100vw - 66px), (max-width: 1180px) 50vw, min(374px, calc(33.3vw - 106px))">
                    <img :src="thumb(pr.img)" :srcset="thumbSet(pr.img)" sizes="(max-width: 720px) calc(100vw - 66px), (max-width: 1180px) 50vw, min(374px, calc(33.3vw - 106px))" :alt="`${t.portfolio.alt} ${pr.client} — ${pr.label}`" loading="lazy" decoding="async" width="800" height="450">
                  </picture>
                  <span class="pf__cat"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="PF_ICONS[CAT_TAB[pr.cat]]" /><span>{{ pr.label }}</span></span>
                </div>
                <div class="pf__body">
                  <h3 class="pf__title">{{ pr.client }}</h3>
                  <p v-if="!pr.desc.startsWith('[')" class="pf__desc">{{ pr.desc }}</p>
                  <p v-else class="pf__desc">{{ t.portfolio.webDesc.replace('{client}', pr.client) }}</p>
                  <div v-if="pr.desc.startsWith('[')" class="pf__more"><span>{{ t.portfolio.more }}</span><i><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="ICON_EXTERNAL" /></i></div>
                </div>
              </NuxtLink>
            </div>
          </Transition>
          <div class="pf__all">
            <NuxtLink :to="link.work()" class="btn btn--outline-dark">{{ t.portfolio.all }}</NuxtLink>
            <NuxtLink :to="link.contact()" class="btn btn--primary">{{ t.portfolio.quote }} <IconArrow /></NuxtLink>
          </div>
        </div>
      </section>

      <!-- POURQUOI KPS : arguments de « Notre ADN » et de « Pourquoi choisir la Team KPS » réunis -->
      <section id="pourquoi-kps" class="why">
        <div class="container">
          <div class="lhead lhead--why">
            <h2 class="lhead__h">{{ t.whyTeam.h2 }} <span class="why__hi">{{ t.whyTeam.hi }}</span>{{ t.whyTeam.suffix }}</h2>
            <p class="lhead__p lhead__p--why">{{ t.whyTeam.p }}</p>
          </div>
          <div class="why__grid m-swipe" tabindex="0">
            <article v-for="(b, i) in t.whyTeam.items" :key="b.title" class="why__card" :style="{ '--c': WHY_COLORS[i] }">
              <div class="why__icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="WHY_ICONS[i]" /></div>
              <h3 class="why__title">{{ b.title }}</h3>
              <p class="why__desc">{{ b.desc }}</p>
              <div class="why__stat"># {{ b.stat }}</div>
            </article>
          </div>
        </div>
      </section>

      <!-- COMPARATIF -->
      <section class="container section">
        <div class="center-head">
          <div class="eyebrow">{{ t.compare.eyebrow }}</div>
          <h2 class="h2 h2--plain compare__h">{{ hl(t.compare.h2)[0] }}<span class="text-gradient">{{ hl(t.compare.h2)[1] }}</span>{{ hl(t.compare.h2)[2] }}</h2>
        </div>
        <p class="compare__hint" aria-hidden="true">{{ t.compare.hint }} →</p>
        <div class="compare-wrap" tabindex="0" role="region" :aria-label="t.compare.caption">
          <table class="compare">
            <caption class="sr-only">{{ t.compare.caption }}</caption>
            <thead>
              <tr>
                <td />
                <th scope="col" class="compare__kps"><img src="/icon-192.png" alt="" width="28" height="28" class="compare__k">KPS Agency</th>
                <th v-for="h in t.compare.cols" :key="h" scope="col">{{ h }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in t.compare.rows" :key="r.label">
                <th scope="row">{{ r.label }}</th>
                <td v-for="(c, i) in r.cells" :key="i" :class="{ 'compare__hi': i === 0 }">
                  <span class="compare__cell">
                    <IconCheck v-if="c[0] === 'y'" :size="18" />
                    <svg v-else-if="c[0] === 'n'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F87171" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
                    <span v-if="c[0] === 'y' && !c[1]" class="sr-only">{{ t.compare.yes }}</span>
                    <span v-if="c[0] === 'n' && !c[1]" class="sr-only">{{ t.compare.no }}</span>
                    <span>{{ c[1] }}</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- TEMOIGNAGES -->
      <section id="avis" class="bg-white section theme-light">
        <div class="container">
          <div class="center-head">
            <div class="center-head__title">
              <div class="eyebrow">{{ t.reviews.eyebrow }}</div>
              <h2 class="h2 h2--plain">{{ hl(t.reviews.h2)[0] }}<span class="text-gradient">{{ hl(t.reviews.h2)[1] }}</span>{{ hl(t.reviews.h2)[2] }}</h2>
            </div>
            <a :href="GOOGLE_REVIEWS_URL" target="_blank" rel="noopener" class="rating">
              <svg class="rating__g" width="28" height="28" viewBox="0 0 48 48" aria-hidden="true"><path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.8-2.1 5.1-4.4 6.7v5.6h7.1c4.2-3.8 6.6-9.5 6.6-16.3z" /><path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.3-9H4.4v5.7C8 41.1 15.4 46 24 46z" /><path fill="#FBBC05" d="M11.7 28.3c-.4-1.3-.7-2.8-.7-4.3s.3-3 .7-4.3V14H4.4C2.9 17 2 20.4 2 24s.9 7 2.4 10z" /><path fill="#EA4335" d="M24 10.7c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.2 29.9 2 24 2 15.4 2 8 6.9 4.4 14l7.3 5.7c1.8-5.2 6.6-9 12.3-9z" /></svg>
              <span class="rating__v">{{ en ? REVIEWS_AVG.toFixed(1) : REVIEWS_AVG.toFixed(1).replace('.', ',') }}</span>
              <span class="rating__t">
                <span class="review__stars" role="img" :aria-label="`${REVIEWS_AVG} ${t.reviews.stars}`"><svg v-for="n in 5" :key="n" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path :d="STAR" /></svg></span>
                <span>{{ REVIEWS.length }} {{ t.reviews.count }} · <u>{{ t.reviews.see }}</u></span>
              </span>
            </a>
          </div>
          <ClientQuotes />
          <ReviewCarousel :reviews="REVIEWS" />
        </div>
      </section>

      <!-- METHODE -->
      <section id="methode" class="container section">
        <div class="center-head">
          <div class="eyebrow">{{ t.method.eyebrow }}</div>
          <h2 class="h2 h2--plain">{{ hl(t.method.h2)[0] }}<span class="text-gradient">{{ hl(t.method.h2)[1] }}</span>{{ hl(t.method.h2)[2] }}</h2>
          <p class="text-18">{{ t.method.p }}</p>
        </div>
        <ol class="grid grid-4 steps m-swipe" tabindex="0">
          <li v-for="st in t.method.steps" :key="st.n" class="card step">
            <div class="step__top"><span class="step__n">{{ st.n }}</span><span class="step__time">{{ st.time }}</span></div>
            <h3 class="step__title">{{ st.title }}</h3>
            <p class="step__desc">{{ st.desc }}</p>
          </li>
        </ol>
        <div class="method__ctas">
          <NuxtLink to="#contact" class="btn btn--primary" @click="actionTab = 0">{{ t.methodCta.quote }} <IconArrow /></NuxtLink>
          <NuxtLink to="#rendez-vous" class="btn btn--ghost" @click="actionTab = 1">{{ t.methodCta.call }}</NuxtLink>
        </div>
      </section>


      <!-- FAQ -->
      <section id="ressources" class="container section faq-sec">
        <div class="faq-sec__head">
          <div class="eyebrow">FAQ</div>
          <h2 class="h2 h2--plain">{{ hl(t.faq.h2)[0] }}<span class="text-gradient">{{ hl(t.faq.h2)[1] }}</span>{{ hl(t.faq.h2)[2] }}</h2>
          <p class="faq-sec__p">{{ t.faq.p }}</p>
          <NuxtLink :to="link.contact()" class="btn btn--ghost btn--sm">{{ t.faq.cta }}</NuxtLink>
        </div>
        <FaqList :items="t.faq.items" numbered class="faq-sec__list" />
      </section>

      <!-- PASSER À L'ACTION : demande de devis et réservation d'appel dans un même bloc -->
      <section id="contact" class="container final">
        <div class="center-head action__head">
          <div class="eyebrow">{{ t.action.eyebrow }}</div>
          <h2 class="h2 h2--plain">{{ hl(t.action.h2)[0] }}<span class="text-gradient">{{ hl(t.action.h2)[1] }}</span>{{ hl(t.action.h2)[2] }}</h2>
          <p class="text-18">{{ t.action.p }}</p>
        </div>
        <div class="action__tabs" role="group" :aria-label="t.action.tabsLabel">
          <button v-for="(label, i) in t.action.tabs" :key="label" type="button" :aria-pressed="actionTab === i" :class="{ 'is-on': actionTab === i }" @click="actionTab = i">{{ label }}</button>
        </div>
        <div v-show="actionTab === 0">
          <div class="final__box">
            <div class="final__text">
              <h3 class="final__h">{{ t.final.h2 }}</h3>
              <p class="final__p">{{ t.final.p }}</p>
              <ul class="final__list">
                <li v-for="x in t.final.list" :key="x"><IconCheck :size="18" color="#FFFFFF" />{{ x }}</li>
              </ul>
              <button type="button" class="final__call" @click="actionTab = 1">{{ t.final.call }} →</button>
            </div>
            <form class="final__form" @submit.prevent="submit">
              <div class="final__row">
                <label>{{ t.form.name }}<input v-model="form.name" type="text" autocomplete="name" :placeholder="t.form.namePh" required></label>
                <label>{{ t.form.company }}<input v-model="form.company" type="text" autocomplete="organization" :placeholder="t.form.companyPh"></label>
              </div>
              <label>{{ t.form.email }}<input v-model="form.email" type="email" autocomplete="email" :placeholder="t.form.emailPh" required></label>
              <fieldset class="final__needs">
                <legend>{{ t.form.need }}</legend>
                <div><button v-for="(n, i) in t.form.needs" :key="n" type="button" :aria-pressed="need === i" :class="{ 'is-on': need === i }" @click="need = i">{{ n }}</button></div>
              </fieldset>
              <label>{{ t.form.msg }}<textarea v-model="form.msg" rows="3" :placeholder="t.form.msgPh" /></label>
              <button type="submit" class="final__submit" :disabled="sending">{{ sending ? t.form.sending : t.form.submit }}</button>
              <span class="final__note">{{ t.form.note }}</span>
            </form>
          </div>
        </div>
        <div v-show="actionTab === 1" id="rendez-vous" class="book">
        <div class="book__intro">
          <div class="eyebrow">{{ t.booking.eyebrow }}</div>
          <h3 class="book__h">{{ t.booking.h2 }}</h3>
          <p class="text-18">{{ t.booking.lead }}</p>
          <ul class="book__facts">
            <li v-for="(f, i) in t.booking.facts" :key="f.t">
              <span class="book__fi"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="BOOK_ICONS[i]" /></svg></span>
              <span><strong>{{ f.t }}</strong>{{ f.d }}</span>
            </li>
          </ul>
        </div>
        <BookingCalendar />
        </div>
      </section>
    </main>

    <!-- Barre d'action fixe (mobile) : visible après le hero, masquée sur le bloc final -->
    <Transition name="sticky">
      <div v-if="stickyOn" class="sticky">
        <NuxtLink to="#contact" class="btn btn--primary btn--sm" @click="actionTab = 0">{{ t.sticky.quote }}</NuxtLink>
        <NuxtLink to="#rendez-vous" class="btn btn--ghost btn--sm" @click="actionTab = 1">{{ t.sticky.call }}</NuxtLink>
      </div>
    </Transition>

    <!-- FOOTER (version accueil) -->
    <footer class="hfoot">
      <div class="container hfoot__inner">
        <div class="hfoot__grid">
          <div class="hfoot__brand">
            <SiteLogo light />
            <p>{{ t.footer.desc }}</p>
            <address>{{ CONTACT.address }} Paris<br><template v-if="!CONTACT.phone.startsWith('[')"><a :href="`tel:${CONTACT.phoneE164}`">{{ CONTACT.phone }}</a><template v-if="CONTACT.whatsapp"> · <a :href="CONTACT.whatsapp" target="_blank" rel="noopener">WhatsApp</a></template><br></template><a :href="`mailto:${CONTACT.email}`">{{ CONTACT.email }}</a></address>
            <SocialLinks />
          </div>
          <div v-for="col in footerCols" :key="col.title" class="hfoot__col">
            <div class="hfoot__title">{{ col.title }}</div>
            <NuxtLink v-for="[l, to] in col.links" :key="l" :to="to">{{ l }}</NuxtLink>
          </div>
        </div>
        <div class="hfoot__tags">
          <div><span>{{ t.footer.local }}</span><NuxtLink v-for="[label, to] in footerLocal" :key="label" :to="to" class="hfoot__pill">{{ label }}</NuxtLink></div>
        </div>
        <div class="hfoot__bottom">
          <span>© 2026 KPS Agency · Paris, France</span>
          <div><NuxtLink :to="link.legal()">{{ t.footer.legal }}</NuxtLink><NuxtLink :to="link.privacy()">{{ t.footer.privacy }}</NuxtLink><NuxtLink :to="link.terms()">{{ t.footer.terms }}</NuxtLink><button type="button" class="hfoot__cookies" @click="resetConsent">{{ en ? 'Manage cookies' : 'Gérer les cookies' }}</button></div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { CONTACT, REVIEWS, REVIEWS_AVG, GOOGLE_REVIEWS_URL, SERVICE_FAMILIES, organizationSchema } from '~/data/content'
import { HOME } from '~/data/home'
import { serviceIconPath } from '~/data/serviceIcons'
definePageMeta({ layout: false })

const { en, locale, link, projects, services, footerCols, footerLocal } = useSite()
const { thumb, thumbSet, avifSet } = useCloudImage()
const route = useRoute()
const { reset: resetConsent } = useAnalyticsConsent()
const site = useRuntimeConfig().public.siteUrl as string
const STAR = 'M12 2l3 7 7 .6-5.3 4.7 1.6 7.2L12 17.8 5.7 21.5l1.6-7.2L2 9.6 9 9z'
const BOOK_ICONS = [
  'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
  'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  'M3 7h12v10H3zM15 10l6-3v10l-6-3',
  'M9 12l2 2 4-4M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z'
]
const t = useLocaleText(HOME)
// Services : les trois familles d'expertises, avec le titre et la phrase courte de chaque expertise (app/data/home.ts)
const families = computed(() => SERVICE_FAMILIES.map(f => ({
  key: f.key, title: f.title[en.value ? 'en' : 'fr'], text: f.text[en.value ? 'en' : 'fr'],
  items: f.slugs.map(slug => t.value.services.items.find(i => i.slug === slug)).filter(i => !!i)
})))
// Entrée « Pas sûr de ce qu'il vous faut ? » : l'élément sans slug de la liste
const svcUnsure = computed(() => t.value.services.items.find(i => !i.slug))
// Prix d'appel d'une expertise (champ « from » de app/data/content.ts) : rien n'est affiché tant qu'il est vide
const svcFrom = (slug: string) => services.value.find(s => s.slug === slug)?.from
// Animation des services dans le hero (onglets Site web, App métier, App mobile, SEO & GEO, Publicité, Social) : désactivée pour l'instant, remettre à true pour la réafficher
const SHOW_HERO_SHOWCASE = false
// Icônes (Lucide) et couleurs des sections reprises de la maquette kps-agency.com
const ICON_WAVES = '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>'
const ICON_SPARKLES = '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>'
const WHY_ICONS = [
  '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  '<path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/>'
]
// Teintes assez foncées pour rester lisibles en petit texte sur fond blanc (contraste ≥ 4,5)
const WHY_COLORS = ['#2563EB', '#7E22CE', '#A16207', '#047857']
// Titres de section : seul le mot-clé marqué par *…* dans les textes (app/data/home.ts) est en dégradé
function hl(title: string): [string, string, string] {
  const m = title.match(/^(.*?)\*(.+?)\*(.*)$/)
  return m ? [m[1]!, m[2]!, m[3]!] : [title, '', '']
}
// Titre du hero : la fin (après la virgule) passe en dégradé de marque
const heroTitle = computed(() => {
  const title = t.value.hero.title
  const i = title.indexOf(',')
  return i < 0 ? [title, ''] : [title.slice(0, i + 1) + ' ', title.slice(i + 1).trim()]
})

usePageSeo({ title: () => t.value.seo.title, description: () => t.value.seo.desc })
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: () => {
      const url = en.value ? `${site}/en` : `${site}/`
      return JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          organizationSchema(site, en.value ? 'en' : 'fr'),
          { '@type': 'WebSite', '@id': `${site}/#website`, url: `${site}/`, name: 'KPS Agency', inLanguage: ['fr-FR', 'en-GB'], publisher: { '@id': `${site}/#organization` } },
          { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: t.value.seo.title, isPartOf: { '@id': `${site}/#website` }, about: { '@id': `${site}/#organization` }, inLanguage: en.value ? 'en-GB' : 'fr-FR' }
        ]
      })
    }
  }]
})

// Réalisations : les 6 dernières par onglet
const ICON_EXTERNAL = '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>'
const PF_ICONS: Record<string, string> = {
  social: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>',
  web: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  ads: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>'
}
const CAT_TAB: Record<string, string> = { Web: 'web', Social: 'social', ADS: 'ads' }
const PF_TABS = ['all', 'web', 'social', 'ads'] as const
const PF_COUNT = 6
const pfTab = ref<string>('all')
// Même ordre que l'admin et que /realisations : les dernières réalisations en premier dans chaque catégorie.
// « Tous » mélange les catégories : la plus récente de chacune, puis la suivante de chacune, etc.
const pfShown = computed(() => {
  const byTab = (tab: string) => projects.value.filter(x => CAT_TAB[x.cat] === tab)
  if (pfTab.value !== 'all') return byTab(pfTab.value).slice(0, PF_COUNT)
  const lists = PF_TABS.filter(tab => tab !== 'all').map(byTab)
  return Array.from({ length: PF_COUNT }, (_, rank) => lists.flatMap(list => list.slice(rank, rank + 1))).flat().slice(0, PF_COUNT)
})

// Bloc final : onglet « devis » ou « appel » (les liens #rendez-vous ouvrent directement l'appel)
const actionTab = ref(0)
watch(() => route.hash, (h) => { if (h === '#rendez-vous') actionTab.value = 1; else if (h === '#contact') actionTab.value = 0 }, { immediate: true })

// Barre d'action mobile : affichée une fois le hero dépassé, masquée quand le bloc final est à l'écran
const stickyOn = ref(false)
let stickyObs: IntersectionObserver | undefined
onMounted(() => {
  if (!('IntersectionObserver' in window)) return
  // Masquée tant qu'un bloc proposant déjà les mêmes actions est visible (hero, encadré budget, boutons des réalisations et de la méthode, bloc final)
  const visible = new Set<Element>()
  stickyObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target) })
    stickyOn.value = scrollY > 300 && visible.size === 0
  })
  document.querySelectorAll('.hero-wrap, .budget, .pf__all, .method__ctas, #contact').forEach(el => stickyObs!.observe(el))
})
onBeforeUnmount(() => stickyObs?.disconnect())

const need = ref(0)
const form = reactive({ name: '', company: '', email: '', msg: '' })
const sending = ref(false)
const config = useRuntimeConfig()
async function submit() {
  // Par défaut : API interne /api/contact (e-mail à l'équipe) ; en cas d'échec, on redirige vers le formulaire complet
  const endpoint = (config.public.formEndpoint as string) || `${(config.public.bookingApi as string || '').replace(/\/$/, '')}/api/contact`
  sending.value = true
  try { await $fetch(endpoint, { method: 'POST', body: { ...form, need: t.value.form.needs[need.value], locale: locale.value } })
    // Succès : conversion mesurée, puis page de remerciement (la même que pour le formulaire de /contact)
    useTrack().lead('accueil', t.value.form.needs[need.value]!)
    await navigateTo(link.thanks())
  }
  catch { await navigateTo(link.contact()) }
  finally { sending.value = false }
}
</script>

<style scoped>
/* Top bar */
.topbar { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px 32px; padding: 10px 20px; background: var(--deep); color: var(--dark-muted); font-size: 13px; }
.topbar__dot { color: var(--muted-2); }

/* Hero — centré, comme la maquette kps-agency.com */
.hero-wrap { position: relative; overflow: hidden; background: var(--bg); }
.hero__blobs i { position: absolute; border-radius: 50%; mix-blend-mode: screen; }
.hero__blobs i:nth-child(1) { top: -10%; left: -10%; width: 60%; height: 60%; background: #4F46E5; filter: blur(100px); opacity: .3; }
.hero__blobs i:nth-child(2) { top: 20%; right: 0; width: 50%; height: 50%; background: #DB2777; filter: blur(120px); opacity: .2; }
.hero__blobs i:nth-child(3) { bottom: -10%; left: 20%; width: 70%; height: 40%; background: #06B6D4; filter: blur(100px); opacity: .2; }
.hero { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 24px; padding-top: 48px; padding-bottom: 120px; }
.hero__badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(255, 255, 255, .05); border: 1px solid rgba(255, 255, 255, .1); border-radius: 999px; backdrop-filter: blur(4px); box-shadow: 0 0 15px rgba(6, 182, 212, .3); color: #67E8F9; font-family: var(--font-body); font-size: 14px; font-weight: 500; letter-spacing: 0; line-height: 1.4; }
.hero__title { background: none; color: var(--ink); font-family: var(--font-display); max-width: 960px; font-size: 72px; line-height: 1.08; letter-spacing: -2px; }
.hero__lead { max-width: 760px; font-size: 20px; line-height: 1.55; font-weight: 300; text-wrap: balance; }
.hero__ctas { display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; padding-top: 8px; }
.hero__ctas .btn { padding: 24px 40px; font-size: 18px; gap: 12px; }
.hero__proof { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
.hero__proof li, .hero__proof a { display: inline-flex; align-items: center; gap: 6px; font-size: 16px; color: var(--muted); }
.hero__proof li { padding: 8px 14px; border-radius: 999px; background: rgba(255, 255, 255, .04); border: 1px solid rgba(255, 255, 255, .08); }
.hero__proof strong { color: var(--white); font-weight: 800; }
.hero__proof a:hover { color: var(--white); }
.hero__stars { color: #FBBF24; letter-spacing: 1px; font-size: 13px; }
.hero__trust { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; justify-content: center; gap: 12px 28px; font-size: 14px; color: var(--muted); }
.hero__trust li { display: flex; align-items: center; gap: 8px; }
.hero__visual { position: relative; width: 100%; max-width: 680px; margin-top: 40px; text-align: left; }
.hero__wave { position: absolute; left: 0; bottom: -1px; width: 100%; line-height: 0; transform: rotate(180deg); }
.hero__wave svg { display: block; width: calc(100% + 1.3px); height: 60px; }
.hero__wave path { fill: var(--bg); }

/* Section claire « Pourquoi KPS » (maquette) */
.why { padding-block: var(--section-y); background: #F8FAFC; color: #0F172A; }
.lhead { text-align: center; margin-bottom: 96px; }
.lhead--why { margin-bottom: 64px; }
.lhead__h { margin-bottom: 24px; font-size: 52px; line-height: 1; font-weight: 900; color: #0F172A; }
.lhead__grad { background: linear-gradient(90deg, #6366F1, #A855F7, #EC4899); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent; }
.lhead__p { max-width: 672px; margin-inline: auto; font-size: 20px; line-height: 1.4; color: #6B7280; }
.lhead__p--why { max-width: 768px; color: #4B5563; }
.why__hi { color: #4F46E5; }
.why__grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; }
.why__card { display: flex; flex-direction: column; padding: 28px; background: #FFFFFF; border: 1px solid #F3F4F6; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, .1), 0 8px 10px -6px rgba(0, 0, 0, .1); transition: box-shadow .3s; }
.why__card:hover { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, .25); }
.why__icon { display: flex; align-items: center; justify-content: center; width: 56px; height: 56px; margin-bottom: 24px; border-radius: 12px; background: color-mix(in srgb, var(--c) 10%, transparent); color: var(--c); }
.why__title { margin-bottom: 12px; font-size: 20px; line-height: 1.4; font-weight: 700; color: #0F172A; }
.why__desc { flex-grow: 1; margin-bottom: 24px; font-size: 16px; line-height: 1.6; color: #4B5563; }
.why__stat { padding-top: 16px; border-top: 1px solid #F3F4F6; font-size: 13px; font-weight: 700; letter-spacing: .6px; text-transform: uppercase; color: var(--c); }


/* Section heads */
.sec-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 48px; margin-bottom: 48px; }
.sec-head__title { display: flex; flex-direction: column; gap: 16px; max-width: 720px; }
.sec-head__p { max-width: 420px; }
.center-head { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px; margin-bottom: 56px; }
.center-head__title { display: flex; flex-direction: column; align-items: center; gap: 16px; max-width: 900px; }
.center-head .rating { margin-top: 8px; }
.center-head .text-18 { max-width: 620px; }

/* Services */
/* Familles d'expertises */
.fam { display: flex; flex-direction: column; gap: 16px; padding: 32px; border: 1px solid var(--line); border-radius: 20px; background: var(--bg); color: var(--ink); }
.fam__head { display: flex; align-items: center; gap: 16px; }
.fam__i { flex: none; display: flex; align-items: center; justify-content: center; width: 52px; height: 52px; border-radius: 16px; background: var(--accent); color: var(--on-accent); }
.fam__t { font-size: 26px; line-height: 1.15; letter-spacing: -.6px; font-weight: 700; }
.fam__d { font-size: 16px; line-height: 1.55; color: var(--muted); }
.fam__list { list-style: none; margin: 4px 0 0; padding: 0; display: flex; flex-direction: column; border-top: 1px solid var(--line); }
.fam__link { display: flex; align-items: center; gap: 12px; padding: 16px 0; border-bottom: 1px solid var(--line); color: var(--ink); }
.fam__list li:last-child .fam__link { border-bottom: none; padding-bottom: 0; }
.fam__txt { display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 0; }
.fam__name { font-size: 17px; font-weight: 700; transition: color .2s; }
.fam__desc { font-size: 14px; line-height: 1.45; color: var(--muted); }
.fam__from { font-size: 13px; color: var(--muted); }
.fam__from strong { color: var(--ink); }
.fam__a { flex: none; color: var(--muted-2); transition: transform .2s, color .2s; }
.fam__link:hover { color: var(--ink); }
.fam__link:hover .fam__name, .fam__link:hover .fam__a { color: var(--accent); }
.fam__link:hover .fam__a { transform: translateX(3px); }
.fams + .mini { margin-top: 20px; }
.mini__cta { flex: none; display: inline-flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 700; }
.mini { display: flex; align-items: center; gap: 14px; padding: 16px 18px; border: 1px solid var(--line); border-radius: 16px; background: var(--bg); color: var(--ink); transition: transform .2s ease, border-color .2s; }
.mini:hover { color: var(--ink); transform: translateY(-2px); border-color: var(--accent-tint-2); }
.mini--soft { background: var(--accent-soft); border-color: var(--accent-tint-2); }
.mini__i { flex: none; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 12px; background: var(--accent-soft); border: 1px solid var(--accent-tint); color: var(--accent-light); }
.mini--soft .mini__i { background: var(--accent); border-color: var(--accent); color: var(--on-accent); }
.mini__txt { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
.mini__t { font-size: 16px; font-weight: 700; }
.mini__d { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; line-clamp: 2; overflow: hidden; font-size: 13px; line-height: 1.4; color: var(--muted); }

/* Argument « tous budgets » : encadré à liseré dégradé sous les services */
.budget { display: flex; justify-content: space-between; align-items: center; gap: 40px; margin-top: 32px; padding: 36px 40px; border: 1px solid transparent; border-radius: 20px; background: linear-gradient(var(--surface), var(--surface)) padding-box, linear-gradient(90deg, #6366F1, #06B6D4, #A855F7) border-box; box-shadow: 0 0 40px -18px rgba(6, 182, 212, .6); }
.budget__text { display: flex; flex-direction: column; gap: 12px; max-width: 760px; }
.budget__tag { align-self: flex-start; padding: 5px 12px; border-radius: 999px; background: var(--accent-soft); border: 1px solid var(--accent-tint); color: var(--accent-light); font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
.budget__title { font-family: var(--font-display); font-size: 32px; line-height: 1.15; letter-spacing: -.8px; font-weight: 900; }
.budget__p { font-size: 16px; line-height: 1.55; color: var(--muted); }
.budget .btn { flex: none; }


/* Steps */
.steps { list-style: none; margin: 0; padding: 0; }
.step { display: flex; flex-direction: column; gap: 16px; padding: 32px 28px; min-height: 280px; }
.step__top { display: flex; align-items: center; gap: 12px; }
.step__n { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 999px; background: var(--deep); color: var(--white); font-weight: 600; }
.step__time { font-size: 13px; font-weight: 600; color: var(--muted-2); }
.step__title { font-size: 24px; letter-spacing: -.4px; font-weight: 700; }
.step__desc { font-size: 16px; line-height: 1.55; color: var(--muted); }

/* Réalisations — trois blocs de la maquette */
.pf { position: relative; overflow: hidden; padding-block: var(--section-y); border-top: 1px solid rgba(30, 41, 59, .5); background: var(--bg); }
.pf__blobs i { position: absolute; border-radius: 50%; filter: blur(150px); mix-blend-mode: screen; opacity: .5; }
.pf__blobs i:nth-child(1) { top: 0; right: 25%; width: 600px; height: 600px; background: rgba(49, 46, 129, .25); }
.pf__blobs i:nth-child(2) { bottom: 0; left: 25%; width: 800px; height: 800px; background: rgba(22, 78, 99, .25); }
.pf__inner { position: relative; max-width: 1280px; padding-inline: 24px; }
.pf__head { max-width: 768px; margin: 0 auto 64px; text-align: center; }
.pf__badge { display: inline-flex; align-items: center; gap: 8px; margin-bottom: 24px; padding: 8px 16px; border-radius: 999px; background: rgba(15, 23, 42, .8); border: 1px solid #1E293B; box-shadow: 0 0 30px rgba(6, 182, 212, .1); backdrop-filter: blur(12px); font-size: 14px; font-weight: 600; letter-spacing: .35px; color: var(--accent-light); }
.pf__h { margin-bottom: 24px; font-size: 52px; line-height: 1; letter-spacing: -1.5px; font-weight: 800; color: var(--white); }
.pf__h span { background: linear-gradient(90deg, #22D3EE, #6366F1, #A855F7); -webkit-background-clip: text; background-clip: text; color: transparent; }
.pf__p { font-size: 20px; line-height: 1.625; font-weight: 300; color: var(--muted-2); }
.pf__tabs { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; width: fit-content; max-width: 100%; margin: -24px auto 40px; padding: 6px; border-radius: 999px; background: rgba(15, 23, 42, .8); border: 1px solid #1E293B; }
.pf__tabs button { min-height: 44px; padding: 10px 20px; border: none; border-radius: 999px; background: none; color: var(--muted-2); font-size: 16px; font-weight: 600; transition: background .3s, color .3s; }
.pf__tabs button:hover { color: var(--white); }
.pf__tabs button.is-on { background: var(--grad-neon); color: var(--white); box-shadow: 0 0 16px rgba(6, 182, 212, .35); }
.pf__grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 28px; }
/* Changement d'onglet : sortie en fondu, entrée des cartes en cascade */
.pf-swap-leave-active { transition: opacity .25s ease, transform .25s ease; }
.pf-swap-leave-to { opacity: 0; transform: translateY(-10px); }
.pf-swap-enter-active .pf__card { animation: pf-in .6s cubic-bezier(.22, 1, .36, 1) both; animation-delay: calc(var(--i) * 70ms); }
@keyframes pf-in { from { opacity: 0; transform: translateY(28px) scale(.97); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .pf-swap-leave-active { transition: none; } .pf-swap-enter-active .pf__card { animation: none; } }
.pf__card { display: flex; flex-direction: column; overflow: hidden; background: rgba(15, 23, 42, .4); border: 1px solid rgba(30, 41, 59, .6); border-radius: 20px; color: var(--white); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, .1), 0 8px 10px -6px rgba(0, 0, 0, .1); transition: border-color .5s, box-shadow .5s; }
.pf__card:hover { color: var(--white); border-color: rgba(6, 182, 212, .3); box-shadow: 0 20px 40px -15px rgba(6, 182, 212, .2); }
.pf__visual { position: relative; display: flex; align-items: center; justify-content: center; aspect-ratio: 4 / 3; padding: 16px; overflow: hidden; background: #070B14; border-bottom: 1px solid rgba(30, 41, 59, .5); }
.pf__visual img { width: 100%; height: 100%; object-fit: contain; transition: transform .7s ease-out; }
.pf__card:hover .pf__visual img { transform: scale(1.05); }
.pf__cat { position: absolute; top: 16px; left: 16px; z-index: 1; display: inline-flex; align-items: center; gap: 6px; max-width: calc(100% - 32px); padding: 6px 12px; border-radius: 999px; background: rgba(2, 6, 23, .8); border: 1px solid rgba(51, 65, 85, .8); backdrop-filter: blur(12px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, .1); font-size: 13px; font-weight: 500; color: #E2E8F0; }
.pf__cat svg { flex: none; color: var(--accent-light); }
.pf__cat span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pf__body { display: flex; flex-direction: column; flex: 1; padding: 32px; background: linear-gradient(180deg, rgba(15, 23, 42, .4), rgba(15, 23, 42, .8)); }
.pf__title { margin-bottom: 12px; font-family: var(--font-body); font-size: 24px; line-height: 1.25; font-weight: 700; transition: color .3s; }
.pf__card:hover .pf__title { color: var(--accent-light); }
.pf__desc { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; line-clamp: 2; overflow: hidden; font-size: 16px; line-height: 1.625; color: var(--muted-2); }
.pf__more { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: auto; padding-top: 24px; font-size: 14px; font-weight: 500; letter-spacing: .35px; text-transform: uppercase; color: var(--muted-2); transition: color .3s; }
.pf__more i { display: flex; align-items: center; justify-content: center; flex: none; width: 40px; height: 40px; border-radius: 999px; background: rgba(30, 41, 59, .8); border: 1px solid #334155; transition: background .3s, border-color .3s, transform .3s; }
.pf__card:hover .pf__more { color: #67E8F9; }
.pf__card:hover .pf__more i { background: rgba(6, 182, 212, .2); border-color: rgba(6, 182, 212, .5); transform: scale(1.1); }
.pf__all { display: flex; justify-content: center; flex-wrap: wrap; gap: 14px; margin-top: 48px; }

/* Méthode : appel à l'action sous les étapes */
.method__ctas { display: flex; justify-content: center; flex-wrap: wrap; gap: 14px; margin-top: 48px; }

/* Compare */
.compare__h { max-width: 900px; }
.compare-wrap { position: relative; overflow-x: auto; background: var(--surface); border: 1px solid var(--line); border-radius: 20px; }
.compare { width: 100%; min-width: 900px; border-collapse: collapse; table-layout: fixed; font-size: 16px; }
.compare thead th, .compare thead td { padding: 22px 28px; font-weight: 600; text-align: left; border-bottom: 1px solid var(--line); }
.compare__kps { background: var(--deep); color: var(--white); }
.compare__k { display: inline-block; width: 28px; height: 28px; margin-right: 10px; vertical-align: middle; }
.compare tbody th { padding: 20px 28px; font-weight: 500; text-align: left; }
.compare tbody td { padding: 20px 28px; color: var(--muted); }
.compare tbody tr { border-bottom: 1px solid var(--line-soft); }
.compare tbody tr:last-child { border-bottom: none; }
.compare__hi { background: var(--accent-soft); color: var(--ink) !important; font-weight: 600; }
.compare__cell { display: flex; align-items: center; gap: 10px; }
.compare__hint { display: none; }

/* Reviews */
.rating { display: flex; align-items: center; gap: 14px; padding: 14px 20px; border: 1px solid var(--line); border-radius: 16px; background: var(--surface); color: var(--ink); transition: border-color .15s, box-shadow .15s; }
.rating:hover { color: var(--ink); border-color: var(--line-3); box-shadow: 0 12px 24px -16px rgba(0, 0, 0, .3); }
.rating__v { font-family: var(--font-display); font-size: 32px; font-weight: 900; }
.rating__t { display: flex; flex-direction: column; gap: 4px; font-size: 13px; color: var(--muted); }
.rating__t u { text-underline-offset: 2px; }
.review__stars { display: flex; gap: 4px; color: #C27803; }

/* Booking */
.book__h { font-family: var(--font-display); font-size: 32px; line-height: 1.15; letter-spacing: -.8px; font-weight: 900; }
.book { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 56px; align-items: start; }
.book__intro { display: flex; flex-direction: column; gap: 20px; position: sticky; top: 110px; }
.book__facts { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; }
.book__facts li { display: flex; align-items: center; gap: 14px; font-size: 16px; color: var(--muted); }
.book__facts strong { color: var(--ink); font-weight: 600; }
.book__fi { flex: none; width: 40px; height: 40px; display: inline-flex; align-items: center; justify-content: center; border-radius: 12px; background: var(--accent-soft); color: var(--accent); }

/* FAQ */
.faq-sec { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 64px; }
.faq-sec__head { display: flex; flex-direction: column; gap: 16px; align-items: flex-start; }
.faq-sec__p { font-size: 16px; line-height: 1.55; color: var(--muted); }
.faq-sec__head .btn { margin-top: 8px; }
.faq-sec__list { grid-column: span 2; }

/* Bloc final : onglets devis / appel */
.action__head { margin-bottom: 32px; }
.action__tabs { display: flex; gap: 8px; width: fit-content; max-width: 100%; margin: 0 auto 32px; padding: 6px; border-radius: 999px; background: var(--surface); border: 1px solid var(--line); }
.action__tabs button { padding: 12px 22px; border: none; border-radius: 999px; background: none; color: var(--muted); font-size: 16px; font-weight: 700; transition: background .3s, color .3s; }
.action__tabs button:hover { color: var(--white); }
.action__tabs button.is-on { background: var(--grad-neon); color: var(--white); box-shadow: 0 0 16px rgba(6, 182, 212, .35); }
.final__call { background: none; font: inherit; cursor: pointer; }

/* Barre d'action fixe (mobile uniquement) */
.sticky { display: none; }
.sticky-enter-active, .sticky-leave-active { transition: transform .35s ease, opacity .35s ease; }
.sticky-enter-from, .sticky-leave-to { transform: translateY(100%); opacity: 0; }

/* Final CTA */
.final { padding-block: var(--section-y); }
.final__box { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 64px; padding: 72px; border-radius: 20px; background: var(--grad-brand); color: var(--white); }
.final__text { display: flex; flex-direction: column; gap: 24px; }
.final__h { font-size: 32px; line-height: 1.15; letter-spacing: -.8px; font-weight: 900; }
.final__p { font-size: 18px; line-height: 1.55; color: rgba(255, 255, 255, .88); max-width: 480px; }
.final__list { list-style: none; margin: 8px 0 0; padding: 0; display: flex; flex-direction: column; gap: 12px; font-size: 16px; }
.final__list li { display: flex; align-items: center; gap: 10px; }
.final__call { align-self: flex-start; margin-top: 12px; padding: 16px 24px; border: 1px solid rgba(255,255,255,.5); border-radius: 16px; color: var(--white); font-weight: 600; }
.final__call:hover { color: var(--white); background: rgba(255,255,255,.1); }
.final__form { display: flex; flex-direction: column; gap: 16px; padding: 32px; background: var(--surface); color: var(--ink); border-radius: 20px; }
.final__row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.final__form label, .final__needs legend { display: flex; flex-direction: column; gap: 6px; font-size: 14px; font-weight: 500; }
.final__form input, .final__form textarea { padding: 14px; border: 1px solid var(--line-2); border-radius: 12px; font-size: 16px; font-family: inherit; resize: none; color: var(--ink); }
.final__needs { border: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.final__needs legend { margin-bottom: 8px; }
.final__needs div { display: flex; flex-wrap: wrap; gap: 8px; }
.final__needs button { min-height: 44px; padding: 9px 16px; border-radius: 999px; font-size: 14px; font-weight: 500; background: var(--surface); color: var(--ink); border: 1px solid var(--line-2); }
.final__needs button.is-on { background: var(--accent); color: var(--on-accent); border-color: var(--accent); }
.final__submit { min-height: 56px; padding: 16px; background: var(--grad-neon); color: var(--white); border: none; border-radius: 16px; box-shadow: var(--glow-neon); font-size: 16px; font-weight: 600; }
.final__submit:disabled { opacity: .7; cursor: wait; }
.final__submit:hover { background: var(--grad-neon-hover); }
.final__note { font-size: 13px; color: var(--muted-2); text-align: center; }

/* Footer home */
.hfoot { background: var(--deep); color: var(--dark-muted); }
.hfoot__inner { display: flex; flex-direction: column; gap: 56px; padding-top: 80px; padding-bottom: 40px; }
.hfoot__grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 32px; }
.hfoot__brand { grid-column: span 2; display: flex; flex-direction: column; gap: 18px; padding-right: 40px; }
.hfoot__brand p { font-size: 16px; line-height: 1.6; color: var(--dark-muted-2); }
.hfoot__brand address { font-style: normal; font-size: 16px; line-height: 1.7; }
.hfoot__brand address a { color: var(--white); }
.hfoot__col { display: flex; flex-direction: column; gap: 12px; font-size: 14px; }
.hfoot__col a, .hfoot__pill { color: var(--dark-muted-2); }
.hfoot__col a:hover, .hfoot__pill:hover, .hfoot__bottom a:hover { color: var(--white); }
.hfoot__title { font-weight: 600; color: var(--white); font-size: 16px; margin-bottom: 4px; }
.hfoot__tags { display: flex; flex-direction: column; gap: 14px; padding-top: 32px; border-top: 1px solid var(--dark-line); }
.hfoot__tags > div { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; font-size: 13px; }
.hfoot__tags > div > span { color: var(--white); font-weight: 600; width: 190px; }
.hfoot__pill { padding: 5px 10px; border: 1px solid var(--dark-line); border-radius: 999px; }
.hfoot__bottom { display: flex; justify-content: space-between; gap: 16px; font-size: 13px; color: var(--dark-muted-3); padding-top: 24px; border-top: 1px solid var(--dark-line); }
.hfoot__bottom > div { display: flex; gap: 24px; flex-wrap: wrap; }
.hfoot__bottom a, .hfoot__cookies { color: var(--dark-muted-3); }
.hfoot__cookies { padding: 0; border: none; background: none; font: inherit; }
.hfoot__cookies:hover { color: var(--white); }

/* Responsive */
@media (max-width: 1180px) {
  .hero__title { font-size: 52px; letter-spacing: -1.6px; }
  .why__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .fams { grid-template-columns: minmax(0, 1fr); }
  .pf__h { font-size: 40px; }
  .pf__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
  .pf__card, .pf__card--half { grid-column: auto; }
  .sec-head { flex-direction: column; align-items: flex-start; }
  .pf__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
  .budget { flex-direction: column; align-items: flex-start; gap: 24px; }
  .book { grid-template-columns: minmax(0, 1fr); gap: 32px; }
  .book__intro { position: static; }
  .faq-sec { grid-template-columns: minmax(0, 1fr); gap: 40px; }
  .faq-sec__list { grid-column: auto; }
  .final__box { grid-template-columns: minmax(0, 1fr); padding: 56px 40px; }
  .hfoot__grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .hfoot__brand { grid-column: span 4; padding-right: 0; }
}
/* Mobile */
@media (max-width: 720px) {
  .hero { gap: 14px; padding-top: 16px; padding-bottom: 96px; }
  .hero__ctas { gap: 10px; }
  .fam { padding: 24px; }
  .fam__t { font-size: 22px; }
  .mini__cta { display: none; }
  .budget { padding: 28px 22px; margin-top: 20px; }
  .budget__title { font-size: 24px; }
  .budget .btn { width: 100%; justify-content: center; white-space: normal; }
  .hero__title { font-size: 40px; letter-spacing: -1px; }
  .hero__badge { font-size: 13px; padding: 6px 12px; }
  .hero__proof li, .hero__proof a { font-size: 13px; }
  .hero__proof li { padding: 6px 10px; }
  .pf__tabs { margin: -12px auto 24px; overflow-x: auto; flex-wrap: nowrap; scrollbar-width: none; justify-content: flex-start; }
  .pf__tabs button { flex: none; min-height: 44px; padding: 9px 16px; font-size: 14px; }
  .pf__inner { padding-inline: var(--gutter); }
  .pf__grid.m-swipe { display: flex; }
  .pf__grid.m-swipe > * { flex-basis: 86%; }
  .hero__proof li { padding-block: 0; }
  .hero__proof a, .hero__proof li { min-height: 44px; }
  .pf__all .btn, .method__ctas .btn { width: 100%; justify-content: center; white-space: normal; }
  .action__tabs { width: 100%; }
  .action__tabs button { flex: 1; min-height: 48px; padding: 11px 10px; font-size: 14px; }
  .final__needs button { min-height: 44px; padding-inline: 16px; }
  .sticky { position: fixed; left: 12px; right: 12px; bottom: 12px; z-index: 70; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 8px; border-radius: 18px; background: rgba(2, 6, 23, .92); border: 1px solid var(--line); backdrop-filter: blur(12px); box-shadow: 0 12px 30px -10px rgba(0, 0, 0, .6); }
  .sticky .btn { justify-content: center; min-height: 46px; padding: 12px 10px; }
  .hfoot { padding-bottom: 76px; }
  .hero__lead { font-size: 16px; }
  .hero__ctas { width: 100%; padding-top: 0; }
  .hero__ctas .btn { padding: 20px 24px; font-size: 16px; }
  .why__grid.m-swipe { display: flex; margin-top: -8px !important; padding-block: 12px 28px !important; }
  .why__grid.m-swipe > * { flex-basis: 78%; box-shadow: 0 10px 20px -8px rgba(0, 0, 0, .12); }
  .final__list, .final__p { display: none; }
  .final__text { gap: 16px; }
  .final__box { gap: 24px; }
  .final__call { margin-top: 0; align-self: stretch; text-align: center; }
  /* 2. Preuves au-dessus des boutons : elles restent visibles tant que le bandeau cookies est affiché */
  .hero__proof { order: 1; flex-wrap: nowrap; }
  .hero__proof li:nth-child(n + 3), .hero__trust li:nth-child(n + 3) { display: none; }
  .hero__trust { flex-wrap: nowrap; gap: 8px 18px; font-size: 13px; }
  /* Carrousel d'avis : la navigation reste accessible au-dessus de la barre d'action */
  #avis { padding-bottom: calc(var(--section-y) + 24px); }
  .hero__ctas { order: 2; }
  .hero__trust { order: 3; }
  /* 2. Pied de page : zones tactiles de 44 px */
  .hfoot__col { gap: 0; }
  .hfoot__col a { display: flex; align-items: center; min-height: 44px; }
  .hfoot__pill { display: inline-flex; align-items: center; min-height: 44px; padding-inline: 14px; }
  .hfoot__bottom > div { gap: 4px 20px; }
  .hfoot__bottom a, .hfoot__cookies { display: inline-flex; align-items: center; min-height: 44px; }
  .hfoot__brand address a { display: inline-flex; align-items: center; min-height: 44px; }
  .lhead { margin-bottom: 56px; }
  .lhead__h { font-size: 32px; line-height: 1.1; }
  .lhead__p { font-size: 18px; }
  /* Barre du haut sur une ligne : on garde les deux arguments principaux */
  .topbar { flex-wrap: nowrap; gap: 10px; font-size: 13px; padding: 9px 12px; }
  .topbar > span:nth-last-child(-n + 2) { display: none; }
  .pf__head { margin-bottom: 36px; }
  .pf__badge { font-size: 13px; padding: 6px 12px; margin-bottom: 16px; }
  .pf__h { font-size: 32px; letter-spacing: -.6px; margin-bottom: 16px; }
  .pf__p { font-size: 16px; }
  .pf__grid { grid-template-columns: minmax(0, 1fr); gap: 16px; }
  .pf__visual { padding: 12px; }
  .pf__body { padding: 20px; }
  .pf__title { font-size: 18px; margin-bottom: 8px; }
  .pf__desc { font-size: 14px; }
  .pf__cat { top: 10px; left: 10px; font-size: 13px; padding: 4px 10px; }
  .pf__all { padding-bottom: 64px; }
  /* Tableau comparatif : colonne des critères figée, indication de défilement */
  .compare__hint { display: block; margin: -8px 0 10px; font-size: 13px; font-weight: 600; color: var(--accent); text-align: right; }
  .compare { min-width: 620px; font-size: 14px; }
  .compare thead th, .compare thead td, .compare tbody th, .compare tbody td { padding: 14px 14px; }
  .compare tbody th, .compare thead td { position: sticky; left: 0; z-index: 1; width: 132px; background: var(--surface); box-shadow: 1px 0 0 var(--line-soft); }
}
@media (max-width: 720px) {
  .final__h { font-size: 24px; }
  .final__box { padding: 40px 22px; }
  .final__row { grid-template-columns: minmax(0, 1fr); }
  .hfoot__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .hfoot__brand { grid-column: span 2; }
  .hfoot__tags > div > span { width: 100%; }
  .hfoot__bottom { flex-direction: column; }
}
</style>
