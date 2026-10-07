// Contenus du site — issus des maquettes validées sur le canevas KPS Agency.
// Les valeurs entre crochets [ ... ] sont des emplacements à compléter.
import cms from '#cms'
import { splitServiceText, type CmsStudy } from '#shared/cms'

export const CONTACT = {
  email: 'contact@kps-agency.com',
  phone: '+33 6 66 31 63 98',
  /** Même numéro au format international, pour les liens tel: et les données structurées */
  phoneE164: '+33666316398',
  /** Lien WhatsApp (https://wa.me/ + numéro sans le « + »). Laisser vide si ce numéro n'a pas de compte WhatsApp : le lien n'est alors affiché nulle part. */
  whatsapp: 'https://wa.me/33666316398',
  address: '59 rue de Ponthieu, 75008'
}

/** Pages officielles sur les réseaux sociaux : coller l'adresse complète de chaque page. Un réseau laissé vide n'est affiché nulle part.
 *  Ces adresses alimentent les icônes du pied de page et les données structurées (schema sameAs). */
export const SOCIAL = {
  linkedin: 'https://www.linkedin.com/company/kps-agency-paris',
  facebook: 'https://www.facebook.com/profile.php?id=61594798874482',
  instagram: 'https://www.instagram.com/kps.agency.ia'
}
export const SOCIAL_LINKS = (Object.entries(SOCIAL) as [keyof typeof SOCIAL, string][]).filter(([, url]) => url.startsWith('https://'))

/* ---------------- Identité légale & données structurées ---------------- */
export const COMPANY = {
  name: 'KPS Agency',
  legalName: 'KPS Agency SAS',
  siret: '10290972800010',
  street: '59 rue de Ponthieu',
  postalCode: '75008',
  city: 'Paris',
  // Profils officiels reliés à la marque (schema sameAs) : réseaux sociaux de SOCIAL, plus d'autres profils à ajouter ici (fiche Google…)
  sameAs: [...SOCIAL_LINKS.map(([, url]) => url)] as string[]
}
const hasPhone = !CONTACT.phone.startsWith('[')

/** Équipe présentée sur la page L'agence. Seuls le nom et la fonction sont obligatoires.
 *  photo : fichier carré déposé dans public/images/equipe/ (ex. '/images/equipe/prenom-nom.webp') ; sans photo, les initiales sont affichées. */
export interface TeamMember { name: string; role: { fr: string; en: string }; bio?: { fr: string; en: string }; photo?: string; linkedin?: string }
/** Bloc « L'équipe » de la page L'agence : masqué tant que les photos et les bios ne sont pas validées. Passer à true pour l'afficher. */
export const SHOW_TEAM = false
export const TEAM: TeamMember[] = [
  {
    name: 'Phillipe Esnault', role: { fr: 'Fondateur & CEO', en: 'Founder & CEO' },
    bio: {
      fr: 'Phillipe a fondé KPS Agency et en fixe le cap. Il suit les projets des clients, du premier échange jusqu’à la mise en ligne.',
      en: 'Phillipe founded KPS Agency and sets its direction. He follows client projects from the first conversation through to launch.'
    }
  },
  {
    name: 'Babacar Senghor', role: { fr: 'Référent technique', en: 'Technical lead' },
    bio: {
      fr: 'Babacar choisit les technologies de chaque projet et veille à la qualité du code, à la performance et à la sécurité de ce que nous livrons.',
      en: 'Babacar chooses the technologies for each project and looks after the code quality, performance and security of what we deliver.'
    }
  },
  {
    name: 'Raphael', role: { fr: 'Développeur senior full-stack', en: 'Senior full-stack developer' },
    bio: {
      fr: 'Raphael développe les sites et les applications de nos clients, de l’interface jusqu’au serveur et à la base de données.',
      en: 'Raphael builds our clients’ websites and applications, from the interface through to the server and the database.'
    }
  },
  {
    name: 'Fatima Sall', role: { fr: 'Responsable marketing digital', en: 'Digital marketing manager' },
    bio: {
      fr: 'Fatima conçoit et pilote les campagnes d’acquisition et les contenus de nos clients, puis en mesure les résultats pour les améliorer.',
      en: 'Fatima plans and runs our clients’ acquisition campaigns and content, then measures the results to improve them.'
    }
  }
]

/** Gages de confiance affichés sous les chiffres clés de l'accueil : partenariats, certifications, profils d'annuaires.
 *  N'ajouter que ce que l'agence détient réellement. Liste vide = rien n'est affiché.
 *  Ex. { label: 'Google Partner', url: 'https://www.google.com/partners/agency?id=…' } */
export interface Badge { label: string; url?: string; img?: string }
export const BADGES: Badge[] = []

/** Auteurs des articles du blog : fonction affichée sous la signature et dans les données structurées (clé = champ « author » de l'article) */
export const AUTHORS: Record<string, { fr: string; en: string }> = {
  'Phillipe Esnault': { fr: 'Fondateur & CEO de KPS Agency', en: 'Founder & CEO of KPS Agency' }
}

/** Adresse de la page d'un auteur : /blog/auteur/<prenom-nom> */
export const authorSlug = (name: string) => name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

/** Entité ProfessionalService de référence, réutilisée par toutes les pages (même @id) */
export const organizationSchema = (site: string, lang: 'fr' | 'en' = 'fr') => ({
  '@type': ['ProfessionalService', 'Organization'],
  '@id': `${site}/#organization`,
  name: COMPANY.name,
  legalName: COMPANY.legalName,
  url: `${site}/`,
  logo: { '@type': 'ImageObject', url: `${site}/logo-kps.webp`, width: 311, height: 120 },
  image: `${site}/og-image.jpg`,
  description: lang === 'en'
    ? 'Paris-based digital agency: website design, custom software, SEO & GEO, paid advertising and social media for SMEs.'
    : 'Agence digitale à Paris : création de sites web, applications sur mesure, référencement SEO & GEO, publicité en ligne et social media pour les PME et TPE.',
  email: CONTACT.email,
  contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', email: CONTACT.email, ...(hasPhone ? { telephone: CONTACT.phoneE164 } : {}), availableLanguage: ['French', 'English'], areaServed: 'FR' },
  ...(hasPhone ? { telephone: CONTACT.phoneE164 } : {}),
  identifier: { '@type': 'PropertyValue', propertyID: 'SIRET', value: COMPANY.siret },
  address: { '@type': 'PostalAddress', streetAddress: COMPANY.street, postalCode: COMPANY.postalCode, addressLocality: COMPANY.city, addressRegion: 'Île-de-France', addressCountry: 'FR' },
  areaServed: [{ '@type': 'City', name: 'Paris' }, { '@type': 'AdministrativeArea', name: 'Île-de-France' }, { '@type': 'Country', name: 'France' }],
  knowsAbout: lang === 'en'
    ? ['Website design', 'E-commerce', 'Custom business software', 'Mobile app development', 'SEO', 'GEO (Generative Engine Optimization)', 'Google Ads', 'Meta Ads', 'Social media']
    : ['Création de site web', 'E-commerce', 'Application métier', 'Application mobile', 'Référencement SEO', 'GEO (Generative Engine Optimization)', 'Google Ads', 'Meta Ads', 'Social media'],
  // Akoraweb, l'agence de KPS à Madagascar (son site déclare KPS Agency comme organisation parente)
  subOrganization: { '@type': 'Organization', name: 'Akoraweb', url: 'https://www.akoraweb.com/' },
  ...(COMPANY.sameAs.length ? { sameAs: COMPANY.sameAs } : {})
})

