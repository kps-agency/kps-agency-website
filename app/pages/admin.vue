<template>
  <!-- Supabase non configuré / chargement / connexion -->
  <div v-if="!configured || !ready || !email || !allowed" class="gate">
    <div class="adm-card gate__card">
      <SiteLogo />
      <h1>Tableau de bord</h1>
      <p v-if="!configured" class="adm-note">Supabase n’est pas configuré : renseignez SUPABASE_URL et SUPABASE_PUBLISHABLE_KEY (voir supabase/README.md).</p>
      <p v-else-if="!ready" class="adm-note">Chargement…</p>
      <template v-else-if="email">
        <p class="adm-error" role="alert">Le compte {{ email }} n’est pas autorisé à gérer le site.</p>
        <button type="button" class="adm-btn" @click="signOut">Se déconnecter</button>
      </template>
      <form v-else class="gate__form" @submit.prevent="login">
        <label class="adm-field">E-mail<input v-model="mail" type="email" autocomplete="username" required></label>
        <label class="adm-field">Mot de passe<input v-model="password" type="password" autocomplete="current-password" required></label>
        <p v-if="error" class="adm-error" role="alert">{{ error }}</p>
        <button type="submit" class="adm-btn adm-btn--primary" :disabled="busy">{{ busy ? 'Connexion…' : 'Se connecter' }}</button>
      </form>
    </div>
  </div>

  <div v-else class="dash" :class="{ 'is-menu-open': menuOpen }">
    <aside id="adm-menu" class="side">
      <div class="side__brand">
        <SiteLogo />
        <span>Tableau de bord</span>
      </div>
      <nav class="side__nav" aria-label="Rubriques">
        <div v-for="group in menu" :key="group.title" class="side__group">
          <p>{{ group.title }}</p>
          <button v-for="item in group.items" :key="item.id" type="button" :class="{ 'is-on': section === item.id }" :aria-current="section === item.id ? 'page' : undefined" @click="go(item.id)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="item.icon" /></svg>
            <span>{{ item.label }}</span>
            <span v-if="item.id === 'leads' && newLeads" class="side__count" :aria-label="`${newLeads} nouvelles demandes`">{{ newLeads }}</span>
          </button>
        </div>
      </nav>
      <div class="side__user">
        <span class="side__mail" :title="email">{{ email }}</span>
        <span class="adm-note">{{ role === 'admin' ? 'Administrateur' : 'Éditeur' }}</span>
        <div class="side__links">
          <a href="/" target="_blank" rel="noopener" class="adm-btn adm-btn--sm">Voir le site</a>
          <button type="button" class="adm-btn adm-btn--sm" @click="signOut">Déconnexion</button>
        </div>
      </div>
    </aside>
    <button type="button" class="dash__veil" aria-label="Fermer le menu" tabindex="-1" @click="menuOpen = false" />

    <div class="dash__body">
      <!-- Le site est figé au build : les modifications enregistrées attendent une publication -->
      <header class="top" :class="{ 'is-pending': pending }">
        <button type="button" class="adm-btn adm-btn--sm top__burger" :aria-expanded="menuOpen" aria-controls="adm-menu" @click="menuOpen = !menuOpen">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          Menu
        </button>
        <p role="status">{{ published ? 'Publication lancée : le site sera à jour dans deux à trois minutes.' : pending ? 'Des modifications enregistrées ne sont pas encore en ligne.' : 'Le site en ligne est à jour avec vos contenus.' }}</p>
        <button type="button" class="adm-btn" :class="{ 'adm-btn--primary': pending }" :disabled="publishing" @click="publishSite">{{ publishing ? 'Publication…' : 'Publier le site' }}</button>
      </header>
      <p v-if="error" class="adm-error dash__error" role="alert">{{ error }}</p>

      <main class="dash__main">
        <component :is="current" :key="section" />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  AdminSectionAudience, AdminSectionBookings, AdminSectionLeads, AdminSectionOverview, AdminSectionPerformance, AdminSectionPosts, AdminSectionProjects,
  AdminSectionPromos, AdminSectionReviews, AdminSectionSeo, AdminSectionServices, AdminSectionSettings, AdminSectionUsers
} from '#components'

