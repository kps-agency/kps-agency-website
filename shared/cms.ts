// Contenus lus dans Supabase au build (modules/cms.ts), exposés au site et au serveur via l'alias « #cms ».
// cms vaut null quand Supabase n'est pas configuré : le site n'utilise alors que les fichiers de content/blog
// et les listes de app/data/content.ts.
import type { BlogMeta } from './blog'

export interface CmsPost { meta: BlogMeta; body: string }
/** Étude de cas d'une réalisation, dans une langue. kpis : un chiffre par ligne, « valeur | libellé » */
export interface CmsStudy { context: string; work: string; results: string; kpis: string; duration: string; quote: string; quoteRole: string }
/** Réalisation gérée dans l'admin (table projects) ; les champs vides valent '' */
export interface CmsProject {
  slug: string; cat: 'Web' | 'ADS' | 'Social'; client: string; label: string; desc: string; metric: string
  bg: string; fg: string; img: string; url?: string
  /** Logo du client et auteur du témoignage (communs aux deux langues) */
  logo: string; quoteAuthor: string; quotePhoto: string
  study: CmsStudy
  /** Date du dernier enregistrement (AAAA-MM-JJ), publiée dans le sitemap */
  updatedAt?: string
  en: { label: string; desc: string; metric: string; study: CmsStudy }
}
/** Promotion affichée en fenêtre (table promos, composant PromoPopup) ; text = titre de l'offre, details = présentation ; dates AAAA-MM-JJ, '' = sans limite */
export interface CmsPromo { id: string; text: string; textEn: string; details: string; detailsEn: string; ctaLabel: string; ctaLabelEn: string; ctaUrl: string; startsOn: string; endsOn: string }
/** Avis client (table reviews) ; date AAAA-MM */
export interface CmsReview { name: string; date: string; text: string; rating: number; truncated: boolean; translated: boolean }
/** Textes d'une expertise modifiés dans l'admin (table services), dans une langue : seuls les champs présents remplacent ceux du code */
export interface CmsServiceText {
  eyebrow?: string; h1?: string; sub?: string; offersTitle?: string; offersSub?: string
  offers?: { n: string; t: string; d: string; tags: string[] }[]
  benTitle?: string; benefits?: { t: string; d: string }[]
  methTitle?: string; steps?: { n: string; t: string; d: string }[]
  cta?: string; from?: string
  /** Balises SEO : titre de l'onglet, titre h1 descriptif, description */
  seoTitle?: string; seoH1?: string; seoDesc?: string
}
export interface CmsData {
  posts: CmsPost[]; projects: CmsProject[]; promos: CmsPromo[]; reviews: CmsReview[]
  services: Record<string, { fr: CmsServiceText; en: CmsServiceText }>
  /** Date du dernier enregistrement des textes d'une expertise (slug → AAAA-MM-JJ), publiée dans le sitemap */
  servicesUpdated?: Record<string, string>
}

/** Sépare les textes d'une expertise de ses balises SEO */
export function splitServiceText(t: CmsServiceText = {}) {
  const { seoTitle, seoH1, seoDesc, ...text } = t
  const seo = { ...(seoTitle ? { title: seoTitle } : {}), ...(seoH1 ? { h1: seoH1 } : {}), ...(seoDesc ? { desc: seoDesc } : {}) }
  return { text, seo }
}

/** Promotion à afficher un jour donné (AAAA-MM-JJ) : la première dont la période contient ce jour */
export const currentPromo = (promos: CmsPromo[] = [], day: string) => promos.find(p => (!p.startsOn || p.startsOn <= day) && (!p.endsOn || p.endsOn >= day))
