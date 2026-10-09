import cms from '#cms'
import { AUTHORS, PROJECTS, SERVICES, LOCAL_PAGES, authorSlug, isCaseStudy } from '../../app/data/content'
import { LOCAL_SLUG_EN, SERVICE_SLUG_EN, projectEn } from '../../app/data/content.en'
import { LASTMOD, latest } from '../../app/data/lastmod'

// Sitemaps bilingues des seules pages indexables : les pages en noindex (pages légales, remerciement, réalisations sans étude de cas),
// la pagination du blog, /admin et /api en sont exclus. Tout est calculé à partir des contenus, sans liste d'URL à tenir à jour.
// Chaque URL déclare ses alternatives fr / en / x-default (mêmes codes que les balises hreflang du <head>) ;
// une page sans traduction indexable n'en déclare aucune.

export const SITEMAPS = ['pages', 'services', 'realisations', 'blog'] as const
export type SitemapName = typeof SITEMAPS[number]

/** Une URL du sitemap, avec les chemins de ses versions FR et EN ('' = pas de version indexable dans cette langue) */
interface Entry { loc: string; fr: string; en: string; lastmod?: string }

/** Une page traduite donne deux URL, qui se déclarent l'une l'autre */
const pair = (fr: string, en: string, lastmod?: string): Entry[] => [fr, en].filter(Boolean).map(loc => ({ loc, fr, en, lastmod }))

async function entries(name: SitemapName): Promise<Entry[]> {
  const d = LASTMOD
  if (name === 'pages') {
    return [
      ...pair('/', '/en', d.pages.index),
      ...LOCAL_PAGES.flatMap(l => pair(`/agence-digitale/${l.slug}`, `/en/digital-agency/${LOCAL_SLUG_EN[l.slug]}`, d.local[l.slug])),
      ...pair('/agence', '/en/about', d.pages.agence),
      ...pair('/rendez-vous', '/en/book-a-call', d.pages['rendez-vous']),
      ...pair('/audit-gratuit', '/en/free-audit', d.pages['audit-gratuit']),
      ...pair('/contact', '/en/contact', d.pages.contact)
    ]
  }
  if (name === 'services') {
    const list = SERVICES.flatMap(s => pair(`/services/${s.slug}`, `/en/services/${SERVICE_SLUG_EN[s.slug]}`, latest(d.services[s.slug], cms?.servicesUpdated?.[s.slug])))
    return [...pair('/services', '/en/services', latest(d.pages.services, ...list.map(e => e.lastmod))), ...list]
  }
  if (name === 'realisations') {
    // Même règle que la page projet, évaluée dans chaque langue : une version en noindex n'est ni listée ni déclarée en alternative
    const list = PROJECTS.flatMap(p => pair(isCaseStudy(p) ? `/realisations/${p.slug}` : '', isCaseStudy(projectEn(p)) ? `/en/work/${p.slug}` : '', latest(p.updated)))
    return [...pair('/realisations', '/en/work', latest(d.pages.realisations, ...PROJECTS.map(p => p.updated))), ...list]
  }
  // Blog : la traduction n'est déclarée que si elle est publiée ; lastmod = date de mise à jour de chaque article
  const articles = await serverArticles()
  const path = (lang: string, slug: string) => (lang === 'en' ? `/en/blog/${slug}` : `/blog/${slug}`)
  const has = (lang: string, slug?: string) => !!slug && articles.some(a => a.lang === lang && a.slug === slug)
  const newest = (author?: string) => latest(...articles.filter(a => !author || a.author === author).map(a => a.updated ?? a.date))
  return [
    ...pair('/blog', '/en/blog', newest()),
    ...Object.keys(AUTHORS).flatMap(n => pair(`/blog/auteur/${authorSlug(n)}`, `/en/blog/author/${authorSlug(n)}`, latest(d.pages.auteur, newest(n)))),
    ...articles.map((a): Entry => {
      const self = path(a.lang, a.slug)
      const otherLang = a.lang === 'en' ? 'fr' : 'en'
      const other = has(otherLang, a.translation) ? path(otherLang, a.translation!) : ''
      return { loc: self, fr: a.lang === 'fr' ? self : other, en: a.lang === 'en' ? self : other, lastmod: a.updated ?? a.date }
    })
  ]
}

const xml = (body: string) => `<?xml version="1.0" encoding="UTF-8"?>\n${body}\n`

/** Un sous-sitemap (/sitemap-<nom>.xml) */
export async function sitemapXml(site: string, name: SitemapName) {
  const urls = (await entries(name)).map(e => [
    '  <url>',
    `    <loc>${site}${e.loc}</loc>`,
    ...(e.fr && e.en
      ? [
          `    <xhtml:link rel="alternate" hreflang="fr" href="${site}${e.fr}"/>`,
          `    <xhtml:link rel="alternate" hreflang="en" href="${site}${e.en}"/>`,
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${site}${e.fr}"/>`
        ]
      : []),
    ...(e.lastmod ? [`    <lastmod>${e.lastmod}</lastmod>`] : []),
    '  </url>'
  ].join('\n'))
  return xml(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>`)
}

/** Index des sous-sitemaps (/sitemap.xml) ; lastmod = contenu le plus récent de chaque sous-sitemap */
export async function sitemapIndexXml(site: string) {
  const items = await Promise.all(SITEMAPS.map(async (name) => {
    const lastmod = latest(...(await entries(name)).map(e => e.lastmod))
    return ['  <sitemap>', `    <loc>${site}/sitemap-${name}.xml</loc>`, ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []), '  </sitemap>'].join('\n')
  }))
  return xml(`<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items.join('\n')}\n</sitemapindex>`)
}