// Tableau de bord du site : contenus et demandes enregistrés dans Supabase, mesures d'audience, de référencement et de performance.
// Une seule adresse (/admin) : la rubrique affichée est portée par le paramètre ?s=… pour que les liens et le bouton Retour fonctionnent.
definePageMeta({ layout: 'admin' })
useSeoMeta({ title: 'Tableau de bord', robots: 'noindex, nofollow' })

const { configured, db, ready, email, allowed, pending, role, refresh, signIn, signOut, publish } = useAdmin()
const route = useRoute()
const router = useRouter()

const SECTIONS = {
  overview: AdminSectionOverview, leads: AdminSectionLeads, bookings: AdminSectionBookings,
  posts: AdminSectionPosts, projects: AdminSectionProjects, services: AdminSectionServices, promos: AdminSectionPromos, reviews: AdminSectionReviews,
  audience: AdminSectionAudience, seo: AdminSectionSeo, performance: AdminSectionPerformance,
  users: AdminSectionUsers, settings: AdminSectionSettings
}
type SectionId = keyof typeof SECTIONS

// Icônes au trait (24 × 24), dessinées pour ce menu
const I = {
  overview: 'M4 5h7v8H4zM13 5h7v5h-7zM13 12h7v7h-7zM4 15h7v4H4z',
  leads: 'M4 6h16v12H4zM4 7l8 6 8-6',
  bookings: 'M5 6h14v14H5zM5 10h14M9 4v4M15 4v4',
  posts: 'M6 4h9l4 4v12H6zM14 4v5h5M9 13h6M9 17h6',
  projects: 'M4 6h16v13H4zM4 15l5-5 4 4 3-3 4 4',
  services: 'M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5',
  promos: 'M4 12V5h7l9 9-7 7zM8.5 8.5h.01',
  reviews: 'M12 4l2.5 5.2 5.5.8-4 4 1 5.6-5-2.7-5 2.7 1-5.6-4-4 5.5-.8z',
  audience: 'M4 19V5M4 19h16M8 15l4-5 3 3 4-6',
  seo: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
  performance: 'M5 17a8 8 0 1 1 14 0M12 13l4-5',
  users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14.5c1.8.9 3 2.9 3 5.5',
  settings: 'M5 7h9M18 7h1M5 17h1M10 17h9M16 5v4M8 15v4'
}
const menu = computed(() => [
  { title: 'Pilotage', items: [{ id: 'overview', label: 'Vue d’ensemble' }] },
  { title: 'Activité commerciale', items: [{ id: 'leads', label: 'Demandes' }, { id: 'bookings', label: 'Rendez-vous' }] },
  { title: 'Contenus du site', items: [{ id: 'posts', label: 'Articles' }, { id: 'projects', label: 'Réalisations' }, { id: 'services', label: 'Expertises' }, { id: 'promos', label: 'Promotions' }, { id: 'reviews', label: 'Avis clients' }] },
  { title: 'Suivi', items: [{ id: 'audience', label: 'Audience' }, { id: 'seo', label: 'Référencement' }, { id: 'performance', label: 'Performances' }] },
  { title: 'Administration', items: [...(role.value === 'admin' ? [{ id: 'users', label: 'Utilisateurs' }] : []), { id: 'settings', label: 'Réglages' }] }
].map(g => ({ ...g, items: g.items.map(i => ({ ...i, id: i.id as SectionId, icon: I[i.id as SectionId] })) })))

const section = computed<SectionId>(() => {
  const s = String(route.query.s ?? '')
  return s in SECTIONS && (s !== 'users' || role.value === 'admin') ? s as SectionId : 'overview'
})
const current = computed(() => SECTIONS[section.value])

const mail = ref('')
const password = ref('')
const busy = ref(false)
const error = ref('')
const menuOpen = ref(false)
const publishing = ref(false)
const published = ref(false)
const newLeads = ref(0)

function go(id: string) {
  menuOpen.value = false
  router.push({ query: id === 'overview' ? {} : { s: id } })
  window.scrollTo({ top: 0 })
}

// Les rubriques renvoient vers une autre rubrique avec useAdminGo()
provide(ADMIN_GO, go)

/** Nombre de demandes non traitées, affiché dans le menu */
async function countNewLeads() {
  const { count } = await db().from('leads').select('id', { count: 'exact', head: true }).eq('status', 'new')
  newLeads.value = count ?? 0
}

