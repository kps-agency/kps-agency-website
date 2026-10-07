<template>
  <div class="adm-head">
    <div>
      <h1>Demandes <small>{{ shown.length }}</small></h1>
      <p class="adm-sub">Les demandes de devis, de contact et d’audit envoyées depuis le site. Changez le statut au fil du suivi : il alimente les chiffres de la vue d’ensemble.</p>
    </div>
    <button type="button" class="adm-btn" :disabled="!shown.length" @click="exportCsv">Exporter en CSV</button>
  </div>

  <div class="filters">
    <div class="adm-seg" role="group" aria-label="Filtrer par statut">
      <button v-for="f in FILTERS" :key="f.id" type="button" :class="{ 'is-on': filter === f.id }" :aria-pressed="filter === f.id" @click="filter = f.id">{{ f.label }} <span class="filters__n">{{ counts[f.id] ?? 0 }}</span></button>
    </div>
    <input v-model="search" type="search" class="adm-search" placeholder="Nom, société, e-mail…" aria-label="Rechercher une demande">
  </div>

  <p v-if="error" class="adm-error" role="alert">{{ error }}</p>
  <p v-if="loading" class="adm-note">Chargement…</p>
  <p v-else-if="!shown.length && !error" class="adm-note">{{ leads.length ? 'Aucune demande ne correspond à ce filtre.' : 'Aucune demande reçue pour l’instant.' }}</p>
  <ul v-else class="adm-list">
    <li v-for="l in shown" :key="l.id" class="dem">
      <div class="adm-row">
        <div class="adm-row__main">
          <button type="button" class="adm-row__title" :aria-expanded="open === l.id" @click="toggle(l)">{{ l.name }}<template v-if="l.company"> · {{ l.company }}</template></button>
          <span class="adm-note">{{ fmtDateTime(l.created_at) }} · {{ LEAD_SOURCE[l.source] ?? l.source }}{{ needs(l) ? ` · ${needs(l)}` : '' }}</span>
        </div>
        <span class="adm-badge" :class="leadBadge(l.status)">{{ LEAD_STATUS[l.status] }}</span>
        <div class="adm-row__actions">
          <a :href="`mailto:${l.email}`" class="adm-btn adm-btn--sm">Répondre</a>
          <button type="button" class="adm-btn adm-btn--sm" @click="toggle(l)">{{ open === l.id ? 'Fermer' : 'Ouvrir' }}</button>
        </div>
      </div>

      <div v-if="open === l.id" class="dem__detail">
        <dl>
          <div><dt>E-mail</dt><dd><a class="adm-link" :href="`mailto:${l.email}`">{{ l.email }}</a></dd></div>
          <div v-if="l.phone"><dt>Téléphone</dt><dd><a class="adm-link" :href="`tel:${l.phone.replace(/\s/g, '')}`">{{ l.phone }}</a></dd></div>
          <div v-if="site(l)"><dt>Site actuel</dt><dd><a class="adm-link" :href="site(l)" target="_blank" rel="noopener noreferrer">{{ l.website }}</a></dd></div>
          <div v-if="l.budget"><dt>Budget</dt><dd>{{ l.budget }}</dd></div>
          <div v-if="l.timing"><dt>Échéance</dt><dd>{{ l.timing }}</dd></div>
          <div><dt>Langue</dt><dd>{{ l.locale === 'en' ? 'Anglais' : 'Français' }}</dd></div>
        </dl>
        <p v-if="l.message" class="dem__msg">{{ l.message }}</p>
        <div class="adm-grid">
          <label class="adm-field">Statut
            <select v-model="draft.status"><option v-for="(label, id) in LEAD_STATUS" :key="id" :value="id">{{ label }}</option></select>
          </label>
          <label class="adm-field adm-span">Notes internes
            <textarea v-model="draft.notes" rows="3" maxlength="4000" placeholder="Échanges, montant du devis, prochaine relance…" />
            <small>Visibles uniquement dans ce tableau de bord.</small>
          </label>
        </div>
        <div class="adm-form__actions">
          <button type="button" class="adm-btn adm-btn--primary" :disabled="saving" @click="save(l)">{{ saving ? 'Enregistrement…' : 'Enregistrer le suivi' }}</button>
          <button type="button" class="adm-btn adm-btn--danger" :disabled="saving" @click="remove(l)">Supprimer la demande</button>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
// Demandes de contact, de devis et d'audit (table leads). Données personnelles : lecture et écriture réservées aux comptes de la table admins (RLS).
const { db } = useAdmin()

