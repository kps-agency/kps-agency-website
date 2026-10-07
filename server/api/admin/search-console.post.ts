interface Row { keys?: string[]; clicks: number; impressions: number; ctr: number; position: number }

const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly'
// Search Console publie ses données avec deux à trois jours de retard
const LAG = 3

// Référencement : Google Search Console (clics, impressions, position), lu avec le compte de service.
// Configuration : NUXT_GSC_SITE_URL (ex. « sc-domain:kps-agency.com » ou « https://kps-agency.com/ »).
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const site = String(useRuntimeConfig(event).gscSiteUrl || '')
  if (!site) throw createError({ statusCode: 503, statusMessage: 'Search Console non configurée' })
  const days = periodDays((await readBody<{ days?: number }>(event))?.days)
  const range = { startDate: dayAgo(days + LAG - 1), endDate: dayAgo(LAG) }
  const previous = { startDate: dayAgo(days * 2 + LAG - 1), endDate: dayAgo(days + LAG) }

  try {
    const token = await googleToken(SCOPE)
    const query = (body: object) => $fetch<{ rows?: Row[] }>(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`, {
      method: 'POST', headers: { authorization: `Bearer ${token}` }, body
    }).then(r => r.rows ?? [])
    const [byDay, now, before, queries, pages] = await Promise.all([
      query({ ...range, dimensions: ['date'] }),
      query(range), query(previous),
      query({ ...range, dimensions: ['query'], rowLimit: 15 }),
      query({ ...range, dimensions: ['page'], rowLimit: 10 })
    ])
    const sum = (r: Row | undefined) => ({ clicks: r?.clicks ?? 0, impressions: r?.impressions ?? 0, ctr: r?.ctr ?? 0, position: r?.position ?? 0 })
    const rows = (list: Row[]) => list.map(r => ({ label: r.keys![0]!, ...sum(r) }))
    return {
      days, totals: sum(now[0]), previous: sum(before[0]),
      byDay: byDay.map(r => ({ date: r.keys![0]!, clicks: r.clicks, impressions: r.impressions })),
      queries: rows(queries), pages: rows(pages)
    }
  } catch (err) {
    throw googleError(err, 'Search Console')
  }
})
