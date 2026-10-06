<template>
  <div v-if="author">
    <section class="container who">
      <Breadcrumb :items="[{ label: t.home, to: link.home() }, { label: 'Blog', to: link.blog() }, { label: author.name }]" />
      <div class="who__card">
        <img v-if="member?.photo" :src="member.photo" :alt="author.name" class="who__photo" width="160" height="160">
        <span v-else class="who__photo who__photo--ini" aria-hidden="true">{{ initials }}</span>
        <div class="who__txt">
          <div class="eyebrow">{{ t.eyebrow }}</div>
          <h1 class="who__h1">{{ author.name }}</h1>
          <p class="who__role">{{ author.role }}</p>
          <p v-if="member?.bio" class="who__bio">{{ member.bio[lang] }}</p>
          <div class="who__links">
            <NuxtLink :to="link.about()" class="btn btn--ghost btn--sm">{{ t.team }}</NuxtLink>
            <a v-if="member?.linkedin" :href="member.linkedin" target="_blank" rel="noopener" class="btn btn--ghost btn--sm">LinkedIn ↗</a>
          </div>
        </div>
      </div>
    </section>

    <section class="container posts">
      <h2 class="h2 h2--48 posts__h">{{ t.articles }} <small>{{ articles.length }}</small></h2>
      <ul class="posts__list">
        <li v-for="a in articles" :key="a.slug">
          <NuxtLink :to="link.article(a.slug)" class="post">
            <span class="post__meta">{{ date(a.updated ?? a.date) }} · {{ a.readingMinutes }} min</span>
            <h3 class="post__t">{{ a.title }}</h3>
            <p class="post__d">{{ a.description }}</p>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <CtaBand :title="t.ctaTitle" :label="t.ctaLabel" />
  </div>
</template>

<script setup lang="ts">
// Page d'un auteur du blog : qui écrit, à quel titre, et ses articles. Les auteurs sont ceux de AUTHORS (app/data/content.ts),
// la bio, la photo et le lien LinkedIn viennent de sa fiche d'équipe (TEAM) quand elle existe.
import { AUTHORS, TEAM, authorSlug } from '~/data/content'
import { blogArticles } from '~/data/blog'

const route = useRoute()
const { en, link } = useSite()
const lang = computed(() => (en.value ? 'en' : 'fr'))

const name = Object.keys(AUTHORS).find(n => authorSlug(n) === String(route.params.slug))
if (!name) throw createError({ statusCode: 404, statusMessage: 'Auteur introuvable', fatal: true })
// Même adresse dans les deux langues (le nom ne se traduit pas)
useSetI18nParams()({ fr: { slug: authorSlug(name) }, en: { slug: authorSlug(name) } })

const author = computed(() => ({ name, role: AUTHORS[name]![lang.value] }))
const member = TEAM.find(m => m.name === name)
const initials = name.split(/\s+/).map(w => w.charAt(0)).join('').slice(0, 2).toUpperCase()
const articles = computed(() => blogArticles(lang.value).filter(a => a.author === name))
const date = (d: string) => new Date(d).toLocaleDateString(en.value ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

const t = useLocaleText({
  fr: { home: 'Accueil', eyebrow: 'Auteur', team: 'Découvrir l’équipe', articles: 'Ses articles', ctaTitle: 'Une question sur votre projet ?', ctaLabel: 'Parler de votre projet' },
  en: { home: 'Home', eyebrow: 'Author', team: 'Meet the team', articles: 'Articles', ctaTitle: 'A question about your project?', ctaLabel: 'Discuss your project' }
})

const site = useRuntimeConfig().public.siteUrl as string
usePageSeo({
  title: () => `${name}, ${author.value.role}`,
  description: () => (en.value
    ? `${name}, ${author.value.role}: read the ${articles.value.length} articles published on the KPS Agency blog about websites, SEO, AI visibility and digital marketing.`
    : `${name}, ${author.value.role} : retrouvez ses ${articles.value.length} articles publiés sur le blog de KPS Agency, sur les sites web, le référencement, la visibilité IA et le marketing digital.`)
})
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: () => {
      const url = `${site}${link.author(name)}`
      return JSON.stringify({
        '@context': 'https://schema.org', '@type': 'ProfilePage', '@id': `${url}#webpage`, url, inLanguage: en.value ? 'en-GB' : 'fr-FR',
        mainEntity: {
          '@type': 'Person', '@id': `${site}${authorPath(name)}#person`, name, jobTitle: author.value.role, url,
          worksFor: { '@id': `${site}/#organization` },
          ...(member?.bio ? { description: member.bio[lang.value] } : {}),
          ...(member?.photo ? { image: `${site}${member.photo}` } : {}),
          ...(member?.linkedin ? { sameAs: [member.linkedin] } : {})
        }
      })
    }
  }]
})
// Identifiant de la personne : l'adresse française, commune aux deux langues
function authorPath(n: string) { return `/blog/auteur/${authorSlug(n)}` }
</script>

<style scoped>
.who { display: flex; flex-direction: column; gap: 40px; padding-top: 40px; padding-bottom: 64px; }
.who__card { display: flex; align-items: flex-start; gap: 40px; }
.who__photo { flex: none; width: 160px; height: 160px; border-radius: 28px; object-fit: cover; }
.who__photo--ini { display: flex; align-items: center; justify-content: center; background: var(--accent-soft); color: var(--accent); font-family: var(--font-display); font-size: 56px; font-weight: 900; }
.who__txt { display: flex; flex-direction: column; gap: 12px; max-width: 760px; }
.who__h1 { font-size: 64px; line-height: 1.02; letter-spacing: -2px; font-weight: 900; }
.who__role { font-size: 20px; font-weight: 600; color: var(--accent); }
.who__bio { font-size: 18px; line-height: 1.65; color: var(--muted); }
.who__links { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 8px; }
.posts { padding-bottom: var(--section-y); }
.posts__h { margin-bottom: 32px; }
.posts__h small { font-size: 20px; font-weight: 600; letter-spacing: 0; color: var(--muted-2); -webkit-text-fill-color: var(--muted-2); }
.posts__list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
.post { display: flex; flex-direction: column; gap: 10px; height: 100%; padding: 28px; background: var(--surface); border: 1px solid var(--line); border-radius: 20px; color: var(--ink); transition: transform .2s ease, border-color .2s; }
.post:hover { color: var(--ink); transform: translateY(-2px); border-color: var(--accent-tint-2); }
.post__meta { font-size: 13px; font-weight: 600; color: var(--muted-2); }
.post__t { font-size: 22px; line-height: 1.25; letter-spacing: -.4px; font-weight: 700; }
.post:hover .post__t { color: var(--accent); }
.post__d { font-size: 16px; line-height: 1.55; color: var(--muted); }

@media (max-width: 1180px) {
  .who__h1 { font-size: 48px; letter-spacing: -1.4px; }
}
@media (max-width: 720px) {
  .who__card { flex-direction: column; gap: 24px; }
  .who__photo { width: 112px; height: 112px; border-radius: 20px; }
  .who__photo--ini { font-size: 40px; }
  .who__h1 { font-size: 36px; letter-spacing: -1px; }
  .posts__list { grid-template-columns: minmax(0, 1fr); }
  .post { padding: 22px; }
}
</style>
