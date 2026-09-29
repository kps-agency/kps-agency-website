// Textes de la page d'accueil (FR / EN) — l'anglais a exactement la même forme que le français.
type Cell = [string, string]
type WorkItem = { client: string; sector: string; title: string; metric: string }

const fr = {
  seo: { title: 'Agence digitale à Paris : site web, SEO & Ads', desc: 'Agence digitale à Paris pour PME et TPE : création de site web, application sur mesure, référencement Google & IA et publicité en ligne. Devis sous 48 h.' },
  topbar: ['Devis gratuit sous 48 h', 'Sans engagement', 'Une équipe basée à Paris'],
  hero: {
    badge: 'Agence digitale à Paris pour PME & TPE', title: 'Votre croissance digitale, gérée de A à Z.',
    lead: 'Site web, application sur mesure, référencement Google & IA, publicité en ligne : une seule équipe pour vous rendre visible, attirer des clients et les convertir.',
    cta: 'Demander un devis gratuit', cta2: 'Voir nos réalisations', trust: ['Réponse sous 48 h', 'Interlocuteur dédié', 'Sans engagement'],
    domain: 'votre-entreprise.fr', seoLabel: 'Référencement Google', seoKw: 'sur votre mot-clé', adsLabel: 'Campagne ADS · YASSIR', adsSub: 'de portée payante sur Meta'
  },
  logos: 'Ils nous ont fait confiance en France et à l’international',
  services: {
    eyebrow: 'Nos services', h2: 'Tout ce qu’il faut pour exister et vendre en ligne.', p: 'Choisissez un service ou combinez-les. Chaque projet est piloté par un chef de projet unique, du brief au lancement.',
    items: [
      { num: '01', slug: 'creation-site-web', tag: 'Le plus demandé', title: 'Création de site web', desc: 'Des sites rapides, beaux et pensés pour convertir vos visiteurs en clients.', items: ['Site vitrine', 'E-commerce', 'Landing page', 'Blog'], cta: 'Découvrir', theme: 'dark' },
      { num: '02', slug: 'application-metier', tag: 'Sur mesure', title: 'Application métier', desc: 'Automatisez vos process avec un outil taillé pour votre activité : CRM, back-office, portail client.', items: ['CRM', 'Back-office', 'Portail client', 'SaaS'], cta: 'Découvrir', theme: 'light' },
      { num: '03', slug: 'referencement-seo-geo', tag: 'Google + IA', title: 'Référencement SEO & GEO', desc: 'Soyez trouvé sur Google et cité par ChatGPT, Gemini et Perplexity.', items: ['Audit SEO', 'SEO local', 'Contenu', 'GEO / IA'], cta: 'Découvrir', theme: 'light' },
      { num: '04', slug: 'application-mobile', tag: 'iOS & Android', title: 'Application mobile', desc: 'Des apps natives ou cross-platform, de la maquette à la publication sur les stores.', items: ['iOS', 'Android', 'Flutter', 'React Native'], cta: 'Découvrir', theme: 'light' },
      { num: '05', slug: 'marketing-digital-ads', tag: 'Acquisition', title: 'Marketing digital & ADS', desc: 'Des campagnes rentables sur Google, Meta et TikTok, pilotées par la donnée.', items: ['Google Ads', 'Meta Ads', 'TikTok Ads', 'Social media'], cta: 'Découvrir', theme: 'light' },
      { num: '?', slug: '', tag: 'Gratuit', title: 'Pas sûr de ce qu’il vous faut ?', desc: 'On analyse votre présence en ligne et on vous dit exactement par où commencer.', items: ['Audit offert', '30 min', 'Sans engagement'], cta: 'Demander mon audit', theme: 'soft' }
    ]
  },
  method: {
    eyebrow: 'Comment ça marche', h2: 'Simple, rapide, transparent.', p: 'Pas de jargon, pas de réunion inutile. Un process en 4 étapes, et vous validez tout avant la mise en ligne.',
    steps: [
      { n: '1', time: 'Jour 1', title: 'Le brief', desc: 'Un appel de 30 min pour comprendre votre activité, vos objectifs et votre budget.' },
      { n: '2', time: 'Sous 48 h', title: 'La proposition', desc: 'Un devis clair, un planning et une maquette de principe. Vous validez, on démarre.' },
      { n: '3', time: 'Production', title: 'La création', desc: 'Design, développement ou campagne : vous suivez l’avancement et validez chaque étape.' },
      { n: '4', time: 'Lancement', title: 'La croissance', desc: 'Mise en ligne, suivi des résultats et optimisation continue. On reste à vos côtés.' }
    ]
  },
  work: {
    eyebrow: 'Réalisations', h2a: 'Des projets concrets,', h2b: 'des résultats mesurés.', filterLabel: 'Filtrer les réalisations', alt: 'Réalisation', more: 'Voir le cas', all: 'Voir toutes les réalisations',
    filters: [{ id: 'all', label: 'Tous' }, { id: 'Web', label: 'Sites & apps' }, { id: 'Social', label: 'Social media' }, { id: 'ADS', label: 'Publicité' }],
    items: {
      'powercell-group': { client: 'PowerCell', sector: 'Énergie renouvelable', title: 'Site corporate international', metric: '' },
      'yassir': { client: 'YASSIR', sector: 'Mobilité & livraison', title: 'Campagne ADS multi-plateforme', metric: '5M reach' },
      'zayn': { client: 'ZAYN', sector: 'Retail', title: 'Campagne social media intégrée', metric: '308,8K couverture' },
      'cushman-wakefield-veritas': { client: 'Cushman & W.', sector: 'Immobilier', title: 'Site Cushman & Wakefield Veritas', metric: '' },
      'groupado-pro': { client: 'groupado PRO', sector: 'E-commerce B2B', title: 'Campagne ADS performance', metric: '6,4M impressions' },
      'kpmg': { client: 'KPMG', sector: 'Audit & conseil', title: 'Audit et analyse d’audience', metric: '' },
      'fibbl': { client: 'Fibbl', sector: 'SaaS B2B', title: 'Site produit SaaS', metric: '' },
      'copenhagen-energy': { client: 'Copenhagen Energy', sector: 'Énergie', title: 'Site institutionnel', metric: '' },
      'brasileia-cosmetics': { client: 'Brasileia', sector: 'Beauté', title: 'Campagne produit beauté', metric: '1,8M vues' },
      'tunisia-franchise-show': { client: 'Tunisia Franchise Show', sector: 'Événementiel', title: 'Campagne événementielle', metric: '2,2M reach' },
      'jardins-de-carthage': { client: 'Jardins de Carthage', sector: 'Santé', title: 'Branding & communication santé', metric: '' },
      'dunstan': { client: 'Dunstan', sector: 'Animalier', title: 'Site e-commerce', metric: '' }
    } as Record<string, WorkItem>
  },
  compare: {
    eyebrow: 'Pourquoi KPS', h2: 'Le meilleur des deux mondes : la réactivité d’un freelance, la force d’une agence.',
    caption: 'Comparatif KPS Agency, freelance, agence classique et recrutement interne', cols: ['Freelance', 'Agence classique', 'Recrutement interne'], yes: 'Oui', no: 'Non',
    rows: [
      { label: 'Tous les services digitaux au même endroit', cells: [['y', ''], ['n', ''], ['y', ''], ['n', 'Plusieurs profils']] as Cell[] },
      { label: 'Interlocuteur unique et dédié', cells: [['y', ''], ['y', ''], ['n', 'Commercial + équipe'], ['y', '']] as Cell[] },
      { label: 'Délai de démarrage', cells: [['y', 'Sous 1 semaine'], ['-', 'Variable'], ['n', '3 à 6 semaines'], ['n', '2 à 3 mois']] as Cell[] },
      { label: 'Continuité si absence', cells: [['y', 'Équipe'], ['n', ''], ['y', ''], ['n', '']] as Cell[] },
      { label: 'Coût adapté aux PME', cells: [['y', 'Sur devis'], ['y', ''], ['n', 'Élevé'], ['n', 'Salaire + charges']] as Cell[] },
      { label: 'Vous restez propriétaire de tout', cells: [['y', ''], ['-', 'Selon contrat'], ['-', 'Selon contrat'], ['y', '']] as Cell[] }
    ]
  },
  reviews: { eyebrow: 'Avis clients', h2: 'Ils en parlent mieux que nous.', stars: 'étoiles sur 5', count: 'avis Google', see: 'Voir la fiche' },
  faq: {
    h2: 'Vos questions, nos réponses.', p: 'Une autre question ? Écrivez-nous, on répond sous 24 h ouvrées.', cta: 'Poser une question',
    items: [
      ['Combien coûte un site internet ?', 'Chaque projet est différent : nous établissons un devis gratuit et détaillé sous 48 h, après un appel pour comprendre vos besoins. Aucun frais caché, et le devis reste valable 30 jours.'],
      ['Comment se passe le paiement ?', '50 % à la commande, 50 % à la livraison, par virement ou carte bancaire. Les conditions précises figurent toujours dans votre devis.'],
      ['En combien de temps mon site sera-t-il en ligne ?', 'Cela dépend de la complexité du projet et de la transmission de vos contenus. Un planning indicatif, jalonné d’étapes de validation, figure dans votre devis, et nous vous tenons informé de l’avancement.'],
      ['Combien de modifications sont incluses ?', 'Chaque prestation comprend deux cycles de révision. Au-delà, les modifications font l’objet d’un complément de devis.'],
      ['Qu’est-ce que le GEO ?', 'Le Generative Engine Optimization consiste à optimiser votre contenu pour être cité par les IA comme ChatGPT, Gemini ou Perplexity, en complément du SEO classique.'],
      ['Puis-je modifier mon site moi-même ?', 'Oui. Nous livrons un site facile à administrer et nous vous formons à son utilisation.'],
      ['Suis-je propriétaire de mon site et de mes comptes publicitaires ?', 'Oui. Les créations vous appartiennent dès le paiement intégral, et le nom de domaine, les contenus et les comptes ADS sont à votre nom.'],
      ['Proposez-vous un suivi après la mise en ligne ?', 'Oui. 12 mois de maintenance technique sont inclus pour chaque site, e-commerce, application ou agent IA. Ensuite, un abonnement optionnel couvre les mises à jour de sécurité, le suivi des performances et l’optimisation SEO ou ADS.'],
      ['Travaillez-vous uniquement à Paris ?', 'Nous sommes basés à Paris et accompagnons des entreprises partout en France et à l’international, en visio ou sur place.']
    ] as [string, string][]
  },
  final: {
    h2: 'Parlons de votre projet.', p: '30 minutes pour comprendre vos besoins et vous proposer la bonne solution. Sans jargon, sans pression, sans engagement.',
    list: ['Devis détaillé et gratuit sous 48 h', 'Un chef de projet dédié du début à la fin', 'Vous restez propriétaire de votre site et de vos comptes'], call: 'Ou réserver un appel directement'
  },
  form: {
    name: 'Nom', namePh: 'Jean Dupont', company: 'Entreprise', companyPh: 'Votre société', email: 'E-mail professionnel', emailPh: 'vous@entreprise.fr',
    need: 'Votre besoin', needs: ['Site web', 'Application', 'SEO / GEO', 'App mobile', 'Publicité'], msg: 'Votre projet en quelques mots', msgPh: 'Objectifs, délais, budget indicatif…',
    submit: 'Recevoir mon devis gratuit', sending: 'Envoi…', sent: 'Merci, demande envoyée', note: 'Vos données restent confidentielles. Réponse sous 48 h ouvrées.'
  },
  footer: { desc: 'Agence digitale à Paris : création de sites, applications sur mesure, SEO & GEO, publicité en ligne pour les PME et TPE.', local: 'Agence digitale :', legal: 'Mentions légales', privacy: 'Confidentialité', terms: 'CGV' }
}

