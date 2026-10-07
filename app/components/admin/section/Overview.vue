<template>
  <div class="adm-head">
    <div>
      <h1>Vue d’ensemble</h1>
      <p class="adm-sub">L’activité du site sur les {{ DAYS }} derniers jours, comparée aux {{ DAYS }} jours précédents.</p>
    </div>
  </div>
  <p v-if="error" class="adm-error" role="alert">{{ error }}</p>
  <p v-if="loading" class="adm-note">Chargement…</p>

  <div v-else class="adm-stack">
    <div class="adm-kpis">
      <AdminStat label="Demandes reçues" :value="recent.length" :change="delta(recent.length, before.length)" />
      <AdminStat label="Demandes à traiter" :value="toHandle" :hint="toHandle ? 'Nouvelles, contactées ou en attente de devis' : 'Tout est traité'" />
      <AdminStat label="Demandes gagnées" :value="won" :hint="closed ? `${fmtPct(won / closed, 0)} des demandes conclues` : 'Aucune demande conclue sur la période'" />
      <AdminStat label="Rendez-vous à venir" :value="upcoming.length" :hint="upcoming[0] ? `Prochain : ${fmtDateTime(upcoming[0].start_at)}` : 'Aucun appel réservé'" />
      <AdminStat v-if="audience" label="Visites (cookies acceptés)" :value="fmtInt(audience.totals.sessions)" :change="delta(audience.totals.sessions, audience.previous.sessions)" />
    </div>

    <section class="adm-card">
      <h2>Demandes reçues par jour <small>{{ DAYS }} derniers jours</small></h2>
      <AdminChartLine :points="byDay" label="Demandes reçues par jour" />
    </section>

    <div class="adm-cols adm-cols--3">
      <section class="adm-card">
        <h2>Suivi des demandes</h2>
        <AdminBarList :items="byStatus" empty="Aucune demande sur la période." />
      </section>
      <section class="adm-card">
        <h2>Origine des demandes</h2>
        <AdminBarList :items="bySource" empty="Aucune demande sur la période." />
      </section>
      <section class="adm-card">
        <h2>Besoins exprimés</h2>
        <AdminBarList :items="byService" empty="Aucun besoin renseigné sur la période." />
      </section>
    </div>

    <div class="adm-cols">
      <section class="adm-card">
        <h2>Dernières demandes</h2>
        <p v-if="!leads.length" class="adm-note">Aucune demande reçue pour l’instant.</p>
        <ul v-else class="mini">
          <li v-for="l in leads.slice(0, 6)" :key="l.id">
            <div>
              <strong>{{ l.name }}<template v-if="l.company"> · {{ l.company }}</template></strong>
              <span class="adm-note">{{ fmtDateTime(l.created_at) }} · {{ LEAD_SOURCE[l.source] ?? l.source }}</span>
            </div>
            <span class="adm-badge" :class="leadBadge(l.status)">{{ LEAD_STATUS[l.status] }}</span>
          </li>
        </ul>
        <button type="button" class="adm-btn adm-btn--sm more" @click="go('leads')">Toutes les demandes</button>
      </section>

      <section class="adm-card">
        <h2>Contenus</h2>
        <ul class="mini">
          <li><div><strong>Articles</strong><span class="adm-note">{{ posts.published }} publiés · {{ posts.scheduled }} programmés · {{ posts.draft }} brouillons</span></div><button type="button" class="adm-btn adm-btn--sm" @click="go('posts')">Gérer</button></li>
          <li><div><strong>Réalisations</strong><span class="adm-note">{{ projects.visible }} visibles · {{ projects.noStudy }} sans étude de cas</span></div><button type="button" class="adm-btn adm-btn--sm" @click="go('projects')">Gérer</button></li>
          <li><div><strong>Prochains rendez-vous</strong><span class="adm-note">{{ upcoming.length ? upcoming.slice(0, 2).map(b => `${b.name}, ${fmtDateTime(b.start_at)}`).join(' — ') : 'Aucun appel réservé' }}</span></div><button type="button" class="adm-btn adm-btn--sm" @click="go('bookings')">Voir</button></li>
          <li><div><strong>Mise en ligne</strong><span class="adm-note">{{ pending ? 'Des modifications attendent une publication.' : 'Le site en ligne est à jour.' }}</span></div><span class="adm-badge" :class="pending ? 'adm-badge--warn' : 'adm-badge--on'">{{ pending ? 'À publier' : 'À jour' }}</span></li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// Vue d'ensemble : chiffres calculés à partir des demandes, des rendez-vous et des contenus enregistrés dans Supabase.
