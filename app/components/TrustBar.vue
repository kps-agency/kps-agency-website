<template>
  <section class="container trust" :aria-labelledby="titleId">
    <div class="trust__head">
      <h2 :id="titleId" class="trust__title">{{ t.title }}</h2>
      <ul class="trust__countries" :aria-label="t.countriesLabel">
        <li v-for="c in t.countries" :key="c"><span aria-hidden="true" class="trust__pin" />{{ c }}</li>
      </ul>
    </div>

    <!-- Défilé continu des clients (liste doublée pour une boucle sans à-coup ; la copie est masquée aux lecteurs d'écran) -->
    <div class="marquee" :class="{ 'is-static': reducedMotion }">
      <div class="marquee__track">
        <ul v-for="copy in copies" :key="copy" class="marquee__list" :aria-hidden="copy === 2 ? 'true' : undefined">
          <li v-for="c in clients" :key="`${copy}-${c.slug}`">
            <NuxtLink v-if="c.logo" :to="link.project(c.slug)" class="client client--logo" :tabindex="copy === 2 ? -1 : undefined">
              <img :src="small(c.logo)" :alt="c.client" class="client__logo" height="36" loading="lazy" decoding="async">
            </NuxtLink>
            <NuxtLink v-else :to="link.project(c.slug)" class="client" :tabindex="copy === 2 ? -1 : undefined">
              <span class="client__dot" :style="{ background: DOT[c.cat] }" aria-hidden="true" />
              <span class="client__txt">
                <span class="client__name">{{ c.client }}</span>
                <span class="client__sector">{{ c.label }}</span>
              </span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <dl class="trust__stats">
      <div v-for="s in stats" :key="s.l" class="stat">
        <dt class="sr-only">{{ s.l }}</dt>
        <dd class="stat__v">{{ s.v }}<span v-if="s.star" class="stat__star" aria-hidden="true">★</span></dd>
        <dd class="stat__l">{{ s.l }}</dd>
      </div>
    </dl>

    <!-- Gages de confiance (BADGES dans app/data/content.ts) : masqués tant que la liste est vide -->
    <ul v-if="BADGES.length" class="badges" :aria-label="t.badgesLabel">
      <li v-for="b in BADGES" :key="b.label">
        <component :is="b.url ? 'a' : 'span'" :href="b.url" :target="b.url ? '_blank' : undefined" :rel="b.url ? 'noopener' : undefined" class="badge">
          <img v-if="b.img" :src="b.img" :alt="b.label" height="32" loading="lazy" decoding="async">
          <template v-else>{{ b.label }}</template>
        </component>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { BADGES, REVIEWS, REVIEWS_AVG } from '~/data/content'

const { en, link, projects, services } = useSite()
const { small } = useCloudImage()
const titleId = useId()
const DOT = { Web: 'var(--accent)', ADS: 'var(--accent-mid)', Social: 'var(--accent-light)' } as const

// Toutes les marques clientes (hors regroupement multi-marques), dans l'ordre éditorial des réalisations
const clients = computed(() => projects.value.filter(p => p.slug !== 'campagnes-beaute-sante'))

const t = useLocaleText({
  fr: {
    title: 'Ils nous ont fait confiance en France et à l’international',
    countriesLabel: 'Pays de nos clients', badgesLabel: 'Partenariats et certifications',
    countries: ['France', 'Suisse', 'Suède', 'Danemark', 'Géorgie', 'Tunisie', 'Madagascar'],
    projects: 'réalisations en ligne', rating: 'sur Google', ratingCount: 'avis', expertise: 'expertises réunies', countriesStat: 'pays servis'
  },
  en: {
    title: 'Trusted by companies in France and internationally',
    countriesLabel: 'Our clients’ countries', badgesLabel: 'Partnerships and certifications',
    countries: ['France', 'Switzerland', 'Sweden', 'Denmark', 'Georgia', 'Tunisia', 'Madagascar'],
    projects: 'projects showcased', rating: 'on Google', ratingCount: 'reviews', expertise: 'areas of expertise', countriesStat: 'countries served'
  }
})

const stats = computed(() => [
  { v: String(projects.value.length), l: t.value.projects },
  { v: en.value ? REVIEWS_AVG.toFixed(1) : REVIEWS_AVG.toFixed(1).replace('.', ','), star: true, l: `${t.value.rating} · ${REVIEWS.length} ${t.value.ratingCount}` },
  { v: String(services.value.length), l: t.value.expertise },
  { v: String(t.value.countries.length), l: t.value.countriesStat }
])

const reducedMotion = ref(false)
// La copie qui boucle le défilé n'est ajoutée que dans le navigateur : le HTML servi ne lie chaque réalisation qu'une fois
const copies = ref(1)
onMounted(() => {
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  copies.value = reducedMotion.value ? 1 : 2
})
</script>

<style scoped>
.trust { display: flex; flex-direction: column; gap: 28px; padding-top: 48px; padding-bottom: 72px; }
.trust__head { display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center; }
.trust__title { font-family: var(--font-body); font-size: 16px; font-weight: 600; color: var(--muted); letter-spacing: .2px; }
.trust__countries { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
.trust__countries li { display: inline-flex; align-items: center; gap: 7px; padding: 6px 12px; border: 1px solid var(--line); border-radius: 999px; background: var(--surface); font-size: 13px; font-weight: 500; color: var(--ink); }
.trust__pin { width: 7px; height: 7px; border-radius: 999px; background: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }

/* Défilé */
.marquee { position: relative; overflow: hidden; padding: 6px 0; -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
.marquee__track { display: flex; width: max-content; animation: trust-scroll 60s linear infinite; }
.marquee:hover .marquee__track, .marquee:focus-within .marquee__track { animation-play-state: paused; }
.marquee__list { list-style: none; margin: 0; padding: 0 12px 0 0; display: flex; gap: 12px; }
.client { display: flex; align-items: center; gap: 12px; padding: 14px 20px 14px 16px; border: 1px solid var(--line); border-radius: 16px; background: var(--surface); color: var(--ink); white-space: nowrap; transition: border-color .2s, box-shadow .2s, transform .2s; }
.client:hover { color: var(--ink); border-color: var(--accent-tint-2); box-shadow: 0 14px 28px -20px rgba(6, 182, 212, .55); transform: translateY(-2px); }
.client--logo { padding: 14px 24px; }
.client__logo { display: block; width: auto; height: 36px; max-width: 160px; object-fit: contain; }
.client__dot { flex: none; width: 10px; height: 10px; border-radius: 999px; }
.client__txt { display: flex; flex-direction: column; gap: 1px; }
.client__name { font-family: var(--font-display); font-size: 18px; font-weight: 900; letter-spacing: -.3px; line-height: 1.15; }
.client__sector { font-size: 13px; color: var(--muted-2); font-weight: 500; }
.client:hover .client__name { color: var(--accent); }
@keyframes trust-scroll { to { transform: translateX(-50%); } }
/* Mouvement réduit : liste statique sur plusieurs lignes */
.marquee.is-static { overflow-x: auto; scrollbar-width: none; -webkit-mask-image: none; mask-image: none; }
.marquee.is-static::-webkit-scrollbar { display: none; }
.marquee.is-static .marquee__track { animation: none; }
.marquee.is-static .marquee__list { padding: 0; }

/* Chiffres clés */
.trust__stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); margin: 0; border: 1px solid var(--line); border-radius: 20px; background: var(--surface); overflow: hidden; }
.stat { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 20px 16px; text-align: center; border-right: 1px solid var(--line-soft); }
.stat:last-child { border-right: none; }
.stat dd { margin: 0; }
.stat__v { font-family: var(--font-display); font-size: 32px; font-weight: 900; letter-spacing: -.8px; color: var(--ink); line-height: 1.1; }
.stat__star { margin-left: 4px; font-size: 20px; color: #C27803; vertical-align: 3px; }
.stat__l { font-size: 13px; color: var(--muted-2); }

/* Gages de confiance */
.badges { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 12px 16px; }
.badge { display: inline-flex; align-items: center; min-height: 44px; padding: 8px 16px; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); font-size: 14px; font-weight: 600; color: var(--ink); }
.badge img { display: block; width: auto; height: 32px; }
a.badge:hover { color: var(--ink); border-color: var(--accent-tint-2); }

@media (prefers-reduced-motion: reduce) {
  .marquee__track { animation: none; }
}
@media (max-width: 720px) {
  .trust { padding-top: 32px; padding-bottom: 48px; }
  .trust__stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .stat:nth-child(2) { border-right: none; }
  .stat:nth-child(-n + 2) { border-bottom: 1px solid var(--line-soft); }
  .client__name { font-size: 16px; }
  .marquee__track { animation-duration: 45s; }
}
</style>
