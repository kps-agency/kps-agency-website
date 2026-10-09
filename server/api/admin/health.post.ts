// État du site : les adresses clés répondent-elles, et en combien de temps ? (mesuré depuis le serveur)
const PATHS = ['/', '/en', '/services', '/realisations', '/blog', '/contact', '/sitemap.xml', '/robots.txt', '/llms.txt', '/blog/rss.xml']

// /sitemap.xml est un index : on additionne les adresses de chaque sous-sitemap
async function sitemapUrlCount(index: string) {
  const subs = [...index.matchAll(/<loc>([^<]+\.xml)<\/loc>/g)].map(m => m[1]!)
  const counts = await Promise.all(subs.map(async (u) => {
    const res = await fetch(u, { signal: AbortSignal.timeout(8000), headers: { 'user-agent': 'KPS-Admin-HealthCheck' } }).catch(() => null)
    return res?.ok ? ((await res.text()).match(/<loc>/g) ?? []).length : 0
  }))
  return counts.reduce((a, b) => a + b, 0)
}

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const site = String(useRuntimeConfig(event).public.siteUrl).replace(/\/$/, '')
  const checks = await Promise.all(PATHS.map(async (path) => {
    const started = Date.now()
    try {
      const res = await fetch(site + path, { redirect: 'manual', signal: AbortSignal.timeout(8000), headers: { 'user-agent': 'KPS-Admin-HealthCheck' } })
      const body = res.ok ? await res.text() : ''
      // Sitemap : nombre d'adresses déclarées à Google
      const urls = path === '/sitemap.xml' ? await sitemapUrlCount(body) : undefined
      return { path, status: res.status, ok: res.ok, ms: Date.now() - started, urls }
    } catch {
      return { path, status: 0, ok: false, ms: Date.now() - started, urls: undefined }
    }
  }))
  return { site, checkedAt: new Date().toISOString(), checks }
})
