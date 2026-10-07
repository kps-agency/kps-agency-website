import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/** Article tel qu'enregistré dans Supabase (table blog_posts) */
export interface PostRow {
  id?: string; lang: 'fr' | 'en'; slug: string; title: string; seo_title: string | null; description: string
  date: string; updated: string | null; sector: string; service: string | null; tags: string[]; author: string
  cover: string | null; cover_alt: string | null; translation: string | null; body: string; draft: boolean
}

/** Réalisation telle qu'enregistrée dans Supabase (table projects) */
export interface ProjectRow {
  id?: string; slug: string; cat: 'Web' | 'ADS' | 'Social'; client: string; label: string; description: string | null; metric: string | null
  bg: string; fg: string; img: string; url: string | null
  label_en: string | null; description_en: string | null; metric_en: string | null; position: number; published: boolean
  // Étude de cas (migration 20261006000000_kps_case_studies.sql) : absents tant que la migration n'est pas exécutée
  logo?: string | null; context?: string | null; work?: string | null; results?: string | null; kpis?: string | null; duration?: string | null
  quote?: string | null; quote_author?: string | null; quote_role?: string | null; quote_photo?: string | null
  context_en?: string | null; work_en?: string | null; results_en?: string | null; kpis_en?: string | null; duration_en?: string | null
  quote_en?: string | null; quote_role_en?: string | null
}

/** Demande de contact / devis (table leads) */
export interface LeadRow {
  id: string; created_at: string; locale: string; source: string; services: string[]; budget: string | null; timing: string | null
  message: string | null; name: string; company: string | null; email: string; phone: string | null; website: string | null
  status: 'new' | 'contacted' | 'quoted' | 'won' | 'lost' | 'spam'; notes?: string | null
}

/** Demande d'appel (table bookings) */
export interface BookingRow {
  id: string; created_at: string; start_at: string; end_at: string; name: string; email: string; phone: string | null; company: string | null
  mode: 'visio' | 'phone'; message: string | null; meet_link: string | null; status: 'booked' | 'done' | 'no_show' | 'cancelled'
}

export type AdminRole = 'admin' | 'editor'
/** Services externes configurés sur le serveur (route /api/admin/status) */
export interface AdminIntegrations { deployHook: boolean; vercel: boolean; analytics: boolean; searchConsole: boolean; cloudinary: boolean; mail: boolean; calendar: boolean }

const PENDING_KEY = 'kps-admin-pending'
let client: SupabaseClient | undefined

/** Slug d'URL : minuscules, sans accents, mots séparés par des tirets */
export const adminSlug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80)

/** Message lisible d'une erreur Supabase ou d'une route /api/admin */
export const adminError = (e: unknown) => {
  const err = e as { code?: string; message?: string; statusMessage?: string; data?: { statusMessage?: string } }
  if (err?.code === '23505') return 'Ce slug est déjà utilisé.'
  // Table ou colonne absente : la migration du tableau de bord n'a pas encore été exécutée
  if (['PGRST205', 'PGRST204', '42P01', '42703'].includes(err?.code ?? '')) return 'Base de données à mettre à jour : exécutez dans Supabase les migrations de supabase/migrations qui ne l’ont pas encore été.'
  if (err?.code === '42501') return 'Votre compte n’a pas le droit de modifier ce contenu.'
  return err?.data?.statusMessage || err?.statusMessage || err?.message || 'Une erreur est survenue.'
}

/** Navigation entre les rubriques du tableau de bord (fournie par app/pages/admin.vue) */
export const ADMIN_GO: InjectionKey<(section: string) => void> = Symbol('admin-go')
export const useAdminGo = () => inject(ADMIN_GO, () => {})

// Espace d'administration (/admin) : connexion Supabase Auth dans le navigateur. Les droits d'écriture sont portés par la base
// (RLS : comptes présents dans la table admins) ; la clé secrète reste sur le serveur (routes /api/admin).
export function useAdmin() {
  const cfg = useRuntimeConfig().public
  const configured = !!(cfg.supabaseUrl && cfg.supabasePublishableKey)
  const db = () => (client ??= createClient(cfg.supabaseUrl, cfg.supabasePublishableKey))

  const ready = useState('admin-ready', () => false)
  const email = useState<string | null>('admin-email', () => null)
  const allowed = useState('admin-allowed', () => false)
  /** Des modifications enregistrées ne sont pas encore en ligne (le site est figé au build) */
  const pending = useState('admin-pending', () => false)
  /** Rôle du compte : seul « admin » gère les utilisateurs (contrôlé par le serveur, ici pour l'affichage) */
  const role = useState<AdminRole>('admin-role', () => 'editor')
  /** null tant que le serveur n'a pas répondu (ou s'il n'a pas la clé secrète Supabase) */
  const integrations = useState<AdminIntegrations | null>('admin-integrations', () => null)

  async function refresh() {
    const { data } = await db().auth.getSession()
    const user = data.session?.user
    email.value = user?.email ?? null
    allowed.value = false
    if (user) {
      const { data: row } = await db().from('admins').select('user_id').eq('user_id', user.id).maybeSingle()
      allowed.value = !!row
    }
    if (allowed.value) {
      const status = await api<{ role: AdminRole; integrations: AdminIntegrations }>('status').catch(() => null)
      role.value = status?.role ?? 'editor'
      integrations.value = status?.integrations ?? null
    }
    pending.value = localStorage.getItem(PENDING_KEY) === '1'
    ready.value = true
  }

  async function signIn(mail: string, password: string) {
    const { error } = await db().auth.signInWithPassword({ email: mail, password })
    if (error) throw new Error(error.status === 400 ? 'E-mail ou mot de passe incorrect.' : error.message)
    await refresh()
  }

  async function signOut() {
    await db().auth.signOut()
    await refresh()
  }

  const setPending = (value: boolean) => {
    pending.value = value
    localStorage.setItem(PENDING_KEY, value ? '1' : '0')
  }

  async function api<T>(path: string, body?: object) {
    const token = (await db().auth.getSession()).data.session?.access_token ?? ''
    return await $fetch<T>(`/api/admin/${path}`, { method: 'POST', body, headers: { authorization: `Bearer ${token}` } })
  }

  /** Envoie une image sur Cloudinary (kps/<dossier>/<nom>) et renvoie son chemin côté site : /images/<dossier>/<nom>.webp */
  async function uploadImage(file: File, folder: 'blog' | 'realisations', name: string) {
    const { url, fields } = await api<{ url: string; fields: Record<string, string> }>('upload-signature', { folder, name })
    const form = new FormData()
    for (const [k, v] of Object.entries(fields)) form.append(k, v)
    form.append('file', file)
    const res = await fetch(url, { method: 'POST', body: form })
    if (!res.ok) throw new Error((await res.json().catch(() => null))?.error?.message ?? 'Envoi de l’image impossible')
    return `/images/${folder}/${name}.webp`
  }

  /** Relance le déploiement : le site relit les articles et les réalisations */
  async function publish() {
    await api('publish')
    setPending(false)
  }

  return { configured, db, ready, email, allowed, pending, role, integrations, refresh, signIn, signOut, setPending, api, uploadImage, publish }
}