/* ---------------- Avis Google (copiés depuis la fiche Google, textes verbatim) ---------------- */
export interface Review { name: string; /** AAAA-MM */ date: string; text: string; rating: number; truncated?: boolean; translated?: boolean }
export const GOOGLE_REVIEWS_URL = 'https://www.google.com/maps/search/?api=1&query=KPS+Agency+59+rue+de+Ponthieu+75008+Paris'
const LOCAL_REVIEWS: Review[] = [
  { name: 'Amine', date: '2026-09', rating: 5, text: 'Intervention rapide et extrêmement efficace sur mon site WordPress. En quelques jours, mon score de performance a grimpé à 81/100 et tout mon référencement local est enfin en place (fiche Google, pages villes, données structurées). Le prestataire est d’une grande honnêteté intellectuelle, fournit des rapports précis et respecte scrupuleusement les délais.' },
  { name: 'Sofia Jacobs', date: '2026-04', rating: 5, text: 'Super content du rendu du site, process clair, suivi régulier et pas de mauvaises surprises. Le projet a été livré dans les délais et conforme à nos attentes. Je recommande' },
  { name: 'ali Khan', date: '2026-08', rating: 5, text: 'Équipe professionnelle ! Ils m’ont fait mon site pour mon restaurant au top ! Prix super accessible, je vous le conseille' },
  { name: 'nelly varenne', date: '2026-04', rating: 5, text: 'En tant qu’architecte, j’accorde beaucoup d’importance a l’image, la communication et la façon dont une entreprise met en valeur son savoir faire. J’ai eu l’occasion de travailler avec KPS et j’ai particulièrement apprécié leur', truncated: true },
  { name: 'Julien Chantemesse', date: '2026-04', rating: 5, text: 'Super agence. La team KPS agency est sérieuse et à l’écoute. Projet de site web rapide et efficace.' },
  { name: 'Axel Schafers', date: '2026-04', rating: 5, text: 'Professionnel, efficace et créatif. Résultats rapides sur Instagram et Facebook. 100 % recommandé.', truncated: true, translated: true },
  { name: 'NeedyMindSet', date: '2026-05', rating: 5, text: 'Très pro et réactif – Site web parfait, bon accompagnement. Je recommande.' },
  { name: 'Malaine Kougbeadjo', date: '2026-04', rating: 5, text: 'super agence de marketing dynamique et réactive! Je recommande!' }
]
// Avis gérés dans l'admin (table reviews de Supabase, lue au build) : ils remplacent la liste ci-dessus dès que la table en contient
export const REVIEWS: Review[] = cms?.reviews?.length ? cms.reviews : LOCAL_REVIEWS
export const REVIEWS_AVG = REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length

export type ProjectCat = 'Web' | 'Social' | 'ADS'
export interface Project {
  slug: string
  cat: ProjectCat
  client: string
  label: string
  desc: string
  metric: string
  bg: string
  fg: string
  img: string
  alt: string
  url?: string
  /** Logo du client (bandeau « Ils nous ont fait confiance ») ; sans logo, le nom est affiché en texte */
  logo?: string
  /** Étude de cas structurée, saisie dans l'admin ; absente pour les réalisations de la liste locale */
  study?: ProjectStudy
}

export interface Kpi { v: string; l: string }
export interface ProjectStudy {
  /** Contexte et enjeu du client, travail réalisé, résultats obtenus : texte libre, un paragraphe par ligne */
  context: string; work: string; results: string
  kpis: Kpi[]
  /** Durée du projet (ex. « 6 semaines ») */
  duration: string
  /** Témoignage du client : affiché seulement s'il a un texte et un auteur */
  quote: string; quoteAuthor: string; quoteRole: string; quotePhoto: string
}
/** « 5M | paid reach » → { v: '5M', l: 'paid reach' } ; une ligne par chiffre, quatre au plus */
export const parseKpis = (s: string): Kpi[] => s.split('\n').map(l => l.split('|').map(x => x.trim())).filter(x => x[0] && x[1]).map(x => ({ v: x[0]!, l: x[1]! })).slice(0, 4)
/** Étude de cas dans une langue ; un champ vide reprend celui de la langue de repli (le français) */
export const toStudy = (s: CmsStudy, who: { quoteAuthor: string; quotePhoto: string }, fb?: ProjectStudy): ProjectStudy => ({
  context: s.context || fb?.context || '', work: s.work || fb?.work || '', results: s.results || fb?.results || '',
  kpis: s.kpis ? parseKpis(s.kpis) : fb?.kpis ?? [], duration: s.duration || fb?.duration || '',
  quote: s.quote || fb?.quote || '', quoteRole: s.quoteRole || fb?.quoteRole || '', quoteAuthor: who.quoteAuthor, quotePhoto: who.quotePhoto
})

const R = '[Résultat]'
const D = '[Description du projet]'
// Visuels et liens issus de public/realisations.json (extraits de kps-agency.com)
const IMG = '/images/realisations/'
const p = (slug: string, cat: ProjectCat, client: string, label: string, desc: string, metric: string, bg: string, fg: string, url?: string): Project =>
  ({ slug, cat, client, label, desc, metric, bg, fg, img: `${IMG}${slug}.webp`, alt: `Réalisation ${client} — ${label}`, url })

const LOCAL_PROJECTS: Project[] = [
  p('powercell-group', 'Web', 'PowerCell Group', 'Énergie Renouvelable', D, R, '#DDE3FF', '#1A2A8A', 'https://powercellgroup.com/'),
  p('yassir', 'ADS', 'YASSIR', 'Campagne ADS Multi-plateforme', 'Stratégie ADS intégrée avec reach massif (3.9M Facebook, 1.4M Instagram, 5M paid reach) et benchmarking compétitif pour optimisation continue.', '5M paid reach', '#0E1726', '#FFFFFF'),
  p('zayn', 'Social', 'ZAYN', 'Campagne Social/Médias', 'Campagne intégrée avec visuels produits premium, stratégie de contenu multi-format et résultats mesurables (308.8K couverture, 6.5K interactions).', '308.8K couverture', '#F2E6D8', '#6B3E12'),
  p('cushman-wakefield-veritas', 'Web', 'Cushman & Wakefield Veritas', 'Immobilier', D, R, '#E4EFE9', '#14532D', 'https://cushwake.ge/'),
  p('groupado-pro', 'ADS', 'groupado PRO', 'Campagne ADS Performance', 'Campagne d’acquisition avec focus sur ad trends, portée payante (1.7M) et impressions massives (6.4M) pour maximiser la visibilité.', '6.4M impressions', '#EDE7F6', '#4C1D95'),
  p('kpmg', 'Social', 'KPMG', 'Audit & Analyse Audience', 'Rapport d’analyse audience détaillé avec insights sur la couverture organique vs payante, performance de contenu et engagement utilisateur.', R, '#E6ECF5', '#0B3A75'),
  p('fibbl', 'Web', 'Fibbl', 'SaaS B2B', D, R, '#FFF1E6', '#9A3412', 'https://fibbl.com/'),
  p('brasileia-cosmetics', 'ADS', 'Brasileia Cosmetics', 'Campagne ADS Beauté', 'Campagne produit beauté avec visuels premium, messaging ciblé et analytics détaillées (1.8M views, 996K coverage).', '1.8M views', '#FCE7F3', '#9D174D'),
  p('br-finanzen', 'Social', 'BR Finanzen', 'Stratégie financière digitale', 'Campagne de communication financière avec design premium, conseils d’épargne et branding cohérent pour services bancaires.', R, '#E0F2FE', '#075985'),
  p('copenhagen-energy', 'Web', 'Copenhagen Energy', 'Énergie', D, R, '#E0F2FE', '#075985', 'https://copenhagen-energy.com/'),
  p('tunisia-franchise-show', 'ADS', 'Tunisia Franchise Show', 'Campagne ADS Événementielle', 'Campagne événementielle avec reach massif (2.2M), engagement ciblé (2.9K interactions) et trafic multi-plateforme.', '2.2M reach', '#FEF3C7', '#92400E'),
  p('campagnes-beaute-sante', 'Social', 'Campagnes Beauté & Santé', 'Multi-marques Beauté/Santé', 'Gestion de campagnes intégrées pour marques beauté et santé avec dashboards analytics, visuels produits et stratégie de contenu premium.', R, '#FCE7F3', '#9D174D'),
  p('foscolo', 'Web', 'Coaching und Therapie Foscolo', 'Services Professionnels', D, R, '#F5F5F4', '#44403C', 'https://www.foscolo.ch/'),
  p('lore-and-heart', 'ADS', 'LORE & HEART', 'Campagne ADS Social', 'Campagne d’acquisition sur Facebook et Instagram avec analyse détaillée de l’engagement, identification des posts performants et optimisation de la portée.', R, '#F5F5F4', '#44403C'),
  p('jardins-de-carthage', 'Social', 'Laboratoire Jardins de Carthage', 'Branding & Communication Santé', 'Campagne de communication santé avec branding premium, visuels médicaux et stratégie de contenu pour laboratoire pharmaceutique.', R, '#DCFCE7', '#166534'),
  p('dunstan', 'Web', 'Dunstan', 'Animaliers', D, R, '#FEF3C7', '#92400E', 'https://dunstan.se/'),
  p('galeries-live', 'ADS', 'Galeries LIVE', 'Campagne ADS Engagement', 'Stratégie ADS combinant reach organique et payante avec analyse des posts top-performing pour optimiser le ROI.', R, '#E4EFE9', '#14532D'),
  p('radiumhemmets-forskningsfonder', 'Web', 'Radiumhemmets Forskningsfonder', 'Recherche', D, R, '#FCE7F3', '#9D174D', 'https://rahfo.se/'),
  p('quartz-conciergerie', 'Web', 'Quartz Conciergerie', 'Conciergerie Airbnb', D, R, '#F3EBDD', '#6B4E2E', 'https://quartzconciergerie.com/'),
  p('founa-com-by-smg','ADS', 'Founa.com by SMG', 'Campagne ADS Acquisition', 'Campagne d’acquisition structurée avec dashboard analytics complet, suivi des KPIs et optimisation des performances.', R, '#E0F2FE', '#075985'),
  p('prostarseo', 'ADS', 'ProstarSEO', 'Campagne ADS Digital/SEO', 'Campagne d’acquisition digitale avec analyse d’autorité, trafic organique et distribution géographique pour ciblage optimisé.', R, '#EDE7F6', '#4C1D95')
]

