import { CAT_LABEL, LOCAL_PAGES, PROJECTS, SERVICES, SERVICE_FAQ, SERVICE_SEO, authorSlug, type LocalPage, type Project, type Service } from '~/data/content'
import { CAT_LABEL_EN, LOCAL_PAGES_EN, LOCAL_SLUG_EN, SERVICES_EN, SERVICE_FAQ_EN, SERVICE_SEO_EN, SERVICE_SLUG_EN, projectEn } from '~/data/content.en'

export type Lang = 'fr' | 'en'

/** Textes d'une page dans les deux langues ; l'anglais doit avoir exactement la forme du français */
export function useLocaleText<T>(dict: { fr: T; en: NoInfer<T> }) {
  const { locale } = useI18n()
  return computed(() => dict[locale.value as Lang])
}

/** Données du site dans la langue courante + liens localisés (slugs traduits en anglais) */
export function useSite() {
  const { locale } = useI18n()
  const lp = useLocalePath()
  const en = computed(() => locale.value === 'en')

  // allServices inclut les pages d'atterrissage SEO (landing) ; services = uniquement les offres listées dans les menus
  const allServices = computed<Service[]>(() => SERVICES.map(s => (en.value ? { ...s, ...SERVICES_EN[s.slug]! } : s)))
  const services = computed<Service[]>(() => allServices.value.filter(s => !s.landing))
  const projects = computed<Project[]>(() => (en.value ? PROJECTS.map(projectEn) : PROJECTS))
  const localPages = computed<LocalPage[]>(() => LOCAL_PAGES.map(l => (en.value ? { ...l, ...LOCAL_PAGES_EN[l.slug]! } : l)))
  const serviceFaq = computed(() => (en.value ? SERVICE_FAQ_EN : SERVICE_FAQ))
  const serviceSeo = computed(() => (en.value ? SERVICE_SEO_EN : SERVICE_SEO))
  const catLabel = computed(() => (en.value ? CAT_LABEL_EN : CAT_LABEL))

  const serviceSlug = (frSlug: string, lang: Lang = locale.value as Lang) => (lang === 'en' ? SERVICE_SLUG_EN[frSlug]! : frSlug)
  const localSlug = (frSlug: string, lang: Lang = locale.value as Lang) => (lang === 'en' ? LOCAL_SLUG_EN[frSlug]! : frSlug)

  const link = {
    home: () => lp('index'),
    services: () => lp('services'),
    service: (frSlug: string, hash = '') => lp({ name: 'services-slug', params: { slug: serviceSlug(frSlug) }, hash }),
    work: () => lp('realisations'),
    project: (slug: string) => lp({ name: 'realisations-slug', params: { slug } }),
    about: () => lp('agence'),
    contact: () => lp('contact'),
    booking: () => lp('rendez-vous'),
    blog: () => lp('blog'),
    /** Page n du blog : la première reste /blog */
    blogPage: (n: number) => (n <= 1 ? lp('blog') : lp({ name: 'blog-page-n', params: { n } })),
    article: (slug: string) => lp({ name: 'blog-slug', params: { slug } }),
    local: (frSlug: string) => lp({ name: 'agence-digitale-slug', params: { slug: localSlug(frSlug) } }),
    terms: () => lp('cgv'),
    legal: (hash = '') => lp({ name: 'mentions-legales', hash }),
    privacy: () => lp('politique-de-confidentialite'),
    /** Offre d'entrée : demande d'audit gratuit */
    audit: () => lp('audit-gratuit'),
    /** Page d'un auteur du blog (nom tel qu'il figure dans AUTHORS) */
    author: (name: string) => lp({ name: 'blog-auteur-slug', params: { slug: authorSlug(name) } }),
    /** Page de remerciement affichée après l'envoi d'une demande de devis */
    thanks: () => lp('merci'),
    method: () => lp({ name: 'index', hash: '#methode' }),
    reviews: () => lp({ name: 'index', hash: '#avis' })
  }

  // Pied de page commun (accueil + autres pages) : chaque libellé mène à une page qui traite du sujet
  const footerCols = computed(() => en.value
    ? [
        { title: 'Websites', links: [['Showcase website', link.service('creation-site-web', '#offre-01')], ['Blog', link.service('creation-site-web', '#offre-02')], ['Landing page', link.service('creation-site-web', '#offre-03')], ['E-commerce', link.service('creation-site-web', '#offre-04')], ['Website redesign', link.service('refonte-site-web')], ['Website maintenance', link.service('maintenance-site-web')]] },
        { title: 'Applications & SaaS', links: [['Business software', link.service('application-metier')], ['SaaS', link.service('creation-saas')], ['Mobile apps', link.service('application-mobile')]] },
        { title: 'Visibility & acquisition', links: [['SEO & GEO', link.service('referencement-seo-geo')], ['GEO agency', link.service('agence-geo')], ['SEO agency Madagascar', link.service('agence-seo-madagascar')], ['Digital marketing & ads', link.service('marketing-digital-ads')], ['Social media & content', link.service('social-media')]] },
        { title: 'Agency', links: [['About us', link.about()], ['Our work', link.work()], ['Client reviews', link.reviews()], ['Blog', link.blog()], ['Free audit', link.audit()], ['Book a call', link.booking()], ['Contact & quote', link.contact()]] }
      ]
    : [
        { title: 'Sites web', links: [['Site vitrine', link.service('creation-site-web', '#offre-01')], ['Blog', link.service('creation-site-web', '#offre-02')], ['Landing page', link.service('creation-site-web', '#offre-03')], ['E-commerce', link.service('creation-site-web', '#offre-04')], ['Refonte de site', link.service('refonte-site-web')], ['Maintenance de site', link.service('maintenance-site-web')]] },
        { title: 'Applications & SaaS', links: [['Application métier', link.service('application-metier')], ['SaaS', link.service('creation-saas')], ['Application mobile', link.service('application-mobile')]] },
        { title: 'Visibilité & acquisition', links: [['SEO & GEO', link.service('referencement-seo-geo')], ['Agence GEO', link.service('agence-geo')], ['Agence SEO Madagascar', link.service('agence-seo-madagascar')], ['Marketing digital & ADS', link.service('marketing-digital-ads')], ['Social media & contenus', link.service('social-media')]] },
        { title: 'L’agence', links: [['À propos', link.about()], ['Réalisations', link.work()], ['Avis clients', link.reviews()], ['Blog', link.blog()], ['Audit gratuit', link.audit()], ['Réserver un appel', link.booking()], ['Contact & devis', link.contact()]] }
      ])
  // Uniquement les pages d'atterrissage qui existent (LOCAL_PAGES) : pas de libellé de secteur menant à une simple fiche projet
  const footerLocal = computed(() => [
    [en.value ? 'Paris' : 'Paris', link.local('paris')],
    ['Madagascar', link.local('madagascar')],
    [en.value ? 'Energy' : 'Énergie', link.local('energie')],
    [en.value ? 'Accounting & advisory' : 'Expertise comptable & conseil', link.local('expertise-comptable')],
    [en.value ? 'Beauty & health' : 'Beauté & santé', link.local('beaute-sante')]
  ] as [string, string][])

  return { en, locale, services, allServices, projects, localPages, serviceFaq, serviceSeo, catLabel, serviceSlug, localSlug, link, footerCols, footerLocal }
}
