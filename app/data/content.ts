// Contenus du site — issus des maquettes validées sur le canevas KPS Agency.
// Les valeurs entre crochets [ ... ] sont des emplacements à compléter.

export const CONTACT = {
  email: 'contact@kps-agency.com',
  phone: '[Téléphone]',
  address: '59 rue de Ponthieu, 75008'
}

/* ---------------- Identité légale & données structurées ---------------- */
export const COMPANY = {
  name: 'KPS Agency',
  legalName: 'KPS Agency SAS',
  siret: '10290972800010',
  street: '59 rue de Ponthieu',
  postalCode: '75008',
  city: 'Paris',
  // Profils officiels (Google Business Profile, LinkedIn, Instagram…) : à compléter pour relier la marque (schema sameAs)
  sameAs: [] as string[]
}
const hasPhone = !CONTACT.phone.startsWith('[')

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
  contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', email: CONTACT.email, availableLanguage: ['French', 'English'], areaServed: 'FR' },
  ...(hasPhone ? { telephone: CONTACT.phone } : {}),
  identifier: { '@type': 'PropertyValue', propertyID: 'SIRET', value: COMPANY.siret },
  address: { '@type': 'PostalAddress', streetAddress: COMPANY.street, postalCode: COMPANY.postalCode, addressLocality: COMPANY.city, addressRegion: 'Île-de-France', addressCountry: 'FR' },
  areaServed: [{ '@type': 'City', name: 'Paris' }, { '@type': 'AdministrativeArea', name: 'Île-de-France' }, { '@type': 'Country', name: 'France' }],
  priceRange: 'Sur devis',
  knowsAbout: ['Création de site web', 'E-commerce', 'Application métier', 'Application mobile', 'Référencement SEO', 'GEO (Generative Engine Optimization)', 'Google Ads', 'Meta Ads', 'Social media'],
  ...(COMPANY.sameAs.length ? { sameAs: COMPANY.sameAs } : {})
})

/* ---------------- Avis Google (copiés depuis la fiche Google, textes verbatim) ---------------- */
export interface Review { name: string; /** AAAA-MM */ date: string; text: string; rating: number; truncated?: boolean; translated?: boolean }
export const GOOGLE_REVIEWS_URL = 'https://www.google.com/maps/search/?api=1&query=KPS+Agency+59+rue+de+Ponthieu+75008+Paris'
export const REVIEWS: Review[] = [
  { name: 'Amine', date: '2026-09', rating: 5, text: 'Intervention rapide et extrêmement efficace sur mon site WordPress. En quelques jours, mon score de performance a grimpé à 81/100 et tout mon référencement local est enfin en place (fiche Google, pages villes, données structurées). Le prestataire est d’une grande honnêteté intellectuelle, fournit des rapports précis et respecte scrupuleusement les délais.' },
  { name: 'Sofia Jacobs', date: '2026-04', rating: 5, text: 'Super content du rendu du site, process clair, suivi régulier et pas de mauvaises surprises. Le projet a été livré dans les délais et conforme à nos attentes. Je recommande' },
  { name: 'ali Khan', date: '2026-08', rating: 5, text: 'Équipe professionnelle ! Ils m’ont fait mon site pour mon restaurant au top ! Prix super accessible, je vous le conseille' },
  { name: 'nelly varenne', date: '2026-04', rating: 5, text: 'En tant qu’architecte, j’accorde beaucoup d’importance a l’image, la communication et la façon dont une entreprise met en valeur son savoir faire. J’ai eu l’occasion de travailler avec KPS et j’ai particulièrement apprécié leur', truncated: true },
  { name: 'Julien Chantemesse', date: '2026-04', rating: 5, text: 'Super agence. La team KPS agency est sérieuse et à l’écoute. Projet de site web rapide et efficace.' },
  { name: 'Axel Schafers', date: '2026-04', rating: 5, text: 'Professionnel, efficace et créatif. Résultats rapides sur Instagram et Facebook. 100 % recommandé.', truncated: true, translated: true },
  { name: 'NeedyMindSet', date: '2026-05', rating: 5, text: 'Très pro et réactif – Site web parfait, bon accompagnement. Je recommande.' },
  { name: 'Malaine Kougbeadjo', date: '2026-04', rating: 5, text: 'super agence de marketing dynamique et réactive! Je recommande!' }
]
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
}

const R = '[Résultat]'
const D = '[Description du projet]'
// Visuels et liens issus de public/realisations.json (extraits de kps-agency.com)
const IMG = '/images/realisations/'
const p = (slug: string, cat: ProjectCat, client: string, label: string, desc: string, metric: string, bg: string, fg: string, url?: string): Project =>
  ({ slug, cat, client, label, desc, metric, bg, fg, img: `${IMG}${slug}.webp`, alt: `Réalisation ${client} — ${label}`, url })

