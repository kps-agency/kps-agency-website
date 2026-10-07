// Tableau de bord (/admin) : mise en forme des nombres et des dates, libellés des statuts.

export const fmtInt = (n: number) => Math.round(n).toLocaleString('fr-FR')
/** Taux entre 0 et 1 → « 12,3 % » */
export const fmtPct = (ratio: number, digits = 1) => `${(ratio * 100).toLocaleString('fr-FR', { minimumFractionDigits: digits, maximumFractionDigits: digits })} %`
/** Durée en secondes → « 1 min 05 s » */
export const fmtDuration = (seconds: number) => (seconds < 60 ? `${Math.round(seconds)} s` : `${Math.floor(seconds / 60)} min ${String(Math.round(seconds % 60)).padStart(2, '0')} s`)
/** Millisecondes → « 2,4 s » */
export const fmtSeconds = (ms: number) => `${(ms / 1000).toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} s`

/** Jour AAAA-MM-JJ ou date ISO → « 7 oct. 2026 » */
export const fmtDay = (d: string) => new Date(d.length === 10 ? `${d}T00:00:00` : d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
/** Jour court pour les axes des graphiques : « 7 oct. » */
export const fmtDayShort = (d: string) => new Date(d.length === 10 ? `${d}T00:00:00` : d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
export const fmtDateTime = (d: string | number) => new Date(d).toLocaleString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

/** Jour local AAAA-MM-JJ d'une date */
export const localDay = (d: Date | string) => {
  const x = new Date(d)
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`
}

/** Évolution relative entre deux périodes ; null quand la période précédente est vide (pas de pourcentage à afficher) */
export const delta = (now: number, before: number) => (before > 0 ? (now - before) / before : null)

export const LEAD_STATUS: Record<LeadRow['status'], string> = { new: 'Nouvelle', contacted: 'Contactée', quoted: 'Devis envoyé', won: 'Gagnée', lost: 'Perdue', spam: 'Spam' }
export const LEAD_SOURCE: Record<string, string> = { contact: 'Page Contact', accueil: 'Accueil', audit: 'Audit gratuit' }
export const BOOKING_STATUS: Record<BookingRow['status'], string> = { booked: 'Prévu', done: 'Réalisé', no_show: 'Absent', cancelled: 'Annulé' }
/** Clés de service envoyées par le formulaire de contact (server/api/contact.post.ts) */
export const LEAD_SERVICE: Record<string, string> = { web: 'Site web', app: 'Application métier', seo: 'SEO & GEO', mobile: 'Application mobile', ads: 'Marketing & ADS', social: 'Social media', refonte: 'Refonte de site', maintenance: 'Maintenance de site', saas: 'SaaS' }

/** Classe de pastille d'un statut de demande */
export const leadBadge = (s: LeadRow['status']) => (s === 'won' ? 'adm-badge--on' : s === 'new' ? 'adm-badge--wait' : s === 'lost' || s === 'spam' ? 'adm-badge--off' : '')

/** Télécharge un tableau en CSV (séparateur « ; » et BOM : s'ouvre directement dans Excel en français) */
export function downloadCsv(filename: string, header: string[], rows: (string | number | null | undefined)[][]) {
  const cell = (v: string | number | null | undefined) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const csv = [header, ...rows].map(r => r.map(cell).join(';')).join('\r\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([String.fromCharCode(0xFEFF) + csv], { type: 'text/csv;charset=utf-8' }))
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}

/** Repères de longueur des balises SEO (résultats Google) : au-delà, le titre ou la description est coupé */
export const SEO_TITLE_MAX = 60
export const SEO_DESC_MIN = 120
export const SEO_DESC_MAX = 160
