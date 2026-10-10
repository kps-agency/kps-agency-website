<template>
  <header class="nav">
    <div class="container nav__inner">
      <SiteLogo />
      <nav class="nav__links" :class="{ 'is-open': open }" :aria-label="t.navLabel">
        <template v-for="item in navItems" :key="item.label">
          <div v-if="item.links" class="nav__item">
            <NuxtLink :to="item.to" class="nav__dd" :class="{ 'is-active': isActive(item) }" aria-haspopup="true">
              {{ item.label }}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
            </NuxtLink>
            <div class="nav__panel" :class="{ 'nav__panel--groups': item.groups }">
              <!-- Menu Services : une colonne par famille d'expertises -->
              <div v-for="g in item.groups" :key="g.title" class="nav__group">
                <span class="nav__group-t">{{ g.title }}</span>
                <NuxtLink v-for="l in g.links" :key="l.label" :to="l.to" class="nav__sub" @click="open = false">
                  <span class="nav__sub-i"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="NAV_ICONS[l.icon]" /></svg></span>
                  <span class="nav__sub-txt">
                    <span class="nav__sub-t">{{ l.label }}</span>
                    <span class="nav__sub-d">{{ l.desc }}</span>
                  </span>
                </NuxtLink>
              </div>
              <NuxtLink v-for="l in item.links" :key="l.label" :to="l.to" class="nav__sub" @click="open = false">
                <span class="nav__sub-i"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="NAV_ICONS[l.icon]" /></svg></span>
                <span class="nav__sub-txt">
                  <span class="nav__sub-t">{{ l.label }}</span>
                  <span class="nav__sub-d">{{ l.desc }}</span>
                </span>
              </NuxtLink>
            </div>
          </div>
          <NuxtLink v-else :to="item.to" class="nav__link" :class="{ 'is-active': isActive(item) }" @click="open = false">{{ item.label }}</NuxtLink>
        </template>
        <div class="nav__lang nav__lang--mobile" role="group" :aria-label="en ? 'Language' : 'Langue'" @click="open = false"><NuxtLink v-if="blogSwitch && en" :to="blogSwitch" hreflang="fr" lang="fr" aria-label="Français">FR</NuxtLink><SwitchLocalePathLink v-else locale="fr" hreflang="fr" lang="fr" aria-label="Français" :class="{ 'is-on': !en }" :aria-current="!en ? 'true' : undefined">FR</SwitchLocalePathLink><span aria-hidden="true">|</span><NuxtLink v-if="blogSwitch && !en" :to="blogSwitch" hreflang="en" lang="en" aria-label="English">EN</NuxtLink><SwitchLocalePathLink v-else locale="en" hreflang="en" lang="en" aria-label="English" :class="{ 'is-on': en }" :aria-current="en ? 'true' : undefined">EN</SwitchLocalePathLink></div>
        <div class="nav__mobile-ctas">
          <NuxtLink :to="link.booking()" class="btn btn--ghost btn--sm" @click="open = false">{{ t.call }}</NuxtLink>
          <NuxtLink :to="link.contact()" class="btn btn--primary btn--sm" @click="open = false">{{ t.quote }}</NuxtLink>
        </div>
      </nav>
      <a v-if="!CONTACT.phone.startsWith('[')" :href="`tel:${CONTACT.phoneE164}`" class="nav__tel" :aria-label="`${t.phone} ${CONTACT.phone}`">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="ICON_PHONE" /></svg>
        <span>{{ CONTACT.phone }}</span>
      </a>
      <div class="nav__ctas">
        <NuxtLink :to="link.booking()" class="nav__call">{{ t.call }}</NuxtLink>
        <NuxtLink :to="link.contact()" class="nav__quote">{{ t.quote }}</NuxtLink>
        <div class="nav__lang" role="group" :aria-label="en ? 'Language' : 'Langue'"><NuxtLink v-if="blogSwitch && en" :to="blogSwitch" hreflang="fr" lang="fr" aria-label="Français">FR</NuxtLink><SwitchLocalePathLink v-else locale="fr" hreflang="fr" lang="fr" aria-label="Français" :class="{ 'is-on': !en }" :aria-current="!en ? 'true' : undefined">FR</SwitchLocalePathLink><span aria-hidden="true">|</span><NuxtLink v-if="blogSwitch && !en" :to="blogSwitch" hreflang="en" lang="en" aria-label="English">EN</NuxtLink><SwitchLocalePathLink v-else locale="en" hreflang="en" lang="en" aria-label="English" :class="{ 'is-on': en }" :aria-current="en ? 'true' : undefined">EN</SwitchLocalePathLink></div>
      </div>
      <button type="button" class="nav__burger" :aria-expanded="open" :aria-label="t.menu" @click="open = !open">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path v-if="!open" d="M4 7h16M4 12h16M4 17h16" /><path v-else d="M6 6l12 12M18 6L6 18" /></svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ICON_PATHS, SERVICE_ICON } from '~/data/serviceIcons'