const { db, api, pending, integrations } = useAdmin()
const go = useAdminGo()

// Même période que les mesures d'audience (Google Analytics : 7, 28 ou 90 jours)
const DAYS = 28
const DAY_MS = 86_400_000

const leads = ref<LeadRow[]>([])
const upcoming = ref<BookingRow[]>([])
const posts = reactive({ published: 0, scheduled: 0, draft: 0 })
const projects = reactive({ visible: 0, noStudy: 0 })
const audience = ref<{ totals: { sessions: number }; previous: { sessions: number } } | null>(null)
const loading = ref(true)
const error = ref('')

const now = Date.now()
// Le spam n'entre dans aucun chiffre
const real = computed(() => leads.value.filter(l => l.status !== 'spam'))
const recent = computed(() => real.value.filter(l => Date.parse(l.created_at) >= now - DAYS * DAY_MS))
const before = computed(() => real.value.filter(l => Date.parse(l.created_at) < now - DAYS * DAY_MS && Date.parse(l.created_at) >= now - 2 * DAYS * DAY_MS))
const toHandle = computed(() => real.value.filter(l => ['new', 'contacted', 'quoted'].includes(l.status)).length)
const won = computed(() => recent.value.filter(l => l.status === 'won').length)
const closed = computed(() => recent.value.filter(l => l.status === 'won' || l.status === 'lost').length)

const byDay = computed(() => {
  const counts: Record<string, number> = {}
  for (const l of recent.value) counts[localDay(l.created_at)] = (counts[localDay(l.created_at)] ?? 0) + 1
  return Array.from({ length: DAYS }, (_, i) => localDay(new Date(now - (DAYS - 1 - i) * DAY_MS))).map(date => ({ date, value: counts[date] ?? 0 }))
})
const tally = (keys: string[], labels: Record<string, string>) => {
  const counts: Record<string, number> = {}
  for (const k of keys) counts[k] = (counts[k] ?? 0) + 1
  return Object.entries(counts).map(([k, value]) => ({ label: labels[k] ?? k, value })).sort((a, b) => b.value - a.value)
}
const byStatus = computed(() => tally(recent.value.map(l => l.status), LEAD_STATUS))
const bySource = computed(() => tally(recent.value.map(l => l.source), LEAD_SOURCE))
const byService = computed(() => tally(recent.value.flatMap(l => l.services), LEAD_SERVICE))

async function load() {
  const today = localDay(new Date())
  const [l, b, p, r] = await Promise.all([
    // Deux périodes : la période affichée et celle qui sert de comparaison
    db().from('leads').select('*').gte('created_at', new Date(now - 2 * DAYS * DAY_MS).toISOString()).order('created_at', { ascending: false }),
    db().from('bookings').select('*').gte('start_at', new Date().toISOString()).eq('status', 'booked').order('start_at').limit(20),
    db().from('blog_posts').select('draft, date'),
    db().from('projects').select('published, description')
  ])
  loading.value = false
  const failed = [l, b, p, r].find(x => x.error)
  if (failed) error.value = adminError(failed.error)
  leads.value = (l.data ?? []) as LeadRow[]
  upcoming.value = (b.data ?? []) as BookingRow[]
  for (const post of p.data ?? []) posts[post.draft ? 'draft' : post.date > today ? 'scheduled' : 'published']++
  projects.visible = (r.data ?? []).filter(x => x.published).length
  projects.noStudy = (r.data ?? []).filter(x => x.published && !x.description).length
  // « À traiter » compte aussi les demandes plus anciennes restées ouvertes
  const older = await db().from('leads').select('*').lt('created_at', new Date(now - 2 * DAYS * DAY_MS).toISOString()).in('status', ['new', 'contacted', 'quoted'])
  if (older.data?.length) leads.value = [...leads.value, ...older.data as LeadRow[]]
}

onMounted(async () => {
  await load()
  if (integrations.value?.analytics) audience.value = await api<typeof audience.value>('analytics', { days: DAYS }).catch(() => null)
})
</script>

<style scoped>
.mini { list-style: none; margin: 0; padding: 0; }
.mini li { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 0; }
.mini li + li { border-top: 1px solid var(--line); }
.mini li > div { display: flex; flex-direction: column; gap: 3px; min-width: 0; overflow-wrap: anywhere; }
.more { margin-top: 12px; }
</style>
