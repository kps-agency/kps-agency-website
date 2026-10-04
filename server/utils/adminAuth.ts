import type { H3Event } from 'h3'

// Routes /api/admin : la session Supabase du navigateur est envoyée en « Authorization: Bearer … ».
// On la vérifie auprès de Supabase, puis on contrôle que le compte figure dans la table admins.
export async function requireAdmin(event: H3Event) {
  const db = supabaseAdmin()
  if (!db) throw createError({ statusCode: 503, statusMessage: 'Supabase non configuré' })
  const token = getHeader(event, 'authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Connexion requise' })
  const { data, error } = await db.auth.getUser(token)
  if (error || !data.user) throw createError({ statusCode: 401, statusMessage: 'Session expirée' })
  const admin = await db.from('admins').select('user_id').eq('user_id', data.user.id).maybeSingle()
  if (admin.error) throw createError({ statusCode: 502, statusMessage: 'Vérification impossible' })
  if (!admin.data) throw createError({ statusCode: 403, statusMessage: 'Compte non autorisé' })
  return data.user
}