// Réalisations gérées dans l'admin (table projects de Supabase, lue au build) : elles remplacent la liste ci-dessus dès que la table en contient
export const PROJECTS: Project[] = cms?.projects?.length
  ? cms.projects.map(c => ({ ...p(c.slug, c.cat, c.client, c.label, c.desc || D, c.metric || R, c.bg, c.fg, c.url), img: c.img, logo: c.logo || undefined, study: toStudy(c.study, c) }))
  : LOCAL_PROJECTS

export const CAT_LABEL: Record<ProjectCat, string> = { Web: 'Site web', ADS: 'ADS', Social: 'Social/Médias' }

/** Une réalisation n'est indexée (et listée dans le sitemap) que si c'est une vraie étude de cas :
 *  présentation, contexte, travail réalisé et résultats totalisent au moins ce nombre de caractères.
 *  En dessous de ce seuil, la page reste consultable mais en noindex. */
export const CASE_STUDY_MIN_CHARS = 400
export const isCaseStudy = (p: Pick<Project, 'desc' | 'study'>) =>
  [p.desc.startsWith('[') ? '' : p.desc, p.study?.context, p.study?.work, p.study?.results].join('').length >= CASE_STUDY_MIN_CHARS

/** Témoignages clients : les réalisations dont l'étude de cas porte une citation signée */
export const hasQuote = (p: Project) => !!(p.study?.quote && p.study.quoteAuthor)

/* ---------------- Services ---------------- */
export interface Offer { n: string; t: string; d: string; tags: string[] }
export interface Step { n: string; t: string; d: string }
export interface Benefit { t: string; d: string }
export interface Service {
  slug: string; key: string; num: string; crumb: string; eyebrow: string; h1: string; sub: string
  offersTitle: string; offersSub: string; offers: Offer[]
  benTitle: string; benefits: Benefit[]; methTitle: string; steps: Step[]
  related: string[]; cta: string
  /** Page d'atterrissage SEO : accessible par son URL et le sitemap, mais absente des menus et des listes de services */
  landing?: boolean
  /** Prix d'appel affiché « À partir de … » sur l'accueil et la page de l'expertise (ex. '1 500 € HT'). Vide = rien n'est affiché. */
  from?: string
}

const o = (n: string, t: string, d: string, tags: string[]): Offer => ({ n, t, d, tags })
const s = (n: string, t: string, d: string): Step => ({ n, t, d })
const b = (t: string, d: string): Benefit => ({ t, d })

const COMMON_STEPS = [
  s('1', 'Cadrage', 'Analyse de votre marché, de vos concurrents et de vos objectifs pour fixer les priorités.'),
  s('2', 'Conception', 'Parcours, maquettes, plan d’action : vous validez avant toute production.'),
  s('3', 'Production', 'Nos équipes produisent avec exigence et vous associent à chaque jalon.'),
  s('4', 'Lancement & suivi', 'Mise en ligne, mesure des performances et optimisation continue.')
]

