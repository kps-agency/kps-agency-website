<template>
  <Transition name="cc">
    <div v-if="ready && consent === null" class="cc" role="dialog" aria-live="polite" :aria-label="t.title">
      <div class="cc__text">
        <strong class="cc__title">{{ t.title }}</strong>
        <p>{{ t.text }} <NuxtLink :to="link.legal('#article-7')">{{ t.more }}</NuxtLink></p>
      </div>
      <div class="cc__actions">
        <button type="button" class="btn btn--ghost btn--sm" @click="refuse">{{ t.refuse }}</button>
        <button type="button" class="btn btn--primary btn--sm" @click="accept">{{ t.accept }}</button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
// Bandeau de consentement : accepter et refuser ont le même poids visuel d'action (recommandation CNIL)
const { link } = useSite()
const { consent, ready, accept, refuse } = useAnalyticsConsent()
const t = useLocaleText({
  fr: {
    title: 'Mesure d’audience', text: 'Nous utilisons Google Analytics pour améliorer le site. Aucun cookie de mesure sans votre accord.',
    more: 'En savoir plus', accept: 'Accepter', refuse: 'Refuser'
  },
  en: {
    title: 'Audience measurement', text: 'We use Google Analytics to improve the website. No analytics cookie without your consent.',
    more: 'Learn more', accept: 'Accept', refuse: 'Decline'
  }
})
</script>

<style scoped>
.cc { position: fixed; right: 20px; bottom: 20px; z-index: 90; display: flex; flex-direction: column; gap: 12px; width: min(360px, calc(100vw - 40px)); padding: 16px 18px; border-radius: 18px; background: rgba(15, 23, 42, .97); border: 1px solid var(--line-2); color: var(--white); box-shadow: 0 24px 48px -16px rgba(0, 0, 0, .6); backdrop-filter: blur(12px); }
.cc__title { display: block; margin-bottom: 4px; font-size: 16px; font-weight: 700; }
.cc__text p { font-size: 13px; line-height: 1.5; color: var(--dark-muted); }
.cc__text a { color: var(--accent-light); text-decoration: underline; text-underline-offset: 3px; }
.cc__actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.cc__actions .btn { justify-content: center; }
.cc-enter-active, .cc-leave-active { transition: opacity .3s ease, transform .3s ease; }
.cc-enter-from, .cc-leave-to { opacity: 0; transform: translateY(16px); }
@media (max-width: 720px) {
  /* Barre fine : le texte court à gauche, les deux boutons à droite, sans masquer les boutons du hero */
  .cc { left: 8px; right: 8px; bottom: 8px; width: auto; padding: 10px 12px; gap: 8px; border-radius: 16px; }
  .cc__title { display: none; }
  .cc__text p { font-size: 13px; line-height: 1.4; }
  .cc__actions { gap: 8px; }
  .cc__actions .btn { min-height: 44px; padding: 8px 10px; font-size: 14px; }
}
</style>
