interface PromoBody { email?: string; promoId?: string; locale?: 'fr' | 'en'; page?: string; hp?: string }

const clean = (v: unknown, max: number) => String(v ?? '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, max)

// Adresse e-mail laissée dans la fenêtre de promotion : enregistrée dans Supabase (table promo_signups) et signalée par e-mail à l'équipe.
// Comme pour les demandes de contact, elle est acceptée dès qu'elle est enregistrée OU envoyée.
export default defineEventHandler(async (event) => {
  if (bookingCors(event)) return // requête de pré-vérification CORS (OPTIONS) traitée
  assertMethod(event, 'POST')
  if (rateLimited(event)) throw createError({ statusCode: 429, statusMessage: 'Trop de tentatives, réessayez plus tard' })

  const body = await readBody<PromoBody>(event)
  if (body?.hp) return { ok: true } // robot : rien n'est enregistré, sans le signaler

  const email = clean(body?.email, 160).toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw createError({ statusCode: 400, statusMessage: 'E-mail invalide' })
  const promoId = /^[0-9a-f-]{36}$/i.test(body?.promoId ?? '') ? body!.promoId! : null
  const locale = body?.locale === 'en' ? 'en' : 'fr'
  const page = clean(body?.page, 200)

  const db = supabaseAdmin()
  const tx = smtpTransport()
  if (!db && !tx) throw createError({ statusCode: 503, statusMessage: 'Formulaire non configuré' })
  const c = useRuntimeConfig()

  // Le titre de l'offre est relu en base : celui que le navigateur pourrait envoyer n'est pas repris tel quel
  const promo = db && promoId ? (await db.from('promos').select('text').eq('id', promoId).maybeSingle()).data : null
  const offer = promo?.text ? String(promo.text) : ''

  const [saved, mailed] = await Promise.allSettled([
    db
      ? db.from('promo_signups')
          // Adresse déjà inscrite à cette promotion : rien n'est dupliqué
          .upsert({ email, promo_id: promo ? promoId : null, promo_text: offer || null, locale, page: page || null }, { onConflict: 'email,promo_id', ignoreDuplicates: true })
          .then(({ error }) => { if (error) throw error })
      : Promise.reject(new Error('Supabase non configuré')),
    tx ? tx.sendMail({
      from: String(c.mailFrom || c.smtpUser),
      to: String(c.contactNotifyEmail || c.bookingNotifyEmail || c.smtpUser),
      replyTo: email,
      subject: `Promotion — nouvelle inscription : ${email}`,
      text: [
        `Une adresse a été laissée dans la fenêtre de promotion du site (${locale.toUpperCase()}) :\n`,
        `E-mail : ${email}`, offer && `Offre : ${offer}`, page && `Page : ${page}`,
        '\nRépondez directement à cet e-mail pour écrire à cette personne.'
      ].filter(Boolean).join('\n')
    }) : Promise.reject(new Error('SMTP non configuré'))
  ])
  if (db && saved.status === 'rejected') console.error('[promo] supabase', saved.reason)
  if (tx && mailed.status === 'rejected') console.error('[promo] mail', mailed.reason)
  if (saved.status === 'rejected' && mailed.status === 'rejected') throw createError({ statusCode: 502, statusMessage: 'Envoi impossible' })
  return { ok: true }
})
