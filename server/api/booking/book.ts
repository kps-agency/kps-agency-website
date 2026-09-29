import { BOOKING, isValidSlotStart } from '#shared/booking'

interface BookingBody {
  start?: string; name?: string; email?: string; phone?: string; company?: string
  mode?: 'visio' | 'phone'; message?: string; locale?: 'fr' | 'en'; website?: string // website = champ piège anti-spam
}

const clean = (v: unknown, max: number) => String(v ?? '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, max)

// Réservation : valide le créneau, revérifie la disponibilité (anti double réservation) puis crée l'événement Google Agenda.
export default defineEventHandler(async (event) => {
  if (bookingCors(event)) return // requête de pré-vérification CORS (OPTIONS) traitée
  assertMethod(event, 'POST')
  if (rateLimited(event)) throw createError({ statusCode: 429, statusMessage: 'Trop de tentatives, réessayez plus tard' })

  const body = await readBody<BookingBody>(event)
  if (body?.website) return { ok: true } // robot : on ne crée rien, sans le signaler

  const name = clean(body?.name, 120)
  const email = clean(body?.email, 160)
  const phone = clean(body?.phone, 40)
  const company = clean(body?.company, 120)
  const message = clean(body?.message, 1500)
  const mode = body?.mode === 'phone' ? 'phone' : 'visio'
  const locale = body?.locale === 'en' ? 'en' : 'fr'
  const start = clean(body?.start, 40)

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw createError({ statusCode: 400, statusMessage: 'Nom ou e-mail invalide' })
  if (mode === 'phone' && phone.replace(/\D/g, '').length < 8) throw createError({ statusCode: 400, statusMessage: 'Téléphone requis pour un appel téléphonique' })
  if (!isValidSlotStart(start)) throw createError({ statusCode: 409, statusMessage: 'Créneau indisponible' })

  const cfg = googleConfig()
  if (!cfg) throw createError({ statusCode: 503, statusMessage: 'Réservation en ligne non configurée' })

  const startDate = new Date(start)
  const end = new Date(startDate.getTime() + BOOKING.duration * 60000).toISOString()

  // Revérification juste avant la création : le créneau a pu être pris entre-temps
  const busy = await busyPeriods(cfg, startDate.toISOString(), end).catch((err) => {
    console.error('[booking] freeBusy', err)
    throw createError({ statusCode: 502, statusMessage: 'Agenda indisponible' })
  })
  if (busy.length) throw createError({ statusCode: 409, statusMessage: 'Créneau déjà réservé' })

  const modeLabel = mode === 'phone' ? `Téléphone : ${phone}` : 'Visio (Google Meet)'
  const description = [
    `Appel découverte réservé depuis kps-agency.com (${locale.toUpperCase()})`,
    '',
    `Nom : ${name}`,
    company && `Entreprise : ${company}`,
    `E-mail : ${email}`,
    phone && `Téléphone : ${phone}`,
    `Format : ${modeLabel}`,
    message && `\nProjet :\n${message}`
  ].filter(Boolean).join('\n')

  try {
    const ev = await createEvent(cfg, {
      start: startDate.toISOString(), end,
      summary: `Appel découverte — ${name}${company ? ` (${company})` : ''}`,
      description,
      attendee: { email, name },
      meet: mode === 'visio'
    })
    return { ok: true, start: startDate.toISOString(), end, meetLink: ev.hangoutLink ?? null, invited: !!cfg.impersonate }
  } catch (err) {
    console.error('[booking] createEvent', err)
    throw createError({ statusCode: 502, statusMessage: 'Impossible de créer le rendez-vous' })
  }
})
