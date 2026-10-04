<template>
  <form class="adm-form" @submit.prevent="save">
    <div class="adm-form__head">
      <h2>{{ project ? 'Modifier la réalisation' : 'Nouvelle réalisation' }}</h2>
      <div class="adm-form__actions">
        <button type="button" class="adm-btn" @click="emit('close')">Retour à la liste</button>
        <button type="submit" class="adm-btn adm-btn--primary" :disabled="saving">{{ saving ? 'Enregistrement…' : 'Enregistrer' }}</button>
      </div>
    </div>
    <p v-if="error" class="adm-error" role="alert">{{ error }}</p>

    <div class="adm-grid">
      <label class="adm-field">Client<input v-model="f.client" type="text" required maxlength="120" @input="autoSlug"></label>
      <label class="adm-field">Slug (adresse de la page)
        <input v-model="f.slug" type="text" required pattern="[a-z0-9\-]+" maxlength="80" :readonly="!!project">
        <small>/realisations/{{ f.slug || '…' }}{{ project ? ' — non modifiable : l’adresse est déjà référencée' : '' }}</small>
      </label>
      <label class="adm-field">Catégorie
        <select v-model="f.cat"><option v-for="(label, key) in CAT_LABEL" :key="key" :value="key">{{ label }}</option></select>
      </label>
      <label class="adm-field">Site du client (facultatif)<input v-model="f.url" type="url" placeholder="https://"></label>
      <label class="adm-check adm-span"><input v-model="f.published" type="checkbox">Visible sur le site</label>
    </div>

    <fieldset>
      <legend>Visuel</legend>
      <div class="adm-grid">
        <AdminImageField v-model="f.img" class="adm-span" folder="realisations" :name="f.slug" />
        <label class="adm-field">Couleur de fond du visuel<span class="color"><input v-model="f.bg" type="color"><input v-model="f.bg" type="text" pattern="#[0-9A-Fa-f]{6}" required></span></label>
        <label class="adm-field">Couleur du texte<span class="color"><input v-model="f.fg" type="color"><input v-model="f.fg" type="text" pattern="#[0-9A-Fa-f]{6}" required></span></label>
      </div>
    </fieldset>

    <fieldset>
      <legend>Français</legend>
      <div class="adm-grid">
        <label class="adm-field">Type de projet ou secteur<input v-model="f.label" type="text" required maxlength="80" placeholder="Campagne ADS Performance"></label>
        <label class="adm-field">Résultat chiffré (facultatif)<input v-model="f.metric" type="text" maxlength="40" placeholder="6.4M impressions"></label>
        <label class="adm-field adm-span">Étude de cas
          <textarea v-model="f.description" rows="4" maxlength="1200" />
          <small>Sans texte, la page du projet reste hors de Google (noindex) et du sitemap.</small>
        </label>
      </div>
    </fieldset>

    <fieldset>
      <legend>English</legend>
      <div class="adm-grid">
        <label class="adm-field">Project type or industry<input v-model="f.label_en" type="text" maxlength="80"></label>
        <label class="adm-field">Key result<input v-model="f.metric_en" type="text" maxlength="40"></label>
        <label class="adm-field adm-span">Case study
          <textarea v-model="f.description_en" rows="4" maxlength="1200" />
          <small>Un champ vide reprend le texte français.</small>
        </label>
      </div>
    </fieldset>

    <div class="adm-form__actions">
      <button type="submit" class="adm-btn adm-btn--primary" :disabled="saving">{{ saving ? 'Enregistrement…' : 'Enregistrer' }}</button>
      <button type="button" class="adm-btn" @click="emit('close')">Retour à la liste</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { CAT_LABEL } from '~/data/content'

const props = defineProps<{ project: ProjectRow | null; nextPosition: number }>()
const emit = defineEmits<{ close: []; saved: [] }>()
const { db, setPending } = useAdmin()

const f = reactive<ProjectRow>(props.project
  ? { ...props.project }
  : { slug: '', cat: 'Web', client: '', label: '', description: '', metric: '', bg: '#E6ECF5', fg: '#0B3A75', img: '', url: '', label_en: '', description_en: '', metric_en: '', position: props.nextPosition, published: true })

const autoSlug = () => { if (!props.project) f.slug = adminSlug(f.client) }

const saving = ref(false)
const error = ref('')
const text = (v: string | null) => v?.trim() || null

async function save() {
  error.value = ''
  if (!/^[a-z0-9-]+$/.test(f.slug)) { error.value = 'Slug invalide : lettres minuscules, chiffres et tirets uniquement.'; return }
  if (!f.img) { error.value = 'Ajoutez un visuel avant d’enregistrer.'; return }
  saving.value = true
  const { id, ...fields } = f
  const row = {
    ...fields, client: f.client.trim(), label: f.label.trim(),
    description: text(f.description), metric: text(f.metric), url: text(f.url),
    label_en: text(f.label_en), description_en: text(f.description_en), metric_en: text(f.metric_en)
  }
  const { error: err } = id ? await db().from('projects').update(row).eq('id', id) : await db().from('projects').insert(row)
  saving.value = false
  if (err) { error.value = adminError(err); return }
  setPending(true)
  emit('saved')
}
</script>

<style scoped>
.color { display: flex; gap: 8px; }
.color input[type="color"] { width: 46px; padding: 2px; flex-shrink: 0; cursor: pointer; }
</style>
