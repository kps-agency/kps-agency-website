<template>
  <div class="adm-head">
    <div>
      <h1>Audience</h1>
      <p class="adm-sub">Mesurée par Google Analytics, uniquement auprès des visiteurs qui ont accepté les cookies de mesure : la fréquentation réelle est plus élevée que ces chiffres.</p>
    </div>
    <AdminPeriod v-if="configured" v-model="days" />
  </div>

  <section v-if="!configured" class="adm-card adm-setup">
    <h2>Google Analytics n’est pas encore relié au tableau de bord</h2>
    <ol>
      <li>Dans Google Cloud, activez « Google Analytics Data API » sur le projet du compte de service.</li>
      <li>Dans Google Analytics → Admin → Gestion des accès à la propriété, ajoutez l’adresse du compte de service comme Lecteur.</li>
      <li>Dans Vercel, renseignez <code>NUXT_GOOGLE_SERVICE_ACCOUNT_EMAIL</code>, <code>NUXT_GOOGLE_PRIVATE_KEY</code> et <code>NUXT_GA_PROPERTY_ID</code> (identifiant numérique de la propriété), puis redéployez.</li>
    </ol>
    <p class="adm-note">Le détail figure dans <code>.env.example</code>.</p>
  </section>

  <template v-else>
    <p v-if="error" class="adm-error" role="alert">{{ error }}</p>
    <p v-if="loading && !data" class="adm-note">Chargement…</p>
    <div v-if="data" class="adm-stack" :aria-busy="loading">
      <div class="adm-kpis">
        <AdminStat label="Visites" :value="fmtInt(data.totals.sessions)" :change="delta(data.totals.sessions, data.previous.sessions)" />
        <AdminStat label="Visiteurs" :value="fmtInt(data.totals.users)" :change="delta(data.totals.users, data.previous.users)" />
        <AdminStat label="Pages vues" :value="fmtInt(data.totals.views)" :change="delta(data.totals.views, data.previous.views)" />
        <AdminStat label="Visites engagées" :value="fmtPct(data.totals.engagementRate, 0)" :change="delta(data.totals.engagementRate, data.previous.engagementRate)" />
        <AdminStat label="Durée moyenne" :value="fmtDuration(data.totals.avgDuration)" :change="delta(data.totals.avgDuration, data.previous.avgDuration)" />
      </div>

      <section class="adm-card">
        <h2>Visites par jour <small>{{ data.days }} derniers jours</small></h2>
        <AdminChartLine :points="data.byDay.map(d => ({ date: d.date, value: d.sessions }))" label="Visites par jour" />
      </section>

      <div class="adm-cols">
        <section class="adm-card"><h2>Pages les plus vues</h2><AdminBarList :items="data.pages" /></section>
        <section class="adm-card"><h2>D’où viennent les visites</h2><AdminBarList :items="data.channels.map(c => ({ ...c, label: CHANNELS[c.label] ?? c.label }))" /></section>
      </div>
      <div class="adm-cols adm-cols--3">
        <section class="adm-card"><h2>Appareils</h2><AdminBarList :items="data.devices.map(d => ({ ...d, label: DEVICES[d.label] ?? d.label }))" /></section>
        <section class="adm-card"><h2>Pays</h2><AdminBarList :items="data.countries" /></section>
        <section class="adm-card">
          <h2>Conversions mesurées</h2>
          <AdminBarList :items="data.events.map(e => ({ ...e, label: EVENTS[e.label] ?? e.label }))" empty="Aucune conversion mesurée sur la période." />
          <p class="adm-note note">Le nombre exact de demandes figure dans « Demandes » : il ne dépend pas des cookies.</p>
        </section>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
// Audience du site : Google Analytics 4, lu par le serveur (server/api/admin/analytics.post.ts)
interface Item { label: string; value: number }
interface Totals { sessions: number; users: number; views: number; engagementRate: number; avgDuration: number }
interface Audience { days: number; totals: Totals; previous: Totals; byDay: { date: string; sessions: number }[]; pages: Item[]; channels: Item[]; devices: Item[]; countries: Item[]; events: Item[] }

const CHANNELS: Record<string, string> = { 'Organic Search': 'Moteurs de recherche', Direct: 'Accès direct', Referral: 'Autres sites', 'Organic Social': 'Réseaux sociaux', 'Paid Search': 'Publicité sur les moteurs', 'Paid Social': 'Publicité sur les réseaux', Email: 'E-mail', Unassigned: 'Non attribué' }
const DEVICES: Record<string, string> = { desktop: 'Ordinateur', mobile: 'Mobile', tablet: 'Tablette' }
const EVENTS: Record<string, string> = { generate_lead: 'Demandes de devis envoyées', book_call: 'Appels réservés' }

const { api, integrations } = useAdmin()
const configured = computed(() => !!integrations.value?.analytics)
const days = ref(28)
const data = ref<Audience | null>(null)
const loading = ref(false)
const error = ref('')

async function load() {
  if (!configured.value) return
  loading.value = true
  error.value = ''
  try {
    data.value = await api<Audience>('analytics', { days: days.value })
  } catch (err) {
    error.value = adminError(err)
  } finally {
    loading.value = false
  }
}
watch([days, configured], load, { immediate: true })
</script>

<style scoped>
.note { margin-top: 16px; }
[aria-busy="true"] { opacity: .6; }
</style>
