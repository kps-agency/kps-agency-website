<template>
  <!-- Promotion en cours (table promos de Supabase, lue au build) : fenêtre affichée quelques secondes après l'arrivée, qui recueille l'e-mail du visiteur -->
  <Transition name="pp">
    <div v-if="open && promo" class="pp" @click.self="close('veil')" @keydown.esc="close('esc')">
      <div ref="box" class="pp__box" role="dialog" aria-modal="true" aria-labelledby="pp-title" :aria-describedby="details ? 'pp-details' : undefined" tabindex="-1">
        <button type="button" class="pp__close" :aria-label="t.close" @click="close('button')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>

        <div class="pp__halo" aria-hidden="true" />
        <span class="pp__badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.4 6.9L21 11l-6.6 2.1L12 20l-2.4-6.9L3 11l6.6-2.1z" /></svg>
          {{ t.badge }}
        </span>

        <!-- Inscription -->
        <template v-if="!done">
          <h2 id="pp-title" class="pp__title">{{ title }}</h2>
          <p v-if="details" id="pp-details" class="pp__details">{{ details }}</p>
          <p v-if="deadline" class="pp__deadline">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
            {{ deadline }}
          </p>

          <form class="pp__form" novalidate @submit.prevent="submit">
            <label class="sr-only" for="pp-email">{{ t.email }}</label>
            <input id="pp-email" ref="field" v-model.trim="email" type="email" inputmode="email" autocomplete="email" required :placeholder="t.placeholder" :aria-invalid="!!error" :aria-describedby="error ? 'pp-error' : 'pp-legal'">
            <!-- Champ piège anti-spam : invisible, jamais rempli par un humain -->
            <input v-model="hp" type="text" name="company_website" class="pp__hp" tabindex="-1" autocomplete="off" aria-hidden="true">
            <button type="submit" class="btn btn--primary pp__submit" :disabled="sending">{{ sending ? t.sending : cta || t.submit }}</button>
          </form>
          <p v-if="error" id="pp-error" class="pp__error" role="alert">{{ error }}</p>
          <p id="pp-legal" class="pp__legal">{{ t.legal }} <NuxtLink :to="link.privacy()" @click="close('link')">{{ t.privacy }}</NuxtLink>.</p>
          <button type="button" class="pp__skip" @click="close('skip')">{{ t.skip }}</button>
        </template>

        <!-- Confirmation -->
        <div v-else class="pp__done" role="status">
          <span class="pp__check" aria-hidden="true">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
          </span>
          <h2 id="pp-title" class="pp__title">{{ t.doneTitle }}</h2>
          <p class="pp__details">{{ t.doneText }}</p>
          <component :is="external ? 'a' : NuxtLink" v-if="promo.ctaUrl" v-bind="external ? { href: promo.ctaUrl, target: '_blank', rel: 'noopener' } : { to: promo.ctaUrl }" class="btn btn--primary pp__submit" @click="close('cta')">{{ t.go }} →</component>
          <button v-else type="button" class="btn btn--ghost pp__submit" @click="close('button')">{{ t.back }}</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import cms from '#cms'
import { currentPromo } from '#shared/cms'
import { NuxtLink } from '#components'

/** Délai avant l'affichage : le visiteur a le temps de voir la page sur laquelle il arrive */
const DELAY_MS = 6000
/** Fenêtre fermée sans inscription : elle n'est pas reproposée avant ce nombre de jours */
const SNOOZE_DAYS = 7
const DAY_MS = 86_400_000
// Pages où le visiteur est déjà en train de nous écrire ou de lire ses droits : la fenêtre ne l'interrompt pas
const QUIET_ROUTES = ['contact', 'rendez-vous', 'audit-gratuit', 'merci', 'politique-de-confidentialite', 'mentions-legales', 'cgv', 'admin']

const { en, link } = useSite()
const { track } = useTrack()
const route = useRoute()
const config = useRuntimeConfig()

const t = useLocaleText({
  fr: {
    badge: 'Offre du moment', close: 'Fermer', email: 'Votre adresse e-mail', placeholder: 'vous@entreprise.fr', submit: 'Recevoir l’offre', sending: 'Envoi…', skip: 'Non merci',
    legal: 'Votre adresse sert uniquement à vous envoyer cette offre et à vous recontacter à son sujet. Désinscription sur simple demande.', privacy: 'Politique de confidentialité',
    until: 'Jusqu’au', invalid: 'Saisissez une adresse e-mail valide.', failed: 'L’envoi n’a pas abouti. Réessayez dans un instant.', tooMany: 'Trop de tentatives : réessayez dans quelques minutes.',
    doneTitle: 'C’est noté, merci !', doneText: 'Nous vous écrivons très vite à cette adresse avec tous les détails de l’offre.', go: 'En profiter maintenant', back: 'Revenir au site'
  },
  en: {
    badge: 'Current offer', close: 'Close', email: 'Your email address', placeholder: 'you@company.com', submit: 'Get the offer', sending: 'Sending…', skip: 'No thanks',
    legal: 'Your address is only used to send you this offer and follow up about it. Unsubscribe on request.', privacy: 'Privacy policy',
    until: 'Until', invalid: 'Please enter a valid email address.', failed: 'Something went wrong. Please try again in a moment.', tooMany: 'Too many attempts: please try again in a few minutes.',
    doneTitle: 'Got it, thank you!', doneText: 'We will email you shortly at this address with the full details of the offer.', go: 'Claim it now', back: 'Back to the site'
  }
})

