// Articles et réalisations lus dans Supabase au build (modules/cms.ts), exposés au site et au serveur via l'alias « #cms ».
// cms vaut null quand Supabase n'est pas configuré : le site n'utilise alors que les fichiers de content/blog
// et la liste de réalisations de app/data/content.ts.
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
  en: { label: string; desc: string; metric: string; study: CmsStudy }
}
export interface CmsData { posts: CmsPost[]; projects: CmsProject[] }