import { CONTACT, SERVICE_FAMILIES } from '~/data/content'
import { blogArticle } from '~/data/blog'

const route = useRoute()
const open = ref(false)
watch(() => route.fullPath, () => { open.value = false })

const ICON_PHONE = 'M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z'
const NAV_ICONS = {
  ...ICON_PATHS,
  grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  energy: 'M13 2 4 14h7l-1 8 9-12h-7l1-8z',
  heart: 'M12 20s-7-4.4-9-8.6C1.6 8.3 3.5 5 6.7 5c2 0 3.3 1 4.3 2.4h2C14 6 15.3 5 17.3 5c3.2 0 5.1 3.3 3.7 6.4C19 15.6 12 20 12 20z',
  finance: 'M4 20V10M10 20V4M16 20v-7M22 20H2'
}

interface NavLink { label: string; desc: string; icon: keyof typeof NAV_ICONS; to: string }
interface NavItem { label: string; to: string; match?: string[]; links?: NavLink[]; groups?: { title: string; links: NavLink[] }[] }

const { en, link, services } = useSite()
const getRouteBaseName = useRouteBaseName()

const t = useLocaleText({
  fr: { navLabel: 'Navigation principale', quote: 'Demander un devis', call: 'Réserver un appel', menu: 'Ouvrir le menu', phone: 'Appeler le' },
  en: { navLabel: 'Main navigation', quote: 'Get a quote', call: 'Book a call', menu: 'Open menu', phone: 'Call' }
})

const SVC_DESC = {
  fr: { web: 'Vitrine, e-commerce, landing page', app: 'CRM, back-office, portail client', mobile: 'iOS & Android, de la maquette aux stores', seo: 'Google et moteurs IA', ads: 'Meta, Google & TikTok Ads', social: 'Stratégie, visuels, vidéo courte', refonte: 'Nouveau design, sans perte de SEO', maintenance: 'Mises à jour, sécurité, évolutions', saas: 'MVP, plateforme, abonnements' },
  en: { web: 'Showcase sites, e-commerce, landing pages', app: 'CRM, back office, client portals', mobile: 'iOS & Android, from mock-up to stores', seo: 'Google and AI search engines', ads: 'Meta, Google & TikTok Ads', social: 'Strategy, visuals, short-form video', refonte: 'New design, rankings preserved', maintenance: 'Updates, security, improvements', saas: 'MVP, platform, subscriptions' }
} as Record<'fr' | 'en', Record<string, string>>

