<template>
  <form class="adm-form" @submit.prevent="save">
    <div class="adm-form__head">
      <h2>{{ base.crumb }}</h2>
      <div class="adm-form__actions">
        <button type="button" class="adm-btn" @click="emit('close')">Retour à la liste</button>
        <button v-if="customised" type="button" class="adm-btn adm-btn--danger" :disabled="saving" @click="reset">Revenir aux textes d’origine</button>
        <button type="submit" class="adm-btn adm-btn--primary" :disabled="saving">{{ saving ? 'Enregistrement…' : 'Enregistrer' }}</button>
      </div>
    </div>
    <p v-if="error" class="adm-error" role="alert">{{ error }}</p>

    <div class="adm-seg" role="group" aria-label="Langue des textes">
      <button type="button" :class="{ 'is-on': lang === 'fr' }" :aria-pressed="lang === 'fr'" @click="lang = 'fr'">Français</button>
      <button type="button" :class="{ 'is-on': lang === 'en' }" :aria-pressed="lang === 'en'" @click="lang = 'en'">English</button>
    </div>

    <fieldset>
      <legend>Haut de page</legend>
      <div class="adm-grid">
        <label class="adm-field">Sur-titre<input v-model="t.eyebrow" type="text" required maxlength="80"></label>
        <label class="adm-field">Prix d’appel (facultatif)
          <input v-model="t.from" type="text" maxlength="40" placeholder="1 500 € HT">
          <small>Affiché « À partir de … ». Vide = aucun prix.</small>
        </label>
        <label class="adm-field adm-span">Titre principal<input v-model="t.h1" type="text" required maxlength="160"></label>
        <label class="adm-field adm-span">Introduction<textarea v-model="t.sub" rows="3" required maxlength="500" /></label>
      </div>
    </fieldset>

    <fieldset>
      <legend>Offres</legend>
      <div class="adm-grid">
        <label class="adm-field">Titre de la section<input v-model="t.offersTitle" type="text" maxlength="160"></label>
        <label class="adm-field">Sous-titre<input v-model="t.offersSub" type="text" maxlength="240"></label>
      </div>
      <div v-for="(o, i) in t.offers" :key="i" class="item">
        <div class="adm-grid">
          <label class="adm-field">Offre {{ i + 1 }}<input v-model="o.t" type="text" required maxlength="80"></label>
          <label class="adm-field">Étiquettes (séparées par des virgules)<input v-model="o.tags" type="text" maxlength="160"></label>
          <label class="adm-field adm-span">Description<textarea v-model="o.d" rows="2" required maxlength="500" /></label>
        </div>
        <button type="button" class="adm-btn adm-btn--sm adm-btn--danger" @click="t.offers.splice(i, 1)">Retirer cette offre</button>
      </div>
      <button type="button" class="adm-btn adm-btn--sm" @click="t.offers.push({ t: '', d: '', tags: '' })">Ajouter une offre</button>
    </fieldset>

    <fieldset>
      <legend>Bénéfices</legend>
      <label class="adm-field">Titre de la section<input v-model="t.benTitle" type="text" maxlength="160"></label>
      <div v-for="(b, i) in t.benefits" :key="i" class="item">
        <div class="adm-grid">
          <label class="adm-field">Bénéfice {{ i + 1 }}<input v-model="b.t" type="text" required maxlength="80"></label>
          <label class="adm-field">Description<textarea v-model="b.d" rows="2" required maxlength="400" /></label>
        </div>
        <button type="button" class="adm-btn adm-btn--sm adm-btn--danger" @click="t.benefits.splice(i, 1)">Retirer ce bénéfice</button>
      </div>
      <button type="button" class="adm-btn adm-btn--sm" @click="t.benefits.push({ t: '', d: '' })">Ajouter un bénéfice</button>
    </fieldset>

    <fieldset>
      <legend>Méthode</legend>
      <label class="adm-field">Titre de la section<input v-model="t.methTitle" type="text" maxlength="160"></label>
      <div v-for="(s, i) in t.steps" :key="i" class="item">
        <div class="adm-grid">
          <label class="adm-field">Étape {{ i + 1 }}<input v-model="s.t" type="text" required maxlength="80"></label>
          <label class="adm-field">Description<textarea v-model="s.d" rows="2" required maxlength="400" /></label>
        </div>
        <button type="button" class="adm-btn adm-btn--sm adm-btn--danger" @click="t.steps.splice(i, 1)">Retirer cette étape</button>
      </div>
      <button type="button" class="adm-btn adm-btn--sm" @click="t.steps.push({ t: '', d: '' })">Ajouter une étape</button>
    </fieldset>

    <fieldset>
      <legend>Appel à l’action et référencement</legend>
      <div class="adm-grid">
        <label class="adm-field adm-span">Phrase du bandeau final<input v-model="t.cta" type="text" maxlength="160"></label>
        <label class="adm-field adm-span">Titre dans Google
          <input v-model="t.seoTitle" type="text" required maxlength="70">
          <small :class="{ 'is-over': t.seoTitle.length > SEO_TITLE_MAX }">{{ t.seoTitle.length }} caractères — viser {{ SEO_TITLE_MAX }} au plus</small>
        </label>
        <label class="adm-field adm-span">Titre descriptif de la page (h1)<input v-model="t.seoH1" type="text" required maxlength="100"></label>
        <label class="adm-field adm-span">Description dans Google
          <textarea v-model="t.seoDesc" rows="2" required maxlength="300" />
          <small :class="{ 'is-over': t.seoDesc.length < SEO_DESC_MIN || t.seoDesc.length > SEO_DESC_MAX }">{{ t.seoDesc.length }} caractères — viser {{ SEO_DESC_MIN }} à {{ SEO_DESC_MAX }}</small>
        </label>
      </div>
    </fieldset>
  </form>
