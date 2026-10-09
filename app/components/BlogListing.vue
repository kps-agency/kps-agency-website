<template>
  <div>
    <section class="container head">
      <Breadcrumb :items="[{ label: t.home, to: link.home() }, { label: 'Blog' }]" />
      <h1 class="eyebrow">{{ t.h1seo }}<template v-if="page > 1"> · {{ t.page }} {{ page }}</template></h1>
      <p class="head__h1 display">{{ t.h1 }}</p>
      <p class="lead head__lead">{{ t.lead }}</p>
    </section>

    <section class="container list">
      <div v-if="sectors.length > 1" class="filters" role="group" :aria-label="t.filterLabel">
        <button type="button" :aria-pressed="sector === 'all'" :class="{ 'is-on': sector === 'all' }" @click="sector = 'all'">{{ t.all }}</button>
        <button v-for="s in sectors" :key="s" type="button" :aria-pressed="sector === s" :class="{ 'is-on': sector === s }" @click="sector = s">{{ sectorLabel(s) }}</button>
      </div>

      <div v-if="shown.length" class="posts">
        <article v-for="(a, i) in shown" :key="a.slug" class="post" :class="{ 'post--featured': i === 0 && sector === 'all' && page === 1 }">
          <div class="post__link card-link">
            <div class="post__visual">
              <picture v-if="a.cover" style="display: contents">
                <source v-if="avifSet(a.cover)" type="image/avif" :srcset="avifSet(a.cover)" :sizes="coverSizes(i)">
                <img :src="image(a.cover)" :srcset="cardSet(a.cover) || undefined" :sizes="cardSet(a.cover) ? coverSizes(i) : undefined" :alt="a.coverAlt || ''" :loading="i === 0 ? undefined : 'lazy'" :fetchpriority="i === 0 ? 'high' : undefined" decoding="async" width="1600" height="900">
              </picture>
              <span v-else class="post__placeholder" aria-hidden="true">{{ sectorLabel(a.sector) }}</span>
            </div>
            <div class="post__body">
              <div class="post__meta"><span class="post__sector">{{ sectorLabel(a.sector) }}</span><span>{{ formatDate(a.date) }} · {{ a.readingMinutes }} min</span></div>
              <h2 class="post__title"><NuxtLink :to="link.article(a.slug)" class="card-link__a">{{ a.title }}</NuxtLink></h2>
              <p class="post__desc">{{ a.description }}</p>
              <span class="post__more">{{ t.read }} →</span>
            </div>
          </div>
        </article>
      </div>
      <p v-else class="empty">{{ t.empty }}</p>

      <!-- Pagination : de vrais liens, une URL par page (/blog, /blog/page/2…) -->
      <nav v-if="sector === 'all' && pages > 1" class="pager" :aria-label="t.pager">
        <NuxtLink v-if="page > 1" :to="link.blogPage(page - 1)" class="pager__step" rel="prev">← {{ t.prev }}</NuxtLink>
        <span v-else class="pager__step is-off" aria-hidden="true">← {{ t.prev }}</span>
        <ol class="pager__nums">
          <li v-for="n in pages" :key="n">
            <NuxtLink :to="link.blogPage(n)" class="pager__num" :class="{ 'is-on': n === page }" :aria-current="n === page ? 'page' : undefined" :aria-label="`${t.page} ${n}`">{{ n }}</NuxtLink>
          </li>
        </ol>
        <NuxtLink v-if="page < pages" :to="link.blogPage(page + 1)" class="pager__step" rel="next">{{ t.next }} →</NuxtLink>
        <span v-else class="pager__step is-off" aria-hidden="true">{{ t.next }} →</span>
      </nav>
    </section>

    <CtaBand :title="t.ctaTitle" :text="t.ctaText" :label="t.ctaLabel" :to="link.booking()" />
  </div>
</template>

<script setup lang="ts">
import { BLOG_SECTORS } from '#shared/blog'
import { blogArticles } from '~/data/blog'

const props = defineProps<{ page: number }>()
const { en, locale, link } = useSite()
const { image, avifSet, cardSet } = useCloudImage()
// Largeur affichée d'une couverture : la carte « à la une » occupe 55 % de la grille, les autres une colonne sur trois
const coverSizes = (i: number) => (i === 0 && sector.value === 'all' && props.page === 1
  ? '(max-width: 1180px) 100vw, 700px'
  : '(max-width: 720px) 100vw, (max-width: 1180px) 50vw, 420px')
