<template>
  <div>
    <section class="container audit">
      <div class="audit__intro">
        <Breadcrumb :items="[{ label: t.home, to: link.home() }, { label: t.crumb }]" />
        <h1 class="eyebrow">{{ t.h1seo }}</h1>
        <p class="audit__h1 display">{{ t.h1 }}</p>
        <p class="lead">{{ t.lead }}</p>
        <ul class="audit__trust">
          <li v-for="x in t.trust" :key="x"><IconCheck />{{ x }}</li>
        </ul>
      </div>

      <form class="audit__form card" novalidate @submit.prevent="submit">
        <h2 class="audit__form-h">{{ t.formTitle }}</h2>
        <label class="field">{{ t.website }}<input v-model="form.website" type="text" inputmode="url" autocomplete="url" :placeholder="t.websitePh" required></label>
        <label class="field">{{ t.name }}<input v-model="form.name" type="text" autocomplete="name" required></label>
        <label class="field">{{ t.email }}<input v-model="form.email" type="email" autocomplete="email" required></label>
        <label class="field">{{ t.goal }}<textarea v-model="form.msg" rows="3" :placeholder="t.goalPh" /></label>
        <!-- Champ piège anti-spam : invisible et hors tabulation, jamais rempli par un humain -->
        <input v-model="form.hp" type="text" class="audit__hp" tabindex="-1" autocomplete="off" aria-hidden="true">
        <p v-if="error" class="audit__error" role="alert">{{ error }}</p>
        <button type="submit" class="btn btn--primary audit__submit" :disabled="sending">{{ sending ? t.sending : t.submit }}</button>
        <p class="audit__note">{{ t.note }} <NuxtLink :to="link.privacy()">{{ t.privacy }}</NuxtLink>.</p>
      </form>
    </section>

    <section class="bg-white section--96">
      <div class="container">
        <div class="audit__head">
          <div class="eyebrow">{{ t.checksEyebrow }}</div>
          <h2 class="h2 h2--52">{{ t.checksTitle }}</h2>
        </div>
        <div class="grid grid-3">
          <div v-for="(c, i) in t.checks" :key="c.t" class="check">
            <span class="check__n">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="check__t">{{ c.t }}</h3>
            <p class="check__d">{{ c.d }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="container section">
      <div class="audit__head">
        <div class="eyebrow">{{ t.stepsEyebrow }}</div>
        <h2 class="h2 h2--52">{{ t.stepsTitle }}</h2>
      </div>
      <ol class="grid grid-3 audit__steps">
        <li v-for="(s, i) in t.steps" :key="s.t" class="card astep">
          <span class="astep__n">{{ i + 1 }}</span>
          <h3 class="astep__t">{{ s.t }}</h3>
          <p class="astep__d">{{ s.d }}</p>
        </li>
      </ol>
    </section>
  </div>
</template>

<script setup lang="ts">
// Offre d'entrée : demande d'audit gratuit en trois champs, pour le visiteur qui n'est pas encore prêt à demander un devis.
// La demande passe par /api/contact (source « audit ») : enregistrée dans Supabase et envoyée par e-mail à l'équipe.
import { CONTACT } from '~/data/content'

const { en, locale, link } = useSite()
const t = useLocaleText({
  fr: {
    title: 'Audit gratuit de votre site web et de votre visibilité', desc: 'Demandez un audit gratuit de votre présence en ligne : vitesse, référencement Google, visibilité dans les IA et conversion. Réponse sous 48 h ouvrées, sans engagement.',
    home: 'Accueil', crumb: 'Audit gratuit', h1seo: 'Audit gratuit de site web et de visibilité en ligne', h1: 'Où en est votre présence en ligne ?',
    lead: 'Donnez-nous l’adresse de votre site : nous analysons votre présence en ligne et nous vous disons, concrètement, par où commencer.',
    trust: ['Gratuit', 'Sans engagement', 'Réponse sous 48 h ouvrées'],
    formTitle: 'Demander mon audit', website: 'Adresse de votre site', websitePh: 'www.votre-entreprise.fr', name: 'Prénom et nom', email: 'E-mail professionnel',
    goal: 'Votre objectif principal (facultatif)', goalPh: 'Plus de demandes de devis, être trouvé sur Google, refaire le site…',
    submit: 'Recevoir mon audit gratuit', sending: 'Envoi…', note: 'Vos données servent uniquement à traiter votre demande. Voir notre', privacy: 'politique de confidentialité',
    errFields: 'Merci d’indiquer l’adresse de votre site, votre nom et une adresse e-mail valide.', errSend: 'L’envoi a échoué. Vous pouvez nous écrire directement à',
    checksEyebrow: 'Ce que nous regardons', checksTitle: 'Six points qui décident de vos résultats.',
    checks: [
      { t: 'Vitesse et affichage mobile', d: 'Le temps de chargement de vos pages et leur lisibilité sur téléphone, là où se fait l’essentiel des visites.' },
      { t: 'Référencement sur Google', d: 'Les pages que Google connaît, les recherches sur lesquelles vous apparaissez et les freins techniques.' },
      { t: 'Visibilité dans les IA', d: 'Ce que répondent ChatGPT, Gemini et Perplexity quand on leur pose les questions de vos clients.' },
      { t: 'Parcours vers la prise de contact', d: 'Ce qu’un visiteur comprend en arrivant, et le chemin qu’il doit suivre pour vous écrire ou vous appeler.' },
      { t: 'Présence locale', d: 'Votre fiche Google, vos avis et la cohérence de vos coordonnées d’un site à l’autre.' },
      { t: 'Priorités', d: 'Les deux ou trois actions à mener en premier, classées par effet attendu.' }
    ],
    stepsEyebrow: 'Comment ça se passe', stepsTitle: 'Trois étapes, sans jargon.',
    steps: [
      { t: 'Vous nous donnez l’adresse', d: 'Le formulaire prend une minute. Aucun accès à votre site n’est nécessaire.' },
      { t: 'Nous analysons', d: 'Nous passons votre site en revue sur les six points ci-dessus et revenons vers vous sous 48 h ouvrées.' },
      { t: 'Nous en parlons', d: 'Un échange de 30 minutes pour vous présenter nos constats et répondre à vos questions. Vous décidez de la suite.' }
    ]
  },
  en: {
    title: 'Free audit of your website and online visibility', desc: 'Request a free audit of your online presence: speed, Google rankings, visibility in AI tools and conversion. Reply within 48 business hours, no commitment.',
    home: 'Home', crumb: 'Free audit', h1seo: 'Free website and online visibility audit', h1: 'Where does your online presence stand?',
    lead: 'Give us your website address: we review your online presence and tell you, in practical terms, where to start.',
    trust: ['Free', 'No commitment', 'Reply within 48 business hours'],
    formTitle: 'Request my audit', website: 'Your website address', websitePh: 'www.your-company.com', name: 'Full name', email: 'Business email',
    goal: 'Your main goal (optional)', goalPh: 'More enquiries, being found on Google, redesigning the site…',
    submit: 'Get my free audit', sending: 'Sending…', note: 'Your data is only used to process your request. See our', privacy: 'privacy policy',
    errFields: 'Please enter your website address, your name and a valid email address.', errSend: 'Sending failed. You can email us directly at',
    checksEyebrow: 'What we look at', checksTitle: 'Six points that decide your results.',
    checks: [
      { t: 'Speed and mobile display', d: 'How fast your pages load and how readable they are on a phone, where most visits happen.' },
      { t: 'Google rankings', d: 'The pages Google knows about, the searches you appear for and the technical obstacles.' },
      { t: 'Visibility in AI tools', d: 'What ChatGPT, Gemini and Perplexity answer when asked your customers’ questions.' },
      { t: 'Path to getting in touch', d: 'What a visitor understands on arrival, and the path they have to follow to write to you or call you.' },
      { t: 'Local presence', d: 'Your Google Business Profile, your reviews and how consistent your contact details are from one site to another.' },
      { t: 'Priorities', d: 'The two or three actions to take first, ranked by expected effect.' }
    ],
    stepsEyebrow: 'How it works', stepsTitle: 'Three steps, no jargon.',
    steps: [
      { t: 'You give us the address', d: 'The form takes a minute. We need no access to your website.' },
      { t: 'We analyse', d: 'We review your website on the six points above and come back to you within 48 business hours.' },
      { t: 'We talk it through', d: 'A 30-minute conversation to present our findings and answer your questions. You decide what comes next.' }
    ]
  }
})

usePageSeo({ title: () => t.value.title, description: () => t.value.desc })
const site = useRuntimeConfig().public.siteUrl as string
useJsonLd(() => [
  { '@type': 'WebPage', '@id': `${site}${link.audit()}#webpage`, url: `${site}${link.audit()}`, name: t.value.title, description: t.value.desc, inLanguage: ldLang(en.value), isPartOf: { '@id': `${site}/#website` }, about: { '@id': `${site}/#organization` } }
])

const config = useRuntimeConfig()
const form = reactive({ website: '', name: '', email: '', msg: '', hp: '' })
const error = ref('')
const sending = ref(false)
async function submit() {
  error.value = ''
  if (!form.website.trim() || !form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) { error.value = t.value.errFields; return }
  sending.value = true
  try {
    const endpoint = (config.public.formEndpoint as string) || `${(config.public.bookingApi as string || '').replace(/\/$/, '')}/api/contact`
    await $fetch(endpoint, { method: 'POST', body: { ...form, need: 'Audit gratuit', source: 'audit', locale: locale.value } })
    useTrack().lead('audit', 'audit')
    await navigateTo(link.thanks())
  } catch {
    error.value = `${t.value.errSend} ${CONTACT.email}.`
  } finally {
    sending.value = false
  }
}
</script>

<style scoped>
.audit { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: 24px; align-items: start; padding-top: var(--section-y); padding-bottom: var(--section-y); }
.audit__intro { grid-column: span 6; display: flex; flex-direction: column; gap: 24px; padding-right: 32px; }
.audit__h1 { font-size: 64px; line-height: 1.02; letter-spacing: -2px; font-weight: 900; }
.audit__trust { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 12px 24px; font-size: 16px; color: var(--muted); }
.audit__trust li { display: flex; align-items: center; gap: 8px; }
.audit__form { grid-column: 8 / -1; display: flex; flex-direction: column; gap: 18px; padding: 36px; }
.audit__form-h { font-family: var(--font-display); font-size: 28px; letter-spacing: -.6px; font-weight: 700; }
.field { display: flex; flex-direction: column; gap: 8px; font-size: 14px; font-weight: 600; }
.field input, .field textarea { padding: 14px 16px; border: 1px solid var(--line-2); border-radius: 12px; font: inherit; font-weight: 400; font-size: 16px; }
.field input:focus-visible, .field textarea:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
.field textarea { resize: vertical; line-height: 1.5; }
.audit__hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }
.audit__error { color: var(--red); font-size: 14px; font-weight: 500; }
.audit__submit { justify-content: center; }
.audit__note { font-size: 13px; line-height: 1.5; color: var(--muted); }
.audit__note a { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; }
.audit__head { display: flex; flex-direction: column; gap: 16px; margin-bottom: 48px; }
.check { display: flex; flex-direction: column; gap: 12px; padding: 32px; background: var(--bg); border: 1px solid var(--line); border-radius: 20px; }
.check__n { font-family: var(--font-display); font-size: 28px; font-weight: 900; color: var(--accent); }
.check__t { font-size: 22px; letter-spacing: -.4px; font-weight: 700; }
.check__d { font-size: 16px; line-height: 1.6; color: var(--muted); }
.audit__steps { list-style: none; margin: 0; padding: 0; }
.astep { display: flex; flex-direction: column; gap: 14px; padding: 32px 28px; }
.astep__n { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 999px; background: var(--deep); color: var(--white); font-weight: 600; }
.astep__t { font-size: 22px; letter-spacing: -.4px; font-weight: 700; }
.astep__d { font-size: 16px; line-height: 1.55; color: var(--muted); }

@media (max-width: 1180px) {
  .audit__intro, .audit__form { grid-column: 1 / -1; padding-right: 0; }
  .audit__form { margin-top: 40px; }
  .audit__h1 { font-size: 48px; letter-spacing: -1.4px; }
}
@media (max-width: 720px) {
  .audit { padding-top: 48px; }
  .audit__h1 { font-size: 36px; letter-spacing: -1px; }
  .audit__form { padding: 24px 20px; }
  .check { padding: 24px; }
}
</style>
