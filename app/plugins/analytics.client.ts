// Google Analytics 4 : le script n'est chargé qu'après acceptation du bandeau de cookies, et jamais en local.
// Les changements de page sont suivis automatiquement par GA4 (mesure améliorée, événements d'historique).
declare global {
  interface Window { dataLayer: unknown[]; gtag: (...args: unknown[]) => void; __KPS_GA_FORCE__?: boolean }
}

export default defineNuxtPlugin(() => {
  const id = useRuntimeConfig().public.gaId as string
  if (!id) return
  const { consent, load } = useAnalyticsConsent()
  const local = ['localhost', '127.0.0.1'].includes(location.hostname) && !window.__KPS_GA_FORCE__
  let started = false

  function start() {
    if (started || local) return
    started = true
    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() { window.dataLayer.push(arguments) } // eslint-disable-line prefer-rest-params
    window.gtag('js', new Date())
    window.gtag('config', id)
    const s = document.createElement('script')
    s.async = true
    s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
    document.head.appendChild(s)
  }

  onNuxtReady(() => {
    load()
    watch(consent, (v) => {
      if (v === 'granted') start()
      // Refus après acceptation : la mesure est coupée immédiatement pour la suite de la visite
      else if (started) (window as unknown as Record<string, boolean>)[`ga-disable-${id}`] = true
    }, { immediate: true })
  })
})
