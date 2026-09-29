import { PROJECTS, SERVICES, LOCAL_PAGES } from '../../app/data/content'

// Sitemap des seules pages indexables (les pages en noindex en sont exclues).
// Prérendu en fichier statique à la génération (voir nitro.prerender.routes).
export default defineEventHandler((event) => {
  const site = useRuntimeConfig(event).public.siteUrl as string
  const today = new Date().toISOString().slice(0, 10)

  const urls: { loc: string; priority: string; changefreq: string }[] = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/services', priority: '0.9', changefreq: 'monthly' },
    ...SERVICES.map(s => ({ loc: `/services/${s.slug}`, priority: '0.9', changefreq: 'monthly' })),
    ...LOCAL_PAGES.map(l => ({ loc: `/agence-digitale/${l.slug}`, priority: '0.8', changefreq: 'monthly' })),
    { loc: '/realisations', priority: '0.8', changefreq: 'monthly' },
    // Même règle que la page projet : indexée seulement si l'étude de cas a un vrai contenu
    ...PROJECTS.filter(p => !p.desc.startsWith('[')).map(p => ({ loc: `/realisations/${p.slug}`, priority: '0.6', changefreq: 'yearly' })),
    { loc: '/agence', priority: '0.7', changefreq: 'yearly' },
    { loc: '/contact', priority: '0.7', changefreq: 'yearly' }
  ]

  const body = urls.map(u => `  <url>\n    <loc>${site}${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`).join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
})