const navItems = computed<NavItem[]>(() => {
  const lang = en.value ? 'en' : 'fr'
  // Menu Services : les trois familles d'expertises (SERVICE_FAMILIES), dans le même ordre que sur le reste du site
  const svcGroups = SERVICE_FAMILIES.map(f => ({
    title: f.title[lang],
    links: f.slugs.map((slug): NavLink => {
      const sv = services.value.find(x => x.slug === slug)!
      return { label: sv.crumb, desc: SVC_DESC[lang][sv.key]!, icon: SERVICE_ICON[sv.key] as NavLink['icon'], to: link.service(slug) }
    })
  }))
  return [
    { label: 'Services', to: link.services(), match: ['services', 'services-slug'], groups: svcGroups, links: [{ label: en.value ? 'All our services' : 'Toutes nos expertises', desc: en.value ? 'Overview of what we do' : 'Vue d’ensemble des services', icon: 'grid', to: link.services() }] },
    {
      label: en.value ? 'Our work' : 'Nos réalisations', to: link.work(), match: ['realisations', 'realisations-slug'],
      links: [
        { label: en.value ? 'Websites' : 'Sites web', desc: 'PowerCell, Cushman & Wakefield, Fibbl', icon: 'web', to: `${link.work()}?cat=Web` },
        { label: en.value ? 'Social media' : 'Social / Médias', desc: 'ZAYN, KPMG, BR Finanzen', icon: 'social', to: `${link.work()}?cat=Social` },
        { label: en.value ? 'Paid ads' : 'Publicité (ADS)', desc: 'YASSIR, groupado PRO, Brasileia', icon: 'ads', to: `${link.work()}?cat=ADS` },
        { label: en.value ? 'All our work' : 'Toutes nos réalisations', desc: en.value ? 'Every project, all categories' : 'Tous les projets, toutes catégories', icon: 'grid', to: link.work() }
      ]
    },
    {
      // Chaque entrée mène à une page secteur existante (LOCAL_PAGES)
      label: en.value ? 'Industries' : 'Secteurs', to: link.local('energie'), match: ['agence-digitale-slug'],
      links: [
        { label: en.value ? 'Energy' : 'Énergie', desc: 'PowerCell Group, Copenhagen Energy', icon: 'energy', to: link.local('energie') },
        { label: en.value ? 'Accounting & advisory' : 'Expertise comptable & conseil', desc: 'ACOI Groupe, 2R Consolidation, Expert PME', icon: 'finance', to: link.local('expertise-comptable') },
        { label: en.value ? 'Beauty & health' : 'Beauté & santé', desc: 'Brasileia Cosmetics, Jardins de Carthage', icon: 'heart', to: link.local('beaute-sante') }
      ]
    },
    { label: 'Blog', to: link.blog(), match: ['blog', 'blog-slug'] },
    { label: en.value ? 'About' : 'L’agence', to: link.about(), match: ['agence'] }
  ]
})

const isActive = (item: NavItem) => !!item.match?.includes(getRouteBaseName(route) ?? '')

// Article de blog : l'autre langue pointe vers sa traduction si elle existe, sinon vers la liste des articles
const localePath = useLocalePath()
const blogSwitch = computed(() => {
  if (getRouteBaseName(route) !== 'blog-slug') return ''
  const from = en.value ? 'en' : 'fr'
  const to = en.value ? 'fr' : 'en'
  const translation = blogArticle(from, String(route.params.slug))?.meta.translation
  return translation && blogArticle(to, translation) ? localePath({ name: 'blog-slug', params: { slug: translation } }, to) : localePath('blog', to)
})
</script>

