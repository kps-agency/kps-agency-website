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
        <label class="adm-field adm-span">Présentation (affichée sous le titre et sur les cartes)
          <textarea v-model="f.description" rows="4" maxlength="1200" />
        </label>
      </div>
    </fieldset>

    <fieldset>
      <legend>Étude de cas</legend>
      <p class="adm-note">La page du projet n’est proposée à Google que si présentation, contexte, travail réalisé et résultats totalisent au moins 400 caractères. Un paragraphe par ligne.</p>
      <div class="adm-grid">
        <label class="adm-field adm-span">Contexte et enjeu du client
          <textarea v-model="f.context" rows="4" maxlength="2000" placeholder="Qui est le client, quel était son problème ou son objectif de départ ?" />
        </label>
        <label class="adm-field adm-span">Ce que nous avons fait
          <textarea v-model="f.work" rows="5" maxlength="3000" placeholder="Les choix faits et le travail réalisé, étape par étape." />
        </label>
        <label class="adm-field adm-span">Résultats obtenus
          <textarea v-model="f.results" rows="4" maxlength="2000" placeholder="Ce qui a changé pour le client, chiffres à l’appui." />
        </label>
        <label class="adm-field">Chiffres clés (4 au plus)
          <textarea v-model="f.kpis" rows="4" maxlength="300" placeholder="5M | paid reach&#10;+38 % | demandes de devis" />
          <small>Un chiffre par ligne : valeur | libellé.</small>
        </label>
        <label class="adm-field">Durée du projet<input v-model="f.duration" type="text" maxlength="40" placeholder="6 semaines"></label>
      </div>
    </fieldset>

    <fieldset>
      <legend>Témoignage du client</legend>
      <p class="adm-note">Affiché sur la page du projet, l’accueil et la page L’agence dès que la citation et l’auteur sont renseignés. À publier avec l’accord du client.</p>
      <div class="adm-grid">
        <label class="adm-field adm-span">Citation
          <textarea v-model="f.quote" rows="3" maxlength="600" />
        </label>
        <label class="adm-field">Auteur (prénom et nom)<input v-model="f.quote_author" type="text" maxlength="80"></label>
        <label class="adm-field">Fonction<input v-model="f.quote_role" type="text" maxlength="80" placeholder="Directrice marketing"></label>
        <div class="adm-field adm-span">Portrait de l’auteur (facultatif)
          <AdminImageField v-model="f.quote_photo" folder="realisations" :name="f.slug && `${f.slug}-portrait`" removable hint="Photo carrée, 400 px de côté au moins." />
        </div>
      </div>
    </fieldset>

    <fieldset>
      <legend>Logo du client</legend>
      <p class="adm-note">Remplace le nom en texte dans le bandeau « Ils nous ont fait confiance ». À publier avec l’accord du client.</p>
      <AdminImageField v-model="f.logo" folder="realisations" :name="f.slug && `${f.slug}-logo`" removable hint="Logo clair sur fond transparent (PNG ou WebP), 400 px de large au moins : il est affiché sur fond sombre." />
    </fieldset>

    <fieldset>
      <legend>English</legend>
      <div class="adm-grid">
        <label class="adm-field">Project type or industry<input v-model="f.label_en" type="text" maxlength="80"></label>
        <label class="adm-field">Key result<input v-model="f.metric_en" type="text" maxlength="40"></label>
        <label class="adm-field adm-span">Introduction
          <textarea v-model="f.description_en" rows="4" maxlength="1200" />
          <small>Un champ vide reprend le texte français.</small>
        </label>
        <label class="adm-field adm-span">Context and challenge<textarea v-model="f.context_en" rows="4" maxlength="2000" /></label>
        <label class="adm-field adm-span">What we did<textarea v-model="f.work_en" rows="5" maxlength="3000" /></label>
        <label class="adm-field adm-span">Results<textarea v-model="f.results_en" rows="4" maxlength="2000" /></label>
        <label class="adm-field">Key figures<textarea v-model="f.kpis_en" rows="4" maxlength="300" placeholder="5M | paid reach" /></label>
        <label class="adm-field">Project duration<input v-model="f.duration_en" type="text" maxlength="40" placeholder="6 weeks"></label>
        <label class="adm-field adm-span">Client quote<textarea v-model="f.quote_en" rows="3" maxlength="600" /></label>
        <label class="adm-field">Author’s job title<input v-model="f.quote_role_en" type="text" maxlength="80"></label>
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
const text = (v?: string | null) => v?.trim() || null
// Champs ajoutés par la migration 20261006000000_kps_case_studies.sql
const STUDY_FIELDS = ['logo', 'context', 'work', 'results', 'kpis', 'duration', 'quote', 'quote_author', 'quote_role', 'quote_photo', 'context_en', 'work_en', 'results_en', 'kpis_en', 'duration_en', 'quote_en', 'quote_role_en'] as const

async function save() {
  error.value = ''
  if (!/^[a-z0-9-]+$/.test(f.slug)) { error.value = 'Slug invalide : lettres minuscules, chiffres et tirets uniquement.'; return }
  if (!f.img) { error.value = 'Ajoutez un visuel avant d’enregistrer.'; return }
  saving.value = true
  const { id, ...fields } = f
  const row: Record<string, unknown> = {
    ...fields, client: f.client.trim(), label: f.label.trim(),
    description: text(f.description), metric: text(f.metric), url: text(f.url),
    label_en: text(f.label_en), description_en: text(f.description_en), metric_en: text(f.metric_en)
  }
  // Un champ d'étude de cas vide n'est envoyé que si sa colonne existe déjà (ligne relue depuis la base) :
  // tant que la migration n'est pas exécutée, l'enregistrement des autres champs continue de fonctionner.
  for (const k of STUDY_FIELDS) {
    row[k] = text(f[k])
    if (row[k] === null && !(props.project && k in props.project)) delete row[k]
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
