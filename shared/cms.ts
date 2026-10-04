// Articles et réalisations lus dans Supabase au build (modules/cms.ts), exposés au site et au serveur via l'alias « #cms ».
// cms vaut null quand Supabase n'est pas configuré : le site n'utilise alors que les fichiers de content/blog
// et la liste de réalisations de app/data/content.ts.
import type { BlogMeta } from './blog'

export interface CmsPost { meta: BlogMeta; body: string }
/** Réalisation gérée dans l'admin (table projects) ; les champs vides valent '' */
export interface CmsProject {
  slug: string; cat: 'Web' | 'ADS' | 'Social'; client: string; label: string; desc: string; metric: string
  bg: string; fg: string; img: string; url?: string
  en: { label: string; desc: string; metric: string }
}
export interface CmsData { posts: CmsPost[]; projects: CmsProject[] }
