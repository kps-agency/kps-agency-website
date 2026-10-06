<template>
  <LegalPage
    :title="t.title"
    :eyebrow="t.eyebrow"
    :lead="t.lead"
    :articles="t.articles"
    :footnote="t.footnote"
  />
</template>

<script setup lang="ts">
import type { LegalArticle } from '~/components/LegalPage.vue'
import { CONTACT } from '~/data/content'
import { PRIVACY_EN } from '~/data/legal.en'

const mail: [string, string, string] = ['Contact', CONTACT.email, `mailto:${CONTACT.email}`]

// Les prestataires listés à l'article 4 doivent suivre la configuration réelle du site (hébergement, base de données, e-mail, agenda, mesure d'audience)
const articlesFr: LegalArticle[] = [
  { t: 'Responsable du traitement', blocks: [
    'Les données personnelles collectées sur le site kps-agency.com sont traitées par KPS Agency, en qualité de responsable du traitement.',
    { kv: [['Société', 'KPS Agency SAS'], ['Siège social', '59 rue de Ponthieu, 75008 Paris, France'], ['SIRET', '102 909 728 00010'], mail] }
  ] },
  { t: 'Données collectées', blocks: [
    'Nous ne collectons que les données que vous choisissez de nous transmettre :',
    [
      'Formulaire de contact et de devis : nom, entreprise, adresse e-mail, téléphone, site web actuel, prestations souhaitées, budget indicatif, échéance et votre message.',
      'Réservation d’un appel : nom, adresse e-mail, téléphone, entreprise, créneau choisi, type d’échange (visio ou téléphone), fuseau horaire et votre message.',
      'Échanges directs : les informations que vous nous communiquez par e-mail, par téléphone ou sur WhatsApp.',
      'Mesure d’audience, uniquement si vous l’acceptez : pages consultées, provenance de la visite, type d’appareil et localisation approximative.'
    ],
    'Seuls votre nom et votre adresse e-mail sont obligatoires pour traiter une demande. Nous ne collectons aucune donnée sensible.'
  ] },
  { t: 'Finalités et bases légales', blocks: [
    [
      'Répondre à votre demande, établir un devis et organiser un appel : mesures précontractuelles prises à votre demande (article 6.1.b du RGPD).',
      'Assurer le suivi de notre relation commerciale avec vous : intérêt légitime de KPS Agency à gérer ses relations avec ses clients et prospects (article 6.1.f du RGPD).',
      'Mesurer la fréquentation du site : votre consentement, recueilli par le bandeau de cookies (article 6.1.a du RGPD).'
    ],
    'Vos données ne sont ni vendues, ni louées, et ne font l’objet d’aucune décision automatisée.'
  ] },
  { t: 'Destinataires des données', blocks: [
    'Vos données sont destinées à l’équipe de KPS Agency. Elles sont hébergées ou acheminées par les prestataires techniques suivants, qui agissent pour notre compte :',
    { kv: [
      ['Hébergement du site', 'Vercel Inc.', 'https://vercel.com'],
      ['Base de données (demandes et rendez-vous)', 'Supabase Inc.', 'https://supabase.com'],
      ['Messagerie', 'Hostinger International Ltd.', 'https://www.hostinger.com'],
      ['Agenda et visioconférence', 'Infomaniak Network SA (kSuite, kMeet)', 'https://www.infomaniak.com'],
      ['Mesure d’audience', 'Google Ireland Ltd. (Google Analytics 4)', 'https://policies.google.com/privacy']
    ] },
    'Certains de ces prestataires sont établis hors de l’Union européenne ou peuvent y traiter des données. Dans ce cas, les transferts sont encadrés par les garanties prévues par le RGPD (décision d’adéquation ou clauses contractuelles types de la Commission européenne).'
  ] },
  { t: 'Durées de conservation', blocks: [
    [
      'Demandes de contact, devis et rendez-vous : trois ans à compter de notre dernier échange avec vous, si vous ne devenez pas client.',
      'Données des clients : pendant la durée de la relation contractuelle, puis pendant les durées légales de conservation (obligations comptables et fiscales).',
      'Mesure d’audience : les cookies de mesure sont conservés 13 mois au maximum.'
    ]
  ] },
  { t: 'Cookies', blocks: [
    'Le site fonctionne sans cookie. Les cookies de mesure d’audience de Google Analytics ne sont déposés qu’après votre accord, recueilli par le bandeau affiché lors de votre première visite. En cas de refus, rien n’est chargé.',
    'Votre choix est mémorisé dans votre navigateur et peut être modifié à tout moment grâce au lien « Gérer les cookies » présent en bas de chaque page.'
  ] },
  { t: 'Vos droits', blocks: [
    'Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits suivants sur vos données :',
    ['droit d’accès, de rectification et d’effacement ;', 'droit à la limitation du traitement et droit d’opposition ;', 'droit à la portabilité de vos données ;', 'droit de retirer votre consentement à tout moment ;', 'droit de définir des directives sur le sort de vos données après votre décès.'],
    'Pour les exercer, écrivez-nous. Nous vous répondons dans un délai d’un mois :',
    { kv: [mail] },
    'Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL :',
    { kv: [['CNIL', 'www.cnil.fr', 'https://www.cnil.fr']] }
  ] },
  { t: 'Sécurité', blocks: [
    'Les échanges avec le site sont chiffrés (HTTPS). L’accès aux demandes reçues est réservé aux membres habilités de l’équipe KPS Agency.'
  ] }
]

const t = useLocaleText({
  fr: {
    title: 'Politique de confidentialité', eyebrow: 'Données personnelles', lead: 'Quelles données nous collectons sur kps-agency.com, pourquoi, pendant combien de temps, et comment exercer vos droits.', articles: articlesFr,
    footnote: 'Dernière mise à jour : 6 octobre 2026.',
    seoTitle: 'Politique de confidentialité', seoDesc: 'Politique de confidentialité de KPS Agency : données collectées par nos formulaires, finalités, durées de conservation, destinataires, cookies et exercice de vos droits RGPD.'
  },
  en: PRIVACY_EN
})
usePageSeo({ title: () => t.value.seoTitle, description: () => t.value.seoDesc, noindex: true })
</script>