const en: typeof fr = {
  seo: { title: 'Digital agency in Paris: websites, SEO & ads', desc: 'Paris digital agency for SMEs and start-ups: website design, custom software, Google & AI search optimisation and paid ads. Free quote within 48 hours.' },
  topbar: ['Free quote within 48 hours', 'No commitment', 'A Paris-based team'],
  hero: {
    badge: 'Digital agency in Paris for SMEs', title: 'Your digital growth, handled end to end.',
    lead: 'Websites, custom software, Google & AI search optimisation, paid ads: one team to make you visible, attract customers and convert them.',
    cta: 'Get a free quote', cta2: 'See our work', trust: ['Reply within 48 hours', 'Dedicated contact', 'No commitment'],
    domain: 'your-company.com', seoLabel: 'Google rankings', seoKw: 'for your keyword', adsLabel: 'Ad campaign · YASSIR', adsSub: 'paid reach on Meta'
  },
  logos: 'Trusted by companies in France and internationally',
  services: {
    eyebrow: 'Our services', h2: 'Everything you need to exist and sell online.', p: 'Choose one service or combine them. Every project is run by a single project manager, from brief to launch.',
    items: [
      { num: '01', slug: 'creation-site-web', tag: 'Most popular', title: 'Website design', desc: 'Fast, beautiful websites designed to turn your visitors into customers.', items: ['Showcase site', 'E-commerce', 'Landing page', 'Blog'], cta: 'Discover', theme: 'dark' },
      { num: '02', slug: 'application-metier', tag: 'Tailor-made', title: 'Business software', desc: 'Automate your processes with a tool built for your business: CRM, back office, client portal.', items: ['CRM', 'Back office', 'Client portal', 'SaaS'], cta: 'Discover', theme: 'light' },
      { num: '03', slug: 'referencement-seo-geo', tag: 'Google + AI', title: 'SEO & GEO', desc: 'Get found on Google and cited by ChatGPT, Gemini and Perplexity.', items: ['SEO audit', 'Local SEO', 'Content', 'GEO / AI'], cta: 'Discover', theme: 'light' },
      { num: '04', slug: 'application-mobile', tag: 'iOS & Android', title: 'Mobile apps', desc: 'Native or cross-platform apps, from mock-up to App Store release.', items: ['iOS', 'Android', 'Flutter', 'React Native'], cta: 'Discover', theme: 'light' },
      { num: '05', slug: 'marketing-digital-ads', tag: 'Acquisition', title: 'Digital marketing & ads', desc: 'Profitable, data-driven campaigns on Google, Meta and TikTok.', items: ['Google Ads', 'Meta Ads', 'TikTok Ads', 'Social media'], cta: 'Discover', theme: 'light' },
      { num: '?', slug: '', tag: 'Free', title: 'Not sure what you need?', desc: 'We review your online presence and tell you exactly where to start.', items: ['Free audit', '30 min', 'No commitment'], cta: 'Request my audit', theme: 'soft' }
    ]
  },
  method: {
    eyebrow: 'How it works', h2: 'Simple, fast, transparent.', p: 'No jargon, no pointless meetings. A 4-step process, and you sign off on everything before go-live.',
    steps: [
      { n: '1', time: 'Day 1', title: 'The brief', desc: 'A 30-minute call to understand your business, goals and budget.' },
      { n: '2', time: 'Within 48 h', title: 'The proposal', desc: 'A clear quote, a schedule and an initial mock-up. You approve, we start.' },
      { n: '3', time: 'Production', title: 'The build', desc: 'Design, development or campaign: you follow progress and approve each step.' },
      { n: '4', time: 'Launch', title: 'Growth', desc: 'Go-live, results tracking and continuous optimisation. We stay by your side.' }
    ]
  },
  work: {
    eyebrow: 'Our work', h2a: 'Real projects,', h2b: 'measurable results.', filterLabel: 'Filter projects', alt: 'Project for', more: 'View project', all: 'See all our work',
    filters: [{ id: 'all', label: 'All' }, { id: 'Web', label: 'Websites & apps' }, { id: 'Social', label: 'Social media' }, { id: 'ADS', label: 'Paid ads' }],
    items: {
      'powercell-group': { client: 'PowerCell', sector: 'Renewable energy', title: 'International corporate website', metric: '' },
      'yassir': { client: 'YASSIR', sector: 'Mobility & delivery', title: 'Multi-platform ad campaign', metric: '5M reach' },
      'zayn': { client: 'ZAYN', sector: 'Retail', title: 'Integrated social media campaign', metric: '308.8K reach' },
      'cushman-wakefield-veritas': { client: 'Cushman & W.', sector: 'Real estate', title: 'Cushman & Wakefield Veritas website', metric: '' },
      'groupado-pro': { client: 'groupado PRO', sector: 'B2B e-commerce', title: 'Performance ad campaign', metric: '6.4M impressions' },
      'kpmg': { client: 'KPMG', sector: 'Audit & consulting', title: 'Audience audit and analysis', metric: '' },
      'fibbl': { client: 'Fibbl', sector: 'B2B SaaS', title: 'SaaS product website', metric: '' },
      'copenhagen-energy': { client: 'Copenhagen Energy', sector: 'Energy', title: 'Corporate website', metric: '' },
      'brasileia-cosmetics': { client: 'Brasileia', sector: 'Beauty', title: 'Beauty product campaign', metric: '1.8M views' },
      'tunisia-franchise-show': { client: 'Tunisia Franchise Show', sector: 'Events', title: 'Event campaign', metric: '2.2M reach' },
      'jardins-de-carthage': { client: 'Jardins de Carthage', sector: 'Healthcare', title: 'Healthcare branding & communication', metric: '' },
      'dunstan': { client: 'Dunstan', sector: 'Pet products', title: 'E-commerce website', metric: '' }
    }
  },
  compare: {
    eyebrow: 'Why KPS', h2: 'The best of both worlds: the agility of a freelancer, the strength of an agency.',
    caption: 'Comparison of KPS Agency, freelancers, traditional agencies and in-house hiring', cols: ['Freelancer', 'Traditional agency', 'In-house hire'], yes: 'Yes', no: 'No',
    rows: [
      { label: 'All digital services in one place', cells: [['y', ''], ['n', ''], ['y', ''], ['n', 'Several profiles']] },
      { label: 'Single, dedicated contact', cells: [['y', ''], ['y', ''], ['n', 'Sales rep + team'], ['y', '']] },
      { label: 'Time to start', cells: [['y', 'Within 1 week'], ['-', 'Varies'], ['n', '3 to 6 weeks'], ['n', '2 to 3 months']] },
      { label: 'Continuity during absences', cells: [['y', 'Team'], ['n', ''], ['y', ''], ['n', '']] },
      { label: 'Pricing suited to SMEs', cells: [['y', 'On quote'], ['y', ''], ['n', 'High'], ['n', 'Salary + overheads']] },
      { label: 'You own everything', cells: [['y', ''], ['-', 'Depends on contract'], ['-', 'Depends on contract'], ['y', '']] }
    ]
  },
  reviews: { eyebrow: 'Client reviews', h2: 'They say it better than we do.', stars: 'stars out of 5', count: 'Google reviews', see: 'See our profile' },
  faq: {
    h2: 'Your questions, answered.', p: 'Another question? Write to us — we reply within one business day.', cta: 'Ask a question',
    items: [
      ['How much does a website cost?', 'Every project is different: after a call to understand your needs, we send a free, detailed quote within 48 hours. No hidden fees, and the quote remains valid for 30 days.'],
      ['How does payment work?', '50% on order and 50% on delivery, by bank transfer or card. The exact terms are always set out in your quote.'],
      ['How long until my website is live?', 'It depends on the project’s complexity and when we receive your content. An indicative schedule with sign-off milestones is included in your quote, and we keep you updated on progress.'],
      ['How many revisions are included?', 'Every service includes two revision cycles. Further changes are covered by an additional quote.'],
      ['What is GEO?', 'Generative Engine Optimization means optimising your content so that AI tools such as ChatGPT, Gemini and Perplexity cite it, alongside traditional SEO.'],
      ['Can I update my website myself?', 'Yes. We deliver a website that is easy to manage and train you to use it.'],
      ['Do I own my website and ad accounts?', 'Yes. You own the deliverables once they are paid in full, and your domain name, content and ad accounts are in your name.'],
      ['Do you offer support after launch?', 'Yes. 12 months of technical maintenance are included for every website, online store, app or AI agent. After that, an optional subscription covers security updates, performance monitoring and SEO or ads optimisation.'],
      ['Do you only work in Paris?', 'We are based in Paris and work with companies across France and internationally, by video call or in person.']
    ]
  },
  final: {
    h2: 'Let’s talk about your project.', p: '30 minutes to understand your needs and suggest the right solution. No jargon, no pressure, no commitment.',
    list: ['Free, detailed quote within 48 hours', 'A dedicated project manager from start to finish', 'You keep ownership of your website and accounts'], call: 'Or book a call directly'
  },
  form: {
    name: 'Name', namePh: 'Jane Smith', company: 'Company', companyPh: 'Your company', email: 'Business email', emailPh: 'you@company.com',
    need: 'What you need', needs: ['Website', 'Software', 'SEO / GEO', 'Mobile app', 'Paid ads'], msg: 'Your project in a few words', msgPh: 'Goals, timeline, indicative budget…',
    submit: 'Get my free quote', sending: 'Sending…', sent: 'Thank you, request sent', note: 'Your data stays confidential. Reply within 48 business hours.'
  },
  footer: { desc: 'Paris digital agency: websites, custom software, SEO & GEO and paid ads for SMEs.', local: 'Digital agency:', legal: 'Legal notice', privacy: 'Privacy', terms: 'Terms' }
}

export const HOME = { fr, en }