<style scoped>
.nav { border-bottom: 1px solid var(--line); background: var(--bg); position: sticky; top: 0; z-index: 50; }
.nav__inner { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding-block: 20px; }
/* Les liens se partagent l'espace restant ; les boutons d'action ne rétrécissent jamais */
.nav__links { display: flex; align-items: center; justify-content: center; flex: 1 1 auto; min-width: 0; gap: 36px; font-size: 15px; font-weight: 500; }
.nav__link, .nav__dd { color: var(--ink); white-space: nowrap; }
.nav__link.is-active, .nav__dd.is-active { color: var(--accent); }
.nav__dd { display: inline-flex; align-items: center; gap: 6px; }
.nav__dd svg { transition: transform .2s; }
.nav__item { position: relative; }
.nav__item::after { content: ''; position: absolute; left: 0; right: 0; top: 100%; height: 18px; }
.nav__panel { position: absolute; top: calc(100% + 18px); left: -20px; z-index: 60; min-width: 320px; padding: 10px; display: grid; gap: 2px; background: var(--surface); border: 1px solid var(--line); border-radius: 16px; box-shadow: 0 24px 48px -24px rgba(0, 0, 0,.3); opacity: 0; visibility: hidden; transform: translateY(6px); transition: opacity .18s, transform .18s, visibility .18s; }
/* Menu Services : une colonne par famille, le lien « Toutes nos expertises » occupe toute la largeur en bas */
.nav__panel--groups { grid-template-columns: repeat(3, minmax(0, 1fr)); width: 900px; column-gap: 10px; }
.nav__group { display: grid; align-content: start; gap: 2px; }
.nav__group-t { padding: 8px 14px 6px; font-size: 12px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: var(--muted-2); }
.nav__panel--groups > .nav__sub { grid-column: 1 / -1; margin-top: 6px; padding-top: 14px; border-top: 1px solid var(--line); border-radius: 0 0 10px 10px; }
.nav__item:hover .nav__panel, .nav__item:focus-within .nav__panel { opacity: 1; visibility: visible; transform: none; }
.nav__item:hover .nav__dd svg, .nav__item:focus-within .nav__dd svg { transform: rotate(180deg); }
.nav__sub { display: flex; align-items: center; gap: 14px; padding: 10px 14px; border-radius: 10px; }
.nav__sub:hover, .nav__sub:focus-visible { background: var(--surface-hover); }
.nav__sub-i { flex: none; width: 38px; height: 38px; display: inline-flex; align-items: center; justify-content: center; border-radius: 10px; background: var(--accent-soft); color: var(--accent); transition: background .15s, color .15s; }
.nav__sub:hover .nav__sub-i, .nav__sub:focus-visible .nav__sub-i { background: var(--accent); color: var(--on-accent); }
.nav__sub-txt { display: flex; flex-direction: column; gap: 2px; }
.nav__sub-t { font-size: 15px; font-weight: 600; color: var(--ink); }
.nav__sub-d { font-size: 13px; font-weight: 400; color: var(--muted); }
.nav__ctas { display: flex; flex: none; gap: 12px; align-items: center; }
/* Téléphone cliquable : icône seule (zone tactile de 44 px), sur tablette et mobile, là où l'on appelle d'un geste.
   Sur ordinateur, la barre est occupée par les menus : le numéro figure dans les pieds de page et sur la page Contact. */
.nav__tel { display: none; flex: none; align-items: center; justify-content: center; width: 44px; height: 44px; border: 1px solid rgba(255, 255, 255, .1); border-radius: 12px; background: rgba(255, 255, 255, .05); color: var(--accent-light); transition: background .15s; }
.nav__tel:hover { color: var(--accent-light); background: rgba(255, 255, 255, .1); }
.nav__tel span { display: none; }
/* SwitchLocalePathLink rend un fragment : le style passe par le conteneur + :deep(a) */
/* Bascule de langue FR | EN, comme sur kps-agency.com : la langue active est en cyan lumineux */
.nav__lang { display: inline-flex; align-items: center; gap: 4px; padding-left: 16px; margin-left: 4px; border-left: 1px solid var(--line-2); }
.nav__lang > span { font-size: 12px; color: var(--line-3); user-select: none; }
.nav__lang :deep(a) { display: inline-flex; align-items: center; justify-content: center; min-width: 32px; height: 44px; padding: 0 4px; font-size: 14px; font-weight: 700; color: var(--muted-2); transition: color .3s, filter .3s; }
.nav__lang :deep(a:hover) { color: var(--ink-hover); }
.nav__lang :deep(a.is-on) { color: var(--accent-light); filter: drop-shadow(0 0 8px rgba(6, 182, 212, .6)); }
.nav__lang--mobile { display: none; }
.nav__call, .nav__quote { display: inline-flex; align-items: center; white-space: nowrap; border-radius: 12px; font-size: 15px; transition: background .15s, border-color .15s, color .15s; }
.nav__call { padding: 12px 18px; font-weight: 600; border: 1px solid rgba(255, 255, 255, .1); background: rgba(255, 255, 255, .05); }
.nav__call:hover { color: var(--white); background: rgba(255, 255, 255, .1); }
.nav__quote { padding: 12px 20px; font-weight: 700; background: var(--grad-neon); color: var(--white); box-shadow: 0 0 16px rgba(6, 182, 212, .4); }
.nav__quote:hover { color: var(--white); background: var(--grad-neon-hover); }
.nav__burger, .nav__mobile-ctas { display: none; }
.nav__burger { flex: none; background: none; border: none; width: 44px; height: 44px; align-items: center; justify-content: center; color: var(--ink); }

