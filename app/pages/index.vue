<template>
  <div class="home">
    <!-- TOP BAR -->
    <div class="topbar">
      <template v-for="(b, i) in t.topbar" :key="b"><span v-if="i" class="topbar__dot">·</span><span>{{ b }}</span></template>
    </div>

    <SiteHeader />

    <main id="contenu">
      <!-- HERO (mise en page de la maquette kps-agency.com : centré, logo, titre en dégradé, vague) -->
      <div class="hero-wrap">
        <div class="hero__blobs" aria-hidden="true"><i /><i /><i /></div>
        <section class="container hero">
          <div class="hero__logo"><img src="/logo_kps.webp" alt="KPS Agency" width="803" height="311" fetchpriority="high"></div>
          <h1 class="hero__badge"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="ICON_WAVES" />{{ t.hero.badge }}</h1>
          <p class="h1 hero__title">{{ heroTitle[0] }}<span v-if="heroTitle[1]" class="text-gradient">{{ heroTitle[1] }}</span></p>
          <p class="lead hero__lead">{{ t.hero.lead }}</p>
          <div class="hero__ctas">
            <NuxtLink :to="link.contact()" class="btn btn--primary"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="ICON_SPARKLES" />{{ t.hero.cta }}</NuxtLink>
            <NuxtLink :to="link.work()" class="btn btn--ghost">{{ t.hero.cta2 }} <IconArrow /></NuxtLink>
          </div>
          <ul class="hero__trust">
            <li v-for="x in t.hero.trust" :key="x"><IconCheck />{{ x }}</li>
          </ul>
          <HeroShowcase class="hero__visual" />
        </section>
        <div class="hero__wave" aria-hidden="true"><svg viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" /></svg></div>
      </div>

      <!-- WORKFLOW (maquette) -->
      <section id="workflow" class="wf">
        <div class="container">
          <div class="lhead">
            <div class="wf__eyebrow">{{ t.workflow.eyebrow }}</div>
            <h2 class="lhead__h">{{ t.workflow.h2 }} <span class="lhead__grad">{{ t.workflow.hi }}</span></h2>
            <p class="lhead__p">{{ t.workflow.p }}</p>
          </div>
          <ol class="wf__steps">
            <li v-for="(st, i) in t.workflow.steps" :key="st.title" class="wf__step">
              <div class="wf__icon" :style="{ '--tint': WF_TINTS[i] }">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="WF_ICONS[i]" />
                <span class="wf__n">{{ i + 1 }}</span>
              </div>
              <h3 class="wf__title">{{ st.title }}</h3>
              <p class="wf__desc">{{ st.desc }}</p>
            </li>
          </ol>
        </div>
      </section>

      <!-- LOGOS -->
      <TrustBar />

      <!-- SERVICES -->
      <section id="services" class="bg-white section--96">
        <div class="container">
          <div class="sec-head">
            <div class="sec-head__title">
              <div class="eyebrow">{{ t.services.eyebrow }}</div>
              <h2 class="h2">{{ t.services.h2 }}</h2>
            </div>
            <p class="text-18 sec-head__p">{{ t.services.p }}</p>
          </div>
          <div class="grid grid-3 svc-grid m-swipe">
            <NuxtLink v-for="sv in t.services.items" :key="sv.num" :to="sv.slug ? link.service(sv.slug) : link.contact()" class="svc" :class="`svc--${sv.theme}`">
              <div class="svc__top"><span class="svc__num">{{ sv.num }}</span><span class="svc__tag">{{ sv.tag }}</span></div>
              <h3 class="svc__title">{{ sv.title }}</h3>
              <p class="svc__desc">{{ sv.desc }}</p>
              <div class="svc__pills"><span v-for="i in sv.items" :key="i">{{ i }}</span></div>
              <span class="svc__cta">{{ sv.cta }} <IconArrow :size="16" /></span>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- METHODE -->
      <section id="methode" class="container section">
        <div class="center-head">
          <div class="eyebrow">{{ t.method.eyebrow }}</div>
          <h2 class="h2">{{ t.method.h2 }}</h2>
          <p class="text-18">{{ t.method.p }}</p>
        </div>
        <ol class="grid grid-4 steps m-swipe">
          <li v-for="st in t.method.steps" :key="st.n" class="card step">
            <div class="step__top"><span class="step__n">{{ st.n }}</span><span class="step__time">{{ st.time }}</span></div>
            <h3 class="step__title">{{ st.title }}</h3>
            <p class="step__desc">{{ st.desc }}</p>
          </li>
        </ol>
      </section>

      <!-- POURQUOI CHOISIR LA TEAM KPS (maquette) -->
      <section id="pourquoi-kps" class="why">
        <div class="container">
          <div class="lhead lhead--why">
            <h2 class="lhead__h">{{ t.whyTeam.h2 }} <span class="why__hi">{{ t.whyTeam.hi }}</span>{{ t.whyTeam.suffix }}</h2>
            <p class="lhead__p lhead__p--why">{{ t.whyTeam.p }}</p>
          </div>
          <div class="why__grid">
            <article v-for="(b, i) in t.whyTeam.items" :key="b.title" class="why__card" :style="{ '--c': WHY_COLORS[i] }">
              <div class="why__icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="WHY_ICONS[i]" /></div>
              <h3 class="why__title">{{ b.title }}</h3>
              <p class="why__desc">{{ b.desc }}</p>
              <div class="why__stat"># {{ b.stat }}</div>
            </article>
          </div>
        </div>
      </section>

      <!-- REALISATIONS -->
      <section id="realisations" class="bg-dark section">
        <div class="container">
          <div class="sec-head">
            <div class="sec-head__title">
              <div class="eyebrow">{{ t.work.eyebrow }}</div>
              <h2 class="h2">{{ t.work.h2a }}<br>{{ t.work.h2b }}</h2>
            </div>
            <div class="filters" role="group" :aria-label="t.work.filterLabel">
              <button v-for="f in t.work.filters" :key="f.id" type="button" :aria-pressed="filter === f.id" :class="{ 'is-on': filter === f.id }" @click="filter = f.id">{{ f.label }}</button>
            </div>
          </div>
          <!-- Défilement automatique par groupes de 6 (en pause au survol, au focus et si l'utilisateur préfère moins d'animations) -->
          <div class="work__stage" @touchstart.passive="workHover = true" @mouseenter="workHover = true" @mouseleave="workHover = false" @focusin="workFocus = true" @focusout="workFocus = false">
          <Transition name="wk" mode="out-in">
          <div :key="`${filter}-${workPage}`" class="grid grid-3 work m-swipe">
            <NuxtLink v-for="(pr, i) in shown" :key="pr.slug" :to="link.project(pr.slug)" class="work__card" :style="{ '--i': i }">
              <div class="work__visual" :style="{ background: pr.bg }">
                <img :src="thumb(pr.img)" :srcset="`${thumb(pr.img)} 800w, ${pr.img} 1600w`" sizes="(max-width: 720px) 100vw, (max-width: 1180px) 50vw, 420px" :alt="`${t.work.alt} ${pr.client} — ${pr.title}`" class="work__img" loading="lazy" decoding="async" width="800" height="450">
                <span class="work__cat">{{ pr.cat }}</span>
              </div>
              <div class="work__body">
                <div class="work__sector">{{ pr.client }} · {{ pr.sector }}</div>
                <div class="work__title">{{ pr.title }}</div>
                <div class="work__foot"><span class="work__metric">{{ pr.metric }}</span><span class="work__more">{{ t.work.more }} →</span></div>
              </div>
            </NuxtLink>
          </div>
          </Transition>
          </div>
          <div v-if="workPages > 1" class="work__dots" role="group" :aria-label="t.work.pagesLabel">
            <button v-for="n in workPages" :key="n" type="button" :class="{ 'is-on': workPage === n - 1 }" :aria-current="workPage === n - 1 ? 'true' : undefined" :aria-label="`${t.work.pageLabel} ${n} / ${workPages}`" @click="goWork(n - 1)"><i :key="`${filter}-${workPage}-${workPaused}`" /></button>
          </div>
          <div class="work__all"><NuxtLink :to="link.work()" class="btn btn--outline-dark">{{ t.work.all }}</NuxtLink></div>
        </div>
      </section>

      <!-- COMPARATIF -->
      <section class="container section">
        <div class="center-head">
          <div class="eyebrow">{{ t.compare.eyebrow }}</div>
          <h2 class="h2 compare__h">{{ t.compare.h2 }}</h2>
        </div>
        <p class="compare__hint" aria-hidden="true">{{ t.compare.hint }} →</p>
        <div class="compare-wrap">
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
      <section id="avis" class="bg-white section--96">
        <div class="container">
          <div class="sec-head">
            <div class="sec-head__title">
              <div class="eyebrow">{{ t.reviews.eyebrow }}</div>
              <h2 class="h2">{{ t.reviews.h2 }}</h2>
            </div>
            <a :href="GOOGLE_REVIEWS_URL" target="_blank" rel="noopener" class="rating">
              <svg class="rating__g" width="28" height="28" viewBox="0 0 48 48" aria-hidden="true"><path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.8-2.1 5.1-4.4 6.7v5.6h7.1c4.2-3.8 6.6-9.5 6.6-16.3z" /><path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.3-9H4.4v5.7C8 41.1 15.4 46 24 46z" /><path fill="#FBBC05" d="M11.7 28.3c-.4-1.3-.7-2.8-.7-4.3s.3-3 .7-4.3V14H4.4C2.9 17 2 20.4 2 24s.9 7 2.4 10z" /><path fill="#EA4335" d="M24 10.7c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.2 29.9 2 24 2 15.4 2 8 6.9 4.4 14l7.3 5.7c1.8-5.2 6.6-9 12.3-9z" /></svg>
              <span class="rating__v">{{ en ? REVIEWS_AVG.toFixed(1) : REVIEWS_AVG.toFixed(1).replace('.', ',') }}</span>
              <span class="rating__t">
                <span class="review__stars" :aria-label="`${REVIEWS_AVG} ${t.reviews.stars}`"><svg v-for="n in 5" :key="n" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path :d="STAR" /></svg></span>
                <span>{{ REVIEWS.length }} {{ t.reviews.count }} · <u>{{ t.reviews.see }}</u></span>
              </span>
            </a>
          </div>
          <ReviewCarousel :reviews="REVIEWS" />
        </div>
      </section>

      <!-- RESERVER UN APPEL -->
      <section id="rendez-vous" class="container section book">
        <div class="book__intro">
          <div class="eyebrow">{{ t.booking.eyebrow }}</div>
          <h2 class="h2">{{ t.booking.h2 }}</h2>
          <p class="text-18">{{ t.booking.lead }}</p>
          <ul class="book__facts">
            <li v-for="(f, i) in t.booking.facts" :key="f.t">
              <span class="book__fi"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="BOOK_ICONS[i]" /></svg></span>
              <span><strong>{{ f.t }}</strong>{{ f.d }}</span>
            </li>
          </ul>
        </div>
        <BookingCalendar />
      </section>

      <!-- FAQ -->
      <section id="ressources" class="container section faq-sec">
        <div class="faq-sec__head">
          <div class="eyebrow">FAQ</div>
          <h2 class="h2">{{ t.faq.h2 }}</h2>
          <p class="faq-sec__p">{{ t.faq.p }}</p>
          <NuxtLink :to="link.contact()" class="btn btn--ghost btn--sm">{{ t.faq.cta }}</NuxtLink>
        </div>
        <FaqList :items="t.faq.items" numbered class="faq-sec__list" />
      </section>

      <!-- CTA + FORM -->
      <section id="contact" class="container final">
        <div class="final__box">
          <div class="final__text">
            <h2 class="final__h">{{ t.final.h2 }}</h2>
            <p class="final__p">{{ t.final.p }}</p>
            <ul class="final__list">
              <li v-for="x in t.final.list" :key="x"><IconCheck :size="18" color="#FFFFFF" />{{ x }}</li>
            </ul>
            <NuxtLink to="#rendez-vous" class="final__call">{{ t.final.call }} →</NuxtLink>
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
            <button type="submit" class="final__submit">{{ sent ? t.form.sent : sending ? t.form.sending : t.form.submit }}</button>
            <span class="final__note">{{ t.form.note }}</span>
          </form>
        </div>
      </section>
    </main>

    <!-- FOOTER (version accueil) -->
    <footer class="hfoot">
      <div class="container hfoot__inner">
        <div class="hfoot__grid">
          <div class="hfoot__brand">
            <SiteLogo light />
            <p>{{ t.footer.desc }}</p>
            <address>{{ CONTACT.address }} Paris<br><a :href="`mailto:${CONTACT.email}`">{{ CONTACT.email }}</a></address>
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
          <div><NuxtLink :to="link.legal()">{{ t.footer.legal }}</NuxtLink><NuxtLink :to="link.legal('#article-7')">{{ t.footer.privacy }}</NuxtLink><NuxtLink :to="link.terms()">{{ t.footer.terms }}</NuxtLink></div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { CONTACT, REVIEWS, REVIEWS_AVG, GOOGLE_REVIEWS_URL, PROJECTS, organizationSchema, thumb } from '~/data/content'
