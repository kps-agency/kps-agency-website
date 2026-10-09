// Index des sitemaps (server/utils/sitemap.ts). Prérendu en fichier statique.
export default defineEventHandler(async (event) => {
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return sitemapIndexXml(useRuntimeConfig(event).public.siteUrl as string)
})