const LOCAL_SERVICES: Service[] = [
  {
    slug: 'creation-site-web', key: 'web', num: '01', crumb: 'Création de site web', eyebrow: 'Création de site web',
    h1: 'Des sites qui travaillent pour votre croissance.',
    sub: 'Vitrine, blog, landing page ou e-commerce : nous concevons des sites rapides, élégants et pensés pour convertir, du premier écran jusqu’à la prise de contact ou l’achat.',
    offersTitle: 'Un format pour chaque ambition.', offersSub: 'Chaque site est une réponse sur-mesure aux enjeux stratégiques de nos clients.',
    offers: [
      o('01', 'Site vitrine', 'Présentez votre entreprise, vos expertises et vos références avec un site qui inspire confiance dès la première visite.', ['Identité', 'Pages services', 'Formulaire de contact']),
      o('02', 'Blog', 'Publiez des contenus experts qui nourrissent votre référencement et installent votre légitimité sur votre marché.', ['Stratégie éditoriale', 'SEO', 'Catégories']),
      o('03', 'Landing page', 'Une page, un objectif : transformer le trafic de vos campagnes en demandes de devis ou en inscriptions.', ['Campagnes ADS', 'Conversion', 'A/B test']),
      o('04', 'E-commerce', 'Une boutique en ligne pensée pour la vente : fiches produits soignées, tunnel d’achat fluide, paiement sécurisé.', ['Catalogue', 'Paiement', 'Tunnel d’achat'])
    ],
    benTitle: 'Un site n’est pas une vitrine. C’est un outil de vente.',
    benefits: [
      b('Performance', 'Des pages légères et rapides, parce qu’un visiteur qui attend est un visiteur qui part.'),
      b('Conversion', 'Chaque section est pensée pour guider le visiteur vers l’action : contact, devis ou achat.'),
      b('Référencement natif', 'Structure, balisage et contenus optimisés dès la conception, pas après la mise en ligne.'),
      b('Cohérence de marque', 'Un design fidèle à votre identité, décliné avec rigueur sur chaque écran.')
    ],
    methTitle: 'De l’idée à la mise en ligne.', steps: COMMON_STEPS,
    related: ['powercell-group', 'cushman-wakefield-veritas', 'acoi-groupe'], cta: 'Un site à créer ou à refondre ?'
  },
  {
    slug: 'application-metier', key: 'app', num: '02', crumb: 'Application métier', eyebrow: 'Application métier sur mesure',
    h1: 'Vos processus, enfin à la hauteur de votre activité.',
    sub: 'Nous concevons des outils métier taillés pour vos équipes : moins de tâches manuelles, moins de fichiers dispersés, plus de temps pour votre cœur de métier.',
    offersTitle: 'Des outils conçus autour de vos équipes.', offersSub: 'Chaque application part de vos usages réels, pas d’un logiciel standard à adapter.',
    offers: [
      o('01', 'CRM sur mesure', 'Centralisez vos contacts, vos opportunités et votre suivi commercial dans un outil qui vous ressemble.', ['Pipeline', 'Relances', 'Tableaux de bord']),
      o('02', 'Back-office', 'Pilotez vos opérations, vos stocks ou vos commandes depuis une interface claire et sécurisée.', ['Gestion', 'Droits d’accès', 'Exports']),
      o('03', 'Portail client', 'Offrez à vos clients un espace dédié pour suivre leurs dossiers, documents et échanges.', ['Espace sécurisé', 'Documents', 'Notifications']),
      o('04', 'Automatisation', 'Connectez vos outils existants et supprimez les tâches répétitives qui ralentissent vos équipes.', ['Intégrations', 'Workflows', 'API'])
    ],
    benTitle: 'Un outil adopté est un outil utile.',
    benefits: [
      b('Sur mesure', 'Conçu à partir de vos processus, sans fonctionnalités superflues.'),
      b('Adoption', 'Des interfaces pensées pour vos équipes, simples à prendre en main.'),
      b('Évolutivité', 'Une architecture qui grandit avec votre entreprise.'),
      b('Sécurité', 'Gestion des accès et protection de vos données au cœur de la conception.')
    ],
    methTitle: 'Du besoin métier à l’outil déployé.', steps: COMMON_STEPS, related: ['karoo', 'stackello'], cta: 'Un processus à digitaliser ?'
  },
  {
    slug: 'referencement-seo-geo', key: 'seo', num: '03', crumb: 'Référencement SEO & GEO', eyebrow: 'Référencement SEO & GEO',
    h1: 'Soyez trouvé sur Google. Soyez cité par les IA.',
    sub: 'Vos clients cherchent sur Google, mais aussi auprès de ChatGPT, Gemini ou Perplexity. Nous optimisons votre visibilité sur ces deux terrains pour capter une demande qualifiée et durable.',
    offersTitle: 'Une visibilité qui se construit dans la durée.', offersSub: 'Le SEO construit un actif durable ; le GEO prépare votre marque aux nouveaux usages de recherche.',
    offers: [
      o('01', 'Audit & stratégie', 'Un état des lieux technique, sémantique et concurrentiel pour prioriser les actions à fort impact.', ['Audit technique', 'Mots-clés', 'Concurrence']),
      o('02', 'SEO technique', 'Vitesse, indexation, structure, données structurées : les fondations indispensables à votre visibilité.', ['Indexation', 'Performance', 'Balisage']),
      o('03', 'Contenus optimisés', 'Des pages et articles qui répondent précisément aux questions de vos clients et aux attentes des moteurs.', ['Rédaction', 'Maillage', 'SEO local']),
      o('04', 'GEO', 'Rendez votre marque visible et citée dans les réponses des IA génératives.', ['ChatGPT', 'Gemini', 'Perplexity'])
    ],
    benTitle: 'Le trafic qui ne s’arrête pas quand le budget s’arrête.',
    benefits: [
      b('Durabilité', 'Contrairement à la publicité, une position acquise continue de générer du trafic.'),
      b('Qualification', 'Vous captez des internautes qui cherchent précisément ce que vous proposez.'),
      b('Anticipation', 'Le GEO positionne votre marque sur les usages de recherche de demain.'),
      b('Mesure', 'Positions, trafic et conversions suivis et partagés avec vous.')
    ],
    methTitle: 'De l’audit à la croissance organique.',
    steps: [s('1', 'Audit', 'État des lieux technique, sémantique et concurrentiel.'), s('2', 'Stratégie', 'Priorisation des mots-clés et des chantiers à fort impact.'), s('3', 'Optimisation', 'Corrections techniques, contenus et maillage interne.'), s('4', 'Suivi', 'Mesure des positions et ajustements continus.')],
    related: ['prostarseo', 'powercell-group', 'cushman-wakefield-veritas'], cta: 'Envie de gagner en visibilité ?'
  },
  {
    slug: 'application-mobile', key: 'mobile', num: '04', crumb: 'Application mobile', eyebrow: 'Application mobile',
    h1: 'Votre marque, dans la poche de vos clients.',
    sub: 'Des applications iOS et Android fluides et intuitives, de la conception UX à la publication sur les stores, pensées pour l’usage réel de vos utilisateurs.',
    offersTitle: 'De la maquette aux stores.', offersSub: 'Une application réussie commence par une expérience utilisateur irréprochable.',
    offers: [
      o('01', 'Conception UX / UI', 'Parcours, maquettes et prototypes interactifs pour valider l’expérience avant le développement.', ['Parcours', 'Maquettes', 'Prototype']),
      o('02', 'Application iOS', 'Une application pensée pour l’écosystème Apple et ses standards d’exigence.', ['iPhone', 'iPad', 'App Store']),
      o('03', 'Application Android', 'Une application performante sur la diversité des appareils Android.', ['Smartphones', 'Tablettes', 'Google Play']),
      o('04', 'Publication & évolutions', 'Mise en ligne sur les stores, suivi et nouvelles fonctionnalités au fil des besoins.', ['Stores', 'Mises à jour', 'Évolutions'])
    ],
    benTitle: 'Une application doit se rendre indispensable.',
    benefits: [
      b('Expérience', 'Des parcours simples et fluides qui donnent envie de revenir.'),
      b('Fidélisation', 'Un canal direct avec vos clients, disponible à tout moment.'),
      b('Performance', 'Une application rapide et stable, quel que soit l’appareil.'),
      b('Évolutivité', 'Une base technique pensée pour accueillir de nouvelles fonctionnalités.')
    ],
    methTitle: 'De l’idée à l’App Store.', steps: COMMON_STEPS, related: ['karoo', 'stackello'], cta: 'Un projet d’application ?'
  },
  {
    slug: 'marketing-digital-ads', key: 'ads', num: '05', crumb: 'Marketing digital & ADS', eyebrow: 'Marketing digital & ADS',
    h1: 'Chaque euro investi doit travailler.',
    sub: 'Campagnes et dispositifs d’acquisition conçus pour améliorer la visibilité, structurer la diffusion et soutenir la performance marketing de nos clients.',
    offersTitle: 'Des campagnes pilotées par la donnée.', offersSub: 'Ciblage, création, diffusion, optimisation : nous prenons en charge toute la chaîne.',
    offers: [
      o('01', 'Stratégie d’acquisition', 'Choix des plateformes, des audiences et des objectifs en fonction de votre marché.', ['Audiences', 'Plateformes', 'Objectifs']),
      o('02', 'Création publicitaire', 'Visuels et messages calibrés pour capter l’attention et déclencher l’action.', ['Visuels', 'Vidéo', 'Messages']),
      o('03', 'Diffusion multi-plateforme', 'Des campagnes orchestrées sur Facebook, Instagram et les plateformes où se trouve votre audience.', ['Facebook', 'Instagram', 'Multi-plateforme']),
      o('04', 'Analyse & optimisation', 'Suivi des KPIs, identification des contenus performants et benchmark concurrentiel.', ['Dashboards', 'KPIs', 'Benchmark'])
    ],
    benTitle: 'Des résultats rapides, mesurés en continu.',
    benefits: [
      b('Rapidité', 'Des campagnes qui génèrent de la visibilité dès leur lancement.'),
      b('Précision', 'Chaque campagne est calibrée pour votre audience cible.'),
      b('Transparence', 'Des dashboards clairs pour suivre la performance de chaque euro investi.'),
      b('Optimisation', 'Analyse des posts top-performing et ajustements continus.')
    ],
    methTitle: 'Du ciblage au retour sur investissement.',
    steps: [s('1', 'Analyse', 'Audience, concurrence et objectifs de la campagne.'), s('2', 'Création', 'Visuels et messages adaptés à chaque plateforme.'), s('3', 'Diffusion', 'Lancement et pilotage des campagnes.'), s('4', 'Optimisation', 'Analyse des résultats et ajustements continus.')],
    related: ['yassir', 'groupado-pro', 'tunisia-franchise-show'], cta: 'Prêt à accélérer votre acquisition ?'
  },
  {
    slug: 'social-media', key: 'social', num: '06', crumb: 'Social media & contenus', eyebrow: 'Social media & contenus',
    h1: 'Des contenus qui renforcent votre image et créent l’engagement.',
    sub: 'Contenus, concepts visuels et dispositifs de communication pensés pour renforcer l’image, la présence et l’impact digital de votre marque sur TikTok et Instagram.',
    offersTitle: 'Visuel. Vidéo. Stratégie.', offersSub: 'Nous combinons créativité et analyse d’audience pour des contenus qui performent.',
    offers: [
      o('01', 'Stratégie éditoriale', 'Ligne éditoriale, calendrier et formats adaptés à vos objectifs et à votre audience.', ['Ligne éditoriale', 'Calendrier', 'Formats']),
      o('02', 'Création visuelle', 'Visuels premium et concepts créatifs fidèles à votre identité de marque.', ['Visuels', 'Carrousels', 'Branding']),
      o('03', 'Vidéo courte', 'Des formats courts pensés pour TikTok et Instagram, là où se joue l’attention.', ['TikTok', 'Reels', 'Stories']),
      o('04', 'Analyse d’audience', 'Couverture organique vs payante, performance des contenus, engagement : des insights pour progresser.', ['Rapports', 'Insights', 'Benchmark'])
    ],
    benTitle: 'Exister sur les réseaux, c’est exister tout court.',
    benefits: [
      b('Visibilité', 'Une présence régulière et maîtrisée là où se trouve votre audience.'),
      b('Image', 'Des contenus premium qui valorisent votre marque.'),
      b('Engagement', 'Des formats qui suscitent réactions, partages et conversations.'),
      b('Pilotage', 'Des analyses d’audience pour affiner la stratégie en continu.')
    ],
    methTitle: 'De la stratégie au contenu publié.',
    steps: [s('1', 'Le Choix', 'Définition de vos objectifs et des formats : visuel, vidéo ou les deux.'), s('2', 'Le Brief', 'Vous nous transmettez votre vision et vos assets.'), s('3', 'La Stratégie', 'Nous analysons, créons et optimisons.'), s('4', 'Le Décollage', 'Livraison des contenus prêts à publier.')],
    related: ['zayn', 'kpmg', 'br-finanzen'], cta: 'Envie de faire rayonner votre marque ?'
  },
  {
    slug: 'refonte-site-web', key: 'refonte', num: '07', crumb: 'Refonte de site', eyebrow: 'Refonte de site web',
    h1: 'Un site vieillissant ? Donnez-lui une seconde vie.',
    sub: 'Design daté, pages lentes, site difficile à mettre à jour ou qui ne génère plus de contacts : nous repensons votre site sans perdre votre référencement ni vos contenus.',
    offersTitle: 'Une refonte à la mesure de votre besoin.', offersSub: 'Du simple rafraîchissement à la reconstruction complète, on ne refait que ce qui doit l’être.',
    offers: [
      o('01', 'Refonte graphique', 'Un design actuel et fidèle à votre marque, sur une structure de site conservée.', ['Nouveau design', 'Responsive', 'Identité']),
      o('02', 'Refonte complète', 'Arborescence, contenus, design et technique repensés pour repartir sur des bases saines.', ['Arborescence', 'Contenus', 'Nouveau socle']),
      o('03', 'Migration technique', 'Changement de CMS ou de technologie, avec reprise de vos contenus et de vos données.', ['Changement de CMS', 'Reprise de contenus', 'Hébergement']),
      o('04', 'Refonte SEO', 'Plan de redirections et optimisation des pages pour préserver vos positions sur Google.', ['Redirections 301', 'Balisage', 'Suivi des positions'])
    ],
    benTitle: 'Refaire son site, sans repartir de zéro.',
    benefits: [
      b('Référencement préservé', 'Chaque ancienne adresse est redirigée vers la nouvelle pour ne pas perdre votre visibilité.'),
      b('Site plus rapide', 'Des pages allégées et un socle technique à jour, sur mobile comme sur ordinateur.'),
      b('Plus de contacts', 'Des parcours repensés pour guider vos visiteurs vers la demande de devis ou l’achat.'),
      b('Autonomie', 'Un site simple à mettre à jour par vos équipes, sans dépendre d’un développeur.')
    ],
    methTitle: 'De l’audit à la bascule.',
    steps: [s('1', 'Audit', 'Analyse de votre site actuel : contenus, performances, référencement et points de friction.'), s('2', 'Conception', 'Nouvelle arborescence et maquettes : vous validez avant toute production.'), s('3', 'Production', 'Développement, reprise des contenus et plan de redirections.'), s('4', 'Bascule & suivi', 'Mise en ligne sans coupure, puis contrôle du référencement dans les semaines qui suivent.')],
    related: ['copenhagen-energy', 'dunstan', 'lbvs-avocats'], cta: 'Un site à moderniser ?'
  },
  {
    slug: 'maintenance-site-web', key: 'maintenance', num: '08', crumb: 'Maintenance de site', eyebrow: 'Maintenance de site web',
    h1: 'Votre site à jour, sécurisé et disponible.',
    sub: 'Mises à jour, sauvegardes, sécurité et petites évolutions : nous veillons sur votre site pour que vous n’ayez plus à vous en soucier.',
    offersTitle: 'Tout ce qu’il faut pour un site serein.', offersSub: 'Un accompagnement dans la durée, que nous ayons créé votre site ou non.',
    offers: [
      o('01', 'Mises à jour', 'CMS, extensions et thème tenus à jour, avec vérification du site après chaque intervention.', ['CMS', 'Extensions', 'Compatibilité']),
      o('02', 'Sécurité & sauvegardes', 'Sauvegardes régulières, surveillance et restauration du site en cas de problème.', ['Sauvegardes', 'Surveillance', 'Restauration']),
      o('03', 'Corrections & évolutions', 'Un bug, un texte à modifier, une page à ajouter : nous intervenons à la demande.', ['Corrections', 'Contenus', 'Nouvelles pages']),
      o('04', 'Performance & suivi', 'Contrôle de la vitesse et de la disponibilité, avec un compte rendu régulier.', ['Vitesse', 'Disponibilité', 'Compte rendu'])
    ],
    benTitle: 'Un site, ça s’entretient.',
    benefits: [
      b('Sécurité', 'Un site à jour est un site moins exposé aux failles et au piratage.'),
      b('Disponibilité', 'Les problèmes sont repérés et traités avant de vous faire perdre des clients.'),
      b('Sérénité', 'Un interlocuteur qui connaît votre site et répond quand vous en avez besoin.'),
      b('Évolution continue', 'Votre site suit votre activité : nouvelles offres, nouvelles pages, nouveaux contenus.')
    ],
    methTitle: 'Une prise en main simple.',
    steps: [s('1', 'État des lieux', 'Audit de votre site : versions, sécurité, sauvegardes et performances.'), s('2', 'Mise à niveau', 'Remise à jour et sécurisation du site avant de démarrer le suivi.'), s('3', 'Suivi régulier', 'Mises à jour, sauvegardes et surveillance tout au long de l’année.'), s('4', 'Interventions', 'Corrections et évolutions à la demande, avec un compte rendu.')],
    related: ['radiumhemmets-forskningsfonder', 'quartz-conciergerie', 'foscolo'], cta: 'Besoin d’un site toujours au point ?'
  },
  {
    slug: 'creation-saas', key: 'saas', num: '09', crumb: 'SaaS', eyebrow: 'Création de SaaS',
    h1: 'Votre idée de logiciel, transformée en produit en ligne.',
    sub: 'Du premier prototype à la plateforme par abonnement : nous concevons et développons votre SaaS, avec comptes utilisateurs, paiement en ligne et un socle prêt à grandir.',
    offersTitle: 'De l’idée au produit qui se vend.', offersSub: 'On avance par étapes, pour mettre rapidement votre produit entre les mains de vrais utilisateurs.',
    offers: [
      o('01', 'MVP', 'Une première version centrée sur l’essentiel, pour tester votre idée auprès de vos premiers clients.', ['Prototype', 'Fonctions clés', 'Mise en ligne']),
      o('02', 'Plateforme SaaS', 'Comptes, rôles, espaces clients et tableaux de bord : une application complète, pensée pour plusieurs clients.', ['Multi-clients', 'Rôles & droits', 'Tableaux de bord']),
      o('03', 'Abonnements & paiement', 'Formules, essais gratuits, facturation et paiement en ligne intégrés à votre produit.', ['Formules', 'Paiement en ligne', 'Facturation']),
      o('04', 'Évolution & intégrations', 'Nouvelles fonctionnalités, API et connexions avec les outils de vos clients.', ['API', 'Intégrations', 'Nouvelles fonctions'])
    ],
    benTitle: 'Un SaaS se construit pour durer.',
    benefits: [
      b('Lancement rapide', 'Une première version utilisable tôt, pour apprendre de vos utilisateurs avant d’aller plus loin.'),
      b('Socle évolutif', 'Une architecture qui accompagne la croissance de votre nombre de clients.'),
      b('Revenus récurrents', 'Abonnements et paiements gérés dans le produit, sans bricolage.'),
      b('Expérience soignée', 'Une interface claire qui donne envie de revenir et limite les demandes au support.')
    ],
    methTitle: 'De l’idée au lancement.',
    steps: [s('1', 'Cadrage', 'Votre marché, vos utilisateurs et les fonctions vraiment indispensables à la première version.'), s('2', 'Conception', 'Parcours et maquettes de l’application : vous validez avant le développement.'), s('3', 'Développement', 'Construction par étapes, avec des démonstrations régulières.'), s('4', 'Lancement & évolution', 'Mise en ligne, suivi de l’usage et ajout de fonctionnalités au fil des retours.')],
    related: ['stackello', 'karoo'], cta: 'Un SaaS à lancer ?'
  },
  {
    slug: 'agence-geo', key: 'geo', num: 'IA', crumb: 'Agence GEO', eyebrow: 'Agence GEO', landing: true,
    h1: 'Donnez aux IA de bonnes raisons de vous citer.',
    sub: 'Vos clients posent désormais leurs questions à ChatGPT, Gemini et Perplexity. Le GEO (Generative Engine Optimization) consiste à faire en sorte que ces IA citent votre entreprise dans leurs réponses.',
    offersTitle: 'Du diagnostic à la citation.', offersSub: 'Le GEO prolonge le référencement naturel : on ne repart pas de zéro, on rend votre site lisible et citable par les IA.',
    offers: [
      o('01', 'Audit de visibilité IA', 'Nous interrogeons les principaux moteurs IA sur vos requêtes clés : êtes-vous cité, qui l’est à votre place, et pourquoi.', ['ChatGPT', 'Gemini', 'Perplexity']),
      o('02', 'Contenus citables', 'Des réponses claires, structurées et sourcées aux questions de vos clients, que les IA peuvent reprendre telles quelles.', ['Questions-réponses', 'Chiffres sourcés', 'Structure']),
      o('03', 'Socle technique', 'Accès des robots IA, données structurées et pages rapides : votre site devient facile à lire pour une IA. Un fichier llms.txt peut s’y ajouter, sans effet garanti.', ['Robots IA', 'Données structurées', 'Vitesse']),
      o('04', 'Notoriété de marque', 'Les IA citent les marques dont on parle ailleurs : avis, annuaires, articles et mentions cohérentes de votre entreprise.', ['Avis', 'Mentions', 'Cohérence'])
    ],
    benTitle: 'Le GEO ne remplace pas le SEO. Il le prolonge.',
    benefits: [
      b('Une nouvelle source de clients', 'Être cité dans une réponse d’IA, c’est être recommandé au moment précis où le client se décide.'),
      b('Un travail qui sert deux fois', 'Le GEO repose sur le même socle que le référencement naturel : un site lisible et des contenus utiles servent les deux.'),
      b('Sans promesse intenable', 'Personne ne contrôle les réponses d’une IA : nous ne garantissons pas une citation, nous augmentons vos chances d’en obtenir.'),
      b('Un suivi régulier', 'Nous testons chaque mois vos requêtes clés sur les principales IA et vous remettons le relevé.')
    ],
    methTitle: 'Notre méthode GEO.',
    steps: [s('1', 'Diagnostic', 'Vos requêtes clés testées sur les moteurs IA, et l’analyse des sources qu’ils citent.'), s('2', 'Plan d’action', 'Les pages à créer ou à réécrire, classées par impact.'), s('3', 'Production', 'Contenus, données structurées et corrections techniques.'), s('4', 'Suivi', 'Mesure régulière des citations et ajustements.')],
    related: ['prostarseo', 'powercell-group', 'cushman-wakefield-veritas'], cta: 'Envie d’être cité par les IA ?'
  }
]

