<template>
  <AdminResource
    table="promos" title="Promotions" singular="une promotion" :fields="FIELDS" :defaults="{ active: true }" :describe="describe"
    intro="Une fenêtre qui s’ouvre quelques secondes après l’arrivée sur le site et propose l’offre en échange d’une adresse e-mail. Une seule promotion s’affiche à la fois : la première de la liste qui est active et dont la période contient la date du jour. Un visiteur qui la ferme ne la revoit pas avant une semaine."
    empty="Aucune promotion : le site n’ouvre pas de fenêtre."
  />

  <!-- Adresses laissées dans la fenêtre : toujours à jour, sans publication -->
  <section class="adm-card signups">
    <div class="adm-head">
      <div>
        <h2>Adresses recueillies <small>{{ signups.length }}</small></h2>
        <p class="adm-sub">Chaque adresse vous est aussi envoyée par e-mail. Ces personnes ont demandé à recevoir l’offre : ne les utilisez pas pour d’autres envois.</p>
      </div>
      <button type="button" class="adm-btn" :disabled="!signups.length" @click="exportCsv">Exporter en CSV</button>
    </div>
    <p v-if="error" class="adm-error" role="alert">{{ error }}</p>
    <p v-if="loading" class="adm-note">Chargement…</p>
    <p v-else-if="!signups.length && !error" class="adm-note">Aucune adresse pour l’instant.</p>
    <div v-else-if="signups.length" class="adm-table-wrap">
      <table class="adm-table">
        <thead><tr><th scope="col">E-mail</th><th scope="col">Offre</th><th scope="col">Date</th><th scope="col">Page</th><th scope="col"><span class="sr-only">Actions</span></th></tr></thead>
        <tbody>
          <tr v-for="s in signups" :key="s.id">
            <td class="wrap"><a class="adm-link" :href="`mailto:${s.email}`">{{ s.email }}</a></td>
            <td class="wrap">{{ s.promo_text ?? '—' }}</td>
            <td>{{ fmtDateTime(s.created_at) }}</td>
            <td>{{ s.page ?? '—' }}<template v-if="s.locale === 'en'"> · EN</template></td>
            <td class="num"><button type="button" class="adm-btn adm-btn--sm adm-btn--danger" @click="remove(s)">Supprimer</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ResourceField } from '../Resource.vue'

// Promotions affichées en fenêtre (table promos, composant PromoPopup) et adresses recueillies (table promo_signups)
interface Signup { id: string; created_at: string; email: string; promo_text: string | null; locale: string; page: string | null }

const FIELDS: ResourceField[] = [
  { key: 'text', label: 'Titre de l’offre', required: true, max: 90, wide: true, placeholder: 'Votre audit SEO offert', hint: 'La grande phrase de la fenêtre : courte, avec le bénéfice pour le visiteur.' },
  { key: 'details', label: 'Présentation (facultatif)', type: 'textarea', max: 280, wide: true, placeholder: 'Laissez votre e-mail : nous analysons votre site et vous envoyons 5 actions prioritaires sous 48 h.' },
  { key: 'text_en', label: 'Titre en anglais (facultatif)', max: 90, wide: true, hint: 'Vide = le texte français s’affiche aussi sur la version anglaise.' },
  { key: 'details_en', label: 'Présentation en anglais (facultatif)', type: 'textarea', max: 280, wide: true },
  { key: 'cta_label', label: 'Libellé du bouton (facultatif)', max: 40, placeholder: 'Recevoir l’offre' },
  { key: 'cta_label_en', label: 'Libellé du bouton en anglais', max: 40 },
  { key: 'cta_url', label: 'Lien proposé après l’inscription (facultatif)', max: 300, wide: true, pattern: '(/|https://).*', placeholder: '/audit-gratuit', hint: 'Une page du site (/audit-gratuit, /contact…) ou une adresse complète en https://' },
  { key: 'starts_on', label: 'Début (facultatif)', type: 'date' },
  { key: 'ends_on', label: 'Fin (facultatif)', type: 'date', hint: 'Dernier jour d’affichage, inclus. La date est rappelée dans la fenêtre.' },
  { key: 'active', label: 'Promotion active', type: 'checkbox', wide: true }
]

const { db } = useAdmin()
const signups = ref<Signup[]>([])
const loading = ref(true)
const error = ref('')

const today = localDay(new Date())
function describe(p: Record<string, any>) {
  const period = p.starts_on || p.ends_on ? `${p.starts_on ? `du ${fmtDay(p.starts_on)}` : 'dès maintenant'} ${p.ends_on ? `au ${fmtDay(p.ends_on)}` : 'sans date de fin'}` : 'Sans limite de date'
  const state = !p.active ? { label: 'Désactivée' }
    : p.ends_on && p.ends_on < today ? { label: 'Terminée', cls: 'adm-badge--off' }
      : p.starts_on && p.starts_on > today ? { label: 'Programmée', cls: 'adm-badge--wait' } : { label: 'En cours', cls: 'adm-badge--on' }
  const count = signups.value.filter(s => s.promo_text === p.text).length
  return { title: p.text, sub: `${period} · ${count} adresse${count > 1 ? 's' : ''} recueillie${count > 1 ? 's' : ''}`, badges: [state] }
}

async function load() {
  const { data, error: err } = await db().from('promo_signups').select('*').order('created_at', { ascending: false }).limit(2000)
  loading.value = false
  if (err) { error.value = adminError(err); return }
  signups.value = data as Signup[]
}

async function remove(s: Signup) {
  if (!confirm(`Supprimer définitivement l’adresse ${s.email} ?`)) return
  const { error: err } = await db().from('promo_signups').delete().eq('id', s.id)
  if (err) { error.value = adminError(err); return }
  signups.value = signups.value.filter(x => x.id !== s.id)
}

function exportCsv() {
  downloadCsv(`adresses-promotion-kps-${today}.csv`, ['Date', 'E-mail', 'Offre', 'Langue', 'Page'],
    signups.value.map(s => [fmtDateTime(s.created_at), s.email, s.promo_text, s.locale, s.page]))
}

onMounted(load)
</script>

<style scoped>
.signups { margin-top: 32px; }
.signups .adm-head { margin-bottom: 16px; }
</style>
