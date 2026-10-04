<template>
  <form class="adm-form" @submit.prevent="save">
    <div class="adm-form__head">
      <h2>{{ post ? 'Modifier l’article' : 'Nouvel article' }}</h2>
      <div class="adm-form__actions">
        <button type="button" class="adm-btn" @click="emit('close')">Retour à la liste</button>
        <button type="submit" class="adm-btn adm-btn--primary" :disabled="saving">{{ saving ? 'Enregistrement…' : 'Enregistrer' }}</button>
      </div>
    </div>
    <p v-if="error" class="adm-error" role="alert">{{ error }}</p>

    <div class="adm-grid">
      <label class="adm-field adm-span">Titre<input v-model="f.title" type="text" required maxlength="160" @input="autoSlug"></label>
      <label class="adm-field">Langue
        <select v-model="f.lang"><option value="fr">Français</option><option value="en">English</option></select>
      </label>
      <label class="adm-field">Slug (adresse de l’article)
        <input v-model="f.slug" type="text" required pattern="[a-z0-9\-]+" maxlength="80" @input="slugTouched = true">
        <small>{{ f.lang === 'en' ? '/en/blog/' : '/blog/' }}{{ f.slug || '…' }}</small>
      </label>
      <label class="adm-field adm-span">Description (résultats Google et listes)
        <textarea v-model="f.description" rows="2" maxlength="300" />
        <small>{{ f.description.length }} caractères — viser 120 à 160</small>
      </label>
      <label class="adm-field adm-span">Titre court pour Google (facultatif)
        <input v-model="f.seo_title" type="text" maxlength="70">
        <small>Remplace le titre dans l’onglet et les résultats de recherche s’il est trop long.</small>
      </label>
    </div>

    <fieldset>
      <legend>Publication</legend>
      <div class="adm-grid adm-grid--3">
        <label class="adm-field">Date de publication<input v-model="f.date" type="date" required></label>
        <label class="adm-field">Mise à jour (facultatif)<input v-model="f.updated" type="date"></label>
        <label class="adm-field">Auteur<input v-model="f.author" type="text" required maxlength="80"></label>
        <label class="adm-check adm-span"><input v-model="f.draft" type="checkbox">Brouillon (non publié)</label>
        <p class="adm-note adm-span">Un article est en ligne s’il n’est pas en brouillon et que sa date est passée, après une publication du site.</p>
      </div>
    </fieldset>

    <fieldset>
      <legend>Classement</legend>
      <div class="adm-grid adm-grid--3">
        <label class="adm-field">Secteur
          <select v-model="f.sector"><option v-for="(label, key) in BLOG_SECTORS" :key="key" :value="key">{{ label.fr }}</option></select>
        </label>
        <label class="adm-field">Service lié (encart en fin d’article)
          <select v-model="f.service"><option value="">Aucun</option><option v-for="s in SERVICES" :key="s.slug" :value="s.slug">{{ s.eyebrow }}</option></select>
        </label>
        <label class="adm-field">Traduction
          <select v-model="f.translation"><option value="">Aucune</option><option v-for="o in translations" :key="o.slug" :value="o.slug">{{ o.title }}</option></select>
          <small>Article équivalent en {{ f.lang === 'en' ? 'français' : 'anglais' }}.</small>
        </label>
        <label class="adm-field adm-span">Mots-clés<input v-model="tags" type="text" placeholder="prix, site vitrine, PME"><small>Séparés par des virgules.</small></label>
      </div>
    </fieldset>

    <fieldset>
      <legend>Image de couverture</legend>
      <div class="adm-grid">
        <AdminImageField v-model="f.cover" class="adm-span" folder="blog" :name="f.slug" removable />
        <label class="adm-field adm-span">Texte alternatif de l’image<input v-model="f.cover_alt" type="text" maxlength="200"></label>
      </div>
    </fieldset>

    <fieldset>
      <legend>Contenu (Markdown)</legend>
      <div class="body__bar">
        <div class="body__tabs" role="tablist">
          <button type="button" role="tab" :aria-selected="!preview" :class="{ 'is-on': !preview }" @click="preview = false">Rédaction</button>
          <button type="button" role="tab" :aria-selected="preview" :class="{ 'is-on': preview }" @click="preview = true">Aperçu</button>
        </div>
        <label v-if="!preview" class="adm-btn adm-btn--sm" :class="{ 'is-off': inserting || !f.slug }">
          {{ inserting ? 'Envoi…' : 'Insérer une image' }}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" :disabled="inserting || !f.slug" @change="insertImage">
        </label>
        <span class="adm-note">{{ words }} mots · {{ minutes }} min de lecture</span>
      </div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-if="preview" class="body__preview" v-html="html" />
      <textarea v-else ref="area" v-model="f.body" class="body__area" rows="24" required spellcheck="true" placeholder="## Premier intertitre&#10;&#10;Votre texte en Markdown…" />
      <p class="adm-note">Intertitres : <code>## Titre</code> · gras : <code>**texte**</code> · lien : <code>[texte](https://…)</code> · liste : <code>- élément</code></p>
    </fieldset>

    <div class="adm-form__actions">
      <button type="submit" class="adm-btn adm-btn--primary" :disabled="saving">{{ saving ? 'Enregistrement…' : 'Enregistrer' }}</button>
      <button type="button" class="adm-btn" @click="emit('close')">Retour à la liste</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { BLOG_SECTORS, readingMinutes } from '#shared/blog'