// Textes modifiés dans l'admin (table services de Supabase, lue au build) : appliqués par-dessus la liste ci-dessus
export const SERVICES: Service[] = LOCAL_SERVICES.map(sv => ({ ...sv, ...splitServiceText(cms?.services?.[sv.slug]?.fr).text }))

/** Les trois familles d'expertises : même regroupement et même ordre partout (accueil, menu, page Services, pied de page, formulaire de contact).
 *  key = clé de la première expertise de la famille, dont l'icône représente la famille. */
export interface ServiceFamily { key: string; slugs: string[]; title: { fr: string; en: string }; text: { fr: string; en: string } }
export const SERVICE_FAMILIES: ServiceFamily[] = [
  {
    key: 'web', slugs: ['creation-site-web', 'refonte-site-web', 'maintenance-site-web'],
    title: { fr: 'Sites web', en: 'Websites' },
    text: { fr: 'Créer votre site, le refaire quand il a vieilli, et le garder rapide et sûr dans la durée.', en: 'Build your site, redesign it when it has aged, and keep it fast and secure over time.' }
  },
  {
    key: 'app', slugs: ['application-metier', 'creation-saas', 'application-mobile'],
    title: { fr: 'Applications & SaaS', en: 'Applications & SaaS' },
    text: { fr: 'Des outils sur mesure pour vos équipes, vos clients ou un nouveau produit à commercialiser.', en: 'Custom tools for your team, your customers or a new product to bring to market.' }
  },
  {
    key: 'seo', slugs: ['referencement-seo-geo', 'marketing-digital-ads', 'social-media'],
    title: { fr: 'Visibilité & acquisition', en: 'Visibility & acquisition' },
    text: { fr: 'Être trouvé sur Google et dans les IA, puis transformer cette audience en demandes.', en: 'Get found on Google and in AI tools, then turn that audience into enquiries.' }
  }
]

