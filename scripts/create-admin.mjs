// Crée (ou retrouve) un compte Supabase Auth et l'autorise à gérer le site depuis /admin (table admins).
// node --env-file=.env scripts/create-admin.mjs email@exemple.com "mot de passe"
// Variables requises : SUPABASE_URL, SUPABASE_SECRET_KEY
import { createClient } from '@supabase/supabase-js'

const { SUPABASE_URL: url, SUPABASE_SECRET_KEY: key } = process.env
const [email, password] = process.argv.slice(2)
if (!url || !key) {
  console.error('SUPABASE_URL et SUPABASE_SECRET_KEY doivent être renseignés dans .env')
  process.exit(1)
}
if (!email || !password || password.length < 10) {
  console.error('Usage : node --env-file=.env scripts/create-admin.mjs email@exemple.com "mot de passe" (10 caractères minimum)')
  process.exit(1)
}

const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })

let { data, error } = await db.auth.admin.createUser({ email, password, email_confirm: true })
let user = data?.user
if (error) {
  // Compte déjà existant : on le retrouve et on met son mot de passe à jour
  const list = await db.auth.admin.listUsers({ perPage: 1000 })
  user = list.data?.users.find(u => u.email?.toLowerCase() === email.toLowerCase())
  if (!user) { console.error(`Création impossible : ${error.message}`); process.exit(1) }
  const updated = await db.auth.admin.updateUserById(user.id, { password })
  if (updated.error) { console.error(`Mot de passe non modifié : ${updated.error.message}`); process.exit(1) }
}

const added = await db.from('admins').upsert({ user_id: user.id })
if (added.error) {
  console.error(`Compte créé, mais non autorisé : ${added.error.message} (la migration de l'admin a-t-elle été exécutée ?)`)
  process.exit(1)
}
console.log(`${email} peut maintenant se connecter sur /admin`)
