interface ContactBody {
  name?: string; email?: string; phone?: string; company?: string; website?: string; locale?: 'fr' | 'en'
  // Formulaire de contact (3 étapes)
  services?: string[]; budget?: string; timing?: string; message?: string
  // Formulaire court de l'accueil
  need?: string; msg?: string
  hp?: string // champ piège anti-spam (jamais rempli par un humain)
}

const clean = (v: unknown, max: number) => String(v ?? '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, max)
const cleanText = (v: unknown, max: number) => String(v ?? '').replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, ' ').trim().slice(0, max)
const SERVICES: Record<string, string> = { web: 'Site web', app: 'Application métier', seo: 'SEO & GEO', mobile: 'Application mobile', ads: 'Marketing & ADS', social: 'Social media' }

// Demande de contact / devis : envoyée par e-mail à l'équipe (SMTP), avec « Répondre » dirigé vers le prospect.
export default defineEventHandler(async (event) => {
  if (bookingCors(event)) return // requête de pré-vérification CORS (OPTIONS) traitée
  assertMethod(event, 'POST')
  if (rateLimited(event)) throw createError({ statusCode: 429, statusMessage: 'Trop de tentatives, réessayez plus tard' })

  const body = await readBody<ContactBody>(event)
  if (body?.hp) return { ok: true } // robot : rien n'est envoyé, sans le signaler

  const name = clean(body?.name, 120)
  const email = clean(body?.email, 160)
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw createError({ statusCode: 400, statusMessage: 'Nom ou e-mail invalide' })

  const company = clean(body?.company, 120)
  const phone = clean(body?.phone, 40)
  const website = clean(body?.website, 200)
  const budget = clean(body?.budget, 60)
  const timing = clean(body?.timing, 60)
  const message = cleanText(body?.message || body?.msg, 3000)
  const needs = Array.isArray(body?.services)
    ? body.services.slice(0, 10).map(s => SERVICES[clean(s, 20)] || clean(s, 40)).filter(Boolean).join(', ')
    : clean(body?.need, 80)
  const locale = body?.locale === 'en' ? 'en' : 'fr'

  const tx = smtpTransport()
  if (!tx) throw createError({ statusCode: 503, statusMessage: 'Envoi d’e-mails non configuré' })
  const c = useRuntimeConfig()

  try {
    await tx.sendMail({
      from: String(c.mailFrom || c.smtpUser),
      to: String(c.contactNotifyEmail || c.bookingNotifyEmail || c.smtpUser),
      replyTo: `"${name.replace(/"/g, '')}" <${email}>`,
      subject: `Nouvelle demande — ${name}${company ? ` (${company})` : ''}${needs ? ` — ${needs}` : ''}`,
      text: [
        `Demande reçue depuis le site (${locale.toUpperCase()}) :\n`,
        `Nom : ${name}`, company && `Entreprise : ${company}`, `E-mail : ${email}`, phone && `Téléphone : ${phone}`, website && `Site actuel : ${website}`,
        needs && `Besoin : ${needs}`, budget && `Budget : ${budget}`, timing && `Délai : ${timing}`,
        message && `\nProjet :\n${message}`, '\nRépondez directement à cet e-mail pour écrire au prospect.'
      ].filter(Boolean).join('\n')
    })
  } catch (err) {
    console.error('[contact] mail', err)
    throw createError({ statusCode: 502, statusMessage: 'Envoi impossible' })
  }
  return { ok: true }
})