/** Balises SEO des services : titre ciblé (≤ 60 car. avec la marque) et description 120–160 car. */
const LOCAL_SERVICE_SEO: Record<string, { title: string; h1: string; desc: string }> = {
  'creation-site-web': { title: 'Création de site web à Paris : vitrine & e-commerce', h1: 'Création de site web à Paris', desc: 'Agence de création de site web à Paris : sites vitrines, e-commerce et landing pages rapides, optimisés pour Google et pensés pour convertir. Devis sous 48 h.' },
  'application-metier': { title: 'Développement d’application métier sur mesure', h1: 'Application métier sur mesure', desc: 'Développement d’applications métier sur mesure à Paris : CRM, back-office, portail client et automatisations adaptés à vos processus. Devis gratuit sous 48 h.' },
  'application-mobile': { title: 'Création d’application mobile iOS & Android', h1: 'Création d’application mobile iOS & Android', desc: 'Conception et développement d’applications mobiles iOS et Android, de la maquette UX à la publication sur les stores. Agence basée à Paris, devis sous 48 h.' },
  'referencement-seo-geo': { title: 'Agence SEO & GEO à Paris : Google et IA', h1: 'Agence SEO & GEO à Paris', desc: 'Référencement naturel SEO et GEO à Paris : audit, SEO technique, contenus et visibilité dans ChatGPT, Gemini et Perplexity pour une demande qualifiée.' },
  'marketing-digital-ads': { title: 'Agence Google Ads, Meta Ads & TikTok Ads', h1: 'Agence marketing digital & publicité en ligne', desc: 'Campagnes Google Ads, Meta Ads et TikTok Ads pilotées par la donnée : stratégie, création, diffusion et optimisation continue. Agence marketing digital à Paris.' },
  'social-media': { title: 'Agence social media : contenus TikTok & Instagram', h1: 'Agence social media & création de contenus', desc: 'Stratégie social media, création visuelle et vidéos courtes pour TikTok et Instagram : des contenus qui renforcent votre image et créent l’engagement.' },
  'refonte-site-web': { title: 'Refonte de site web à Paris, sans perte de SEO', h1: 'Refonte de site web à Paris', desc: 'Refonte de site web à Paris : nouveau design, migration technique et plan de redirections pour moderniser votre site sans perdre votre référencement Google.' },
  'maintenance-site-web': { title: 'Maintenance de site web : mises à jour & sécurité', h1: 'Maintenance de site web', desc: 'Maintenance de site web : mises à jour, sauvegardes, sécurité, corrections et évolutions à la demande. Un site à jour et disponible, suivi par une agence à Paris.' },
  'agence-geo': { title: 'Agence GEO : être cité par ChatGPT, Gemini, Perplexity', h1: 'Agence GEO à Paris', desc: 'Agence GEO à Paris : audit de visibilité IA, contenus citables et socle technique pour que ChatGPT, Gemini et Perplexity recommandent votre entreprise.' },
  'creation-saas': { title: 'Création de SaaS : du MVP à la plateforme', h1: 'Création de SaaS sur mesure', desc: 'Création de SaaS sur mesure à Paris : MVP, plateforme multi-clients, abonnements et paiement en ligne. Du cadrage au lancement, avec une équipe dédiée. Devis sous 48 h.' }
}
export const SERVICE_SEO: Record<string, { title: string; h1: string; desc: string }> = Object.fromEntries(
  Object.entries(LOCAL_SERVICE_SEO).map(([slug, seo]) => [slug, { ...seo, ...splitServiceText(cms?.services?.[slug]?.fr).seo }])
)