const t = useLocaleText({
  fr: {
    home: 'Accueil', h1seo: 'Le blog de KPS Agency : conseils web, SEO et publicité', h1: 'Conseils digitaux, secteur par secteur.',
    lead: 'Site web, référencement, publicité, réseaux sociaux : nos conseils concrets pour développer votre activité en ligne, adaptés aux enjeux de votre secteur.',
    filterLabel: 'Filtrer par secteur', page: 'page', pager: 'Pages du blog', prev: 'Articles plus récents', next: 'Articles plus anciens', all: 'Tous les articles', read: 'Lire l’article', empty: 'Les premiers articles arrivent bientôt.',
    ctaTitle: 'Une question sur votre projet ?', ctaText: '30 minutes pour faire le point sur vos priorités digitales, gratuitement et sans engagement.', ctaLabel: 'Réserver un appel',
    title: 'Blog : conseils digitaux par secteur', desc: 'Conseils concrets en création de site web, SEO & GEO, publicité en ligne et social media, adaptés à votre secteur : énergie, immobilier, santé, finance, B2B…'
  },
  en: {
    home: 'Home', h1seo: 'The KPS Agency blog: web, SEO and advertising advice', h1: 'Digital advice, industry by industry.',
    lead: 'Websites, SEO, paid ads, social media: practical advice to grow your business online, tailored to the challenges of your industry.',
    filterLabel: 'Filter by industry', page: 'page', pager: 'Blog pages', prev: 'Newer articles', next: 'Older articles', all: 'All articles', read: 'Read the article', empty: 'Our first articles are coming soon.',
    ctaTitle: 'A question about your project?', ctaText: '30 minutes to review your digital priorities, free and with no commitment.', ctaLabel: 'Book a call',
    title: 'Blog: digital marketing advice by industry', desc: 'Practical advice on website design, SEO & GEO, paid advertising and social media, tailored to your industry: energy, real estate, healthcare, finance, B2B…'
  }
})

const articles = computed(() => blogArticles(locale.value as 'fr' | 'en'))
const sectors = computed(() => [...new Set(articles.value.map(a => a.sector))])
const sector = ref('all')
// Première page : l’article mis en avant + 9 cartes ; pages suivantes : 12 cartes
const FIRST = 10
const NEXT = 12
const pages = computed(() => 1 + Math.ceil(Math.max(0, articles.value.length - FIRST) / NEXT))
if (!Number.isInteger(props.page) || props.page < 1 || props.page > pages.value) throw createError({ statusCode: 404, statusMessage: 'Page introuvable', fatal: true })
const start = computed(() => (props.page === 1 ? 0 : FIRST + (props.page - 2) * NEXT))
// Un filtre par secteur porte sur tous les articles : la pagination ne s'applique qu'à la liste complète
const shown = computed(() => (sector.value === 'all'
  ? articles.value.slice(start.value, start.value + (props.page === 1 ? FIRST : NEXT))
  : articles.value.filter(a => a.sector === sector.value)))
const sectorLabel = (s: string) => BLOG_SECTORS[s]?.[en.value ? 'en' : 'fr'] ?? s
const formatDate = (d: string) => new Intl.DateTimeFormat(en.value ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${d}T12:00:00Z`))

const suffix = computed(() => (props.page > 1 ? ` – ${t.value.page} ${props.page}` : ''))
usePageSeo({ title: () => t.value.title + suffix.value, description: () => (props.page > 1 ? `${t.value.title}${suffix.value}. ` : '') + t.value.desc })
const site = useRuntimeConfig().public.siteUrl as string
useHead({
  link: [{ rel: 'alternate', type: 'application/rss+xml', title: 'KPS Agency — Blog', href: () => `${site}${en.value ? '/en' : ''}/blog/rss.xml` }],
  // Données structurées du blog : sur la première page seulement
  script: props.page > 1 ? [] : [{
    type: 'application/ld+json',
    innerHTML: () => JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Blog', '@id': `${site}${link.blog()}#blog`, url: `${site}${link.blog()}`,
      name: t.value.title, description: t.value.desc, inLanguage: en.value ? 'en-GB' : 'fr-FR', publisher: { '@id': `${site}/#organization` },
      blogPost: articles.value.map(a => ({ '@type': 'BlogPosting', headline: a.title, url: `${site}${link.article(a.slug)}`, datePublished: a.date }))
    })
  }]
})
</script>

