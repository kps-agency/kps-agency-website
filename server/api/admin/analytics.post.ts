interface Row { dimensionValues?: { value: string }[]; metricValues: { value: string }[] }
interface Report { rows?: Row[] }

const SCOPE = 'https://www.googleapis.com/auth/analytics.readonly'
const num = (r: Row | undefined, i: number) => Number(r?.metricValues[i]?.value ?? 0)
const list = (r: Report | undefined) => (r?.rows ?? []).map(row => ({ label: row.dimensionValues?.[0]?.value || '(non défini)', value: num(row, 0) }))

// Audience du site : Google Analytics 4 (Data API), lu avec le compte de service. Configuration : NUXT_GA_PROPERTY_ID.
// Ces chiffres ne comptent que les visiteurs qui ont accepté les cookies de mesure d'audience.
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const property = String(useRuntimeConfig(event).gaPropertyId || '').replace(/\D/g, '')
  if (!property) throw createError({ statusCode: 503, statusMessage: 'Google Analytics non configuré' })
  const days = periodDays((await readBody<{ days?: number }>(event))?.days)
  const range = { startDate: `${days}daysAgo`, endDate: 'yesterday' }
  const previous = { startDate: `${days * 2}daysAgo`, endDate: `${days + 1}daysAgo` }
  const top = (dimension: string, metric: string, limit = 8) => ({
    dateRanges: [range], dimensions: [{ name: dimension }], metrics: [{ name: metric }], limit,
    orderBys: [{ metric: { metricName: metric }, desc: true }]
  })
  const totals = (dateRange: object) => ({
    dateRanges: [dateRange],
    metrics: ['sessions', 'totalUsers', 'screenPageViews', 'engagementRate', 'averageSessionDuration'].map(name => ({ name }))
  })

  try {
    const token = await googleToken(SCOPE)
    const run = (requests: object[]) => $fetch<{ reports: Report[] }>(`https://analyticsdata.googleapis.com/v1beta/properties/${property}:batchRunReports`, {
      method: 'POST', headers: { authorization: `Bearer ${token}` }, body: { requests }
    })
    // Une requête groupée accepte cinq rapports au plus
    const [a, b] = await Promise.all([
      run([
        { dateRanges: [range], dimensions: [{ name: 'date' }], metrics: [{ name: 'sessions' }, { name: 'totalUsers' }], orderBys: [{ dimension: { dimensionName: 'date' } }], limit: 100 },
        totals(range), totals(previous), top('pagePath', 'screenPageViews', 10), top('sessionDefaultChannelGroup', 'sessions')
      ]),
      run([
        top('deviceCategory', 'sessions'), top('country', 'sessions'),
        // Conversions envoyées par le site (app/composables/useTrack.ts)
        { ...top('eventName', 'eventCount'), dimensionFilter: { filter: { fieldName: 'eventName', inListFilter: { values: ['generate_lead', 'book_call'] } } } }
      ])
    ])
    const sum = (r: Report | undefined) => {
      const row = r?.rows?.[0]
      return { sessions: num(row, 0), users: num(row, 1), views: num(row, 2), engagementRate: num(row, 3), avgDuration: num(row, 4) }
    }
    return {
      days,
      totals: sum(a.reports[1]), previous: sum(a.reports[2]),
      byDay: (a.reports[0]?.rows ?? []).map(r => ({ date: r.dimensionValues![0]!.value.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3'), sessions: num(r, 0), users: num(r, 1) })),
      pages: list(a.reports[3]), channels: list(a.reports[4]),
      devices: list(b.reports[0]), countries: list(b.reports[1]), events: list(b.reports[2])
    }
  } catch (err) {
    throw googleError(err, 'Google Analytics')
  }
})
