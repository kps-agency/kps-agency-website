<template>
  <!-- Supabase non configuré / chargement / connexion -->
  <div v-if="!configured || !ready || !email || !allowed" class="gate">
    <div class="adm-card gate__card">
      <h1>KPS Agency · Administration</h1>
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

  <div v-else class="dash">
    <header class="dash__top">
      <strong class="dash__brand">KPS Agency · Administration</strong>
      <nav class="dash__tabs" aria-label="Rubriques">
        <button type="button" :class="{ 'is-on': tab === 'posts' }" @click="go('posts')">Articles</button>
        <button type="button" :class="{ 'is-on': tab === 'projects' }" @click="go('projects')">Réalisations</button>
      </nav>
      <div class="dash__user">
        <span class="adm-note">{{ email }}</span>
        <a href="/" target="_blank" rel="noopener" class="adm-btn adm-btn--sm">Voir le site</a>
        <button type="button" class="adm-btn adm-btn--sm" @click="signOut">Déconnexion</button>
      </div>
    </header>

    <!-- Le site est figé au build : les modifications enregistrées attendent une publication -->
    <div class="dash__publish" :class="{ 'is-pending': pending }">
      <p>{{ published ? 'Publication lancée : le site sera à jour dans deux à trois minutes.' : pending ? 'Des modifications enregistrées ne sont pas encore en ligne.' : 'Les modifications sont mises en ligne quand vous publiez le site.' }}</p>
      <button type="button" class="adm-btn" :class="{ 'adm-btn--primary': pending }" :disabled="publishing" @click="publishSite">{{ publishing ? 'Publication…' : 'Publier le site' }}</button>
    </div>
    <p v-if="error" class="adm-error dash__error" role="alert">{{ error }}</p>

    <main class="dash__main">
      <!-- Articles -->
      <template v-if="tab === 'posts'">
        <AdminPostForm v-if="editing" :key="editPost?.id ?? 'new'" class="adm-card" :post="editPost" :posts="posts" @close="editing = false" @saved="saved" />
        <template v-else>
          <div class="list__head">
            <h1>Articles <small>{{ posts.length }}</small></h1>
            <button type="button" class="adm-btn adm-btn--primary" @click="edit(null)">Nouvel article</button>
          </div>
          <p v-if="loading" class="adm-note">Chargement…</p>
          <p v-else-if="!posts.length" class="adm-note">Aucun article pour l’instant.</p>
          <ul v-else class="list">
            <li v-for="p in posts" :key="p.id" class="row">
              <div class="row__main">
                <button type="button" class="row__title" @click="edit(p)">{{ p.title }}</button>
                <span class="adm-note">{{ p.lang.toUpperCase() }} · {{ formatDate(p.date) }} · /{{ p.lang === 'en' ? 'en/' : '' }}blog/{{ p.slug }}</span>
              </div>
              <span class="adm-badge" :class="postStatus(p).cls">{{ postStatus(p).label }}</span>
              <div class="row__actions">
                <button type="button" class="adm-btn adm-btn--sm" @click="edit(p)">Modifier</button>
                <button type="button" class="adm-btn adm-btn--sm adm-btn--danger" @click="removePost(p)">Supprimer</button>
              </div>
            </li>
          </ul>
        </template>
      </template>

      <!-- Réalisations -->
      <template v-else>
        <AdminProjectForm v-if="editing" :key="editProject?.id ?? 'new'" class="adm-card" :project="editProject" :next-position="nextPosition" @close="editing = false" @saved="saved" />
        <template v-else>
          <div class="list__head">
            <h1>Réalisations <small>{{ projects.length }}</small></h1>
            <button type="button" class="adm-btn adm-btn--primary" @click="edit(null)">Nouvelle réalisation</button>
          </div>
          <p v-if="loading" class="adm-note">Chargement…</p>
          <p v-else-if="!projects.length" class="adm-note">Aucune réalisation en base : le site affiche la liste d’origine. Ajoutez-en une pour la remplacer.</p>
          <ul v-else class="list">
            <li v-for="(p, i) in projects" :key="p.id" class="row">
              <img class="row__thumb" :src="thumb(p.img)" alt="" loading="lazy" width="96" height="54" :style="{ background: p.bg }">
              <div class="row__main">
                <button type="button" class="row__title" @click="edit(p)">{{ p.client }}</button>
                <span class="adm-note">{{ CAT_LABEL[p.cat] }} · {{ p.label }}{{ p.metric ? ` · ${p.metric}` : '' }}</span>
              </div>
              <span v-if="!p.description" class="adm-badge">Sans étude de cas</span>
              <span class="adm-badge" :class="{ 'adm-badge--on': p.published }">{{ p.published ? 'Visible' : 'Masquée' }}</span>
              <div class="row__actions">
                <button type="button" class="adm-btn adm-btn--sm" :disabled="i === 0 || moving" :aria-label="`Monter ${p.client}`" @click="move(i, -1)">↑</button>
                <button type="button" class="adm-btn adm-btn--sm" :disabled="i === projects.length - 1 || moving" :aria-label="`Descendre ${p.client}`" @click="move(i, 1)">↓</button>
                <button type="button" class="adm-btn adm-btn--sm" @click="edit(p)">Modifier</button>
                <button type="button" class="adm-btn adm-btn--sm adm-btn--danger" @click="removeProject(p)">Supprimer</button>
              </div>
            </li>
          </ul>
        </template>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import { CAT_LABEL } from '~/data/content'

// Espace d'administration : articles du blog et réalisations, enregistrés dans Supabase puis mis en ligne par une publication (déploiement).
definePageMeta({ layout: 'admin' })
useSeoMeta({ title: 'Administration', robots: 'noindex, nofollow' })

