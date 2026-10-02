import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Client Supabase du serveur (clé secrète : contourne la RLS, ne jamais l'exposer au navigateur).
// null si SUPABASE_URL / SUPABASE_SECRET_KEY ne sont pas renseignés (variables lues à l'exécution, jamais exposées au navigateur).
let client: SupabaseClient | null | undefined
export function supabaseAdmin() {
  if (client !== undefined) return client
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY
  client = url && key
    ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
    : null
  return client
}
