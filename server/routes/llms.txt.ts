import { COMPANY, CONTACT, LOCAL_PAGES, PROJECTS, REVIEWS, REVIEWS_AVG, SERVICES, SERVICE_SEO } from '../../app/data/content'
import { LOCAL_PAGES_EN, LOCAL_SLUG_EN, SERVICES_EN, SERVICE_SLUG_EN } from '../../app/data/content.en'

// llms.txt : présentation du site pour les moteurs IA, construite à partir des mêmes données que les pages
// (services, pages locales, réalisations, avis, articles publiés). Prérendu en fichier statique.
export default defineEventHandler(async (event) => {
  const site = useRuntimeConfig(event).public.siteUrl as string
  const link = (label: string, path: string, desc?: string) => `- [${label}](${site}${path})${desc ? `: ${desc}` : ''}`
  const siret = COMPANY.siret.replace(/^(\d{3})(\d{3})(\d{3})(\d{5})$/, '$1 $2 $3 $4')
  const rating = REVIEWS_AVG.toFixed(1).replace('.', ',')
  const clients = PROJECTS.map(p => (p.metric.startsWith('[') ? p.client : `${p.client} (${p.metric})`)).join(', ')

  const articles = await serverArticles()
  const posts = (lang: 'fr' | 'en') => articles.filter(a => a.lang === lang)
    .map(a => link(a.title, `${lang === 'en' ? '/en' : ''}/blog/${a.slug}`, a.description))

  const lines = [
    `# ${COMPANY.name}`,
    '',
    `> Agence digitale basée à Paris (${CONTACT.address}) qui accompagne les PME et TPE en France et à l'international : création de sites web, applications sur mesure, référencement SEO & GEO, publicité en ligne et social media, avec un interlocuteur unique.`,
    '',
    `- Société : ${COMPANY.name}, SAS au capital de 1 000 €, SIRET ${siret}, ${COMPANY.city}`,
    `- Contact : ${CONTACT.email} — devis gratuit sous 48 h, sans engagement`,
    `- Avis Google : note ${rating} (${REVIEWS.length} avis)`,
    '- Conditions : paiement 50 % à la commande et 50 % à la livraison, deux cycles de révision inclus, 12 mois de maintenance technique inclus pour les sites, applications et agents IA',
    '',
    '## Expertises',
    '',
    link('Tous les services', '/services'),
    ...SERVICES.map(s => link(s.eyebrow, `/services/${s.slug}`, SERVICE_SEO[s.slug]?.desc)),
    '',
    '## Références',
    '',
    link('Réalisations', '/realisations', clients),
    ...LOCAL_PAGES.map(l => link(l.eyebrow, `/agence-digitale/${l.slug}`, l.description)),
    '',
    '## Blog',
    '',
    link('Blog : conseils digitaux et guides de prix', '/blog'),
    ...posts('fr'),
    link('Flux RSS', '/blog/rss.xml'),
    '',
    '## Informations',
    '',
    link('L’agence', '/agence'),
    link('Réserver un appel', '/rendez-vous'),
    link('Contact et devis', '/contact'),
    link('Conditions générales de vente', '/cgv'),
    link('Mentions légales', '/mentions-legales'),
    '',
    '## English version',
    '',
    `${COMPANY.name} is a Paris-based digital agency (${CONTACT.address} Paris) helping SMEs in France and internationally with website design, custom software, mobile apps, SEO & GEO, paid ads and social media. Free quote within 48 hours: ${CONTACT.email}.`,
    '',
    link('Home (English)', '/en'),
    link('All services', '/en/services'),
    ...SERVICES.map(s => link(SERVICES_EN[s.slug]?.eyebrow ?? s.eyebrow, `/en/services/${SERVICE_SLUG_EN[s.slug]}`)),
    ...LOCAL_PAGES.map(l => link(LOCAL_PAGES_EN[l.slug]?.eyebrow ?? l.eyebrow, `/en/digital-agency/${LOCAL_SLUG_EN[l.slug]}`)),
    link('Our work', '/en/work'),
    link('About us', '/en/about'),
    link('Book a call', '/en/book-a-call'),
    link('Contact & quote', '/en/contact'),
    link('Blog', '/en/blog'),
    ...posts('en')
  ]

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return `${lines.join('\n')}\n`
})