export const SERVICE_FAQ: [string, string][] = [
  ['Combien coûtent vos prestations ?', 'Chaque projet est unique : son budget dépend de la complexité, des technologies et des délais demandés. Après un premier échange, nous vous remettons un devis détaillé, valable 30 jours. Le paiement se fait en deux temps : 50 % à la commande, 50 % à la livraison.'],
  ['Quels sont les délais ?', 'Ils dépendent de la nature et de l’envergure du projet, ainsi que de la transmission de vos contenus. Un planning indicatif, jalonné d’étapes de validation, est établi dès le cadrage.'],
  ['Combien de révisions sont incluses ?', 'Deux cycles de révision sont inclus dans chaque prestation. Les demandes supplémentaires font l’objet d’un complément de devis.'],
  ['Que se passe-t-il après la livraison ?', 'Pour un site, une application ou un agent IA, 12 mois de maintenance technique sont inclus. Un abonnement de suivi peut ensuite prendre le relais. Les créations vous appartiennent dès le paiement intégral.'],
  ['Peut-on combiner plusieurs expertises ?', 'Oui, et c’est souvent là que naît la performance : un site bien référencé, nourri par des campagnes et des contenus cohérents.']
]

/* ---------------- Landing pages locales ---------------- */
export interface LocalPage {
  slug: string; crumbParent: string; crumb: string; eyebrow: string; h1: string; sub: string
  svcTitle: string; whyTitle: string; why: Benefit[]; refTitle: string; refs: string[]
  faq: [string, string][]; cta: string; title: string; description: string
}