export const PROJECTS: Project[] = [
  p('powercell-group', 'Web', 'PowerCell Group', 'Énergie Renouvelable', D, R, '#DDE3FF', '#1A2A8A', 'https://powercellgroup.com/'),
  p('yassir', 'ADS', 'YASSIR', 'Campagne ADS Multi-plateforme', 'Stratégie ADS intégrée avec reach massif (3.9M Facebook, 1.4M Instagram, 5M paid reach) et benchmarking compétitif pour optimisation continue.', '5M paid reach', '#0E1726', '#FFFFFF'),
  p('zayn', 'Social', 'ZAYN', 'Campagne Social/Médias', 'Campagne intégrée avec visuels produits premium, stratégie de contenu multi-format et résultats mesurables (308.8K couverture, 6.5K interactions).', '308.8K couverture', '#F2E6D8', '#6B3E12'),
  p('cushman-wakefield-veritas', 'Web', 'Cushman & Wakefield Veritas', 'Immobilier', D, R, '#E4EFE9', '#14532D', 'https://cushwake.ge/'),
  p('groupado-pro', 'ADS', 'groupado PRO', 'Campagne ADS Performance', 'Campagne d’acquisition avec focus sur ad trends, reach payante (1.7M) et impressions massives (6.4M) pour maximiser la visibilité.', '6.4M impressions', '#EDE7F6', '#4C1D95'),
  p('kpmg', 'Social', 'KPMG', 'Audit & Analyse Audience', 'Rapport d’analyse audience détaillé avec insights sur la couverture organique vs payante, performance de contenu et engagement utilisateur.', R, '#E6ECF5', '#0B3A75'),
  p('fibbl', 'Web', 'Fibbl', 'SaaS B2B', D, R, '#FFF1E6', '#9A3412', 'https://fibbl.com/'),
  p('brasileia-cosmetics', 'ADS', 'Brasileia Cosmetics', 'Campagne ADS Beauté', 'Campagne produit beauté avec visuels premium, messaging ciblé et analytics détaillées (1.8M views, 996K coverage).', '1.8M views', '#FCE7F3', '#9D174D'),
  p('br-finanzen', 'Social', 'BR Finanzen', 'Stratégie Financière Digital', 'Campagne de communication financière avec design premium, conseils d’épargne et branding cohérent pour services bancaires.', R, '#E0F2FE', '#075985'),
  p('copenhagen-energy', 'Web', 'Copenhagen Energy', 'Énergie', D, R, '#E0F2FE', '#075985', 'https://copenhagen-energy.com/'),
  p('tunisia-franchise-show', 'ADS', 'Tunisia Franchise Show', 'Campagne ADS Événementielle', 'Campagne événementielle avec reach massif (2.2M), engagement ciblé (2.9K interactions) et traffic multi-plateforme.', '2.2M reach', '#FEF3C7', '#92400E'),
  p('campagnes-beaute-sante', 'Social', 'Campagnes Beauté & Santé', 'Multi-marques Beauté/Santé', 'Gestion de campagnes intégrées pour marques beauté et santé avec dashboards analytics, visuels produits et stratégie de contenu premium.', R, '#FCE7F3', '#9D174D'),
  p('foscolo', 'Web', 'Coaching und Therapie Foscolo', 'Services Professionnels', D, R, '#F5F5F4', '#44403C', 'https://www.foscolo.ch/'),
  p('lore-and-heart', 'ADS', 'LORE & HEART', 'Campagne ADS Social', 'Campagne d’acquisition sur Facebook et Instagram avec analyse détaillée de l’engagement, identification des posts performants et optimisation de la portée.', R, '#F5F5F4', '#44403C'),
  p('jardins-de-carthage', 'Social', 'Laboratoire Jardins de Carthage', 'Branding & Communication Santé', 'Campagne de communication santé avec branding premium, visuels médicaux et stratégie de contenu pour laboratoire pharmaceutique.', R, '#DCFCE7', '#166534'),
  p('dunstan', 'Web', 'Dunstan', 'Animaliers', D, R, '#FEF3C7', '#92400E', 'https://dunstan.se/'),
  p('galeries-live', 'ADS', 'Galeries LIVE', 'Campagne ADS Engagement', 'Stratégie ADS combinant reach organique et payante avec analyse des posts top-performing pour optimiser le ROI.', R, '#E4EFE9', '#14532D'),
  p('radiumhemmets-forskningsfonder', 'Web', 'Radiumhemmets Forskningsfonder', 'Recherche', D, R, '#FCE7F3', '#9D174D', 'https://rahfo.se/'),
  p('founa-com-by-smg', 'ADS', 'Founa.com by SMG', 'Campagne ADS Acquisition', 'Campagne d’acquisition structurée avec dashboard analytics complet, suivi des KPIs et optimisation des performances.', R, '#E0F2FE', '#075985'),
  p('prostarseo', 'ADS', 'ProstarSEO', 'Campagne ADS Digital/SEO', 'Campagne d’acquisition digital avec analyse d’autorité, traffic organique et distribution géographique pour ciblage optimisé.', R, '#EDE7F6', '#4C1D95')
]