</template>

<script setup lang="ts">
import type { CmsServiceText } from '#shared/cms'
import { SERVICES, SERVICE_SEO, type Service } from '~/data/content'
import { SERVICES_EN, SERVICE_SEO_EN } from '~/data/content.en'

// Textes d'une expertise, dans les deux langues. Point de départ : les textes du site (code + dernière publication),
// recouverts par la ligne enregistrée dans la table services si elle existe.
const props = defineProps<{ slug: string; row: { fr: CmsServiceText; en: CmsServiceText } | null }>()
const emit = defineEmits<{ close: []; saved: [] }>()
const { db, setPending } = useAdmin()

interface Draft {
  eyebrow: string; from: string; h1: string; sub: string; offersTitle: string; offersSub: string
  offers: { t: string; d: string; tags: string }[]; benTitle: string; benefits: { t: string; d: string }[]
  methTitle: string; steps: { t: string; d: string }[]; cta: string; seoTitle: string; seoH1: string; seoDesc: string
}

const base = SERVICES.find(s => s.slug === props.slug)!
const customised = computed(() => !!props.row)

function draft(text: Partial<Service>, seo: { title: string; h1: string; desc: string }, saved: CmsServiceText = {}): Draft {
  const s = { ...text, ...saved }
  return {
    eyebrow: s.eyebrow ?? '', from: s.from ?? '', h1: s.h1 ?? '', sub: s.sub ?? '', offersTitle: s.offersTitle ?? '', offersSub: s.offersSub ?? '',
    offers: (s.offers ?? []).map(o => ({ t: o.t, d: o.d, tags: o.tags.join(', ') })),
    benTitle: s.benTitle ?? '', benefits: (s.benefits ?? []).map(b => ({ ...b })),
    methTitle: s.methTitle ?? '', steps: (s.steps ?? []).map(x => ({ t: x.t, d: x.d })), cta: s.cta ?? '',
    seoTitle: saved.seoTitle ?? seo.title, seoH1: saved.seoH1 ?? seo.h1, seoDesc: saved.seoDesc ?? seo.desc
  }
}

const drafts = reactive({
  fr: draft(base, SERVICE_SEO[props.slug]!, props.row?.fr),
  en: draft(SERVICES_EN[props.slug]!, SERVICE_SEO_EN[props.slug]!, props.row?.en)
})
const lang = ref<'fr' | 'en'>('fr')
const t = computed(() => drafts[lang.value])
const saving = ref(false)
const error = ref('')

/** Texte enregistré : offres et étapes renumérotées dans l'ordre du formulaire */
const toText = (d: Draft): CmsServiceText => ({
  eyebrow: d.eyebrow.trim(), from: d.from.trim(), h1: d.h1.trim(), sub: d.sub.trim(), offersTitle: d.offersTitle.trim(), offersSub: d.offersSub.trim(),
  offers: d.offers.map((o, i) => ({ n: String(i + 1).padStart(2, '0'), t: o.t.trim(), d: o.d.trim(), tags: o.tags.split(',').map(x => x.trim()).filter(Boolean) })),
  benTitle: d.benTitle.trim(), benefits: d.benefits.map(b => ({ t: b.t.trim(), d: b.d.trim() })),
  methTitle: d.methTitle.trim(), steps: d.steps.map((s, i) => ({ n: String(i + 1), t: s.t.trim(), d: s.d.trim() })),
  cta: d.cta.trim(), seoTitle: d.seoTitle.trim(), seoH1: d.seoH1.trim(), seoDesc: d.seoDesc.trim()
})

async function save() {
  error.value = ''
  // Les champs obligatoires de la langue masquée ne sont pas contrôlés par le navigateur
  const other = lang.value === 'fr' ? 'en' : 'fr'
  const d = drafts[other]
  if (!d.eyebrow.trim() || !d.h1.trim() || !d.sub.trim() || !d.seoTitle.trim() || !d.seoH1.trim() || !d.seoDesc.trim() || [...d.offers, ...d.benefits, ...d.steps].some(x => !x.t.trim() || !x.d.trim())) {
    lang.value = other
    error.value = `Des champs obligatoires sont vides dans la version ${other === 'fr' ? 'française' : 'anglaise'}.`
    return
  }
  saving.value = true
  const { error: err } = await db().from('services').upsert({ slug: props.slug, fr: toText(drafts.fr), en: toText(drafts.en) })
  saving.value = false
  if (err) { error.value = adminError(err); return }
  setPending(true)
  emit('saved')
}

async function reset() {
  if (!confirm(`Revenir aux textes d’origine pour « ${base.crumb} » ? Les textes modifiés ici seront supprimés.`)) return
  saving.value = true
  const { error: err } = await db().from('services').delete().eq('slug', props.slug)
  saving.value = false
  if (err) { error.value = adminError(err); return }
  setPending(true)
  emit('saved')
}
</script>

<style scoped>
fieldset { display: flex; flex-direction: column; gap: 16px; }
.item { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; padding: 14px; border: 1px solid var(--line); border-radius: var(--r-sm); background: var(--band); }
.item .adm-grid { width: 100%; }
fieldset > .adm-btn { align-self: flex-start; }
.is-over { color: var(--amber); }
</style>
