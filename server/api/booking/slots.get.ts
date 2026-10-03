import { BOOKING, candidateSlots } from '#shared/booking'

// Créneaux disponibles : règles (lun–sam, 10 h–17 h Paris, jours fériés, délai 2 h, 30 jours) moins les périodes occupées de l'agenda (kSuite ou Google).
export default defineEventHandler(async (event) => {
  if (bookingCors(event)) return
  // Agenda interrogé au plus une fois par minute : réponse gardée 60 s par le CDN, jamais par le navigateur.
  // Un créneau pris entre-temps est refusé à la réservation (409, book.ts revérifie l'agenda).
  setHeader(event, 'cache-control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=120')

  const days = candidateSlots()
  const base = { timeZone: BOOKING.timeZone, duration: BOOKING.duration }
  const provider = calendarProvider()
  // Sans agenda configuré (développement), on renvoie les créneaux théoriques
  if (!provider) return { ...base, configured: false, days }

  const all = days.flatMap(d => d.slots)
  if (!all.length) return { ...base, configured: true, days: [] }

  let busy: { start: number; end: number }[]
  try {
    busy = await provider.busy(all[0]!.start, all[all.length - 1]!.end)
  } catch (err) {
    console.error(`[booking] ${provider.name} busy`, err)
    throw createError({ statusCode: 502, statusMessage: 'Agenda indisponible' })
  }

  const free = days
    .map(d => ({ date: d.date, slots: d.slots.filter(s => !busy.some(b => Date.parse(s.start) < b.end && Date.parse(s.end) > b.start)) }))
    .filter(d => d.slots.length)
  return { ...base, configured: true, days: free }
})
