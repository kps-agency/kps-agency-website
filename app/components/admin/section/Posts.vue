<template>
  <AdminPostForm v-if="editing" :key="item?.id ?? 'new'" class="adm-card" :post="item" :posts="posts" @close="editing = false" @saved="saved" />
  <template v-else>
    <div class="adm-head">
      <h1>Articles <small>{{ posts.length }}</small></h1>
      <div class="adm-head__actions">
        <div class="adm-seg" role="group" aria-label="Filtrer par état">
          <button v-for="f in FILTERS" :key="f.id" type="button" :class="{ 'is-on': filter === f.id }" :aria-pressed="filter === f.id" @click="filter = f.id">{{ f.label }}</button>
        </div>
        <button type="button" class="adm-btn adm-btn--primary" @click="edit(null)">Nouvel article</button>
      </div>
    </div>
    <p v-if="error" class="adm-error" role="alert">{{ error }}</p>
    <p v-if="loading" class="adm-note">Chargement…</p>
    <p v-else-if="!shown.length" class="adm-note">{{ posts.length ? 'Aucun article dans cet état.' : 'Aucun article pour l’instant.' }}</p>
    <ul v-else class="adm-list">
      <li v-for="p in shown" :key="p.id" class="adm-row">
        <div class="adm-row__main">
          <button type="button" class="adm-row__title" @click="edit(p)">{{ p.title }}</button>
          <span class="adm-note">{{ p.lang.toUpperCase() }} · {{ fmtDay(p.date) }} · /{{ p.lang === 'en' ? 'en/' : '' }}blog/{{ p.slug }}</span>
        </div>
        <span class="adm-badge" :class="status(p).cls">{{ status(p).label }}</span>
        <div class="adm-row__actions">
          <button type="button" class="adm-btn adm-btn--sm" @click="edit(p)">Modifier</button>
          <button type="button" class="adm-btn adm-btn--sm adm-btn--danger" @click="remove(p)">Supprimer</button>
        </div>
      </li>
    </ul>
    <p class="adm-note files">Les articles écrits en fichiers Markdown (content/blog) sont publiés avec le code du site et n’apparaissent pas dans cette liste.</p>
  </template>
</template>

<script setup lang="ts">
// Articles du blog enregistrés dans Supabase (table blog_posts)
const { db, setPending } = useAdmin()

const FILTERS = [{ id: 'all', label: 'Tous' }, { id: 'published', label: 'Publiés' }, { id: 'scheduled', label: 'Programmés' }, { id: 'draft', label: 'Brouillons' }] as const
const posts = ref<PostRow[]>([])
const loading = ref(true)
const error = ref('')
const editing = ref(false)
const item = ref<PostRow | null>(null)
const filter = ref<typeof FILTERS[number]['id']>('all')

const today = localDay(new Date())
const status = (p: PostRow) => p.draft
  ? { id: 'draft', label: 'Brouillon', cls: '' }
  : p.date > today ? { id: 'scheduled', label: 'Programmé', cls: 'adm-badge--wait' } : { id: 'published', label: 'Publié', cls: 'adm-badge--on' }
const shown = computed(() => posts.value.filter(p => filter.value === 'all' || status(p).id === filter.value))

async function load() {
  loading.value = true
  const { data, error: err } = await db().from('blog_posts').select('*').order('date', { ascending: false }).order('created_at', { ascending: false })
  loading.value = false
  if (err) { error.value = adminError(err); return }
  posts.value = data as PostRow[]
}

function edit(p: PostRow | null) {
  item.value = p
  editing.value = true
  window.scrollTo({ top: 0 })
}

async function saved() {
  editing.value = false
  await load()
}

async function remove(p: PostRow) {
  if (!confirm(`Supprimer définitivement l’article « ${p.title} » ?`)) return
  const { error: err } = await db().from('blog_posts').delete().eq('id', p.id!)
  if (err) { error.value = adminError(err); return }
  setPending(true)
  await load()
}

onMounted(load)
</script>

<style scoped>
.files { margin-top: 16px; }
</style>
