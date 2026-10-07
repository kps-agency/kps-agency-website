<template>
  <div class="adm-head">
    <div>
      <h1>Performances</h1>
      <p class="adm-sub">La vitesse des pages mesurée par Google (PageSpeed Insights), la disponibilité du site et ses dernières mises en ligne.</p>
    </div>
  </div>

  <div class="adm-stack">
    <!-- Mesure de vitesse -->
    <section class="adm-card">
      <h2>Mesurer une page</h2>
      <form class="run" @submit.prevent="run">
        <label class="adm-field">Page
          <select v-model="page"><option v-for="p in PAGES" :key="p.path" :value="p.path">{{ p.label }}</option></select>
        </label>
        <div class="adm-seg" role="group" aria-label="Appareil simulé">
          <button type="button" :class="{ 'is-on': strategy === 'mobile' }" :aria-pressed="strategy === 'mobile'" @click="strategy = 'mobile'">Mobile</button>
          <button type="button" :class="{ 'is-on': strategy === 'desktop' }" :aria-pressed="strategy === 'desktop'" @click="strategy = 'desktop'">Ordinateur</button>
        </div>
        <button type="submit" class="adm-btn adm-btn--primary" :disabled="running">{{ running ? 'Mesure en cours…' : 'Lancer la mesure' }}</button>
      </form>
      <p v-if="running" class="adm-note" role="status">Google charge la page et l’analyse : comptez 20 à 40 secondes.</p>
      <p v-if="error" class="adm-error" role="alert">{{ error }}</p>

      <template v-if="last">
        <p class="adm-note when">{{ last.id ? 'Dernière mesure' : 'Mesure' }} du {{ fmtDateTime(last.created_at) }}</p>
        <div class="scores">
          <div v-for="s in scores(last)" :key="s.label" class="score">
            <svg width="72" height="72" viewBox="0 0 72 72" role="img" :aria-label="`${s.label} : ${s.value ?? '—'} sur 100, ${STATE[s.state].label}`">
              <circle cx="36" cy="36" r="31" class="score__track" />
              <circle v-if="s.value !== null" cx="36" cy="36" r="31" class="score__arc" :class="`is-${s.state}`" :stroke-dasharray="`${(s.value / 100) * CIRC} ${CIRC}`" transform="rotate(-90 36 36)" />
              <text x="36" y="42" text-anchor="middle" class="score__n">{{ s.value ?? '—' }}</text>
            </svg>
            <strong>{{ s.label }}</strong>
            <span class="adm-badge" :class="STATE[s.state].cls">{{ STATE[s.state].label }}</span>
          </div>
        </div>
        <div class="adm-table-wrap">
          <table class="adm-table">
            <thead><tr><th scope="col">Mesure</th><th scope="col" class="num">En laboratoire</th><th scope="col" class="num">Chez vos visiteurs</th><th scope="col">Repère de Google</th></tr></thead>
            <tbody>
              <tr v-for="m in metrics(last)" :key="m.label">
                <td class="wrap"><strong>{{ m.label }}</strong><br><span class="adm-note">{{ m.help }}</span></td>
                <td class="num">{{ m.lab ?? '—' }} <span v-if="m.labState" class="adm-badge" :class="STATE[m.labState].cls">{{ STATE[m.labState].label }}</span></td>
                <td class="num">{{ m.field ?? '—' }} <span v-if="m.fieldState" class="adm-badge" :class="STATE[m.fieldState].cls">{{ STATE[m.fieldState].label }}</span></td>
                <td>{{ m.target }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="adm-note">« Chez vos visiteurs » : mesures réelles des 28 derniers jours sur Chrome, publiées par Google seulement quand la page reçoit assez de visites.</p>
      </template>
    </section>

    <section v-if="history.length > 1" class="adm-card">
      <h2>Évolution du score de performance <small>{{ pageLabel }} · {{ strategy === 'mobile' ? 'mobile' : 'ordinateur' }} · {{ history.length }} mesures</small></h2>
      <AdminChartLine :points="history.map(h => ({ date: h.created_at, value: h.performance ?? 0 }))" label="Score de performance" :summary="`de ${history[0]!.performance} à ${history.at(-1)!.performance} sur 100`" />
    </section>

    <div class="adm-cols">
      <!-- Disponibilité -->
      <section class="adm-card">
        <h2>Disponibilité du site <small v-if="health">vérifiée à {{ new Date(health.checkedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }}</small></h2>
        <p v-if="healthError" class="adm-error" role="alert">{{ healthError }}</p>
        <p v-else-if="!health" class="adm-note">Vérification…</p>
        <div v-else class="adm-table-wrap">
          <table class="adm-table">
            <thead><tr><th scope="col">Adresse</th><th scope="col">État</th><th scope="col" class="num">Réponse</th></tr></thead>
            <tbody>
              <tr v-for="c in health.checks" :key="c.path">
                <td class="wrap">{{ c.path }}<span v-if="c.urls !== undefined" class="adm-note"> · {{ c.urls }} adresses déclarées</span></td>
                <td><span class="adm-badge" :class="c.ok ? 'adm-badge--on' : 'adm-badge--off'">{{ c.ok ? 'En ligne' : c.status ? `Erreur ${c.status}` : 'Injoignable' }}</span></td>
                <td class="num">{{ fmtInt(c.ms) }} ms</td>
              </tr>
            </tbody>
          </table>
        </div>
        <button type="button" class="adm-btn adm-btn--sm again" :disabled="checking" @click="checkHealth">{{ checking ? 'Vérification…' : 'Vérifier à nouveau' }}</button>
      </section>

      <!-- Déploiements -->
      <section class="adm-card" :class="{ 'adm-setup': !integrations?.vercel }">
        <h2>Dernières mises en ligne</h2>
        <template v-if="!integrations?.vercel">
          <p class="adm-note">Pour suivre ici l’avancement d’une publication, renseignez dans Vercel <code>NUXT_VERCEL_TOKEN</code> et <code>NUXT_VERCEL_PROJECT_ID</code> (et <code>NUXT_VERCEL_TEAM_ID</code> pour une équipe), puis redéployez.</p>
        </template>
        <p v-else-if="deployError" class="adm-error" role="alert">{{ deployError }}</p>
        <p v-else-if="!deployments" class="adm-note">Chargement…</p>
        <ul v-else class="deploys">
          <li v-for="d in deployments" :key="d.id">
            <div>
              <strong>{{ d.message || (d.production ? 'Publication depuis le tableau de bord' : 'Déploiement') }}</strong>
              <span class="adm-note">{{ fmtDateTime(d.createdAt) }}{{ d.seconds ? ` · ${fmtDuration(d.seconds)}` : '' }}{{ d.production ? '' : ` · aperçu (${d.branch || 'branche'})` }}</span>
            </div>
            <span class="adm-badge" :class="DEPLOY[d.state]?.cls">{{ DEPLOY[d.state]?.label ?? d.state }}</span>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// Performances : PageSpeed Insights appelé depuis le navigateur (une mesure dure 20 à 40 s, plus que le délai d'une fonction serveur),
// chaque résultat étant conservé dans la table perf_snapshots pour suivre l'évolution.
type State = 'good' | 'warn' | 'bad'
interface Snapshot {
  id?: string; created_at: string; url: string; strategy: 'mobile' | 'desktop'
  performance: number | null; accessibility: number | null; best_practices: number | null; seo: number | null
  lcp_ms: number | null; tbt_ms: number | null; fcp_ms: number | null; cls: number | null
  field_lcp_ms: number | null; field_inp_ms: number | null; field_cls: number | null
}
interface Health { checkedAt: string; checks: { path: string; status: number; ok: boolean; ms: number; urls?: number }[] }
interface Deploy { id: string; state: string; createdAt: number; seconds: number | null; production: boolean; message: string; branch: string }

const PAGES = [
  { path: '/', label: 'Accueil' }, { path: '/en', label: 'Accueil (anglais)' }, { path: '/services', label: 'Services' },
  { path: '/services/creation-site-web', label: 'Expertise : création de site web' }, { path: '/realisations', label: 'Réalisations' },
  { path: '/blog', label: 'Blog' }, { path: '/contact', label: 'Contact' }, { path: '/rendez-vous', label: 'Réserver un appel' }
]
const STATE: Record<State, { label: string; cls: string }> = { good: { label: 'Bon', cls: 'adm-badge--on' }, warn: { label: 'À améliorer', cls: 'adm-badge--warn' }, bad: { label: 'Faible', cls: 'adm-badge--off' } }
const DEPLOY: Record<string, { label: string; cls: string }> = {
  READY: { label: 'En ligne', cls: 'adm-badge--on' }, BUILDING: { label: 'En cours', cls: 'adm-badge--wait' }, QUEUED: { label: 'En attente', cls: 'adm-badge--wait' },
  INITIALIZING: { label: 'En attente', cls: 'adm-badge--wait' }, ERROR: { label: 'Échec', cls: 'adm-badge--off' }, CANCELED: { label: 'Annulé', cls: '' }
}
const CIRC = 2 * Math.PI * 31

const { db, api, integrations } = useAdmin()
const cfg = useRuntimeConfig().public
const site = String(cfg.siteUrl).replace(/\/$/, '')

const page = ref('/')
const strategy = ref<'mobile' | 'desktop'>('mobile')
const running = ref(false)
const error = ref('')
const history = ref<Snapshot[]>([])
const fresh = ref<Snapshot | null>(null)
const health = ref<Health | null>(null)
const healthError = ref('')
const checking = ref(false)
const deployments = ref<Deploy[] | null>(null)
const deployError = ref('')

const pageLabel = computed(() => PAGES.find(p => p.path === page.value)!.label)
// Mesure affichée : celle qui vient d'être lancée, sinon la dernière enregistrée pour cette page et cet appareil
const last = computed(() => fresh.value ?? history.value.at(-1) ?? null)

/** Seuils de Google : score Lighthouse (90 / 50) et Core Web Vitals */
const scoreState = (v: number | null): State => (v === null ? 'bad' : v >= 90 ? 'good' : v >= 50 ? 'warn' : 'bad')
const rate = (v: number | null, good: number, poor: number): State | undefined => (v === null ? undefined : v <= good ? 'good' : v <= poor ? 'warn' : 'bad')
const cls = (v: number | null) => (v === null ? undefined : v.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
const ms = (v: number | null) => (v === null ? undefined : `${fmtInt(v)} ms`)
const sec = (v: number | null) => (v === null ? undefined : fmtSeconds(v))

const scores = (s: Snapshot) => [
  { label: 'Performance', value: s.performance }, { label: 'Accessibilité', value: s.accessibility },
  { label: 'Bonnes pratiques', value: s.best_practices }, { label: 'SEO technique', value: s.seo }
].map(x => ({ ...x, state: scoreState(x.value) }))

const metrics = (s: Snapshot) => [
  { label: 'Affichage du contenu principal (LCP)', help: 'Temps avant que le plus grand élément visible soit affiché.', lab: sec(s.lcp_ms), labState: rate(s.lcp_ms, 2500, 4000), field: sec(s.field_lcp_ms), fieldState: rate(s.field_lcp_ms, 2500, 4000), target: '2,5 s au plus' },
  { label: 'Réactivité (INP)', help: 'Délai entre un clic et la réponse de la page ; mesurable uniquement chez de vrais visiteurs.', lab: undefined, labState: undefined, field: ms(s.field_inp_ms), fieldState: rate(s.field_inp_ms, 200, 500), target: '200 ms au plus' },
  { label: 'Stabilité de la mise en page (CLS)', help: 'Décalages inattendus des éléments pendant le chargement.', lab: cls(s.cls), labState: rate(s.cls, 0.1, 0.25), field: cls(s.field_cls), fieldState: rate(s.field_cls, 0.1, 0.25), target: '0,10 au plus' },
  { label: 'Blocage du navigateur (TBT)', help: 'Temps pendant lequel la page ne répond pas, pendant son chargement.', lab: ms(s.tbt_ms), labState: rate(s.tbt_ms, 200, 600), field: undefined, fieldState: undefined, target: '200 ms au plus' },
  { label: 'Premier affichage (FCP)', help: 'Temps avant l’apparition du premier texte ou de la première image.', lab: sec(s.fcp_ms), labState: rate(s.fcp_ms, 1800, 3000), field: undefined, fieldState: undefined, target: '1,8 s au plus' }
]

async function loadHistory() {
  fresh.value = null
  const { data, error: err } = await db().from('perf_snapshots').select('*').eq('url', site + page.value).eq('strategy', strategy.value).order('created_at', { ascending: false }).limit(30)
  if (err) { error.value = adminError(err); return }
  history.value = (data as Snapshot[]).reverse()
}

async function run() {
  error.value = ''
  running.value = true
  const url = site + page.value
  const measured = strategy.value
  try {
    const query = new URLSearchParams({ url, strategy: measured, locale: 'fr', ...(cfg.pagespeedApiKey ? { key: String(cfg.pagespeedApiKey) } : {}) })
    for (const c of ['performance', 'accessibility', 'best-practices', 'seo']) query.append('category', c)
    const res = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${query}`)
    const json = await res.json()
    if (!res.ok) {
      throw new Error(res.status === 429
        ? 'Quota de mesures gratuites atteint chez Google : réessayez plus tard, ou renseignez NUXT_PUBLIC_PAGESPEED_API_KEY.'
        : `PageSpeed Insights : ${json?.error?.message ?? 'mesure impossible'}`)
    }
    const lh = json.lighthouseResult
    const score = (k: string) => (typeof lh.categories[k]?.score === 'number' ? Math.round(lh.categories[k].score * 100) : null)
    const audit = (k: string) => (typeof lh.audits[k]?.numericValue === 'number' ? lh.audits[k].numericValue as number : null)
    const field = (k: string) => (json.loadingExperience?.metrics?.[k]?.percentile as number | undefined) ?? null
    const fieldCls = field('CUMULATIVE_LAYOUT_SHIFT_SCORE')
    const lcp = audit('largest-contentful-paint'), tbt = audit('total-blocking-time'), fcp = audit('first-contentful-paint')
    const snapshot: Snapshot = {
      created_at: new Date().toISOString(), url, strategy: measured,
      performance: score('performance'), accessibility: score('accessibility'), best_practices: score('best-practices'), seo: score('seo'),
      lcp_ms: lcp === null ? null : Math.round(lcp), tbt_ms: tbt === null ? null : Math.round(tbt), fcp_ms: fcp === null ? null : Math.round(fcp), cls: audit('cumulative-layout-shift'),
      // Le CLS réel est publié multiplié par 100
      field_lcp_ms: field('LARGEST_CONTENTFUL_PAINT_MS'), field_inp_ms: field('INTERACTION_TO_NEXT_PAINT'), field_cls: fieldCls === null ? null : fieldCls / 100
    }
    fresh.value = snapshot
    const { error: err } = await db().from('perf_snapshots').insert(snapshot)
    if (err) error.value = `Mesure affichée, mais non enregistrée dans l’historique. ${adminError(err)}`
    else if (url === site + page.value && measured === strategy.value) await loadHistory()
  } catch (err) {
    error.value = err instanceof TypeError ? 'PageSpeed Insights est injoignable depuis ce navigateur.' : adminError(err)
  } finally {
    running.value = false
  }
}

async function checkHealth() {
  checking.value = true
  healthError.value = ''
  try {
    health.value = await api<Health>('health')
  } catch (err) {
    healthError.value = adminError(err)
  } finally {
    checking.value = false
  }
}

watch([page, strategy], loadHistory, { immediate: true })
onMounted(checkHealth)
watch(() => integrations.value?.vercel, async (ok) => {
  if (!ok) return
  try {
    deployments.value = (await api<{ deployments: Deploy[] }>('deployments')).deployments
  } catch (err) {
    deployError.value = adminError(err)
  }
}, { immediate: true })
</script>

<style scoped>
.run { display: flex; align-items: flex-end; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; }
.run .adm-field { flex: 1; min-width: 220px; max-width: 360px; }
.when { margin: 8px 0 16px; }
.scores { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-bottom: 20px; }
.score { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px; border: 1px solid var(--line); border-radius: var(--r-md); background: var(--band); text-align: center; font-size: 14px; }
.score__track { fill: none; stroke: var(--line); stroke-width: 6; }
.score__arc { fill: none; stroke-width: 6; stroke-linecap: round; }
.score__arc.is-good { stroke: var(--green); }
.score__arc.is-warn { stroke: var(--amber); }
.score__arc.is-bad { stroke: var(--red); }
.score__n { fill: var(--ink); font-size: 20px; font-weight: 800; font-variant-numeric: tabular-nums; }
.adm-card .adm-table-wrap { margin-bottom: 12px; }
.again { margin-top: 16px; }
.deploys { list-style: none; margin: 0; padding: 0; }
.deploys li { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 0; }
.deploys li + li { border-top: 1px solid var(--line); }
.deploys li > div { display: flex; flex-direction: column; gap: 3px; min-width: 0; overflow-wrap: anywhere; }
</style>