import { HOME } from '~/data/home'
definePageMeta({ layout: false })

const { en, locale, link, footerCols, footerLocal } = useSite()
const site = useRuntimeConfig().public.siteUrl as string
const STAR = 'M12 2l3 7 7 .6-5.3 4.7 1.6 7.2L12 17.8 5.7 21.5l1.6-7.2L2 9.6 9 9z'
const BOOK_ICONS = [
  'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
  'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  'M3 7h12v10H3zM15 10l6-3v10l-6-3',
  'M9 12l2 2 4-4M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z'
]
const t = useLocaleText(HOME)
// Icônes (Lucide) et couleurs des sections reprises de la maquette kps-agency.com
const ICON_WAVES = '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>'
const ICON_SPARKLES = '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>'
const WF_ICONS = [
  '<path d="M14 4.1 12 6"/><path d="m5.1 8-2.9-.8"/><path d="m6 12-1.9 2"/><path d="M7.2 2.2 8 5.1"/><path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z"/>',
  '<path d="M12.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v9.5"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M13.378 15.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/>',
  '<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M9 13a4.5 4.5 0 0 0 3-4"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M12 13h4"/><path d="M12 18h6a2 2 0 0 1 2 2v1"/><path d="M12 8h8"/><path d="M16 8V5a2 2 0 0 1 2-2"/><circle cx="16" cy="13" r=".5"/><circle cx="18" cy="3" r=".5"/><circle cx="20" cy="21" r=".5"/><circle cx="20" cy="8" r=".5"/>',
  '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>'
]
const WF_TINTS = ['linear-gradient(135deg, #3B82F6, #06B6D4)', 'linear-gradient(135deg, #06B6D4, #14B8A6)', 'linear-gradient(135deg, #14B8A6, #22C55E)', 'linear-gradient(135deg, #22C55E, #10B981)']
const WHY_ICONS = [
  '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  '<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/>',
  '<path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/>'
]
const WHY_COLORS = ['#EAB308', '#EF4444', '#6366F1', '#10B981']
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
          { '@type': 'WebSite', '@id': `${site}/#website`, url: `${site}/`, name: 'KPS Agency', inLanguage: ['fr-FR', 'en'], publisher: { '@id': `${site}/#organization` } },
          { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: t.value.seo.title, isPartOf: { '@id': `${site}/#website` }, about: { '@id': `${site}/#organization` }, inLanguage: en.value ? 'en' : 'fr-FR' }
        ]
      })
    }
  }]
})