async function login() {
  error.value = ''
  busy.value = true
  try {
    await signIn(mail.value, password.value)
    password.value = ''
  } catch (err) {
    error.value = adminError(err)
  } finally {
    busy.value = false
  }
}

async function publishSite() {
  error.value = ''
  publishing.value = true
  try {
    await publish()
    published.value = true
  } catch (err) {
    error.value = adminError(err)
  } finally {
    publishing.value = false
  }
}

onMounted(async () => {
  if (!configured) return
  await refresh()
})
watch(allowed, (ok) => { if (ok) countNewLeads() }, { immediate: true })
// Le compteur du menu suit le traitement des demandes ; un nouvel enregistrement efface le message « Publication lancée »
watch(section, () => { if (allowed.value) countNewLeads() })
watch(pending, (p) => { if (p) published.value = false })
</script>

<style scoped>
.gate { min-height: 100vh; display: grid; place-items: center; padding: 20px; }
.gate__card { width: 100%; max-width: 420px; display: flex; flex-direction: column; gap: 20px; }
.gate__form { display: flex; flex-direction: column; gap: 16px; }

.dash { --side: 264px; display: grid; grid-template-columns: var(--side) minmax(0, 1fr); min-height: 100vh; }
.side { position: sticky; top: 0; height: 100vh; display: flex; flex-direction: column; background: var(--band); border-right: 1px solid var(--line); }
.side__brand { display: flex; flex-direction: column; gap: 6px; padding: 20px 20px 16px; border-bottom: 1px solid var(--line); }
.side__brand span { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: var(--accent-light); }
.side__nav { flex: 1; overflow-y: auto; padding: 8px 12px 16px; }
.side__group p { margin: 16px 0 6px; padding: 0 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--muted-3); }
.side__group button { width: 100%; display: flex; align-items: center; gap: 12px; padding: 9px 10px; border: 0; border-radius: var(--r-sm); background: none; color: var(--muted); font: inherit; font-size: 14px; font-weight: 600; text-align: left; cursor: pointer; }
.side__group button:hover { background: var(--surface-hover); color: var(--ink); }
.side__group button.is-on { background: var(--accent-soft); color: var(--accent-light); box-shadow: inset 2px 0 0 var(--accent); }
.side__group button svg { flex-shrink: 0; }
.side__group button span:nth-of-type(1) { flex: 1; }
.side__count { min-width: 22px; padding: 2px 7px; border-radius: var(--r-pill); background: var(--grad-neon); color: var(--white); font-size: 12px; font-weight: 700; text-align: center; }
.side__user { display: flex; flex-direction: column; gap: 4px; padding: 16px 20px; border-top: 1px solid var(--line); }
.side__mail { font-size: 13px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.side__links { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
.dash__veil { display: none; }

.dash__body { min-width: 0; display: flex; flex-direction: column; }
.top { position: sticky; top: 0; z-index: 20; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 12px 32px; border-bottom: 1px solid var(--line); background: var(--bg); font-size: 14px; color: var(--muted-2); }
.top p { margin: 0; flex: 1; }
/* Teinte d'accent posée sur le fond opaque : la barre reste lisible quand le contenu défile dessous */
.top.is-pending { background: linear-gradient(var(--accent-soft), var(--accent-soft)), var(--bg); color: var(--ink); }
.top__burger { display: none; }
.dash__error { padding: 12px 32px 0; }
.dash__main { width: 100%; max-width: 1280px; margin: 0 auto; padding: 32px; }

@media (max-width: 1000px) {
  .dash { grid-template-columns: minmax(0, 1fr); }
  .side { position: fixed; z-index: 40; left: 0; width: min(var(--side), 86vw); transform: translateX(-100%); visibility: hidden; transition: transform .2s ease, visibility .2s; }
  .is-menu-open .side { transform: none; visibility: visible; }
  .is-menu-open .dash__veil { display: block; position: fixed; inset: 0; z-index: 30; border: 0; background: rgba(2, 6, 23, .7); }
  .top__burger { display: inline-flex; }
  .top { padding-inline: 16px; flex-wrap: wrap; }
  .dash__error { padding-inline: 16px; }
  .dash__main { padding: 20px 16px; }
}
@media (prefers-reduced-motion: reduce) { .side { transition: none; } }
</style>