import { SERVICES } from '~/data/content'
import { renderArticle } from '~/data/blog'

const props = defineProps<{ post: PostRow | null; posts: PostRow[] }>()
const emit = defineEmits<{ close: []; saved: [] }>()
const { db, uploadImage, setPending } = useAdmin()
const cloud = useRuntimeConfig().public.cloudinaryCloudName

const today = new Date().toISOString().slice(0, 10)
const f = reactive<PostRow>(props.post
  ? { ...props.post, seo_title: props.post.seo_title ?? '', service: props.post.service ?? '', translation: props.post.translation ?? '', cover_alt: props.post.cover_alt ?? '' }
  : { lang: 'fr', slug: '', title: '', seo_title: '', description: '', date: today, updated: null, sector: 'pme', service: '', tags: [], author: 'KPS Agency', cover: null, cover_alt: '', translation: '', body: '', draft: true })
const tags = ref(f.tags.join(', '))

// Le slug suit le titre tant qu'il n'a pas été saisi à la main (jamais pour un article existant : son adresse est déjà référencée)
const slugTouched = ref(!!props.post)
const autoSlug = () => { if (!slugTouched.value) f.slug = adminSlug(f.title) }

const translations = computed(() => props.posts.filter(p => p.lang !== f.lang))
const preview = ref(false)
const html = computed(() => renderArticle(f.body).html)
const words = computed(() => f.body.split(/\s+/).filter(Boolean).length)
const minutes = computed(() => readingMinutes(f.body))

const area = ref<HTMLTextAreaElement>()
const inserting = ref(false)
const saving = ref(false)
const error = ref('')

/** Envoie une image et insère sa balise Markdown à l'endroit du curseur */
async function insertImage(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  error.value = ''
  inserting.value = true
  try {
    const name = `${f.slug}-${Date.now().toString(36)}`
    await uploadImage(file, 'blog', name)
    const md = `\n\n![Description de l’image](https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto:eco,c_limit,w_1600/kps/blog/${name})\n\n`
    const at = area.value?.selectionStart ?? f.body.length
    f.body = f.body.slice(0, at) + md + f.body.slice(at)
  } catch (err) {
    error.value = adminError(err)
  } finally {
    inserting.value = false
  }
}

async function save() {
  error.value = ''
  if (!/^[a-z0-9-]+$/.test(f.slug)) { error.value = 'Slug invalide : lettres minuscules, chiffres et tirets uniquement.'; return }
  saving.value = true
  const { id, ...fields } = f
  const row = {
    ...fields,
    title: f.title.trim(), description: f.description.trim(), author: f.author.trim() || 'KPS Agency',
    seo_title: f.seo_title?.trim() || null, service: f.service || null, translation: f.translation || null,
    cover_alt: f.cover_alt?.trim() || null, updated: f.updated || null,
    tags: tags.value.split(',').map(t => t.trim()).filter(Boolean)
  }
  const { error: err } = id ? await db().from('blog_posts').update(row).eq('id', id) : await db().from('blog_posts').insert(row)
  saving.value = false
  if (err) { error.value = adminError(err); return }
  setPending(true)
  emit('saved')
}
</script>

<style scoped>
.body__bar { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; }
.body__bar .adm-note { margin-left: auto; }
.body__tabs { display: flex; border: 1px solid var(--line-2); border-radius: var(--r-sm); overflow: hidden; }
.body__tabs button { padding: 6px 14px; background: none; border: 0; color: var(--muted); font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; }
.body__tabs button.is-on { background: var(--accent-soft); color: var(--accent-light); }
.body__bar input[type="file"] { position: absolute; width: 1px; height: 1px; opacity: 0; }
.is-off { opacity: .5; cursor: not-allowed; }
.body__area { width: 100%; padding: 14px; border: 1px solid var(--line-2); border-radius: var(--r-sm); background: var(--deep); color: var(--ink); font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 14px; line-height: 1.6; resize: vertical; }
.body__area:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
.body__preview { min-height: 300px; padding: 20px; border: 1px solid var(--line-2); border-radius: var(--r-sm); background: var(--deep); font-size: 17px; line-height: 1.7; overflow-wrap: anywhere; }
.body__preview :deep(h2) { font-size: 26px; margin: 1.4em 0 .5em; }
.body__preview :deep(h3) { font-size: 20px; margin: 1.2em 0 .4em; }
.body__preview :deep(a) { color: var(--accent-light); text-decoration: underline; }
.body__preview :deep(img) { max-width: 100%; height: auto; border-radius: var(--r-md); }
.body__preview :deep(table) { border-collapse: collapse; display: block; overflow-x: auto; }
.body__preview :deep(th), .body__preview :deep(td) { border: 1px solid var(--line-2); padding: 8px 12px; text-align: left; }
.adm-form code { background: var(--line); padding: 1px 6px; border-radius: 4px; font-size: 13px; }
</style>
