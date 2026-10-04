import { addTemplate, addTypeTemplate, defineNuxtModule, useLogger } from 'nuxt/kit'
import { createClient } from '@supabase/supabase-js'
import { readingMinutes, type BlogLang } from '../shared/blog'
import type { CmsData, CmsProject } from '../shared/cms'

// Articles du blog et réalisations lus dans Supabase au démarrage du build (clé publishable, lecture des seuls contenus publiés).
// Les pages restent prérendues (SEO) : après une modification dans Supabase, relancer le déploiement (voir supabase/README.md).
async function loadCms(url: string, key: string): Promise<CmsData> {
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
  const posts = await db.from('blog_posts').select('*')
  if (posts.error) throw new Error(`Supabase : ${posts.error.message}`)
  // Table projects absente (migration de l'admin pas encore exécutée) : on garde la liste de app/data/content.ts
  const projects = await db.from('projects').select('*').order('position').order('created_at')
  if (projects.error && !['PGRST205', '42P01'].includes(projects.error.code)) throw new Error(`Supabase : ${projects.error.message}`)

  return {
    posts: posts.data!.map(a => ({
      meta: {
        lang: a.lang as BlogLang, slug: a.slug, title: a.title, seoTitle: a.seo_title || a.title, description: a.description,
        date: a.date, updated: a.updated ?? undefined, sector: a.sector, service: a.service ?? undefined, tags: a.tags ?? [],
        author: a.author, cover: a.cover ?? undefined, coverAlt: a.cover_alt ?? undefined, translation: a.translation ?? undefined,
        draft: a.draft, readingMinutes: readingMinutes(a.body)
      },
      body: a.body
    })),
    projects: (projects.data ?? []).map((p): CmsProject => ({
      slug: p.slug, cat: p.cat, client: p.client, label: p.label, desc: p.description ?? '', metric: p.metric ?? '',
      bg: p.bg, fg: p.fg, img: p.img, url: p.url ?? undefined,
      en: { label: p.label_en ?? '', desc: p.description_en ?? '', metric: p.metric_en ?? '' }
    }))
  }
}

export default defineNuxtModule({
  meta: { name: 'cms' },
  async setup(_, nuxt) {
    const logger = useLogger('cms')
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_PUBLISHABLE_KEY
    // Supabase configuré mais injoignable : on arrête le build plutôt que de publier un blog incomplet.
    // En développement, on continue avec les articles locaux (ex. tables pas encore créées).
    const data = url && key
      ? await loadCms(url, key).catch((err) => {
          if (!nuxt.options.dev) throw err
          logger.warn(`${err.message} — articles locaux uniquement`)
          return null
        })
      : null
    if (data) logger.info(`Supabase : ${data.posts.length} articles, ${data.projects.length} réalisations`)
    else if (!url || !key) logger.info('Supabase non configuré : articles locaux uniquement (content/blog)')

    const tpl = addTemplate({ filename: 'cms.mjs', write: true, getContents: () => `export default ${JSON.stringify(data)}\n` })
    nuxt.options.alias['#cms'] = tpl.dst
    addTypeTemplate({
      filename: 'types/cms.d.ts',
      getContents: () => `declare module '#cms' {\n  const cms: import('../../shared/cms').CmsData | null\n  export default cms\n}\n`
    }, { nuxt: true, nitro: true, shared: true })
  }
})
