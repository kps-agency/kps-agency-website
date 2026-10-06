import { AUTHORS, PROJECTS, SERVICES, LOCAL_PAGES, authorSlug, isCaseStudy } from '../../app/data/content'
import { LOCAL_SLUG_EN, SERVICE_SLUG_EN } from '../../app/data/content.en'

// Sitemap bilingue des seules pages indexables (les pages en noindex en sont exclues).
// Chaque URL déclare ses alternatives fr / en / x-default (hreflang). Prérendu en fichier statique.
export default defineEventHandler(async (event) => {
  const site = useRuntimeConfig(event).public.siteUrl as string

  // [chemin FR, chemin EN]. Pas de <lastmod> sur ces pages : leur date de modification réelle n'est pas connue,
  // et Google n'utilise cette balise que si elle est fiable. <changefreq> et <priority> sont ignorés par Google.
  const pages: [string, string][] = [
    ['/', '/en'],
    ['/services', '/en/services'],
    ...SERVICES.map(s => [`/services/${s.slug}`, `/en/services/${SERVICE_SLUG_EN[s.slug]}`] as [string, string]),
    ...LOCAL_PAGES.map(l => [`/agence-digitale/${l.slug}`, `/en/digital-agency/${LOCAL_SLUG_EN[l.slug]}`] as [string, string]),
    ['/realisations', '/en/work'],
    // Même règle que la page projet : indexée seulement si c'est une vraie étude de cas
    ...PROJECTS.filter(isCaseStudy).map(p => [`/realisations/${p.slug}`, `/en/work/${p.slug}`] as [string, string]),
    ['/agence', '/en/about'],
    ['/rendez-vous', '/en/book-a-call'],
    ['/audit-gratuit', '/en/free-audit'],
    ['/blog', '/en/blog'],
    ...Object.keys(AUTHORS).map(n => [`/blog/auteur/${authorSlug(n)}`, `/en/blog/author/${authorSlug(n)}`] as [string, string]),
    ['/contact', '/en/contact']
  ]

  const url = (loc: string, fr: string, en: string) => [
    '  <url>',
    `    <loc>${site}${loc}</loc>`,
    `    <xhtml:link rel="alternate" hreflang="fr-FR" href="${site}${fr}"/>`,
    `    <xhtml:link rel="alternate" hreflang="en" href="${site}${en}"/>`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${site}${fr}"/>`,
    '  </url>'
  ].join('\n')

  // Articles : hreflang seulement si la traduction existe ; lastmod = date de mise à jour
  const articles = await serverArticles()
  const has = (lang: string, slug?: string) => !!slug && articles.some(a => a.lang === lang && a.slug === slug)
  const articleUrls = articles.map((a) => {
    const self = a.lang === 'en' ? `/en/blog/${a.slug}` : `/blog/${a.slug}`
    const other = has(a.lang === 'en' ? 'fr' : 'en', a.translation) ? (a.lang === 'en' ? `/blog/${a.translation}` : `/en/blog/${a.translation}`) : ''
    const fr = a.lang === 'fr' ? self : other
    const en = a.lang === 'en' ? self : other
    return [
      '  <url>',
      `    <loc>${site}${self}</loc>`,
      ...(fr ? [`    <xhtml:link rel="alternate" hreflang="fr-FR" href="${site}${fr}"/>`] : []),
      ...(en ? [`    <xhtml:link rel="alternate" hreflang="en" href="${site}${en}"/>`] : []),
      ...(fr && en ? [`    <xhtml:link rel="alternate" hreflang="x-default" href="${site}${fr}"/>`] : []),
      `    <lastmod>${a.updated ?? a.date}</lastmod>`,
      '  </url>'
    ].join('\n')
  })

  const body = [...pages.flatMap(([fr, en]) => [url(fr, fr, en), url(en, fr, en)]), ...articleUrls].join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${body}\n</urlset>\n`
})
