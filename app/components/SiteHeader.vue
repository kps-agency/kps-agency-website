<template>
  <header class="nav">
    <div class="container nav__inner">
      <SiteLogo />
      <nav class="nav__links" :class="{ 'is-open': open }" aria-label="Navigation principale">
        <template v-for="item in navItems" :key="item.label">
          <div v-if="item.links" class="nav__item">
            <NuxtLink :to="item.to" class="nav__dd" :class="{ 'is-active': isActive(item) }" aria-haspopup="true">
              {{ item.label }}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
            </NuxtLink>
            <div class="nav__panel">
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
        <NuxtLink to="/contact" class="btn btn--dark btn--sm nav__mobile-cta" @click="open = false">Demander un devis</NuxtLink>
      </nav>
      <div class="nav__ctas">
        <NuxtLink to="/contact" class="nav__call">Réserver un appel</NuxtLink>
        <NuxtLink to="/contact" class="nav__quote">Demander un devis</NuxtLink>
      </div>
      <button type="button" class="nav__burger" :aria-expanded="open" aria-label="Ouvrir le menu" @click="open = !open">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path v-if="!open" d="M4 7h16M4 12h16M4 17h16" /><path v-else d="M6 6l12 12M18 6L6 18" /></svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const open = ref(false)
watch(() => route.fullPath, () => { open.value = false })

const NAV_ICONS = {
  web: 'M3 5h18v14H3zM3 9h18M7 7h.01M10 7h.01',
  app: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 16.5h7M16.5 13v7',
  mobile: 'M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM11 18h2',
  seo: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4M8 13l2-2 2 1.5 2.5-3',
  ads: 'M3 11v2a1 1 0 0 0 1 1h3l6 5V5L7 10H4a1 1 0 0 0-1 1zM17 8a5 5 0 0 1 0 8',
  social: 'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12zM9 11h.01M12 11h.01M15 11h.01',
  grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  energy: 'M13 2 4 14h7l-1 8 9-12h-7l1-8z',
  building: 'M4 21V5l8-3v19M12 21V8l8 3v10M3 21h18M8 8h.01M8 12h.01M8 16h.01M16 14h.01M16 17h.01',
  cloud: 'M7 18a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 9.5a4.3 4.3 0 0 1-.5 8.5z',
  heart: 'M12 20s-7-4.4-9-8.6C1.6 8.3 3.5 5 6.7 5c2 0 3.3 1 4.3 2.4h2C14 6 15.3 5 17.3 5c3.2 0 5.1 3.3 3.7 6.4C19 15.6 12 20 12 20z',
  finance: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  event: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M9 15l2 2 4-4'
}

interface NavLink { label: string; desc: string; icon: keyof typeof NAV_ICONS; to: string }
interface NavItem { label: string; to: string; match?: string; links?: NavLink[] }

const navItems: NavItem[] = [
  {
    label: 'Services', to: '/services', match: '/services',
    links: [
      { label: 'Création de site web', desc: 'Vitrine, e-commerce, landing page', icon: 'web', to: '/services/creation-site-web' },
      { label: 'Application métier', desc: 'CRM, back-office, portail client', icon: 'app', to: '/services/application-metier' },
      { label: 'Application mobile', desc: 'iOS & Android, de la maquette aux stores', icon: 'mobile', to: '/services/application-mobile' },
      { label: 'Référencement SEO & GEO', desc: 'Google et moteurs IA', icon: 'seo', to: '/services/referencement-seo-geo' },
      { label: 'Marketing digital & ADS', desc: 'Meta, Google & TikTok Ads', icon: 'ads', to: '/services/marketing-digital-ads' },
      { label: 'Social media & contenus', desc: 'Stratégie, visuels, vidéo courte', icon: 'social', to: '/services/social-media' },
      { label: 'Toutes nos expertises', desc: 'Vue d’ensemble des services', icon: 'grid', to: '/services' }
    ]
  },
  { label: 'Réalisations', to: '/realisations', match: '/realisations' },
  { label: 'Méthode', to: '/#methode' },
  {
    label: 'Secteurs', to: '/agence-digitale/energie', match: '/agence-digitale',
    links: [
      { label: 'Énergie', desc: 'PowerCell Group, Copenhagen Energy', icon: 'energy', to: '/agence-digitale/energie' },
      { label: 'Immobilier', desc: 'Cushman & Wakefield Veritas', icon: 'building', to: '/realisations/cushman-wakefield-veritas' },
      { label: 'SaaS B2B', desc: 'Fibbl', icon: 'cloud', to: '/realisations/fibbl' },
      { label: 'Beauté & Santé', desc: 'Brasileia, Jardins de Carthage', icon: 'heart', to: '/realisations/campagnes-beaute-sante' },
      { label: 'Finance & Conseil', desc: 'KPMG, BR Finanzen', icon: 'finance', to: '/realisations/kpmg' },
      { label: 'Événementiel', desc: 'Tunisia Franchise Show, Galeries LIVE', icon: 'event', to: '/realisations/tunisia-franchise-show' }
    ]
  },
  { label: 'L’agence', to: '/agence', match: '/agence' }
]