/* Écrans moyens : on resserre les liens avant de toucher aux boutons */
@media (max-width: 1400px) {
  .nav__links { gap: 26px; }
}
@media (max-width: 1300px) {
  .nav__inner { gap: 16px; }
  .nav__links { gap: 20px; font-size: 14.5px; }
  .nav__ctas { gap: 8px; }
  .nav__call, .nav__quote { font-size: 14px; padding: 10px 15px; }
  .nav :deep(.logo__img) { height: 50px; }
}
/* Petits écrans d'ordinateur : menus et boutons resserrés pour que les cinq menus et les deux boutons tiennent sur la ligne */
@media (min-width: 1181px) and (max-width: 1260px) {
  .nav__links { gap: 14px; }
  .nav__call, .nav__quote { padding: 10px 12px; }
}
/* Tablette : les liens passent dans le menu, les deux boutons restent dans la barre */
@media (max-width: 1180px) {
  .nav__burger { display: inline-flex; }
  .nav__tel { display: inline-flex; margin-left: auto; }
  .nav__ctas .nav__lang { display: none; }
  .nav__links { display: none; position: absolute; top: 100%; left: 0; right: 0; flex-direction: column; align-items: stretch; justify-content: flex-start; gap: 0; padding: 12px var(--gutter) 24px; background: var(--bg); border-bottom: 1px solid var(--line); max-height: calc(100vh - 90px); overflow-y: auto; font-size: 15px; }
  .nav__links.is-open { display: flex; }
  .nav__link, .nav__dd { padding: 14px 0; border-bottom: 1px solid var(--line); font-size: 17px; }
  .nav__dd { display: flex; }
  .nav__item::after { display: none; }
  .nav__panel--groups { grid-template-columns: minmax(0, 1fr); width: auto; }
  .nav__panel--groups > .nav__sub { margin-top: 0; padding-top: 8px; border-top: none; }
  .nav__group-t { padding: 10px 0 2px; }
  .nav__panel { position: static; min-width: 0; padding: 4px 0 8px 12px; background: none; border: none; box-shadow: none; opacity: 1; visibility: visible; transform: none; }
  .nav__sub { padding: 8px 0; gap: 12px; }
  .nav__sub-i { width: 30px; height: 30px; border-radius: 8px; }
  .nav__sub-d { display: none; }
  .nav__lang--mobile { display: flex; padding: 8px 0; margin: 0; border-left: none; border-bottom: 1px solid var(--line); }
  .nav__lang--mobile :deep(a) { font-size: 16px; min-width: 40px; }
}
/* Mobile : un seul bouton dans la barre, les deux dans le menu */
@media (max-width: 680px) {
  /* En-tête compact : il reste collé en haut de l'écran pendant le défilement */
  .nav__inner { padding-block: 10px; }
  .nav__ctas .nav__call { display: none; }
  .nav__mobile-ctas { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-top: 18px; }
  .nav__mobile-ctas .btn { justify-content: center; }
  .nav :deep(.logo__img) { height: 42px; }
}
@media (max-width: 420px) {
  .nav__ctas { display: none; }
  .nav__mobile-ctas { grid-template-columns: minmax(0, 1fr); }
}
</style>
