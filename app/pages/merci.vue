<template>
  <section class="container thanks">
    <span class="thanks__icon"><IconCheck :size="30" /></span>
    <h1 class="thanks__h1 display">{{ t.h1 }}</h1>
    <p class="lead thanks__lead">{{ t.lead }}</p>

    <ol class="thanks__steps">
      <li v-for="(s, i) in t.steps" :key="s.t" class="card thanks__step">
        <span class="thanks__n">{{ i + 1 }}</span>
        <h2 class="thanks__t">{{ s.t }}</h2>
        <p class="thanks__d">{{ s.d }}</p>
      </li>
    </ol>

    <div class="thanks__ctas">
      <NuxtLink :to="link.booking()" class="btn btn--primary">{{ t.call }} <IconArrow /></NuxtLink>
      <NuxtLink :to="link.work()" class="btn btn--ghost">{{ t.work }}</NuxtLink>
    </div>
    <p v-if="!CONTACT.phone.startsWith('[')" class="thanks__urgent">{{ t.urgent }} <a :href="`tel:${CONTACT.phoneE164}`">{{ CONTACT.phone }}</a></p>
  </section>
</template>

<script setup lang="ts">
// Page de remerciement affichée après l'envoi d'une demande de devis (formulaires de /contact et de l'accueil).
// Son URL sert d'objectif de conversion (Google Ads, Meta) ; l'événement GA4 generate_lead est envoyé par le formulaire lui-même.
import { CONTACT } from '~/data/content'

const { link } = useSite()
const t = useLocaleText({
  fr: {
    title: 'Merci, votre demande est envoyée', desc: 'Votre demande de devis a bien été transmise à KPS Agency. Nous revenons vers vous sous 48 h ouvrées.',
    h1: 'Merci, votre demande est envoyée.', lead: 'Notre équipe étudie votre projet et revient vers vous sous 48 h ouvrées avec une recommandation et un devis personnalisé.',
    steps: [
      { t: 'Nous lisons votre demande', d: 'Votre message est arrivé dans notre boîte : un membre de l’équipe en prend connaissance.' },
      { t: 'Nous vous répondons', d: 'Vous recevez une réponse par e-mail sous 48 h ouvrées, à l’adresse que vous avez indiquée.' },
      { t: 'Vous recevez votre devis', d: 'Si besoin, un court échange nous permet de préciser le périmètre avant de vous remettre un devis détaillé.' }
    ],
    call: 'Réserver un appel dès maintenant', work: 'Découvrir nos réalisations', urgent: 'Une question urgente ? Appelez-nous au'
  },
  en: {
    title: 'Thank you, your request has been sent', desc: 'Your quote request has been sent to KPS Agency. We will come back to you within 48 business hours.',
    h1: 'Thank you, your request has been sent.', lead: 'Our team is reviewing your project and will come back to you within 48 business hours with a recommendation and a tailored quote.',
    steps: [
      { t: 'We read your request', d: 'Your message has reached our inbox: a member of the team is reviewing it.' },
      { t: 'We reply to you', d: 'You receive a reply by email within 48 business hours, at the address you provided.' },
      { t: 'You receive your quote', d: 'If needed, a short conversation lets us clarify the scope before sending you a detailed quote.' }
    ],
    call: 'Book a call now', work: 'Discover our work', urgent: 'An urgent question? Call us on'
  }
})

usePageSeo({ title: () => t.value.title, description: () => t.value.desc, noindex: true })
</script>

<style scoped>
.thanks { display: flex; flex-direction: column; align-items: flex-start; gap: 24px; padding-top: var(--section-y); padding-bottom: var(--section-y); min-height: 60vh; }
.thanks__icon { display: flex; align-items: center; justify-content: center; width: 64px; height: 64px; border-radius: 999px; background: rgba(34, 197, 94, .14); }
.thanks__h1 { max-width: 900px; font-size: 56px; line-height: 1.05; letter-spacing: -1.5px; font-weight: 900; }
.thanks__lead { max-width: 720px; }
.thanks__steps { list-style: none; margin: 16px 0 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; width: 100%; }
.thanks__step { display: flex; flex-direction: column; gap: 12px; padding: 28px; }
.thanks__n { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 999px; background: var(--deep); color: var(--white); font-weight: 600; }
.thanks__t { font-size: 20px; font-weight: 700; letter-spacing: -.3px; }
.thanks__d { font-size: 16px; line-height: 1.55; color: var(--muted); }
.thanks__ctas { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 16px; }
.thanks__urgent { font-size: 16px; color: var(--muted); }
.thanks__urgent a { color: var(--ink); font-weight: 600; }

@media (max-width: 1180px) {
  .thanks__steps { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 720px) {
  .thanks__h1 { font-size: 34px; letter-spacing: -1px; }
  .thanks__ctas .btn { width: 100%; justify-content: center; }
  .thanks__urgent a { display: inline-flex; align-items: center; min-height: 44px; }
}
</style>
