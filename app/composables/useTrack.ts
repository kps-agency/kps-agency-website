// Événements de conversion Google Analytics 4. window.gtag n'existe qu'après acceptation du bandeau de cookies
// (app/plugins/analytics.client.ts) : sans consentement, rien n'est envoyé.
export type LeadForm = 'contact' | 'accueil' | 'audit'

export function useTrack() {
  const track = (name: string, params: Record<string, unknown> = {}) => {
    if (import.meta.client && typeof window.gtag === 'function') window.gtag('event', name, params)
  }
  return {
    track,
    /** Demande de devis envoyée (événement recommandé GA4 : à marquer comme événement clé dans GA4) */
    lead: (form: LeadForm, services: string) => track('generate_lead', { form, services }),
    /** Appel découverte réservé */
    booking: (mode: string) => track('book_call', { mode })
  }
}
