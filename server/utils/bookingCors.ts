import type { H3Event } from 'h3'

// L'API peut être hébergée ailleurs que le site statique (ex. Vercel) : on n'autorise que les origines du site.
export function bookingCors(event: H3Event) {
  const c = useRuntimeConfig()
  const site = c.public.siteUrl as string
  const extra = String(c.bookingAllowedOrigins || '').split(',').map(s => s.trim()).filter(Boolean)
  const origins = [site, site.replace('https://', 'https://www.'), 'http://localhost:3000', ...extra]
  return handleCors(event, { origin: origins, methods: ['GET', 'POST', 'OPTIONS'], allowHeaders: ['content-type'], maxAge: '86400' })
}

// Limite simple anti-abus (mémoire du processus) : N requêtes par IP et par fenêtre
const hits = new Map<string, number[]>()
export function rateLimited(event: H3Event, max = 5, windowMs = 10 * 60_000) {
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const now = Date.now()
  const list = (hits.get(ip) || []).filter(t => now - t < windowMs)
  list.push(now)
  hits.set(ip, list)
  return list.length > max
}
