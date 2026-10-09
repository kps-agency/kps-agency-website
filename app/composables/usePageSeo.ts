import type { MaybeRefOrGetter } from 'vue'

interface PageSeo {
  /** Titre de page, sans la marque (ajoutée par le titleTemplate) */
  title: MaybeRefOrGetter<string>
  /** Meta description : viser 120–160 caractères */
  description: MaybeRefOrGetter<string>
  /** Image de partage (chemin local ou URL absolue). Par défaut : /og-image.jpg */
  image?: MaybeRefOrGetter<string | undefined>
  /** true = noindex, follow (page provisoire, légale, erreur…) */
  noindex?: MaybeRefOrGetter<boolean>
  type?: 'website' | 'article'
}

const DEFAULT_IMAGE = '/og-image.jpg'
const MAX_DESCRIPTION = 160

/** Ramène une description à 160 caractères au plus : à la fin d'une phrase si elle laisse au moins 110 caractères, sinon au dernier mot entier suivi de « … » */
export function clipDescription(text: string, max = MAX_DESCRIPTION) {
  const s = text.replace(/\s+/g, ' ').trim()
  if (s.length <= max) return s
  const head = s.slice(0, max)
  const sentence = Math.max(head.lastIndexOf('. '), head.lastIndexOf(' ! '), head.lastIndexOf(' ? '), head.lastIndexOf('! '), head.lastIndexOf('? '))
  if (sentence >= 110) return head.slice(0, sentence + 1).trim()
  return `${s.slice(0, max - 1).replace(/\s+\S*$/, '').replace(/[\s,;:–—-]+$/, '')}…`
}

// Balises SEO et réseaux sociaux d'une page. Canonical, og:url, og:site_name et og:locale sont posés globalement dans app.vue.
export function usePageSeo(o: PageSeo) {
  const site = useRuntimeConfig().public.siteUrl as string
  const abs = (u: string) => (u.startsWith('http') ? u : site + u)
  const image = () => abs(toValue(o.image) || DEFAULT_IMAGE)
  const isDefault = () => !toValue(o.image)
  const description = () => clipDescription(toValue(o.description))

  useSeoMeta({
    title: () => toValue(o.title),
    description,
    ogTitle: () => `${toValue(o.title)} · KPS Agency`,
    ogDescription: description,
    ogType: o.type ?? 'website',
    ogImage: image,
    ogImageWidth: () => (isDefault() ? 1200 : undefined),
    ogImageHeight: () => (isDefault() ? 630 : undefined),
    ogImageAlt: () => toValue(o.title),
    twitterCard: 'summary_large_image',
    twitterTitle: () => `${toValue(o.title)} · KPS Agency`,
    twitterDescription: description,
    twitterImage: image,
    robots: () => (toValue(o.noindex) ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1')
  })
}
