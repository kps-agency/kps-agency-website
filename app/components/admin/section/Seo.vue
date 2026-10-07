<template>
  <div class="adm-head">
    <div>
      <h1>Référencement</h1>
      <p class="adm-sub">La présence du site dans Google (Search Console) et le contrôle des balises de vos contenus.</p>
    </div>
    <AdminPeriod v-if="configured" v-model="days" />
  </div>

  <div class="adm-stack">
    <!-- Search Console -->
    <section v-if="!configured" class="adm-card adm-setup">
      <h2>La Search Console n’est pas encore reliée au tableau de bord</h2>
      <ol>
        <li>Dans Google Cloud, activez « Google Search Console API » sur le projet du compte de service.</li>
        <li>Dans Search Console → Paramètres → Utilisateurs et autorisations, ajoutez l’adresse du compte de service.</li>
        <li>Dans Vercel, renseignez <code>NUXT_GSC_SITE_URL</code> (<code>sc-domain:kps-agency.com</code> pour une propriété de domaine), puis redéployez.</li>
      </ol>
      <p class="adm-note">Le contrôle des contenus ci-dessous fonctionne sans cette liaison.</p>
    </section>
    <template v-else>
      <p v-if="error" class="adm-error" role="alert">{{ error }}</p>
      <p v-if="loading && !data" class="adm-note">Chargement…</p>
      <template v-if="data">
        <div class="adm-kpis">
          <AdminStat label="Clics depuis Google" :value="fmtInt(data.totals.clicks)" :change="delta(data.totals.clicks, data.previous.clicks)" />
          <AdminStat label="Affichages dans Google" :value="fmtInt(data.totals.impressions)" :change="delta(data.totals.impressions, data.previous.impressions)" />
          <AdminStat label="Taux de clic" :value="fmtPct(data.totals.ctr)" :change="delta(data.totals.ctr, data.previous.ctr)" />
          <AdminStat label="Position moyenne" :value="position(data.totals.position)" :change="delta(data.totals.position, data.previous.position)" lower-is-better />
        </div>
        <section class="adm-card">
          <h2>Clics depuis Google par jour <small>{{ data.days }} jours, données disponibles avec trois jours de retard</small></h2>
          <AdminChartLine :points="data.byDay.map(d => ({ date: d.date, value: d.clicks }))" label="Clics depuis Google par jour" />
        </section>
        <div class="adm-cols">
          <section class="adm-card">
            <h2>Recherches qui affichent le site</h2>
            <p v-if="!data.queries.length" class="adm-note">Aucune recherche sur la période.</p>
            <div v-else class="adm-table-wrap">
              <table class="adm-table">
                <thead><tr><th scope="col">Recherche</th><th scope="col" class="num">Clics</th><th scope="col" class="num">Affichages</th><th scope="col" class="num">Position</th></tr></thead>
                <tbody><tr v-for="q in data.queries" :key="q.label"><td class="wrap">{{ q.label }}</td><td class="num">{{ fmtInt(q.clicks) }}</td><td class="num">{{ fmtInt(q.impressions) }}</td><td class="num">{{ position(q.position) }}</td></tr></tbody>
              </table>
            </div>
          </section>
          <section class="adm-card">
            <h2>Pages les plus cliquées</h2>
            <p v-if="!data.pages.length" class="adm-note">Aucune page sur la période.</p>
            <div v-else class="adm-table-wrap">
              <table class="adm-table">
                <thead><tr><th scope="col">Page</th><th scope="col" class="num">Clics</th><th scope="col" class="num">Affichages</th><th scope="col" class="num">Position</th></tr></thead>
                <tbody><tr v-for="p in data.pages" :key="p.label"><td class="wrap">{{ path(p.label) }}</td><td class="num">{{ fmtInt(p.clicks) }}</td><td class="num">{{ fmtInt(p.impressions) }}</td><td class="num">{{ position(p.position) }}</td></tr></tbody>
              </table>
            </div>
          </section>
        </div>
      </template>
    </template>

    <!-- Contrôle des contenus -->
    <section class="adm-card">
      <h2>Contrôle des contenus <small v-if="!auditing">{{ audit.length - flagged.length }} sur {{ audit.length }} sans remarque</small></h2>
      <p class="adm-sub rules">Titre dans Google : {{ SEO_TITLE_MAX }} caractères au plus. Description : {{ SEO_DESC_MIN }} à {{ SEO_DESC_MAX }} caractères. Article : au moins {{ MIN_WORDS }} mots, une image de couverture décrite et sa traduction. Réalisation : une étude de cas d’au moins {{ CASE_STUDY_MIN_CHARS }} caractères, sinon la page n’est pas proposée à Google.</p>
      <p v-if="auditError" class="adm-error" role="alert">{{ auditError }}</p>
      <p v-if="auditing" class="adm-note">Analyse…</p>
      <p v-else-if="!flagged.length" class="adm-note">Aucune remarque : toutes les balises sont dans les repères.</p>
      <div v-else class="adm-table-wrap">
        <table class="adm-table">
          <thead><tr><th scope="col">Contenu</th><th scope="col">Type</th><th scope="col">À corriger</th><th scope="col"><span class="sr-only">Action</span></th></tr></thead>
          <tbody>
            <tr v-for="item in flagged" :key="item.type + item.title">
              <td class="wrap"><strong>{{ item.title }}</strong></td>
              <td>{{ item.type }}</td>
              <td class="wrap"><ul class="issues"><li v-for="i in item.issues" :key="i">{{ i }}</li></ul></td>
              <td class="num"><button v-if="item.section" type="button" class="adm-btn adm-btn--sm" @click="go(item.section)">Ouvrir</button><span v-else class="adm-note">Fichier du code</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { CmsServiceText } from '#shared/cms'