export const CAT_LABEL: Record<ProjectCat, string> = { Web: 'Site web', ADS: 'ADS', Social: 'Social/Médias' }
/** Vignette 800 px générée à côté de chaque visuel (cartes, listes) */
export const thumb = (img: string) => img.replace(/\.webp$/, '-800.webp')

/* ---------------- Services ---------------- */
export interface Offer { n: string; t: string; d: string; tags: string[] }
export interface Step { n: string; t: string; d: string }
export interface Benefit { t: string; d: string }
export interface Service {
  slug: string; key: string; num: string; crumb: string; eyebrow: string; h1: string; sub: string
  offersTitle: string; offersSub: string; offers: Offer[]
  benTitle: string; benefits: Benefit[]; methTitle: string; steps: Step[]
  related: string[]; cta: string
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

export const SERVICES: Service[] = [
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
    related: ['powercell-group', 'cushman-wakefield-veritas', 'fibbl'], cta: 'Un site à créer ou à refondre ?'
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
    methTitle: 'Du besoin métier à l’outil déployé.', steps: COMMON_STEPS, related: [], cta: 'Un processus à digitaliser ?'
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
    related: [], cta: 'Envie de gagner en visibilité ?'
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
    methTitle: 'De l’idée à l’App Store.', steps: COMMON_STEPS, related: [], cta: 'Un projet d’application ?'
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
    related: ['zayn', 'kpmg', 'brasileia-cosmetics'], cta: 'Envie de faire rayonner votre marque ?'
  }
]

/** Balises SEO des services : titre ciblé (≤ 60 car. avec la marque) et description 120–160 car. */
export const SERVICE_SEO: Record<string, { title: string; h1: string; desc: string }> = {
  'creation-site-web': { title: 'Création de site web à Paris : vitrine & e-commerce', h1: 'Création de site web à Paris', desc: 'Agence de création de site web à Paris : sites vitrines, e-commerce et landing pages rapides, optimisés pour Google et pensés pour convertir. Devis sous 48 h.' },
  'application-metier': { title: 'Développement d’application métier sur mesure', h1: 'Application métier sur mesure', desc: 'Développement d’applications métier sur mesure à Paris : CRM, back-office, portail client et automatisations adaptés à vos processus. Devis gratuit sous 48 h.' },
  'application-mobile': { title: 'Création d’application mobile iOS & Android', h1: 'Création d’application mobile iOS & Android', desc: 'Conception et développement d’applications mobiles iOS et Android, de la maquette UX à la publication sur les stores. Agence basée à Paris, devis sous 48 h.' },
  'referencement-seo-geo': { title: 'Agence SEO & GEO à Paris : Google et IA', h1: 'Agence SEO & GEO à Paris', desc: 'Référencement naturel SEO et GEO à Paris : audit, SEO technique, contenus et visibilité dans ChatGPT, Gemini et Perplexity pour une demande qualifiée.' },
  'marketing-digital-ads': { title: 'Agence Google Ads, Meta Ads & TikTok Ads', h1: 'Agence marketing digital & publicité en ligne', desc: 'Campagnes Google Ads, Meta Ads et TikTok Ads pilotées par la donnée : stratégie, création, diffusion et optimisation continue. Agence marketing digital à Paris.' },
  'social-media': { title: 'Agence social media : contenus TikTok & Instagram', h1: 'Agence social media & création de contenus', desc: 'Stratégie social media, création visuelle et vidéos courtes pour TikTok et Instagram : des contenus qui renforcent votre image et créent l’engagement.' }
}


export const SERVICE_FAQ: [string, string][] = [
  ['Combien coûte ce service ?', 'Chaque projet est unique : son budget dépend de la complexité, des technologies et des délais demandés. Après un premier échange, nous vous remettons un devis détaillé, valable 30 jours. Le paiement se fait en deux temps : 50 % à la commande, 50 % à la livraison.'],
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
      b('Une équipe complète', 'Six expertises réunies pour mener votre projet de bout en bout.')
    ],
    refTitle: 'Quelques-unes de nos références', refs: ['yassir', 'kpmg', 'cushman-wakefield-veritas'],
    faq: [
      ['Intervenez-vous dans toute l’Île-de-France ?', 'Oui. Nous accompagnons les entreprises de Paris et de toute l’Île-de-France, en rendez-vous ou en visio.'],
      ['Peut-on vous rencontrer dans vos locaux ?', 'Oui, sur rendez-vous : nos bureaux se trouvent au 59 rue de Ponthieu, dans le 8e arrondissement de Paris. Écrivez-nous à contact@kps-agency.com pour convenir d’un créneau.'],
      ['Travaillez-vous aussi hors de Paris ?', 'Oui. Nous accompagnons des entreprises partout en France et à l’international, notamment en Suisse, en Suède, au Danemark et en Tunisie.']
    ],
    cta: 'Un projet digital à Paris ?'
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
  }
]
