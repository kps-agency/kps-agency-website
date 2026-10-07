<template>
  <AdminProjectForm v-if="editing" :key="item?.id ?? 'new'" class="adm-card" :project="item" :next-position="nextPosition" @close="editing = false" @saved="saved" />
  <template v-else>
    <div class="adm-head">
      <h1>Réalisations <small>{{ projects.length }}</small></h1>
      <button type="button" class="adm-btn adm-btn--primary" @click="edit(null)">Nouvelle réalisation</button>
    </div>
    <p v-if="error" class="adm-error" role="alert">{{ error }}</p>
    <p v-if="loading" class="adm-note">Chargement…</p>
    <p v-else-if="!projects.length" class="adm-note">Aucune réalisation en base : le site affiche la liste d’origine. Ajoutez-en une pour la remplacer.</p>
    <ul v-else class="adm-list">
      <li v-for="(p, i) in projects" :key="p.id" class="adm-row">
        <img class="adm-row__thumb" :src="thumb(p.img)" alt="" loading="lazy" width="96" height="54" :style="{ background: p.bg }">
        <div class="adm-row__main">
          <button type="button" class="adm-row__title" @click="edit(p)">{{ p.client }}</button>
          <span class="adm-note">{{ CAT_LABEL[p.cat] }} · {{ p.label }}{{ p.metric ? ` · ${p.metric}` : '' }}</span>
        </div>
        <span v-if="!p.description" class="adm-badge">Sans étude de cas</span>
        <span class="adm-badge" :class="{ 'adm-badge--on': p.published }">{{ p.published ? 'Visible' : 'Masquée' }}</span>
        <div class="adm-row__actions">
          <button type="button" class="adm-btn adm-btn--sm" :disabled="i === 0 || moving" :aria-label="`Monter ${p.client}`" @click="move(i, -1)">↑</button>
          <button type="button" class="adm-btn adm-btn--sm" :disabled="i === projects.length - 1 || moving" :aria-label="`Descendre ${p.client}`" @click="move(i, 1)">↓</button>
          <button type="button" class="adm-btn adm-btn--sm" @click="edit(p)">Modifier</button>
          <button type="button" class="adm-btn adm-btn--sm adm-btn--danger" @click="remove(p)">Supprimer</button>
        </div>
      </li>
    </ul>
  </template>
</template>

<script setup lang="ts">
import { CAT_LABEL } from '~/data/content'

// Réalisations enregistrées dans Supabase (table projects)
const { db, setPending } = useAdmin()
const { thumb } = useCloudImage()

const projects = ref<ProjectRow[]>([])
const loading = ref(true)
const error = ref('')
const editing = ref(false)
const item = ref<ProjectRow | null>(null)
const moving = ref(false)

// Une nouvelle réalisation se place en tête de liste (les plus récentes d'abord) ; les flèches permettent ensuite de la déplacer
const nextPosition = computed(() => Math.min(10, ...projects.value.map(p => p.position)) - 10)

async function load() {
  loading.value = true
  const { data, error: err } = await db().from('projects').select('*').order('position').order('created_at')
  loading.value = false
  if (err) { error.value = adminError(err); return }
  projects.value = data as ProjectRow[]
}

function edit(p: ProjectRow | null) {
  item.value = p
  editing.value = true
  window.scrollTo({ top: 0 })
}

async function saved() {
  editing.value = false
  await load()
}

async function remove(p: ProjectRow) {
  if (!confirm(`Supprimer définitivement la réalisation « ${p.client} » ?`)) return
  const { error: err } = await db().from('projects').delete().eq('id', p.id!)
  if (err) { error.value = adminError(err); return }
  setPending(true)
  await load()
}

/** Monte ou descend une réalisation, puis renumérote les positions qui ont changé */
async function move(index: number, step: -1 | 1) {
  const list = [...projects.value]
  const [moved] = list.splice(index, 1)
  list.splice(index + step, 0, moved!)
  moving.value = true
  const changed = list.map((p, i) => ({ id: p.id!, position: (i + 1) * 10, was: p.position })).filter(p => p.position !== p.was)
  const results = await Promise.all(changed.map(p => db().from('projects').update({ position: p.position }).eq('id', p.id)))
  moving.value = false
  const failed = results.find(r => r.error)
  if (failed) error.value = adminError(failed.error)
  else setPending(true)
  await load()
}

onMounted(load)
</script>