const isActive = (item: NavItem) => {
  if (!item.match) return false
  return item.match === '/agence' ? route.path === '/agence' : route.path.startsWith(item.match)
}
</script>

<style scoped>
.nav { border-bottom: 1px solid var(--line); background: var(--bg); position: sticky; top: 0; z-index: 50; }
.nav__inner { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding-block: 20px; }
.nav__links { display: flex; align-items: center; gap: 36px; font-size: 15px; font-weight: 500; }
.nav__link, .nav__dd { color: var(--ink); }
.nav__link.is-active, .nav__dd.is-active { color: var(--accent); }
.nav__dd { display: inline-flex; align-items: center; gap: 6px; }
.nav__dd svg { transition: transform .2s; }
.nav__item { position: relative; }
.nav__item::after { content: ''; position: absolute; left: 0; right: 0; top: 100%; height: 18px; }
.nav__panel { position: absolute; top: calc(100% + 18px); left: -20px; z-index: 60; min-width: 320px; padding: 10px; display: grid; gap: 2px; background: var(--white); border: 1px solid var(--line); border-radius: 16px; box-shadow: 0 24px 48px -24px rgba(14,23,38,.3); opacity: 0; visibility: hidden; transform: translateY(6px); transition: opacity .18s, transform .18s, visibility .18s; }
.nav__item:hover .nav__panel, .nav__item:focus-within .nav__panel { opacity: 1; visibility: visible; transform: none; }
.nav__item:hover .nav__dd svg, .nav__item:focus-within .nav__dd svg { transform: rotate(180deg); }
.nav__sub { display: flex; align-items: center; gap: 14px; padding: 10px 14px; border-radius: 10px; }
.nav__sub:hover, .nav__sub:focus-visible { background: #F2F1EC; }
.nav__sub-i { flex: none; width: 38px; height: 38px; display: inline-flex; align-items: center; justify-content: center; border-radius: 10px; background: #EEF1FF; color: var(--accent); transition: background .15s, color .15s; }
.nav__sub:hover .nav__sub-i, .nav__sub:focus-visible .nav__sub-i { background: var(--accent); color: var(--white); }
.nav__sub-txt { display: flex; flex-direction: column; gap: 2px; }
.nav__sub-t { font-size: 15px; font-weight: 600; color: var(--ink); }
.nav__sub-d { font-size: 13px; font-weight: 400; color: var(--muted); }
.nav__ctas { display: flex; gap: 12px; align-items: center; }
.nav__call { padding: 12px 18px; font-size: 15px; font-weight: 500; border: 1px solid var(--line-3); border-radius: 999px; }
.nav__quote { padding: 12px 20px; font-size: 15px; font-weight: 600; background: var(--ink); color: var(--white); border-radius: 999px; }
.nav__quote:hover { color: var(--white); background: #1E2A40; }
.nav__burger, .nav__mobile-cta { display: none; }
.nav__burger { background: none; border: none; width: 44px; height: 44px; align-items: center; justify-content: center; color: var(--ink); }

@media (max-width: 1180px) {
  .nav__links { gap: 22px; }
}
@media (max-width: 1024px) {
  .nav__ctas { display: none; }
  .nav__burger { display: inline-flex; }
  .nav__links { display: none; position: absolute; top: 100%; left: 0; right: 0; flex-direction: column; align-items: stretch; gap: 0; padding: 12px var(--gutter) 24px; background: var(--bg); border-bottom: 1px solid var(--line); max-height: calc(100vh - 90px); overflow-y: auto; }
  .nav__links.is-open { display: flex; }
  .nav__link, .nav__dd { padding: 14px 0; border-bottom: 1px solid var(--line); font-size: 17px; }
  .nav__dd { display: flex; }
  .nav__item::after { display: none; }
  .nav__panel { position: static; min-width: 0; padding: 4px 0 8px 12px; background: none; border: none; box-shadow: none; opacity: 1; visibility: visible; transform: none; }
  .nav__sub { padding: 8px 0; gap: 12px; }
  .nav__sub-i { width: 30px; height: 30px; border-radius: 8px; }
  .nav__sub-d { display: none; }
  .nav__mobile-cta { display: inline-flex; justify-content: center; margin-top: 18px; border: none; color: var(--white); }
}
</style>