// Réalisations mises en avant (ordre éditorial) ; textes courts propres à l'accueil
const featured = ['powercell-group', 'yassir', 'zayn', 'cushman-wakefield-veritas', 'groupado-pro', 'kpmg', 'fibbl', 'copenhagen-energy', 'brasileia-cosmetics', 'tunisia-franchise-show', 'jardins-de-carthage', 'dunstan']
const catShort = computed(() => (en.value ? { Web: 'Web', ADS: 'Ads', Social: 'Social' } : { Web: 'Web', ADS: 'ADS', Social: 'Social' }))
const filter = ref('all')
const filtered = computed(() => featured
  .map((slug) => {
    const pr = PROJECTS.find(x => x.slug === slug)!
    return { ...t.value.work.items[slug]!, slug, img: pr.img, bg: pr.bg, cat: catShort.value[pr.cat], type: pr.cat }
  })
  .filter(x => filter.value === 'all' || x.type === filter.value))

// Réalisations affichées par groupes de 6, qui défilent automatiquement
const WORK_GROUP = 6
const WORK_DELAY = 6000
const workPage = ref(0)
const workPages = computed(() => Math.ceil(filtered.value.length / WORK_GROUP))
const shown = computed(() => filtered.value.slice(workPage.value * WORK_GROUP, (workPage.value + 1) * WORK_GROUP))
const workHover = ref(false)
const workFocus = ref(false)
const workReduced = ref(false)
const workPaused = computed(() => workHover.value || workFocus.value || workReduced.value || workPages.value < 2)
let workTimer: ReturnType<typeof setTimeout> | undefined
function scheduleWork() {
  clearTimeout(workTimer)
  if (workPaused.value) return
  workTimer = setTimeout(() => { if (!document.hidden) workPage.value = (workPage.value + 1) % workPages.value; else scheduleWork() }, WORK_DELAY)
}
function goWork(n: number) { workPage.value = n }
watch(filter, () => { workPage.value = 0 })
watch([workPage, workPaused, filter], scheduleWork)
onMounted(() => {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  workReduced.value = mq.matches
  mq.addEventListener?.('change', (e) => { workReduced.value = e.matches })
  scheduleWork()
})
onBeforeUnmount(() => clearTimeout(workTimer))

