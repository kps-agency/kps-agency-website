// Données structurées (JSON-LD) d'une page. Organization et WebSite sont posés une fois pour tout le site dans app.vue :
// les pages n'ajoutent que leurs propres entités et y font référence par @id (`${site}/#organization`, `${site}/#website`).

/** Langue déclarée dans les données structurées : celle de la page */
export const ldLang = (en: boolean) => (en ? 'en-GB' : 'fr-FR')

/** FAQPage construite avec la liste passée à <FaqList> : les questions balisées sont exactement celles affichées */
export const faqSchema = (url: string, items: [string, string][], en: boolean) => ({
  '@type': 'FAQPage', '@id': `${url}#faq`, inLanguage: ldLang(en),
  mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
})

/** Ajoute au <head> un bloc JSON-LD regroupant les entités de la page (recalculé au changement de langue) */
export function useJsonLd(nodes: () => object[]) {
  useHead({
    script: [{ type: 'application/ld+json', innerHTML: () => JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes() }) }]
  })
}
