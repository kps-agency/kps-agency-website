<template>
  <div class="adm-head">
    <div>
      <h1>Rendez-vous <small>{{ shown.length }}</small></h1>
      <p class="adm-sub">Les appels réservés depuis la page « Réserver un appel ». Le créneau lui-même se déplace ou s’annule dans l’agenda : ici, vous suivez ce qu’il est devenu.</p>
    </div>
    <div class="adm-seg" role="group" aria-label="Période">
      <button type="button" :class="{ 'is-on': !past }" :aria-pressed="!past" @click="past = false">À venir</button>
      <button type="button" :class="{ 'is-on': past }" :aria-pressed="past" @click="past = true">Passés</button>
    </div>
  </div>

  <p v-if="error" class="adm-error" role="alert">{{ error }}</p>
  <p v-if="loading" class="adm-note">Chargement…</p>
  <p v-else-if="!shown.length && !error" class="adm-note">{{ past ? 'Aucun rendez-vous passé.' : 'Aucun rendez-vous à venir.' }}</p>
  <ul v-else class="adm-list">
    <li v-for="b in shown" :key="b.id" class="adm-row">
      <time class="when" :datetime="b.start_at">
        <strong>{{ new Date(b.start_at).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }) }}</strong>
        <span>{{ new Date(b.start_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }}</span>
      </time>
      <div class="adm-row__main">
        <span class="name">{{ b.name }}<template v-if="b.company"> · {{ b.company }}</template></span>
        <span class="adm-note">
          {{ b.mode === 'visio' ? 'Visio' : 'Téléphone' }} ·
          <a class="adm-link" :href="`mailto:${b.email}`">{{ b.email }}</a><template v-if="b.phone"> · <a class="adm-link" :href="`tel:${b.phone.replace(/\s/g, '')}`">{{ b.phone }}</a></template>
        </span>
        <span v-if="b.message" class="adm-note msg">« {{ b.message }} »</span>
      </div>
      <a v-if="b.meet_link && !past" :href="b.meet_link" target="_blank" rel="noopener noreferrer" class="adm-btn adm-btn--sm">Rejoindre la visio</a>
      <label class="status">
        <span class="sr-only">Statut du rendez-vous de {{ b.name }}</span>
        <select :value="b.status" :disabled="saving === b.id" @change="setStatus(b, ($event.target as HTMLSelectElement).value as BookingRow['status'])">
          <option v-for="(label, id) in BOOKING_STATUS" :key="id" :value="id">{{ label }}</option>
        </select>
      </label>
    </li>
  </ul>
</template>

<script setup lang="ts">
// Demandes d'appel (table bookings). L'événement d'agenda (kSuite ou Google) n'est pas modifié depuis ici.
const { db } = useAdmin()

const bookings = ref<BookingRow[]>([])
const loading = ref(true)
const error = ref('')
const past = ref(false)
const saving = ref('')

const now = Date.now()
const shown = computed(() => {
  const list = bookings.value.filter(b => (Date.parse(b.end_at) < now) === past.value)
  // À venir : le plus proche d'abord ; passés : le plus récent d'abord
  return list.sort((a, b) => (past.value ? -1 : 1) * (Date.parse(a.start_at) - Date.parse(b.start_at)))
})

async function load() {
  loading.value = true
  const { data, error: err } = await db().from('bookings').select('*').order('start_at', { ascending: false }).limit(500)
  loading.value = false
  if (err) { error.value = adminError(err); return }
  bookings.value = data as BookingRow[]
}

async function setStatus(b: BookingRow, status: BookingRow['status']) {
  error.value = ''
  saving.value = b.id
  const { error: err } = await db().from('bookings').update({ status }).eq('id', b.id)
  saving.value = ''
  if (err) { error.value = adminError(err); return }
  b.status = status
}

onMounted(load)
</script>

<style scoped>
.when { display: flex; flex-direction: column; gap: 2px; min-width: 104px; font-size: 13px; color: var(--muted-2); }
.when strong { font-size: 15px; color: var(--ink); text-transform: capitalize; }
.name { font-weight: 700; font-size: 16px; }
.msg { font-style: italic; }
.status select { padding: 7px 10px; border: 1px solid var(--line-2); border-radius: var(--r-sm); background: var(--deep); color: var(--ink); font: inherit; font-size: 13px; font-weight: 600; }
</style>