import { blogArticles } from '~/data/blog'
import { CASE_STUDY_MIN_CHARS, SERVICES, SERVICE_SEO } from '~/data/content'

// Référencement : Search Console lue par le serveur (server/api/admin/search-console.post.ts) et contrôle des balises des contenus.
interface Totals { clicks: number; impressions: number; ctr: number; position: number }
interface Search { days: number; totals: Totals; previous: Totals; byDay: { date: string; clicks: number }[]; queries: (Totals & { label: string })[]; pages: (Totals & { label: string })[] }
interface Audited { type: 'Article' | 'Réalisation' | 'Expertise'; title: string; section: string; issues: string[] }

/** En dessous, un article est jugé trop court pour répondre à une recherche */
const MIN_WORDS = 600

const { db, api, integrations } = useAdmin()
const go = useAdminGo()
const configured = computed(() => !!integrations.value?.searchConsole)
const days = ref(28)
const data = ref<Search | null>(null)
const loading = ref(false)
const error = ref('')
const audit = ref<Audited[]>([])
const auditing = ref(true)
const auditError = ref('')
const flagged = computed(() => audit.value.filter(a => a.issues.length))

const position = (p: number) => (p ? p.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : '—')
const path = (url: string) => url.replace(/^https?:\/\/[^/]+/, '') || '/'

async function load() {
  if (!configured.value) return
  loading.value = true
  error.value = ''
  try {
    data.value = await api<Search>('search-console', { days: days.value })
  } catch (err) {
    error.value = adminError(err)
  } finally {
    loading.value = false
  }
}
watch([days, configured], load, { immediate: true })

function tagIssues(title: string, desc: string) {
  const issues: string[] = []
  if (title.length > SEO_TITLE_MAX) issues.push(`Titre Google trop long (${title.length} caractères)`)
  if (!desc) issues.push('Description absente')
  else if (desc.length < SEO_DESC_MIN) issues.push(`Description trop courte (${desc.length} caractères)`)
  else if (desc.length > SEO_DESC_MAX) issues.push(`Description trop longue (${desc.length} caractères)`)
  return issues
}

async function runAudit() {
  const [posts, projects, services] = await Promise.all([
    db().from('blog_posts').select('*'),
    db().from('projects').select('*').eq('published', true),
    db().from('services').select('*')
  ])
  auditing.value = false
  const failed = [posts, projects, services].find(r => r.error)
  if (failed) auditError.value = adminError(failed.error)

  const dbPosts = (posts.data ?? []) as PostRow[]
  const inDb = new Set(dbPosts.map(p => `${p.lang}/${p.slug}`))
  const list: Audited[] = dbPosts.filter(p => !p.draft).map((p) => {
    const issues = tagIssues(p.seo_title || p.title, p.description)
    const words = p.body.split(/\s+/).filter(Boolean).length
    if (words < MIN_WORDS) issues.push(`Article court (${words} mots)`)
    if (!p.cover) issues.push('Image de couverture absente')
    else if (!p.cover_alt) issues.push('Image de couverture sans description')
    if (!p.translation) issues.push(`Pas de version ${p.lang === 'fr' ? 'anglaise' : 'française'} liée`)
    return { type: 'Article', title: `${p.title} (${p.lang.toUpperCase()})`, section: 'posts', issues }
  })
  // Articles publiés en fichiers Markdown (content/blog) : mêmes contrôles sur les balises, correction dans le fichier
  for (const lang of ['fr', 'en'] as const) {
    for (const m of blogArticles(lang).filter(a => !inDb.has(`${a.lang}/${a.slug}`))) {
      const issues = tagIssues(m.seoTitle, m.description)
      if (!m.cover) issues.push('Image de couverture absente')
      else if (!m.coverAlt) issues.push('Image de couverture sans description')
      if (!m.translation) issues.push(`Pas de version ${lang === 'fr' ? 'anglaise' : 'française'} liée`)
      list.push({ type: 'Article', title: `${m.title} (${lang.toUpperCase()})`, section: '', issues })
    }
  }
  for (const p of (projects.data ?? []) as ProjectRow[]) {
    const issues: string[] = []
    const chars = [p.description, p.context, p.work, p.results].join('').length
    if (chars < CASE_STUDY_MIN_CHARS) issues.push(`Étude de cas trop courte (${chars} caractères) : page non proposée à Google`)
    if (!p.label_en) issues.push('Libellé anglais absent')
    list.push({ type: 'Réalisation', title: p.client, section: 'projects', issues })
  }
  const saved = Object.fromEntries((services.data ?? []).map(r => [r.slug, (r.fr ?? {}) as CmsServiceText]))
  for (const s of SERVICES) {
    const seo = SERVICE_SEO[s.slug]
    if (seo) list.push({ type: 'Expertise', title: s.crumb, section: 'services', issues: tagIssues(saved[s.slug]?.seoTitle ?? seo.title, saved[s.slug]?.seoDesc ?? seo.desc) })
  }
  audit.value = list
}

onMounted(runAudit)
</script>

<style scoped>
.rules { margin: -8px 0 16px; }
.issues { margin: 0; padding-left: 18px; color: var(--muted); line-height: 1.6; }
</style>
