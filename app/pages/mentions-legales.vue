<template>
  <LegalPage
    title="Mentions légales"
    eyebrow="Informations légales"
    lead="Informations réglementaires concernant le site, nos engagements et l’activité de KPS Agency."
    :articles="articles"
  />
</template>

<script setup lang="ts">
import type { LegalArticle } from '~/components/LegalPage.vue'
import { CONTACT } from '~/data/content'

usePageSeo({
  title: 'Mentions légales',
  description: 'Mentions légales du site kps-agency.com : éditeur, hébergement, propriété intellectuelle, données personnelles et cookies.',
  noindex: true
})

const mail: [string, string, string] = ['Contact', CONTACT.email, `mailto:${CONTACT.email}`]

const articles: LegalArticle[] = [
  { t: 'Éditeur du site', blocks: [
    'Le présent site web kps-agency.com est édité par l’agence KPS Agency.',
    { kv: [
      ['Raison sociale', 'KPS Agency'],
      ['Statut juridique', 'SAS au capital de 1 000 €'],
      ['Siège social', '59 rue de Ponthieu, 75008 Paris, France'],
      ['SIRET', '102 909 728 00010'],
      ['RCS', 'Paris'],
      ['Directeur de la publication', 'KPS Agency'],
      mail
    ] }
  ] },
  { t: 'Hébergement', blocks: [
    'L’hébergement du site est assuré par la société Hostinger International Ltd.',
    { kv: [
      ['Hébergeur', 'Hostinger International Ltd.'],
      ['Adresse', '61 Lordou Vironos Street, 6023 Larnaca, Chypre'],
      ['Site web', 'www.hostinger.com', 'https://www.hostinger.com']
    ] }
  ] },
  { t: 'Propriété intellectuelle et contrefaçons', blocks: [
    'L’ensemble du contenu de ce site (textes, images, vidéos, logos, design, code source) est la propriété exclusive de KPS Agency, sauf mention contraire expresse.',
    'Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de KPS Agency.',
    'Toute exploitation non autorisée du site ou de l’un quelconque des éléments qu’il contient sera considérée comme constitutive d’une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de la propriété intellectuelle.'
  ] },
  { t: 'Conditions générales d’utilisation (CGU)', blocks: [
    'L’utilisation du site kps-agency.com implique l’acceptation pleine et entière des conditions générales d’utilisation. Ces conditions d’utilisation sont susceptibles d’être modifiées ou complétées à tout moment.',
    'Ce site est normalement accessible à tout moment aux utilisateurs. Une interruption pour raison de maintenance technique peut toutefois être décidée par KPS Agency, qui s’efforcera alors de communiquer préalablement aux utilisateurs les dates et heures de l’intervention.'
  ] },
  { t: 'Limitations de responsabilité', blocks: [
    'KPS Agency agit en tant qu’éditeur du site et s’efforce de fournir des informations aussi précises que possible. Toutefois, l’agence ne pourra être tenue responsable des oublis, inexactitudes et carences dans la mise à jour, qu’elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations.',
    'KPS Agency décline toute responsabilité quant aux éventuels dysfonctionnements pouvant survenir sur le site et entraîner une perte de données ou une indisponibilité de l’accès aux informations produites sur celui-ci.'
  ] },
  { t: 'Gestion des données personnelles (RGPD)', blocks: [
    'L’Utilisateur est informé des réglementations concernant la communication marketing, la loi du 21 juin 2004 pour la confiance dans l’économie numérique, la loi Informatique et Libertés du 6 août 2004 ainsi que le Règlement général sur la protection des données (RGPD, n° 2016/679).',
    'Pour les données personnelles collectées dans le cadre de la navigation de l’Utilisateur ou via nos formulaires, le responsable du traitement est KPS Agency.',
    'KPS Agency s’engage à respecter le cadre des dispositions légales en vigueur. Aucune information personnelle de l’utilisateur du site n’est publiée à son insu, échangée, transférée, cédée ou vendue sur un support quelconque à des tiers.'
  ] },
  { t: 'Politique de confidentialité et exercice des droits', blocks: [
    'Conformément à la réglementation européenne en vigueur, les utilisateurs de kps-agency.com disposent des droits suivants :',
    ['droit d’accès, de rectification, de mise à jour et de complétude des données ;', 'droit de verrouillage ou d’effacement des données ;', 'droit de retirer à tout moment un consentement ;', 'droit à la limitation du traitement.'],
    'Pour exercer ces droits, vous pouvez contacter KPS Agency par e-mail en joignant une copie d’une pièce d’identité valide :',
    { kv: [mail] }
  ] },
  { t: 'Liens hypertextes et cookies', blocks: [
    'Le site kps-agency.com contient un certain nombre de liens hypertextes vers d’autres sites. Cependant, KPS Agency n’a pas la possibilité de vérifier le contenu des sites ainsi visités et n’assumera en conséquence aucune responsabilité de ce fait.',
    { h: 'Cookies' },
    'La navigation sur le site est susceptible de provoquer l’installation de cookie(s) sur l’ordinateur de l’utilisateur. Un cookie est un fichier de petite taille, qui ne permet pas l’identification de l’utilisateur, mais qui enregistre des informations relatives à la navigation d’un ordinateur sur un site.',
    'Le refus d’installation d’un cookie peut entraîner l’impossibilité d’accéder à certains services. L’utilisateur peut toutefois configurer son ordinateur pour refuser l’installation des cookies.'
  ] },
  { t: 'Droit applicable et attribution de juridiction', blocks: [
    'Tout litige en relation avec l’utilisation du site kps-agency.com est soumis au droit français. En dehors des cas où la loi ne le permet pas, il est fait attribution exclusive de juridiction aux tribunaux compétents.'
  ] },
  { t: 'Contact et réclamations', blocks: [
    'Pour tout signalement de contenu ou d’activités illicites, ou pour toute question concernant les présentes mentions légales, l’Utilisateur peut contacter l’Éditeur par courrier électronique :',
    { kv: [mail] }
  ] }
]
</script>