const { configured, db, ready, email, allowed, pending, refresh, signIn, signOut, setPending, publish } = useAdmin()
const { thumb } = useCloudImage()

const mail = ref('')
const password = ref('')
const busy = ref(false)
const error = ref('')

const tab = ref<'posts' | 'projects'>('posts')
const posts = ref<PostRow[]>([])
const projects = ref<ProjectRow[]>([])
const loading = ref(false)
const editing = ref(false)
const editPost = ref<PostRow | null>(null)
const editProject = ref<ProjectRow | null>(null)
const moving = ref(false)
const publishing = ref(false)
const published = ref(false)

const nextPosition = computed(() => Math.max(0, ...projects.value.map(p => p.position)) + 10)
const formatDate = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
const postStatus = (p: PostRow) => p.draft
  ? { label: 'Brouillon', cls: '' }
  : p.date > new Date().toISOString().slice(0, 10) ? { label: 'Programmé', cls: 'adm-badge--wait' } : { label: 'Publié', cls: 'adm-badge--on' }

async function load() {
  loading.value = true
  error.value = ''
  const [a, b] = await Promise.all([
    db().from('blog_posts').select('*').order('date', { ascending: false }).order('created_at', { ascending: false }),
    db().from('projects').select('*').order('position').order('created_at')
  ])
  loading.value = false
  if (a.error || b.error) { error.value = adminError(a.error || b.error); return }
  posts.value = a.data as PostRow[]
  projects.value = b.data as ProjectRow[]
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

function go(next: 'posts' | 'projects') {
  tab.value = next
  editing.value = false
}

function edit(item: PostRow | ProjectRow | null) {
  if (tab.value === 'posts') editPost.value = item as PostRow | null
  else editProject.value = item as ProjectRow | null
  editing.value = true
  window.scrollTo({ top: 0 })
}

async function saved() {
  editing.value = false
  published.value = false
  await load()
}

async function removePost(p: PostRow) {
  if (!confirm(`Supprimer définitivement l’article « ${p.title} » ?`)) return
  const { error: err } = await db().from('blog_posts').delete().eq('id', p.id!)
  if (err) { error.value = adminError(err); return }
  setPending(true)
  await saved()
}

async function removeProject(p: ProjectRow) {
  if (!confirm(`Supprimer définitivement la réalisation « ${p.client} » ?`)) return
  const { error: err } = await db().from('projects').delete().eq('id', p.id!)
  if (err) { error.value = adminError(err); return }
  setPending(true)
  await saved()
}

/** Monte ou descend une réalisation, puis renumérote les positions qui ont changé */
async function move(index: number, delta: -1 | 1) {
  const list = [...projects.value]
  const [item] = list.splice(index, 1)
  list.splice(index + delta, 0, item!)
  moving.value = true
  const changed = list.map((p, i) => ({ id: p.id!, position: (i + 1) * 10, was: p.position })).filter(p => p.position !== p.was)
  const results = await Promise.all(changed.map(p => db().from('projects').update({ position: p.position }).eq('id', p.id)))
  moving.value = false
  const failed = results.find(r => r.error)
  if (failed) error.value = adminError(failed.error)
  else setPending(true)
  await saved()
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
watch(allowed, (ok) => { if (ok) load() }, { immediate: true })
</script>

<style scoped>
.gate { min-height: 100vh; display: grid; place-items: center; padding: 20px; }
.gate__card { width: 100%; max-width: 420px; display: flex; flex-direction: column; gap: 20px; }
.gate__form { display: flex; flex-direction: column; gap: 16px; }

.dash__top { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; padding: 14px 32px; border-bottom: 1px solid var(--line); background: var(--band); }
.dash__brand { font-family: var(--font-display); font-weight: 900; font-size: 17px; }
.dash__tabs { display: flex; gap: 4px; }
.dash__tabs button { padding: 8px 14px; border: 0; border-radius: var(--r-sm); background: none; color: var(--muted); font: inherit; font-weight: 600; cursor: pointer; }
.dash__tabs button:hover { color: var(--ink); }
.dash__tabs button.is-on { background: var(--accent-soft); color: var(--accent-light); }
.dash__user { margin-left: auto; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

.dash__publish { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; padding: 12px 32px; border-bottom: 1px solid var(--line); font-size: 14px; color: var(--muted-2); }
.dash__publish p { margin: 0; }
.dash__publish.is-pending { background: var(--accent-soft); color: var(--ink); }
.dash__error { padding: 12px 32px 0; }
.dash__main { max-width: 1100px; margin: 0 auto; padding: 32px; }

.list__head { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
.list__head small { font-size: 15px; font-weight: 600; color: var(--muted-2); margin-left: 6px; }
.list { list-style: none; margin: 0; padding: 0; border: 1px solid var(--line); border-radius: var(--r-lg); background: var(--surface); overflow: hidden; }
.row { display: flex; align-items: center; gap: 14px; padding: 14px 18px; flex-wrap: wrap; }
.row + .row { border-top: 1px solid var(--line); }
.row__thumb { width: 96px; height: 54px; object-fit: cover; object-position: top center; border-radius: 6px; flex-shrink: 0; }
.row__main { flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 4px; overflow-wrap: anywhere; }
.row__title { padding: 0; border: 0; background: none; color: var(--ink); font: inherit; font-weight: 700; font-size: 16px; text-align: left; cursor: pointer; }
.row__title:hover { color: var(--accent-light); }
.row__actions { display: flex; gap: 6px; flex-wrap: wrap; }

@media (max-width: 720px) {
  .dash__top, .dash__publish { padding-inline: 16px; }
  .dash__error { padding-inline: 16px; }
  .dash__main { padding: 20px 16px; }
  .dash__user { margin-left: 0; }
}
</style>