const need = ref(0)
const form = reactive({ name: '', company: '', email: '', msg: '' })
const sent = ref(false)
const sending = ref(false)
const config = useRuntimeConfig()
async function submit() {
  // Par défaut : API interne /api/contact (e-mail à l'équipe) ; en cas d'échec, on redirige vers le formulaire complet
  const endpoint = (config.public.formEndpoint as string) || `${(config.public.bookingApi as string || '').replace(/\/$/, '')}/api/contact`
  sending.value = true
  try { await $fetch(endpoint, { method: 'POST', body: { ...form, need: t.value.form.needs[need.value], locale: locale.value } }); sent.value = true }
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
.hero { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 32px; padding-top: 80px; padding-bottom: 150px; }
.hero__logo { position: relative; margin-bottom: 8px; }
.hero__logo::before { content: ''; position: absolute; inset: -16px; border-radius: 999px; background: var(--grad-brand); opacity: .2; filter: blur(24px); transition: opacity 1s; }
.hero__logo:hover::before { opacity: .4; }
.hero__logo img { position: relative; width: 500px; height: auto; filter: drop-shadow(0 0 35px rgba(139, 92, 246, .3)); }
.hero__badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(255, 255, 255, .05); border: 1px solid rgba(255, 255, 255, .1); border-radius: 999px; backdrop-filter: blur(4px); box-shadow: 0 0 15px rgba(6, 182, 212, .3); color: #67E8F9; font-family: var(--font-body); font-size: 14px; font-weight: 500; letter-spacing: 0; line-height: 1.4; }
.hero__title { background: none; color: var(--ink); font-family: var(--font-display); max-width: 1040px; font-size: 88px; line-height: 1.1; letter-spacing: -2.5px; }
.hero__lead { max-width: 768px; font-size: 22px; line-height: 1.6; font-weight: 300; }
.hero__ctas { display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; padding-top: 8px; }
.hero__ctas .btn { padding: 24px 40px; font-size: 18px; gap: 12px; }
.hero__trust { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; justify-content: center; gap: 12px 28px; font-size: 14px; color: var(--muted); }
.hero__trust li { display: flex; align-items: center; gap: 8px; }
.hero__visual { position: relative; width: 100%; max-width: 680px; margin-top: 40px; text-align: left; }
.hero__wave { position: absolute; left: 0; bottom: -1px; width: 100%; line-height: 0; transform: rotate(180deg); }
.hero__wave svg { display: block; width: calc(100% + 1.3px); height: 60px; }
.hero__wave path { fill: #FFFFFF; }

/* Sections claires de la maquette : Workflow et Pourquoi choisir la Team KPS */
.wf { padding-block: 128px; background: #FFFFFF; color: #0F172A; overflow: hidden; }
.why { padding-block: 128px; background: #F8FAFC; color: #0F172A; }
.lhead { text-align: center; margin-bottom: 96px; }
.lhead--why { margin-bottom: 64px; }
.wf__eyebrow { margin-bottom: 8px; font-size: 14px; font-weight: 700; letter-spacing: 1.4px; text-transform: uppercase; color: #4F46E5; }
.lhead__h { margin-bottom: 24px; font-size: 48px; line-height: 1; font-weight: 900; color: #0F172A; }
.lhead__grad { background: linear-gradient(90deg, #6366F1, #A855F7, #EC4899); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent; }
.lhead__p { max-width: 672px; margin-inline: auto; font-size: 20px; line-height: 1.4; color: #6B7280; }
.lhead__p--why { max-width: 768px; color: #4B5563; }
.wf__steps { position: relative; list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 48px; }
/* Ligne de progression en dégradé derrière les icônes */
.wf__steps::before { content: ''; position: absolute; top: 46px; left: calc(-1 * var(--gutter)); right: calc(-1 * var(--gutter)); height: 4px; background: linear-gradient(90deg, #6366F1, #A855F7); }
.wf__step { position: relative; display: flex; flex-direction: column; align-items: center; text-align: center; }
.wf__icon { position: relative; display: flex; align-items: center; justify-content: center; width: 96px; height: 96px; margin-bottom: 32px; border-radius: 24px; background: #FFFFFF; border: 4px solid #FFFFFF; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, .1), 0 8px 10px -6px rgba(0, 0, 0, .1); color: #334155; transition: transform .3s, color .3s; }
.wf__icon::before { content: ''; position: absolute; inset: 0; border-radius: 16px; background: var(--tint); opacity: .1; transition: opacity .3s; }
.wf__icon svg { position: relative; }
.wf__step:hover .wf__icon { transform: translateY(-8px); color: #4F46E5; }
.wf__step:hover .wf__icon::before { opacity: .2; }
.wf__n { position: absolute; top: -16px; right: -16px; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 999px; background: #0F172A; color: #FFFFFF; border: 4px solid #FFFFFF; font-weight: 700; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, .1); }
.wf__title { margin-bottom: 12px; font-size: 24px; line-height: 1.33; font-weight: 700; color: #0F172A; transition: color .3s; }
.wf__step:hover .wf__title { color: #4F46E5; }
.wf__desc { font-size: 16px; line-height: 1.625; font-weight: 500; color: #6B7280; }
.why__hi { color: #4F46E5; }
.why__grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; }
.why__card { display: flex; flex-direction: column; padding: 24px; background: #FFFFFF; border: 1px solid #F3F4F6; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, .1), 0 8px 10px -6px rgba(0, 0, 0, .1); transition: box-shadow .3s; }
.why__card:hover { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, .25); }
.why__icon { display: flex; align-items: center; justify-content: center; width: 56px; height: 56px; margin-bottom: 24px; border-radius: 12px; background: color-mix(in srgb, var(--c) 10%, transparent); color: var(--c); }
.why__title { margin-bottom: 12px; font-size: 20px; line-height: 1.4; font-weight: 700; color: #0F172A; }
.why__desc { flex-grow: 1; margin-bottom: 24px; font-size: 14px; line-height: 1.625; color: #6B7280; }
.why__stat { padding-top: 16px; border-top: 1px solid #F3F4F6; font-size: 12px; font-weight: 700; letter-spacing: .6px; text-transform: uppercase; color: var(--c); }


/* Section heads */
.sec-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 48px; margin-bottom: 48px; }
.sec-head__title { display: flex; flex-direction: column; gap: 16px; max-width: 720px; }
.sec-head__p { max-width: 420px; }
.center-head { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px; margin-bottom: 56px; }
.center-head .text-18 { max-width: 620px; }

/* Services */
.svc { display: flex; flex-direction: column; gap: 18px; padding: 32px; min-height: 330px; border: 1px solid var(--line); border-radius: 20px; transition: transform .2s ease; }
.svc:hover { transform: translateY(-3px); }
.svc--dark { background: var(--deep); color: var(--white); } .svc--dark:hover { color: var(--white); }
.svc--light { background: var(--bg); color: var(--ink); } .svc--light:hover { color: var(--ink); }
.svc--soft { background: var(--accent-soft); color: var(--ink); } .svc--soft:hover { color: var(--ink); }
.svc__top { display: flex; justify-content: space-between; align-items: center; }
.svc__num { display: flex; align-items: center; justify-content: center; width: 52px; height: 52px; border-radius: 14px; font-family: var(--font-display); font-weight: 900; font-size: 18px; background: var(--surface); color: var(--ink); }
.svc--dark .svc__num, .svc--soft .svc__num { background: var(--accent); color: var(--on-accent); }
.svc__tag { font-size: 13px; font-weight: 600; padding: 6px 12px; border-radius: 999px; border: 1px solid var(--line-2); }
.svc--dark .svc__tag { border-color: var(--dark-line-2); }
.svc--soft .svc__tag { border-color: var(--accent-tint-2); }
.svc__title { font-size: 28px; line-height: 1.15; letter-spacing: -.6px; font-weight: 700; }
.svc__desc { font-size: 16px; line-height: 1.55; color: var(--muted); }
.svc--dark .svc__desc { color: var(--dark-muted); }
.svc__pills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: auto; }
.svc__pills span { font-size: 13px; padding: 6px 10px; border-radius: 8px; background: var(--surface); }
.svc--dark .svc__pills span { background: var(--dark-2); }
.svc__cta { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; }

/* Steps */
.steps { list-style: none; margin: 0; padding: 0; }
.step { display: flex; flex-direction: column; gap: 16px; padding: 32px 28px; min-height: 280px; }
.step__top { display: flex; align-items: center; gap: 12px; }
.step__n { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 99px; background: var(--deep); color: var(--white); font-weight: 600; }
.step__time { font-size: 13px; font-weight: 600; color: var(--muted-2); }
.step__title { font-size: 24px; letter-spacing: -.4px; font-weight: 700; }
.step__desc { font-size: 16px; line-height: 1.55; color: var(--muted); }

/* Work */
.filters { display: flex; gap: 8px; padding: 6px; background: var(--dark-2); border-radius: 999px; flex-wrap: wrap; }
.filters button { padding: 10px 18px; border: none; border-radius: 999px; font-size: 14px; font-weight: 600; background: transparent; color: var(--dark-muted); }
.filters button.is-on { background: var(--accent); color: var(--on-accent); }
.work { margin-top: 40px; }
/* Visuel en haut, bas de carte sur fond sombre, détaché de la section par une bordure */
.work__card { display: flex; flex-direction: column; background: var(--dark-2); color: var(--white); border: 1px solid var(--dark-line); border-radius: 20px; overflow: hidden; transition: transform .2s ease, border-color .2s ease; }
.work__card:hover { color: var(--white); transform: translateY(-3px); border-color: var(--dark-line-2); }
.work__visual { position: relative; aspect-ratio: 16 / 9; overflow: hidden; }
.work__img { width: 100%; height: 100%; object-fit: cover; object-position: top center; transition: transform .4s ease; }
.work__card:hover .work__img { transform: scale(1.04); }
.work__cat { position: absolute; left: 16px; top: 16px; font-size: 12px; font-weight: 600; padding: 5px 10px; border-radius: 999px; background: var(--surface); color: var(--ink); box-shadow: 0 4px 12px -4px rgba(0, 0, 0,.3); }
.work__body { display: flex; flex-direction: column; flex-grow: 1; gap: 8px; padding: 22px 24px 24px; }
.work__sector { font-size: 13px; color: var(--dark-muted-2); font-weight: 500; }
.work__title { font-size: 18px; font-weight: 600; line-height: 1.35; }
.work__foot { display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid var(--dark-line-2); margin-top: auto; }
.work__metric { font-family: var(--font-display); font-size: 22px; font-weight: 900; color: var(--accent-light); }
.work__more { font-size: 14px; font-weight: 600; }
.work__card:hover .work__more { color: var(--accent-light); }
/* Changement de groupe : les cartes sortent en fondu puis les suivantes arrivent en cascade */
.work__stage { --ease: cubic-bezier(.22, 1, .36, 1); }
.wk-leave-active { transition: opacity .3s ease, transform .3s ease; }
.wk-leave-to { opacity: 0; transform: translateY(-12px) scale(.985); }
.wk-enter-active .work__card { animation: wk-in .7s var(--ease) both; animation-delay: calc(var(--i) * 80ms); }
@keyframes wk-in { from { opacity: 0; transform: translateY(36px) scale(.96); filter: blur(6px); } to { opacity: 1; transform: none; filter: none; } }
.work__dots { display: flex; justify-content: center; gap: 10px; margin-top: 32px; }
.work__dots button { position: relative; width: 12px; height: 28px; padding: 0; border: none; background: none; transition: width .4s cubic-bezier(.22, 1, .36, 1); }
.work__dots button::before { content: ''; position: absolute; left: 0; right: 0; top: 11px; height: 6px; border-radius: 99px; background: var(--dark-line-2); }
.work__dots button.is-on { width: 48px; }
/* Jauge du groupe en cours : elle se remplit le temps de l'affichage */
.work__dots i { position: absolute; left: 0; top: 11px; height: 6px; width: 100%; border-radius: 99px; background: var(--grad-neon); transform-origin: left; transform: scaleX(0); }
.work__dots button.is-on i { animation: wk-fill 6s linear forwards; }
.work__stage:hover + .work__dots button.is-on i, .work__stage:focus-within + .work__dots button.is-on i { animation: none; transform: scaleX(1); }
@keyframes wk-fill { to { transform: scaleX(1); } }
@media (prefers-reduced-motion: reduce) {
  .wk-leave-active { transition: none; }
  .wk-enter-active .work__card { animation: none; }
  .work__dots button.is-on i { animation: none; transform: scaleX(1); }
}
.work__all { display: flex; justify-content: center; margin-top: 40px; }

/* Compare */
.compare__h { max-width: 900px; }
.compare-wrap { position: relative; overflow-x: auto; background: var(--surface); border: 1px solid var(--line); border-radius: 24px; }
.compare { width: 100%; min-width: 900px; border-collapse: collapse; table-layout: fixed; font-size: 15px; }
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
.book { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 56px; align-items: start; }
.book__intro { display: flex; flex-direction: column; gap: 20px; position: sticky; top: 110px; }
.book__facts { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; }
.book__facts li { display: flex; align-items: center; gap: 14px; font-size: 16px; color: var(--muted); }
.book__facts strong { color: var(--ink); font-weight: 600; }
.book__fi { flex: none; width: 40px; height: 40px; display: inline-flex; align-items: center; justify-content: center; border-radius: 12px; background: var(--accent-soft); color: var(--accent); }

/* FAQ */
.faq-sec { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 64px; }
.faq-sec__head { display: flex; flex-direction: column; gap: 16px; align-items: flex-start; }
.faq-sec__p { font-size: 17px; line-height: 1.55; color: var(--muted); }
.faq-sec__head .btn { margin-top: 8px; }
.faq-sec__list { grid-column: span 2; }

/* Final CTA */
.final { padding-bottom: 112px; }
.final__box { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 64px; padding: 72px; border-radius: 32px; background: var(--grad-brand); color: var(--white); }
.final__text { display: flex; flex-direction: column; gap: 24px; }
.final__h { font-size: 60px; line-height: 1.02; letter-spacing: -2px; font-weight: 900; }
.final__p { font-size: 19px; line-height: 1.55; color: rgba(255, 255, 255, .88); max-width: 480px; }
.final__list { list-style: none; margin: 8px 0 0; padding: 0; display: flex; flex-direction: column; gap: 12px; font-size: 16px; }
.final__list li { display: flex; align-items: center; gap: 10px; }
.final__call { align-self: flex-start; margin-top: 12px; padding: 16px 24px; border: 1px solid rgba(255,255,255,.5); border-radius: 999px; color: var(--white); font-weight: 600; }
.final__call:hover { color: var(--white); background: rgba(255,255,255,.1); }
.final__form { display: flex; flex-direction: column; gap: 16px; padding: 32px; background: var(--surface); color: var(--ink); border-radius: 20px; }
.final__row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.final__form label, .final__needs legend { display: flex; flex-direction: column; gap: 6px; font-size: 14px; font-weight: 500; }
.final__form input, .final__form textarea { padding: 14px; border: 1px solid var(--line-2); border-radius: 10px; font-size: 15px; font-family: inherit; resize: none; color: var(--ink); }
.final__needs { border: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.final__needs legend { margin-bottom: 8px; }
.final__needs div { display: flex; flex-wrap: wrap; gap: 8px; }
.final__needs button { padding: 9px 14px; border-radius: 999px; font-size: 14px; font-weight: 500; background: var(--surface); color: var(--ink); border: 1px solid var(--line-2); }
.final__needs button.is-on { background: var(--accent); color: var(--on-accent); border-color: var(--accent); }
.final__submit { padding: 18px; background: var(--grad-neon); color: var(--white); border: none; border-radius: 16px; box-shadow: var(--glow-neon); font-size: 16px; font-weight: 600; }
.final__submit:hover { background: var(--grad-neon-hover); }
.final__note { font-size: 12px; color: var(--muted-2); text-align: center; }

/* Footer home */
.hfoot { background: var(--deep); color: var(--dark-muted); }
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
  .hero__title { font-size: 68px; letter-spacing: -2px; }
  .wf, .why { padding-block: 96px; }
  .wf__steps, .why__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .wf__steps::before { display: none; }
  .sec-head { flex-direction: column; align-items: flex-start; }
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
  .hero { gap: 24px; padding-top: 48px; padding-bottom: 110px; }
  .hero__logo img { width: 300px; }
  .hero__title { font-size: 44px; letter-spacing: -1.2px; }
  .hero__lead { font-size: 18px; }
  .hero__ctas { width: 100%; padding-top: 0; }
  .hero__ctas .btn { padding: 20px 24px; font-size: 17px; }
  .wf, .why { padding-block: 80px; }
  .lhead { margin-bottom: 56px; }
  .lhead__h { font-size: 36px; line-height: 1.1; }
  .lhead__p { font-size: 18px; }
  .wf__steps, .why__grid { grid-template-columns: minmax(0, 1fr); }
  /* Barre du haut sur une ligne : on garde les deux arguments principaux */
  .topbar { flex-wrap: nowrap; gap: 10px; font-size: 12px; padding: 9px 12px; }
  .topbar > span:nth-last-child(-n + 2) { display: none; }
  /* Filtres : une rangée qui se fait glisser */
  .filters { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; max-width: 100%; }
  .filters::-webkit-scrollbar { display: none; }
  .filters button { flex: none; white-space: nowrap; padding: 9px 14px; }
  /* Tableau comparatif : colonne des critères figée, indication de défilement */
  .compare__hint { display: block; margin: -8px 0 10px; font-size: 13px; font-weight: 600; color: var(--accent); text-align: right; }
  .compare { min-width: 620px; font-size: 14px; }
  .compare thead th, .compare thead td, .compare tbody th, .compare tbody td { padding: 14px 14px; }
  .compare tbody th, .compare thead td { position: sticky; left: 0; z-index: 1; width: 132px; background: var(--surface); box-shadow: 1px 0 0 var(--line-soft); }
}
@media (max-width: 720px) {
  .final__h { font-size: 40px; }
  .final__box { padding: 40px 22px; }
  .final__row { grid-template-columns: minmax(0, 1fr); }
  .hfoot__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .hfoot__brand { grid-column: span 2; }
  .hfoot__tags > div > span { width: 100%; }
  .hfoot__bottom { flex-direction: column; }
}
</style>