const FILTERS = [{ id: 'open', label: 'À traiter' }, { id: 'new', label: 'Nouvelles' }, { id: 'won', label: 'Gagnées' }, { id: 'lost', label: 'Perdues' }, { id: 'all', label: 'Toutes' }] as const
type Filter = typeof FILTERS[number]['id']
// « À traiter » : tout ce qui n'est ni conclu ni écarté
const OPEN: LeadRow['status'][] = ['new', 'contacted', 'quoted']

const leads = ref<LeadRow[]>([])
const loading = ref(true)
const error = ref('')
const filter = ref<Filter>('open')
const search = ref('')
const open = ref('')
const saving = ref(false)
const draft = reactive<{ status: LeadRow['status']; notes: string }>({ status: 'new', notes: '' })

const matches = (l: LeadRow, f: Filter) => f === 'all' ? l.status !== 'spam' : f === 'open' ? OPEN.includes(l.status) : l.status === f
const counts = computed(() => Object.fromEntries(FILTERS.map(f => [f.id, leads.value.filter(l => matches(l, f.id)).length])) as Record<Filter, number>)
const shown = computed(() => {
  const q = search.value.trim().toLowerCase()
  return leads.value.filter(l => matches(l, filter.value) && (!q || [l.name, l.company, l.email, l.message].some(v => v?.toLowerCase().includes(q))))
})
const needs = (l: LeadRow) => l.services.map(s => LEAD_SERVICE[s] ?? s).join(', ')
/** Adresse du site saisie par le prospect, rendue cliquable uniquement si c'est bien une adresse web */
const site = (l: LeadRow) => {
  const url = l.website ? (/^https?:\/\//i.test(l.website) ? l.website : `https://${l.website}`) : ''
  return /^https?:\/\/[^\s/]+\.[^\s]+$/i.test(url) ? url : ''
}

async function load() {
  loading.value = true
  const { data, error: err } = await db().from('leads').select('*').order('created_at', { ascending: false }).limit(1000)
  loading.value = false
  if (err) { error.value = adminError(err); return }
  leads.value = data as LeadRow[]
}

function toggle(l: LeadRow) {
  open.value = open.value === l.id ? '' : l.id
  draft.status = l.status
  draft.notes = l.notes ?? ''
}

async function save(l: LeadRow) {
  error.value = ''
  saving.value = true
  const { error: err } = await db().from('leads').update({ status: draft.status, notes: draft.notes.trim() || null }).eq('id', l.id)
  saving.value = false
  if (err) { error.value = adminError(err); return }
  Object.assign(l, { status: draft.status, notes: draft.notes.trim() || null })
  open.value = ''
}

async function remove(l: LeadRow) {
  if (!confirm(`Supprimer définitivement la demande de ${l.name} ? Ses coordonnées et son message seront effacés.`)) return
  const { error: err } = await db().from('leads').delete().eq('id', l.id)
  if (err) { error.value = adminError(err); return }
  leads.value = leads.value.filter(x => x.id !== l.id)
}

function exportCsv() {
  downloadCsv(`demandes-kps-${localDay(new Date())}.csv`,
    ['Date', 'Statut', 'Origine', 'Nom', 'Société', 'E-mail', 'Téléphone', 'Site', 'Besoins', 'Budget', 'Échéance', 'Message', 'Notes'],
    shown.value.map(l => [fmtDateTime(l.created_at), LEAD_STATUS[l.status], LEAD_SOURCE[l.source] ?? l.source, l.name, l.company, l.email, l.phone, l.website, needs(l), l.budget, l.timing, l.message, l.notes]))
}

onMounted(load)
</script>

<style scoped>
.filters { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
.filters__n { margin-left: 4px; color: var(--muted-2); font-weight: 400; font-variant-numeric: tabular-nums; }
.dem + .dem { border-top: 1px solid var(--line); }
.dem__detail { display: flex; flex-direction: column; gap: 16px; padding: 4px 18px 20px; }
.dem__detail dl { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px 24px; margin: 0; }
.dem__detail dt { font-size: 12px; font-weight: 700; color: var(--muted-2); text-transform: uppercase; letter-spacing: .5px; }
.dem__detail dd { margin: 2px 0 0; overflow-wrap: anywhere; }
.dem__msg { padding: 14px 16px; border-left: 2px solid var(--accent); background: var(--band); border-radius: 0 var(--r-sm) var(--r-sm) 0; white-space: pre-wrap; overflow-wrap: anywhere; line-height: 1.6; color: var(--muted); }
</style>
