<template>
  <!-- Formulaire -->
  <form v-if="editing" class="adm-card adm-form" @submit.prevent="save">
    <div class="adm-form__head">
      <h2>{{ form.id ? `Modifier ${singular}` : `Ajouter ${singular}` }}</h2>
      <div class="adm-form__actions">
        <button type="button" class="adm-btn" @click="editing = false">Retour à la liste</button>
        <button type="submit" class="adm-btn adm-btn--primary" :disabled="saving">{{ saving ? 'Enregistrement…' : 'Enregistrer' }}</button>
      </div>
    </div>
    <p v-if="error" class="adm-error" role="alert">{{ error }}</p>
    <div class="adm-grid">
      <template v-for="f in fields" :key="f.key">
        <label v-if="f.type === 'checkbox'" class="adm-check" :class="{ 'adm-span': f.wide }"><input v-model="form[f.key]" type="checkbox">{{ f.label }}</label>
        <label v-else class="adm-field" :class="{ 'adm-span': f.wide }">{{ f.label }}
          <textarea v-if="f.type === 'textarea'" v-model="form[f.key]" rows="4" :required="f.required" :maxlength="f.max" />
          <select v-else-if="f.type === 'select'" v-model="form[f.key]"><option v-for="o in f.options" :key="o.value" :value="o.value">{{ o.label }}</option></select>
          <input v-else v-model="form[f.key]" :type="f.type ?? 'text'" :required="f.required" :maxlength="f.max" :pattern="f.pattern" :placeholder="f.placeholder">
          <small v-if="f.hint">{{ f.hint }}</small>
        </label>
      </template>
    </div>
  </form>

  <!-- Liste -->
  <template v-else>
    <div class="adm-head">
      <div>
        <h1>{{ title }} <small>{{ rows.length }}</small></h1>
        <p v-if="intro" class="adm-sub">{{ intro }}</p>
      </div>
      <button type="button" class="adm-btn adm-btn--primary" @click="edit(null)">Ajouter {{ singular }}</button>
    </div>
    <p v-if="error" class="adm-error" role="alert">{{ error }}</p>
    <p v-if="loading" class="adm-note">Chargement…</p>
    <p v-else-if="!rows.length && !error" class="adm-note">{{ empty }}</p>
    <ul v-else class="adm-list">
      <li v-for="(row, i) in rows" :key="row.id" class="adm-row">
        <div class="adm-row__main">
          <button type="button" class="adm-row__title" @click="edit(row)">{{ describe(row).title }}</button>
          <span class="adm-note">{{ describe(row).sub }}</span>
        </div>
        <span v-for="b in describe(row).badges" :key="b.label" class="adm-badge" :class="b.cls">{{ b.label }}</span>
        <div class="adm-row__actions">
          <button type="button" class="adm-btn adm-btn--sm" :disabled="i === 0 || moving" :aria-label="`Monter ${describe(row).title}`" @click="move(i, -1)">↑</button>
          <button type="button" class="adm-btn adm-btn--sm" :disabled="i === rows.length - 1 || moving" :aria-label="`Descendre ${describe(row).title}`" @click="move(i, 1)">↓</button>
          <button type="button" class="adm-btn adm-btn--sm" @click="edit(row)">Modifier</button>
          <button type="button" class="adm-btn adm-btn--sm adm-btn--danger" @click="remove(row)">Supprimer</button>
        </div>
      </li>
    </ul>
  </template>
</template>

<script setup lang="ts">
// Gestion d'une table simple de Supabase (promotions, avis…) : liste ordonnée par la colonne position, formulaire décrit par « fields ».
export interface ResourceField {
  key: string; label: string; type?: 'text' | 'textarea' | 'date' | 'month' | 'number' | 'url' | 'checkbox' | 'select'
  required?: boolean; max?: number; pattern?: string; placeholder?: string; hint?: string; wide?: boolean
  options?: { value: string | number; label: string }[]
}
type Row = Record<string, any>

const props = defineProps<{
  table: string; title: string
  /** Avec son article, pour les boutons : « une promotion », « un avis » */
  singular: string
  intro?: string; empty: string; fields: ResourceField[]
  /** Valeurs d'une nouvelle ligne */
  defaults: Row
  describe: (row: Row) => { title: string; sub: string; badges: { label: string; cls?: string }[] }
}>()
const { db, setPending } = useAdmin()

const rows = ref<Row[]>([])
const loading = ref(true)
const error = ref('')
const editing = ref(false)
const saving = ref(false)
const moving = ref(false)
const form = ref<Row>({})

async function load() {
  loading.value = true
  const { data, error: err } = await db().from(props.table).select('*').order('position').order('created_at')
  loading.value = false
  if (err) { error.value = adminError(err); return }
  rows.value = data
}

function edit(row: Row | null) {
  error.value = ''
  // Une nouvelle ligne se place à la fin de la liste
  form.value = row ? { ...row } : { ...props.defaults, position: Math.max(0, ...rows.value.map(r => r.position)) + 10 }
  // Les champs facultatifs vides (null en base) s'affichent vides dans le formulaire
  for (const f of props.fields) if (f.type !== 'checkbox') form.value[f.key] ??= ''
  editing.value = true
  window.scrollTo({ top: 0 })
}

async function save() {
  error.value = ''
  saving.value = true
  const row: Row = { position: form.value.position }
  for (const f of props.fields) {
    const v = form.value[f.key]
    row[f.key] = f.type === 'checkbox' ? !!v : f.type === 'number' ? Number(v) : typeof v === 'number' ? v : String(v).trim() || null
  }
  const { error: err } = form.value.id ? await db().from(props.table).update(row).eq('id', form.value.id) : await db().from(props.table).insert(row)
  saving.value = false
  if (err) { error.value = adminError(err); return }
  setPending(true)
  editing.value = false
  await load()
}

async function remove(row: Row) {
  if (!confirm(`Supprimer définitivement « ${props.describe(row).title} » ?`)) return
  const { error: err } = await db().from(props.table).delete().eq('id', row.id)
  if (err) { error.value = adminError(err); return }
  setPending(true)
  await load()
}

/** Monte ou descend une ligne, puis renumérote les positions qui ont changé */
async function move(index: number, step: -1 | 1) {
  const list = [...rows.value]
  const [moved] = list.splice(index, 1)
  list.splice(index + step, 0, moved!)
  moving.value = true
  const changed = list.map((r, i) => ({ id: r.id, position: (i + 1) * 10, was: r.position })).filter(r => r.position !== r.was)
  const results = await Promise.all(changed.map(r => db().from(props.table).update({ position: r.position }).eq('id', r.id)))
  moving.value = false
  const failed = results.find(r => r.error)
  if (failed) error.value = adminError(failed.error)
  else setPending(true)
  await load()
}

onMounted(load)
</script>
