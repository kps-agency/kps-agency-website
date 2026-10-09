const CARD_WIDTHS = [400, 600, 800]
const WIDE_WIDTHS = [800, 1200, 1600]

/**
 * Images servies par Cloudinary : /images/realisations/x.webp → identifiant kps/realisations/x (envoyé par scripts/cloudinary-upload.mjs).
 * Sans CLOUDINARY_CLOUD_NAME, on retombe sur les fichiers de public/ et leurs déclinaisons (scripts/image-variants.py).
 */
export function useCloudImage() {
  const { cloudinaryCloudName: cloud, siteUrl } = useRuntimeConfig().public
  const hosted = (path: string) => !!cloud && path.startsWith('/images/')
  // q_auto:eco : les originaux sont déjà compressés, le q_auto par défaut les alourdit
  const cld = (path: string, width: number, format = 'f_auto') =>
    `https://res.cloudinary.com/${cloud}/image/upload/${format},q_auto:eco,c_limit,w_${width}/kps/${path.slice('/images/'.length).replace(/\.\w+$/, '')}`

  /** Visuel pleine largeur (1600 px) */
  const image = (path: string) => (hosted(path) ? cld(path, 1600) : path)
  /** Vignette 800 px (cartes, listes) */
  const thumb = (path: string) => (hosted(path) ? cld(path, 800) : path.replace(/\.webp$/, '-800.webp'))
  /** srcset des cartes : 400/600/800 px + original 1600 px */
  const thumbSet = (path: string) => CARD_WIDTHS
    .map(w => `${hosted(path) ? cld(path, w) : path.replace(/\.webp$/, `-${w}.webp`)} ${w}w`)
    .concat(`${image(path)} 1600w`).join(', ')
  /** Petit visuel sans déclinaison locale (logo client, portrait) : 400 px via Cloudinary, fichier tel quel sinon */
  const small = (path: string) => (hosted(path) ? cld(path, 400) : path)
  /** Variantes AVIF pour <source type="image/avif"> (f_auto ne le sert pas de lui-même) ; vide hors Cloudinary */
  const avif = (path: string) => (hosted(path) ? cld(path, 1600, 'f_avif') : '')
  const avifSet = (path: string) => (hosted(path) ? [...CARD_WIDTHS, 1600].map(w => `${cld(path, w, 'f_avif')} ${w}w`).join(', ') : '')
  /** srcset d'un visuel pleine largeur (couverture d'article, visuel d'une réalisation) : un téléphone ne charge pas le fichier de 1600 px.
   *  Vide hors Cloudinary (pas de déclinaisons locales) : l'attribut src suffit alors. */
  const wideSet = (path: string, format = 'f_auto') => (hosted(path) ? WIDE_WIDTHS.map(w => `${cld(path, w, format)} ${w}w`).join(', ') : '')
  /** srcset d'une vignette sans déclinaison locale (couverture d'article dans une liste) ; vide hors Cloudinary */
  const cardSet = (path: string) => (hosted(path) ? [...CARD_WIDTHS, 1600].map(w => `${cld(path, w)} ${w}w`).join(', ') : '')
  /** URL absolue (données structurées, partage) */
  const absolute = (path: string) => { const u = image(path); return u.startsWith('http') ? u : siteUrl + u }

  return { image, thumb, small, thumbSet, avif, avifSet, wideSet, cardSet, absolute }
}
