// Articles lus dans Supabase au build (modules/cms.ts), exposés au site et au serveur via l'alias « #cms ».
// cms vaut null quand Supabase n'est pas configuré : le site n'utilise alors que les fichiers de content/blog.
import type { BlogMeta } from './blog'

export interface CmsPost { meta: BlogMeta; body: string }
export interface CmsData { posts: CmsPost[] }
