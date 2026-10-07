import type { H3Event } from 'h3'

export type AdminRole = 'admin' | 'editor'

// Routes /api/admin : la session Supabase du navigateur est envoyée en « Authorization: Bearer … ».
// On la vérifie auprès de Supabase, puis on contrôle que le compte figure dans la table admins.
export async function requireAdmin(event: H3Event, opts: { manageUsers?: boolean } = {}) {
  const db = supabaseAdmin()
  if (!db) throw createError({ statusCode: 503, statusMessage: 'Supabase non configuré' })
  const token = getHeader(event, 'authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Connexion requise' })
  const { data, error } = await db.auth.getUser(token)
  if (error || !data.user) throw createError({ statusCode: 401, statusMessage: 'Session expirée' })
  const admin = await db.from('admins').select('*').eq('user_id', data.user.id).maybeSingle()
  if (admin.error) throw createError({ statusCode: 502, statusMessage: 'Vérification impossible' })
  if (!admin.data) throw createError({ statusCode: 403, statusMessage: 'Compte non autorisé' })
  // Colonne role absente (migration 20261007 pas encore exécutée) : tous les comptes sont administrateurs
  const role: AdminRole = admin.data.role === 'editor' ? 'editor' : 'admin'
  if (opts.manageUsers && role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Réservé aux administrateurs' })
  return Object.assign(data.user, { adminRole: role })
}