export const LOCAL_PAGES: LocalPage[] = [
  {
    slug: 'paris', crumbParent: 'Agence digitale', crumb: 'Paris', eyebrow: 'Agence digitale à Paris',
    title: 'Agence digitale à Paris', description: 'Création de sites, applications sur mesure, référencement SEO & GEO et marketing digital pour les entreprises parisiennes et franciliennes.',
    h1: 'Votre agence digitale à Paris.',
    sub: 'Création de sites, applications sur mesure, référencement SEO & GEO et marketing digital : KPS accompagne les entreprises parisiennes et franciliennes dans leur croissance en ligne.',
    svcTitle: 'Toutes nos expertises, au service des entreprises parisiennes.', whyTitle: 'Pourquoi une agence basée à Paris ?',
    why: [
      b('La proximité', 'Des échanges directs avec une équipe basée à Paris, en visio ou en rendez-vous.'),
      b('La connaissance du marché', 'Une compréhension fine des attentes des clients et de la concurrence en Île-de-France.'),
      b('Le SEO local', 'Une visibilité optimisée sur les recherches géolocalisées de vos futurs clients.'),
      b('Une équipe complète', 'Neuf expertises réunies pour mener votre projet de bout en bout.')
    ],
    refTitle: 'Quelques-unes de nos références', refs: ['yassir', 'kpmg', 'cushman-wakefield-veritas'],
    faq: [
      ['Intervenez-vous dans toute l’Île-de-France ?', 'Oui. Nous accompagnons les entreprises de Paris et de toute l’Île-de-France, en rendez-vous ou en visio.'],
      ['Peut-on vous rencontrer dans vos locaux ?', 'Oui, sur rendez-vous : nos bureaux se trouvent au 59 rue de Ponthieu, dans le 8e arrondissement de Paris. Écrivez-nous à contact@kps-agency.com pour convenir d’un créneau.'],
      ['Travaillez-vous aussi hors de Paris ?', 'Oui. Nous accompagnons des entreprises partout en France et à l’international, notamment en Suisse, en Suède, au Danemark et en Tunisie. KPS dispose aussi d’une agence basée à Madagascar, Akoraweb (akoraweb.com).']
    ],
    cta: 'Un projet digital à Paris ?'
  },
  {
    slug: 'madagascar', crumbParent: 'Agence digitale', crumb: 'Madagascar', eyebrow: 'Agence web à Madagascar',
    title: 'Agence web à Madagascar : sites et applications', description: 'Agence web à Madagascar : création de site internet, boutique en ligne avec paiement mobile, applications et référencement, avec notre équipe Akoraweb sur place.',
    h1: 'Votre agence web à Madagascar.',
    sub: 'Création de site internet, boutique en ligne, application web et référencement : KPS accompagne les entreprises de Madagascar et d’Afrique avec Akoraweb, son agence basée sur l’île.',
    svcTitle: 'Nos expertises pour les entreprises de Madagascar.', whyTitle: 'Pourquoi une agence présente à Madagascar ?',
    why: [
      b('Une équipe sur place', 'Akoraweb, l’agence de KPS à Madagascar, connaît les usages locaux et travaille sur le même fuseau horaire que vous.'),
      b('Pensé pour le mobile', 'Des sites légers, rapides à charger sur téléphone et sobres en données mobiles.'),
      b('Le paiement mobile', 'Des boutiques en ligne conçues autour de MVola, Orange Money, Airtel Money et du paiement à la livraison.'),
      b('Une ouverture internationale', 'Un interlocuteur à Paris pour les entreprises qui visent aussi l’Europe ou la diaspora.')
    ],
    refTitle: 'Quelques réalisations de notre équipe', refs: ['karoo', 'stackello', 'acoi-groupe'],
    faq: [
      ['Avez-vous une équipe à Madagascar ?', 'Oui. KPS dispose d’une agence basée à Madagascar, Akoraweb (akoraweb.com), qui conçoit et développe les projets de nos clients de l’île et du continent africain.'],
      ['Pouvez-vous intégrer le paiement mobile à un site ?', 'Oui. Nous concevons des boutiques en ligne qui proposent le paiement mobile et le paiement à la livraison. L’encaissement automatique passe par un compte marchand auprès de l’opérateur ou par un agrégateur de paiement.'],
      ['Faut-il un nom de domaine en .mg ?', 'Le .mg indique clairement une entreprise malgache ; le .com convient si vous visez aussi l’étranger. Dans les deux cas, le nom de domaine est enregistré à votre nom.'],
      ['Comment se déroule un projet à distance ?', 'Les échanges se font en visioconférence, par téléphone ou par messagerie, avec un interlocuteur unique et des étapes validées ensemble.']
    ],
    cta: 'Un projet digital à Madagascar ?'
  },
  {
    slug: 'energie', crumbParent: 'Secteurs', crumb: 'Énergie', eyebrow: 'Secteur de l’énergie',
    title: 'Agence digitale pour le secteur de l’énergie', description: 'Agence digitale pour le secteur de l’énergie : sites corporate multilingues, référencement et campagnes pour les acteurs des énergies renouvelables.',
    h1: 'Le digital au service des acteurs de l’énergie.',
    sub: 'Sites corporate, référencement et campagnes : nous aidons les entreprises de l’énergie et des énergies renouvelables à valoriser leur expertise auprès de leurs clients, partenaires et investisseurs.',
    svcTitle: 'Nos expertises pour le secteur de l’énergie.', whyTitle: 'Un secteur exigeant, des enjeux spécifiques.',
    why: [
      b('Crédibilité', 'Des sites corporate qui inspirent confiance à des publics exigeants : investisseurs, partenaires, institutions.'),
      b('Pédagogie', 'Rendre lisibles des offres et des technologies complexes.'),
      b('Dimension internationale', 'Des sites pensés pour des audiences multi-pays et multilingues.'),
      b('Visibilité', 'Un référencement sur les requêtes stratégiques de votre marché.')
    ],
    refTitle: 'Nos références dans l’énergie', refs: ['powercell-group', 'copenhagen-energy'],
    faq: [
      ['Avez-vous déjà travaillé dans l’énergie ?', 'Oui, notamment pour PowerCell Group et Copenhagen Energy.'],
      ['Pouvez-vous créer un site multilingue ?', 'Oui. Nous avons conçu des sites pour des acteurs de l’énergie présents à l’international, comme PowerCell Group en Suède et Copenhagen Energy au Danemark, pensés pour des audiences multi-pays.'],
      ['Accompagnez-vous aussi la communication financière ?', 'Oui. Nous avons notamment mené une campagne de communication financière pour BR Finanzen, avec un design premium et un branding cohérent.']
    ],
    cta: 'Un projet dans l’énergie ?'
  },
  {
    slug: 'expertise-comptable', crumbParent: 'Secteurs', crumb: 'Expertise comptable & conseil', eyebrow: 'Cabinets comptables et de conseil',
    title: 'Agence web pour experts-comptables et conseil', description: 'Agence web pour cabinets d’expertise comptable, d’audit et de conseil : sites vitrines, landing pages et référencement qui amènent le dirigeant jusqu’au rendez-vous.',
    h1: 'Le digital au service des cabinets comptables et de conseil.',
    sub: 'Site vitrine, landing page, référencement : nous aidons les cabinets d’expertise comptable, d’audit et de conseil à présenter clairement leurs missions et à transformer leurs visiteurs en rendez-vous.',
    svcTitle: 'Nos expertises pour les cabinets comptables et de conseil.', whyTitle: 'Un métier de confiance, un site qui la mérite.',
    why: [
      b('Inspirer confiance', 'Un dirigeant confie ses comptes à un cabinet qu’il juge sérieux dès la première visite : le site en est la première preuve.'),
      b('Rendre l’offre lisible', 'Missions comptables, conseil, audit, social : chaque visiteur doit trouver en quelques secondes ce qui le concerne.'),
      b('Mener au rendez-vous', 'Des parcours pensés pour conduire le visiteur vers la prise de contact ou de rendez-vous, sans détour.'),
      b('Être trouvé localement', 'Un référencement sur les recherches de vos futurs clients, dans les villes où le cabinet est implanté.')
    ],
    refTitle: 'Nos références dans le chiffre et le conseil', refs: ['acoi-groupe', '2r-consolidation', 'expert-pme'],
    faq: [
      ['Avez-vous déjà travaillé pour des cabinets comptables ou de conseil ?', 'Oui. Nous avons réalisé le site du Groupe ACOI, cabinet d’expertise comptable, de conseil et d’audit présent à Versailles et à La Réunion, celui de 2R Consolidation, cabinet spécialisé en consolidation des comptes, et la landing page d’Expert PME, cabinet de conseil aux dirigeants de TPE et PME.'],
      ['Le site peut-il donner accès à un espace client ?', 'Oui. Le site du Groupe ACOI, par exemple, donne accès à un espace réservé aux clients et au service de facturation électronique du cabinet.'],
      ['Faut-il un site complet ou une simple landing page ?', 'Cela dépend de votre objectif. Un site vitrine présente l’ensemble du cabinet ; une landing page sert une offre précise, comme celle d’Expert PME, construite autour de la prise de contact. Nous vous conseillons après un premier échange.']
    ],
    cta: 'Un projet pour votre cabinet ?'
  },
  {
    slug: 'beaute-sante', crumbParent: 'Secteurs', crumb: 'Beauté & santé', eyebrow: 'Marques de beauté et de santé',
    title: 'Agence digitale beauté & santé : social media et ADS', description: 'Agence digitale pour les marques de beauté et de santé : contenus social media, campagnes publicitaires et boutiques en ligne, avec des résultats mesurés.',
    h1: 'Le digital au service des marques de beauté et de santé.',
    sub: 'Contenus social media, campagnes publicitaires, boutique en ligne : nous aidons les marques de beauté et de santé à soigner leur image et à toucher leur public sur les réseaux.',
    svcTitle: 'Nos expertises pour les marques de beauté et de santé.', whyTitle: 'Dans ces secteurs, l’image fait la différence.',
    why: [
      b('Une image soignée', 'Des visuels produits de qualité, fidèles à l’identité de la marque sur chaque publication.'),
      b('Des contenus réguliers', 'Une ligne éditoriale et des formats pensés pour TikTok et Instagram, là où se trouve votre public.'),
      b('Des campagnes mesurées', 'Portée, vues, interactions : chaque campagne est suivie par des tableaux de bord partagés avec vous.'),
      b('Une identité cohérente', 'Le même univers de marque sur le site, les réseaux sociaux et la publicité.')
    ],
    refTitle: 'Nos références en beauté et santé', refs: ['brasileia-cosmetics', 'jardins-de-carthage', 'campagnes-beaute-sante'],
    faq: [
      ['Avez-vous des références en beauté et en santé ?', 'Oui. Nous avons mené une campagne produit pour Brasileia Cosmetics (1,8 million de vues, 996 000 personnes touchées) et une campagne de communication santé pour le Laboratoire Jardins de Carthage, ainsi que des campagnes pour plusieurs marques de beauté et de santé.'],
      ['Gérez-vous à la fois les réseaux sociaux et la publicité ?', 'Oui. Contenus et campagnes sont conçus ensemble : les visuels produits servent les publications comme les annonces, et les résultats sont suivis dans les mêmes tableaux de bord.'],
      ['Créez-vous aussi des boutiques en ligne ?', 'Oui. Nous avons par exemple réalisé la boutique Shopify de la marque Maison SKL.']
    ],
    cta: 'Un projet pour votre marque ?'
  }
]
