import type { AdminRole } from '../../utils/adminAuth'

interface Body { action?: 'list' | 'create' | 'role' | 'password' | 'remove'; email?: string; password?: string; role?: string; userId?: string }

const MIN_PASSWORD = 10

// Comptes autorisés sur /admin (table admins + Supabase Auth). Réservé au rôle « admin » : la clé secrète reste sur le serveur.
export default defineEventHandler(async (event) => {
  const me = await requireAdmin(event, { manageUsers: true })
  const db = supabaseAdmin()!
  const body = await readBody<Body>(event)
  const role: AdminRole = body?.role === 'editor' ? 'editor' : 'admin'
  const fail = (statusMessage: string, statusCode = 400) => createError({ statusCode, statusMessage })

  const admins = async () => {
    const { data, error } = await db.from('admins').select('*').order('created_at')
    if (error) throw fail('Lecture des comptes impossible', 502)
    return data as { user_id: string; role?: string; created_at: string }[]
  }
  /** Refuse de retirer ou de rétrograder le dernier administrateur : plus personne ne pourrait gérer les comptes */
  const keepOneAdmin = async (userId: string) => {
    const others = (await admins()).filter(a => a.user_id !== userId && a.role !== 'editor')
    if (!others.length) throw fail('Il doit rester au moins un administrateur.')
  }

  if (body?.action === 'create') {
    const email = String(body.email ?? '').trim().toLowerCase()
    const password = String(body.password ?? '')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw fail('E-mail invalide.')
    if (password.length < MIN_PASSWORD) throw fail(`Mot de passe : ${MIN_PASSWORD} caractères minimum.`)
    const created = await db.auth.admin.createUser({ email, password, email_confirm: true })
    let userId = created.data.user?.id
    if (created.error) {
      // Compte Supabase déjà existant : on l'autorise sans toucher à son mot de passe
      const list = await db.auth.admin.listUsers({ perPage: 1000 })
      userId = list.data?.users.find(u => u.email?.toLowerCase() === email)?.id
      if (!userId) throw fail(`Création impossible : ${created.error.message}`, 502)
    }
    const added = await db.from('admins').upsert({ user_id: userId, role })
    if (added.error) throw fail('Compte créé, mais non autorisé (migration 20261007 exécutée ?)', 502)
  } else if (body?.action === 'role' || body?.action === 'password' || body?.action === 'remove') {
    const userId = String(body.userId ?? '')
    if (!(await admins()).some(a => a.user_id === userId)) throw fail('Compte introuvable.', 404)
    if (body.action === 'role') {
      if (role === 'editor') await keepOneAdmin(userId)
      const { error } = await db.from('admins').update({ role }).eq('user_id', userId)
      if (error) throw fail('Rôle non modifié', 502)
    } else if (body.action === 'password') {
      const password = String(body.password ?? '')
      if (password.length < MIN_PASSWORD) throw fail(`Mot de passe : ${MIN_PASSWORD} caractères minimum.`)
      const { error } = await db.auth.admin.updateUserById(userId, { password })
      if (error) throw fail(`Mot de passe non modifié : ${error.message}`, 502)
    } else {
      if (userId === me.id) throw fail('Vous ne pouvez pas retirer votre propre accès.')
      await keepOneAdmin(userId)
      // Seul l'accès à l'admin est retiré : le compte Supabase est conservé
      const { error } = await db.from('admins').delete().eq('user_id', userId)
      if (error) throw fail('Accès non retiré', 502)
    }
  } else if (body?.action !== 'list') {
    throw fail('Action inconnue.')
  }

  const [rows, list] = await Promise.all([admins(), db.auth.admin.listUsers({ perPage: 1000 })])
  const byId = new Map((list.data?.users ?? []).map(u => [u.id, u]))
  return {
    me: me.id,
    users: rows.map(a => ({
      id: a.user_id, email: byId.get(a.user_id)?.email ?? '(compte supprimé)', role: a.role === 'editor' ? 'editor' : 'admin',
      createdAt: a.created_at, lastSignInAt: byId.get(a.user_id)?.last_sign_in_at ?? null
    }))
  }
})
