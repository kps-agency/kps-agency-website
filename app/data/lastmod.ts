// Date de dernière modification du contenu de chaque page (AAAA-MM-JJ), publiée dans le sitemap (<lastmod>).
// À mettre à jour quand le texte de la page change : Google n'utilise cette balise que si elle est fiable.
// Les articles ont leur propre date (champ « updated ») ; les réalisations et les textes de services modifiés dans l'admin
// prennent la date d'enregistrement de Supabase (updated_at), lue au build.
export const LASTMOD: { pages: Record<string, string>; services: Record<string, string>; local: Record<string, string> } = {
  // Pages fixes, par nom de fichier de app/pages
  pages: {
    index: '2026-10-08',
    services: '2026-10-07',
    realisations: '2026-10-06',
    agence: '2026-10-07',
    contact: '2026-10-07',
    'rendez-vous': '2026-10-03',
    'audit-gratuit': '2026-10-07',
    auteur: '2026-10-07'
  },
  // Expertises (slug FR)
  services: {
    'creation-site-web': '2026-10-05',
    'application-metier': '2026-10-07',
    'referencement-seo-geo': '2026-10-08',
    'application-mobile': '2026-10-07',
    'marketing-digital-ads': '2026-10-05',
    'social-media': '2026-10-05',
    'refonte-site-web': '2026-10-05',
    'maintenance-site-web': '2026-10-05',
    'creation-saas': '2026-10-07',
    'agence-geo': '2026-10-08',
    'agence-seo-madagascar': '2026-10-08'
  },
  // Pages villes et secteurs (slug FR)
  local: {
    paris: '2026-10-05',
    madagascar: '2026-10-06',
    energie: '2026-10-07',
    'expertise-comptable': '2026-10-07',
    'beaute-sante': '2026-10-07'
  }
}

/** La plus récente des dates connues ; undefined si aucune (la balise <lastmod> est alors omise) */
export const latest = (...dates: (string | undefined | null)[]) => dates.filter((d): d is string => !!d).map(d => d.slice(0, 10)).sort().pop()
