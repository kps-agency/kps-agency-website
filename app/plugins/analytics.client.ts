// Google Analytics 4 : le script n'est chargé qu'après acceptation du bandeau de cookies, et en local seulement si NUXT_PUBLIC_GA_LOCAL=true.
// Les changements de page sont suivis automatiquement par GA4 (mesure améliorée, événements d'historique).
declare global {
  interface Window { dataLayer: unknown[]; gtag: (...args: unknown[]) => void; __KPS_GA_FORCE__?: boolean }
}

export default defineNuxtPlugin(() => {
  const { gaId, gaLocal } = useRuntimeConfig().public
  const id = gaId as string
  if (!id) return
  const { consent, load } = useAnalyticsConsent()
  const local = ['localhost', '127.0.0.1'].includes(location.hostname)
  // En local, la mesure reste coupée sauf si NUXT_PUBLIC_GA_LOCAL=true (ou window.__KPS_GA_FORCE__)
  const blocked = local && !(gaLocal === true || gaLocal === 'true') && !window.__KPS_GA_FORCE__
  let started = false

  function start() {
    if (started || blocked) return
    started = true
    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() { window.dataLayer.push(arguments) } // eslint-disable-line prefer-rest-params
    window.gtag('js', new Date())
    // debug_mode en local : les visites de test vont dans DebugView et restent hors des rapports GA4
    window.gtag('config', id, local ? { debug_mode: true } : {})
    const s = document.createElement('script')
    s.async = true
    s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
    document.head.appendChild(s)
  }

  // Clics sur un téléphone, un e-mail ou WhatsApp, où qu'ils soient dans le site : événement contact_click (rien n'est envoyé sans consentement)
  document.addEventListener('click', (e) => {
    if (!started) return
    const href = (e.target as Element | null)?.closest?.('a[href]')?.getAttribute('href') ?? ''
    const method = href.startsWith('tel:') ? 'phone' : href.startsWith('mailto:') ? 'email' : href.startsWith('https://wa.me/') ? 'whatsapp' : ''
    if (method) window.gtag('event', 'contact_click', { method, page: location.pathname })
  }, { capture: true })

  onNuxtReady(() => {
    load()
    watch(consent, (v) => {
      if (v === 'granted') start()
      // Refus après acceptation : la mesure est coupée immédiatement pour la suite de la visite
      else if (started) (window as unknown as Record<string, boolean>)[`ga-disable-${id}`] = true
    }, { immediate: true })
  })
})