<style scoped>
.head { display: flex; flex-direction: column; gap: 20px; padding-top: 40px; padding-bottom: 48px; }
.head__h1 { font-size: 72px; line-height: 1.02; letter-spacing: -2.4px; font-weight: 900; max-width: 980px; margin-top: 16px; }
.head__lead { max-width: 760px; }
.list { padding-bottom: var(--section-y); }
.filters { display: flex; flex-wrap: wrap; gap: 8px; padding: 6px; margin-bottom: 32px; width: fit-content; max-width: 100%; background: var(--surface); border: 1px solid var(--line); border-radius: 999px; }
.filters button { padding: 10px 18px; border: none; border-radius: 999px; font-size: 14px; font-weight: 600; background: transparent; color: var(--muted); white-space: nowrap; }
.filters button.is-on { background: var(--deep); color: var(--white); }
.posts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
.post { display: flex; }
.post__link { display: flex; flex-direction: column; width: 100%; background: var(--surface); border: 1px solid var(--line); border-radius: 20px; overflow: hidden; color: var(--ink); transition: transform .2s, box-shadow .2s; }
.post__link:hover { color: var(--ink); transform: translateY(-3px); box-shadow: 0 24px 48px -28px rgba(0, 0, 0, .35); }
.post__visual { aspect-ratio: 16 / 9; overflow: hidden; background: var(--accent-soft); }
.post__visual img { width: 100%; height: 100%; object-fit: cover; object-position: top center; transition: transform .4s; }
.post__link:hover .post__visual img { transform: scale(1.04); }
.post__placeholder { display: flex; align-items: center; justify-content: center; height: 100%; font-family: var(--font-display); font-size: 24px; font-weight: 900; color: var(--accent); background: linear-gradient(135deg, var(--accent-soft), var(--accent-tint)); }
.post__body { display: flex; flex-direction: column; gap: 10px; padding: 24px; flex-grow: 1; }
.post__meta { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; font-size: 13px; color: var(--muted-2); }
.post__sector { padding: 4px 10px; border-radius: 999px; background: var(--accent-soft); color: var(--accent); font-weight: 600; }
.post__title { font-size: 20px; line-height: 1.25; letter-spacing: -.4px; font-weight: 700; }
.post__desc { font-size: 16px; line-height: 1.55; color: var(--muted); display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.post__more { margin-top: auto; padding-top: 8px; font-size: 14px; font-weight: 600; color: var(--accent); }
/* Article le plus récent mis en avant */
.post--featured { grid-column: 1 / -1; }
.post--featured .post__link { flex-direction: row; }
.post--featured .post__visual { flex: 0 0 55%; aspect-ratio: auto; min-height: 340px; }
.post--featured .post__body { padding: 40px; justify-content: center; }
.post--featured .post__title { font-size: 32px; letter-spacing: -.8px; }
.pager { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-top: 48px; padding-top: 32px; border-top: 1px solid var(--line); }
.pager__nums { list-style: none; margin: 0; padding: 0; display: flex; gap: 8px; }
.pager__num { display: flex; align-items: center; justify-content: center; min-width: 44px; height: 44px; padding: 0 12px; border-radius: 12px; border: 1px solid var(--line); background: var(--surface); color: var(--ink); font-size: 15px; font-weight: 600; }
.pager__num:hover { border-color: var(--accent); color: var(--ink); }
.pager__num.is-on { background: var(--accent); border-color: var(--accent); color: var(--on-accent); }
.pager__step { display: inline-flex; align-items: center; min-height: 44px; font-size: 15px; font-weight: 600; color: var(--accent-light); }
.pager__step.is-off { visibility: hidden; }
.empty { padding: 48px; text-align: center; color: var(--muted); background: var(--surface); border: 1px dashed var(--line-3); border-radius: 20px; }
@media (max-width: 1180px) {
  .head__h1 { font-size: 52px; letter-spacing: -1.8px; }
  .posts { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .post--featured .post__link { flex-direction: column; }
  .post--featured .post__visual { flex: none; aspect-ratio: 16 / 9; min-height: 0; }
  .post--featured .post__body { padding: 28px; }
  .post--featured .post__title { font-size: 28px; }
}
@media (max-width: 720px) {
  .pager { flex-wrap: wrap; justify-content: center; }
  .pager__nums { order: -1; width: 100%; justify-content: center; }
  .head__h1 { font-size: 40px; letter-spacing: -1.2px; }
  .posts { grid-template-columns: minmax(0, 1fr); }
  .filters { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; }
  .filters::-webkit-scrollbar { display: none; }
  .post__title, .post--featured .post__title { font-size: 21px; }
  .post__body, .post--featured .post__body { padding: 20px; }
}
</style>
