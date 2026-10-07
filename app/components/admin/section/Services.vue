<template>
  <AdminServiceForm v-if="slug" :key="slug" class="adm-card" :slug="slug" :row="rows[slug] ?? null" @close="slug = ''" @saved="saved" />
  <template v-else>
    <div class="adm-head">
      <div>
        <h1>Expertises <small>{{ SERVICES.length }}</small></h1>
        <p class="adm-sub">Les textes de chaque page d’expertise : titres, offres, bénéfices, méthode et balises Google, en français et en anglais. La liste des expertises, leurs adresses et leurs icônes restent définies dans le code du site.</p>
      </div>
    </div>
    <p v-if="error" class="adm-error" role="alert">{{ error }}</p>
    <p v-if="loading" class="adm-note">Chargement…</p>
    <ul v-else class="adm-list">
      <li v-for="s in SERVICES" :key="s.slug" class="adm-row">
        <div class="adm-row__main">
          <button type="button" class="adm-row__title" @click="open(s.slug)">{{ s.crumb }}</button>
          <span class="adm-note">/services/{{ s.slug }} · {{ rows[s.slug]?.fr.offers?.length ?? s.offers.length }} offres</span>
        </div>
        <span v-if="s.landing" class="adm-badge">Page d’atterrissage SEO</span>
        <span class="adm-badge" :class="{ 'adm-badge--wait': rows[s.slug] }">{{ rows[s.slug] ? 'Textes modifiés' : 'Textes d’origine' }}</span>
        <div class="adm-row__actions">
          <a :href="`/services/${s.slug}`" target="_blank" rel="noopener" class="adm-btn adm-btn--sm">Voir</a>
          <button type="button" class="adm-btn adm-btn--sm" @click="open(s.slug)">Modifier</button>
        </div>
      </li>
    </ul>
  </template>
</template>

<script setup lang="ts">
import type { CmsServiceText } from '#shared/cms'
import { SERVICES } from '~/data/content'

// Expertises : textes modifiés enregistrés dans Supabase (table services), appliqués par-dessus ceux du code à la publication
const { db } = useAdmin()

const rows = ref<Record<string, { fr: CmsServiceText; en: CmsServiceText }>>({})
const loading = ref(true)
const error = ref('')
const slug = ref('')

async function load() {
  loading.value = true
  const { data, error: err } = await db().from('services').select('*')
  loading.value = false
  if (err) { error.value = adminError(err); return }
  rows.value = Object.fromEntries(data.map(r => [r.slug, { fr: r.fr ?? {}, en: r.en ?? {} }]))
}

function open(s: string) {
  slug.value = s
  window.scrollTo({ top: 0 })
}

async function saved() {
  slug.value = ''
  await load()
}

onMounted(load)
</script>
