import { BOOKING, candidateSlots } from '#shared/booking'

// Créneaux disponibles : règles (lun–sam, 10 h–17 h Paris, jours fériés, délai 2 h, 30 jours) moins les périodes occupées de Google Agenda.
export default defineEventHandler(async (event) => {
  if (bookingCors(event)) return
  setHeader(event, 'cache-control', 'no-store')

  const days = candidateSlots()
  const base = { timeZone: BOOKING.timeZone, duration: BOOKING.duration }
  const cfg = googleConfig()
  // Sans configuration Google (développement), on renvoie les créneaux théoriques
  if (!cfg) return { ...base, configured: false, days }

  const all = days.flatMap(d => d.slots)
  if (!all.length) return { ...base, configured: true, days: [] }

  let busy: { start: number; end: number }[]
  try {
    busy = await busyPeriods(cfg, all[0]!.start, all[all.length - 1]!.end)
  } catch (err) {
    console.error('[booking] freeBusy', err)
    throw createError({ statusCode: 502, statusMessage: 'Agenda indisponible' })
  }

  const free = days
    .map(d => ({ date: d.date, slots: d.slots.filter(s => !busy.some(b => Date.parse(s.start) < b.end && Date.parse(s.end) > b.start)) }))
    .filter(d => d.slots.length)
  return { ...base, configured: true, days: free }
})
