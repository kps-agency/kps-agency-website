// Consentement à la mesure d'audience (Google Analytics) : rien n'est chargé tant que le visiteur n'a pas accepté (RGPD / CNIL).
// Le choix est mémorisé dans le navigateur ; « Gérer les cookies » (pied de page) permet de le modifier.
type Consent = 'granted' | 'denied' | null
const KEY = 'kps-consent-analytics'

export function useAnalyticsConsent() {
  const consent = useState<Consent>('analytics-consent', () => null)
  // true une fois le choix relu dans le navigateur : évite d'afficher le bandeau avant de savoir
  const ready = useState('analytics-consent-ready', () => false)

  function load() {
    if (ready.value) return
    try {
      const v = localStorage.getItem(KEY)
      consent.value = v === 'granted' || v === 'denied' ? v : null
    } catch { /* stockage indisponible : le bandeau sera simplement reproposé */ }
    ready.value = true
  }
  function set(v: Exclude<Consent, null>) {
    consent.value = v
    try { localStorage.setItem(KEY, v) } catch { /* ignoré */ }
  }
  /** Rouvre le bandeau pour changer d'avis */
  function reset() {
    consent.value = null
    try { localStorage.removeItem(KEY) } catch { /* ignoré */ }
  }
  return { consent, ready, load, accept: () => set('granted'), refuse: () => set('denied'), reset }
}