// Le site est figé au build : la période de la promotion est évaluée dans le navigateur, au moment de l'affichage.
// Jour du visiteur (et non le jour UTC, en retard d'une à deux heures sur Paris) : une promotion qui commence le 8 est visible le 8 dès minuit.
const promo = computed(() => currentPromo(cms?.promos, localDay(new Date())))
const title = computed(() => (en.value && promo.value?.textEn) || promo.value?.text)
const details = computed(() => (en.value && promo.value?.detailsEn) || promo.value?.details)
const cta = computed(() => (en.value && promo.value?.ctaLabelEn) || promo.value?.ctaLabel)
const external = computed(() => /^https?:\/\//.test(promo.value?.ctaUrl ?? ''))
const deadline = computed(() => promo.value?.endsOn
  ? `${t.value.until} ${new Date(`${promo.value.endsOn}T00:00:00`).toLocaleDateString(en.value ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'long' })}`
  : '')

const open = ref(false)
const done = ref(false)
const email = ref('')
const hp = ref('')
const sending = ref(false)
const error = ref('')
const box = ref<HTMLElement>()
const field = ref<HTMLInputElement>()
let timer: ReturnType<typeof setTimeout> | undefined
let opener: Element | null = null

// Mémoire du navigateur, propre à chaque promotion : « inscrit » (plus jamais proposée) ou date de la dernière fermeture
const key = computed(() => `kps-promo-${promo.value?.id ?? ''}`)
const remembered = () => {
  try {
    const v = localStorage.getItem(key.value)
    return v === 'done' || (!!v && Date.now() - Number(v) < SNOOZE_DAYS * DAY_MS)
  } catch { return false } // navigation privée stricte : la fenêtre s'affiche, rien n'est mémorisé
}
const remember = (value: string) => { try { localStorage.setItem(key.value, value) } catch { /* stockage indisponible */ } }
const quiet = () => QUIET_ROUTES.some(name => String(route.name ?? '').startsWith(name))

function show() {
  if (!promo.value || open.value || remembered() || quiet()) return
  opener = document.activeElement
  open.value = true
  track('promo_view', { promo: promo.value.text })
  nextTick(() => (field.value ?? box.value)?.focus({ preventScroll: true }))
}

function close(how: string) {
  open.value = false
  // Après une inscription, la promotion n'est plus proposée ; après une simple fermeture, elle attend quelques jours
  remember(done.value ? 'done' : String(Date.now()))
  if (!done.value) track('promo_dismiss', { how })
  if (opener instanceof HTMLElement) opener.focus({ preventScroll: true })
}

/** Le focus reste dans la fenêtre tant qu'elle est ouverte (navigation au clavier) */
function trap(e: KeyboardEvent) {
  if (e.key !== 'Tab' || !open.value || !box.value) return
  const items = [...box.value.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([tabindex="-1"])')]
  const first = items[0], last = items.at(-1)
  if (!first || !last) return
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
}

async function submit() {
  error.value = ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { error.value = t.value.invalid; field.value?.focus(); return }
  sending.value = true
  try {
    await $fetch(`${String(config.public.bookingApi || '').replace(/\/$/, '')}/api/promo`, {
      method: 'POST', body: { email: email.value, promoId: promo.value?.id, locale: en.value ? 'en' : 'fr', page: route.path, hp: hp.value }
    })
    done.value = true
    remember('done')
    track('promo_signup', { promo: promo.value?.text })
    nextTick(() => box.value?.focus({ preventScroll: true }))
  } catch (err) {
    error.value = (err as { statusCode?: number })?.statusCode === 429 ? t.value.tooMany : t.value.failed
  } finally {
    sending.value = false
  }
}

const schedule = () => { clearTimeout(timer); timer = setTimeout(show, DELAY_MS) }
onMounted(() => {
  schedule()
  document.addEventListener('keydown', trap)
})
onBeforeUnmount(() => {
  clearTimeout(timer)
  document.removeEventListener('keydown', trap)
})
// Arrivé sur une page « calme », le visiteur revoit le délai repartir quand il change de page
watch(() => route.path, schedule)
// La page ne défile pas derrière la fenêtre
watch(open, (isOpen) => { document.documentElement.style.overflow = isOpen ? 'hidden' : '' })
</script>

<style scoped>
.pp { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; padding: 20px; background: rgba(2, 6, 23, .78); backdrop-filter: blur(6px); overflow-y: auto; }
/* Liseré en dégradé de la marque : un fond dégradé sous un fond plein, décalés d'un pixel par la bordure transparente */
.pp__box { position: relative; width: min(520px, 100%); padding: 44px 40px 32px; border: 1px solid transparent; border-radius: 28px; background: linear-gradient(var(--surface), var(--surface)) padding-box, linear-gradient(135deg, #06B6D4, #6366F1 55%, #A855F7) border-box; box-shadow: 0 40px 80px -30px rgba(0, 0, 0, .8), 0 0 60px -10px rgba(99, 102, 241, .45); text-align: center; overflow: hidden; }
.pp__box:focus { outline: none; }
.pp__halo { position: absolute; top: -140px; left: 50%; width: 420px; height: 280px; transform: translateX(-50%); background: radial-gradient(closest-side, rgba(6, 182, 212, .28), transparent); pointer-events: none; }
.pp__close { position: absolute; top: 14px; right: 14px; z-index: 1; display: grid; place-items: center; width: 40px; height: 40px; border: 0; border-radius: 50%; background: rgba(255, 255, 255, .06); color: var(--muted); }
.pp__close:hover { background: rgba(255, 255, 255, .12); color: var(--white); }
.pp__badge { position: relative; display: inline-flex; align-items: center; gap: 8px; padding: 7px 14px; border-radius: var(--r-pill); background: var(--grad-brand); color: var(--white); font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
.pp__title { position: relative; margin-top: 20px; font-size: 32px; line-height: 1.15; letter-spacing: -0.8px; font-weight: 900; text-wrap: balance; }
.pp__details { position: relative; margin-top: 12px; font-size: 17px; line-height: 1.55; color: var(--muted); text-wrap: pretty; }
.pp__deadline { display: inline-flex; align-items: center; gap: 8px; margin-top: 16px; padding: 6px 12px; border-radius: var(--r-pill); background: var(--accent-soft); color: var(--accent-light); font-size: 14px; font-weight: 700; }

.pp__form { display: flex; flex-direction: column; gap: 12px; margin-top: 24px; }
.pp__form input[type="email"] { width: 100%; padding: 16px 18px; border: 1px solid var(--line-2); border-radius: 14px; font: inherit; font-size: 17px; text-align: center; }
.pp__form input[type="email"]:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-color: transparent; }
.pp__form input[aria-invalid="true"] { border-color: var(--red); }
.pp__hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }
.pp__submit { width: 100%; justify-content: center; }
.pp__submit:disabled { opacity: .6; cursor: progress; transform: none; }
.pp__error { margin-top: 10px; color: var(--red); font-size: 14px; font-weight: 600; }
.pp__legal { margin-top: 14px; font-size: 12px; line-height: 1.5; color: var(--muted-2); }
.pp__legal a { color: var(--muted); text-decoration: underline; text-underline-offset: 2px; }
.pp__skip { margin-top: 10px; padding: 8px 12px; border: 0; background: none; color: var(--muted-2); font-size: 14px; font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }
.pp__skip:hover { color: var(--white); }

.pp__done { display: flex; flex-direction: column; align-items: center; }
.pp__check { display: grid; place-items: center; width: 56px; height: 56px; margin-top: 20px; border-radius: 50%; background: rgba(34, 197, 94, .15); color: var(--green); }
.pp__done .pp__submit { margin-top: 24px; }

.pp-enter-active, .pp-leave-active { transition: opacity .3s ease; }
.pp-enter-active .pp__box, .pp-leave-active .pp__box { transition: transform .35s cubic-bezier(.2, .9, .3, 1.2), opacity .3s ease; }
.pp-enter-from, .pp-leave-to { opacity: 0; }
.pp-enter-from .pp__box, .pp-leave-to .pp__box { transform: translateY(24px) scale(.96); opacity: 0; }

@media (max-width: 720px) {
  /* Sur mobile : panneau posé en bas de l'écran, à portée de pouce */
  .pp { place-items: end center; padding: 0; }
  .pp__box { width: 100%; padding: 40px 20px 20px; border-radius: 24px 24px 0 0; border-bottom: 0; }
  .pp__title { font-size: 26px; }
  .pp__details { font-size: 16px; }
  .pp-enter-from .pp__box, .pp-leave-to .pp__box { transform: translateY(100%); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .pp-enter-active, .pp-leave-active, .pp-enter-active .pp__box, .pp-leave-active .pp__box { transition: none; }
}
</style>
