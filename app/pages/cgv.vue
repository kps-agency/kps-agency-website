<template>
  <LegalPage title="Conditions Générales de Vente" eyebrow="Conditions générales" lead="Parce que des engagements clairs font les meilleurs partenariats.">
    <div class="keys">
      <div v-for="k in keys" :key="k.t" class="keys__item">
        <span class="keys__i"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="k.icon" /></svg></span>
        <h2 class="keys__t">{{ k.t }}</h2>
        <p class="keys__d">{{ k.d }}</p>
      </div>
    </div>

    <div class="terms">
      <nav class="toc" aria-label="Sommaire des conditions générales">
        <div class="toc__title">Sommaire</div>
        <ol class="toc__list">
          <li v-for="(a, i) in articles" :key="a.t"><a :href="`#article-${i + 1}`"><span>{{ num(i) }}</span>{{ a.t }}</a></li>
        </ol>
      </nav>

      <div class="articles">
        <h2 class="articles__h">Conditions détaillées</h2>
        <article v-for="(a, i) in articles" :id="`article-${i + 1}`" :key="a.t" class="art">
          <div class="art__n">{{ num(i) }}.</div>
          <div class="art__body">
            <h3 class="art__t">{{ a.t }}</h3>
            <template v-for="(b, j) in a.blocks" :key="j">
              <ul v-if="Array.isArray(b)" class="art__list"><li v-for="li in b" :key="li">{{ li }}</li></ul>
              <h4 v-else-if="typeof b === 'object'" class="art__sub">{{ b.h }}</h4>
              <p v-else class="art__p">{{ b }}</p>
            </template>
          </div>
        </article>
        <p class="terms__date">Les présentes conditions générales sont applicables à compter du 1<sup>er</sup> janvier 2026. KPS Agency se réserve le droit de les modifier à tout moment. Les modifications s’appliquent uniquement aux commandes et devis émis après la date de mise à jour.</p>
      </div>
    </div>
  </LegalPage>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Conditions Générales de Vente',
  description: 'Conditions générales de vente de KPS Agency : devis, paiement, délais, maintenance, propriété intellectuelle et responsabilités.',
  robots: 'noindex'
})

const num = (i: number) => String(i + 1).padStart(2, '0')

const keys = [
  { t: 'Des prestations cadrées', d: 'Chaque prestation fait l’objet d’un devis détaillé et de votre validation préalable. Vous gardez la maîtrise du périmètre de votre projet.', icon: 'M9 12l2 2 4-4M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z' },
  { t: 'Modalités de paiement', d: 'Une structure claire : 50 % à la commande, 50 % à la livraison. Les conditions spécifiques sont toujours précisées dans votre devis.', icon: 'M2 7h20v12H2zM2 11h20M6 15h4' },
  { t: 'Délais de réalisation', d: 'Les délais sont estimés avec soin et donnés à titre indicatif. Nous nous engageons à une communication transparente sur l’avancement.', icon: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2' },
  { t: 'Responsabilité encadrée', d: 'Notre engagement porte sur les moyens mis en œuvre. La performance dépend aussi de facteurs externes (algorithmes, marché…).', icon: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z' }
]

type Block = string | string[] | { h: string }
const articles: { t: string; blocks: Block[] }[] = [
  { t: 'Présentation de la société', blocks: [
    'Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre KPS Agency, agence digitale spécialisée dans la conception, la gestion et le déploiement de solutions digitales, ci-après « KPS Agency », et toute personne physique ou morale souhaitant bénéficier de ses services, ci-après « le Client ».',
    'La validation d’un devis, d’une commande ou d’une prestation implique l’acceptation pleine et entière des présentes CGV.'
  ] },
  { t: 'Objet', blocks: [
    'Les présentes CGV ont pour objet de définir les conditions dans lesquelles KPS Agency fournit ses services digitaux. Les services proposés peuvent notamment comprendre :',
    ['la création de contenus pour les réseaux sociaux (posts, vidéos courtes) ;', 'la gestion et la stratégie des réseaux sociaux ;', 'la création de sites web ;', 'le développement de sites e-commerce ;', 'le développement d’applications ;', 'la conception et le déploiement d’agents d’intelligence artificielle ;', 'l’automatisation digitale ;', 'le design graphique ;', 'le marketing digital ;', 'le conseil en stratégie digitale.'],
    'Chaque prestation fait l’objet d’un devis ou d’une proposition commerciale.'
  ] },
  { t: 'Commande', blocks: [
    'Toute commande devient ferme et définitive après :',
    ['la validation du devis par le Client ;', 'le paiement de l’acompte prévu.'],
    'KPS Agency se réserve le droit de refuser une commande en cas de litige antérieur avec le Client.'
  ] },
  { t: 'Prix', blocks: [
    'Les prix sont exprimés en euros, hors taxes ou toutes taxes comprises selon la situation fiscale. Les tarifs peuvent varier en fonction :',
    ['de la complexité du projet ;', 'de la charge de travail ;', 'des technologies utilisées ;', 'des délais demandés.'],
    'Sauf mention contraire, les devis sont valables 30 jours.'
  ] },
  { t: 'Modalités de paiement', blocks: [
    'Le paiement des prestations s’effectue selon les modalités suivantes :',
    ['50 % du montant total à la commande ;', '50 % à la livraison ou à la mise à disposition du projet.'],
    'La livraison finale ou la mise en production peut être conditionnée au paiement intégral du solde. Les paiements peuvent être effectués par :',
    ['virement bancaire ;', 'carte bancaire ;', 'tout autre moyen accepté par KPS Agency.'],
    'Tout retard de paiement peut entraîner l’application de pénalités conformément à la réglementation en vigueur.'
  ] },
  { t: 'Délais de réalisation', blocks: [
    'Les délais de réalisation sont donnés à titre indicatif. Ils peuvent varier en fonction :',
    ['de la complexité du projet ;', 'de la disponibilité des ressources ;', 'de la réactivité du Client ;', 'de la transmission des contenus nécessaires.'],
    'KPS Agency ne saurait être tenue responsable des retards causés par un défaut de validation ou d’information de la part du Client.'
  ] },
  { t: 'Révisions et modifications', blocks: [
    'Chaque prestation comprend deux cycles de révision inclus dans le prix initial. Une révision correspond à une demande de modification raisonnable portant sur le travail livré.',
    'Toute modification supplémentaire peut faire l’objet :',
    ['d’une facturation complémentaire ;', 'ou d’un nouveau devis.'],
    'Les modifications majeures peuvent être considérées comme un nouveau projet.'
  ] },
  { t: 'Livraison des prestations', blocks: [
    'Les prestations peuvent être livrées sous forme de :',
    ['fichiers numériques ;', 'publication de contenus ;', 'mise en ligne d’un site web ;', 'mise en ligne d’une application ;', 'accès à une solution ou à un agent IA.'],
    'La livraison est réputée effectuée dès la mise à disposition du livrable au Client.'
  ] },
  { t: 'Maintenance des solutions digitales', blocks: [
    'À la livraison d’un site web, d’une plateforme e-commerce, d’une application ou d’un agent IA, KPS Agency inclut une maintenance technique initiale de 12 mois à compter de la mise en production. Cette maintenance comprend :',
    ['la correction des bugs liés au développement initial ;', 'le maintien du bon fonctionnement général de la solution ;', 'la compatibilité technique de base avec les technologies utilisées.'],
    'Cette maintenance ne couvre pas :',
    ['les évolutions fonctionnelles ;', 'l’ajout de nouvelles fonctionnalités ;', 'les modifications demandées par le Client ;', 'les modifications effectuées par un tiers ;', 'les changements liés à des services externes.'],
    { h: 'Maintenance après la première année' },
    'À l’issue de cette période, la maintenance peut être prolongée dans le cadre d’un abonnement proposé par KPS Agency. Cet abonnement peut inclure :',
    ['la maintenance technique continue ;', 'les mises à jour de sécurité ;', 'le suivi des performances ;', 'l’optimisation technique ;', 'l’ajustement des agents IA.'],
    'En l’absence de contrat de maintenance actif, KPS Agency ne saurait être tenue responsable de l’évolution technique des solutions.'
  ] },
  { t: 'Intervention de prestataires externes', blocks: [
    'Dans le cadre de ses prestations, KPS Agency agit en qualité d’intermédiaire et de coordinateur de services digitaux. Pour certains projets, KPS Agency peut faire appel à des prestataires externes indépendants, qui peuvent intervenir en :',
    ['développement web ;', 'production de contenus ;', 'design ;', 'marketing digital ;', 'développement d’applications ;', 'développement d’agents IA.']
  ] },
  { t: 'Responsabilité des prestataires', blocks: [
    'Les prestataires externes interviennent en tant que professionnels indépendants et sont pleinement responsables de leurs prestations.',
    'KPS Agency ne saurait être tenue responsable des défauts, retards ou dysfonctionnements imputables à ces prestataires.'
  ] },
  { t: 'Interlocuteur unique', blocks: [
    'Dans le cadre de l’organisation du projet, KPS Agency demeure l’interlocuteur unique du Client et assure la coordination des intervenants.',
    'Toutefois, la responsabilité technique de l’exécution des prestations incombe aux prestataires qui ont réalisé les travaux.'
  ] },
  { t: 'Limitation de responsabilité', blocks: [
    'La responsabilité de KPS Agency ne peut être engagée qu’en cas de faute prouvée. En tout état de cause, la responsabilité totale de KPS Agency est limitée au montant payé par le Client pour la prestation concernée.',
    'KPS Agency ne saurait être tenue responsable des dommages indirects, tels que :',
    ['la perte de chiffre d’affaires ;', 'la perte de données ;', 'la perte d’exploitation ;', 'la perte d’opportunités commerciales.']
  ] },
  { t: 'Dépendance aux services externes', blocks: [
    'Certaines prestations reposent sur l’utilisation de services tiers, tels que :',
    ['les réseaux sociaux ;', 'les hébergeurs web ;', 'les CMS ;', 'les solutions e-commerce ;', 'les API ;', 'les services d’intelligence artificielle.'],
    'KPS Agency ne saurait être tenue responsable des interruptions, modifications ou suppressions de services liées à ces plateformes.'
  ] },
  { t: 'Hébergement et sécurité', blocks: [
    'Sauf mention contraire, l’hébergement des solutions développées est assuré par des prestataires spécialisés. KPS Agency ne saurait être tenue responsable :',
    ['d’une défaillance de l’hébergeur ;', 'd’une faille de sécurité externe ;', 'd’une perte de données causée par un tiers.']
  ] },
  { t: 'Utilisation de solutions d’intelligence artificielle', blocks: [
    'Les solutions d’intelligence artificielle peuvent produire des résultats variables. Le Client reconnaît que :',
    ['les résultats peuvent nécessiter une validation humaine ;', 'les performances peuvent évoluer selon les technologies utilisées.'],
    'KPS Agency ne peut garantir un résultat spécifique lié à l’utilisation d’un agent IA.'
  ] },
  { t: 'Prestations récurrentes', blocks: [
    'Certaines prestations peuvent être proposées sous forme d’abonnement mensuel. Sauf mention contraire, elles sont conclues pour une durée minimale de 3 mois, puis reconduites tacitement de mois en mois.',
    'La résiliation doit être notifiée en respectant un préavis de 30 jours.'
  ] },
  { t: 'Retard ou absence de collaboration du Client', blocks: [
    'L’exécution des prestations nécessite la collaboration active du Client. En l’absence de réponse pendant plus de 15 jours, le planning du projet peut être ajusté.',
    'Au-delà de 30 jours, le projet peut être suspendu. Sa reprise peut entraîner des frais supplémentaires.'
  ] },
  { t: 'Propriété intellectuelle', blocks: [
    'Les créations deviennent la propriété du Client après paiement intégral. KPS Agency reste propriétaire :',
    ['de ses méthodes ;', 'de ses outils internes ;', 'de ses frameworks ;', 'de ses composants techniques réutilisables.'],
    'KPS Agency peut présenter les travaux réalisés dans son portfolio.'
  ] },
  { t: 'Confidentialité', blocks: [
    'KPS Agency s’engage à respecter la confidentialité des informations communiquées par le Client.'
  ] },
  { t: 'Résiliation', blocks: [
    'En cas d’annulation du projet après son démarrage :',
    ['l’acompte versé reste acquis à KPS Agency ;', 'les travaux réalisés peuvent être facturés.']
  ] },
  { t: 'Absence de remboursement', blocks: [
    'Les prestations étant personnalisées, aucun remboursement ne peut être exigé une fois la prestation commencée, sauf faute grave imputable à KPS Agency.'
  ] },
  { t: 'Validation des livrables', blocks: [
    'Le Client dispose d’un délai de 7 jours après la livraison pour demander une révision ou signaler un problème.',
    'Sans retour dans ce délai, le livrable est considéré comme accepté et validé.'
  ] },
  { t: 'Délai de réclamation', blocks: [
    'Toute réclamation doit être formulée dans un délai maximal de 7 jours après la livraison. Passé ce délai, la prestation est réputée conforme.'
  ] },
  { t: 'Droit applicable', blocks: [
    'Les présentes CGV sont soumises au droit français. En cas de litige, les parties s’efforceront de trouver une solution amiable.',
    'À défaut, le litige sera porté devant les tribunaux compétents du siège social de KPS Agency.'
  ] }
]
</script>

<style scoped>
.keys { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; margin-top: 16px; }
.keys__item { display: flex; flex-direction: column; gap: 12px; padding: 28px; background: var(--white); border: 1px solid var(--line); border-radius: 20px; }
.keys__i { width: 44px; height: 44px; display: inline-flex; align-items: center; justify-content: center; border-radius: 12px; background: var(--accent-soft); color: var(--accent); }
.keys__t { font-size: 20px; font-weight: 700; letter-spacing: -.3px; }
.keys__d { font-size: 15px; line-height: 1.55; color: var(--muted); }

.terms { display: grid; grid-template-columns: 300px minmax(0, 1fr); gap: 64px; align-items: start; margin-top: 48px; }
.toc { position: sticky; top: 112px; max-height: calc(100vh - 136px); overflow-y: auto; padding: 24px; background: var(--white); border: 1px solid var(--line); border-radius: 20px; }
.toc__title { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: var(--muted-2); margin-bottom: 12px; }
.toc__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
.toc__list a { display: flex; gap: 10px; padding: 6px 8px; border-radius: 8px; font-size: 14px; line-height: 1.35; color: var(--muted); }
.toc__list a span { flex: none; width: 22px; font-weight: 600; color: var(--muted-3); font-variant-numeric: tabular-nums; }
.toc__list a:hover { background: var(--bg); color: var(--accent); }

.articles__h { font-size: 36px; letter-spacing: -1px; font-weight: 800; margin-bottom: 8px; }
.art { display: grid; grid-template-columns: 64px minmax(0, 1fr); gap: 16px; padding: 32px 0; border-top: 1px solid var(--line); scroll-margin-top: 112px; }
.art__n { font-family: var(--font-display); font-size: 22px; font-weight: 800; color: var(--accent); }
.art__body { display: flex; flex-direction: column; gap: 14px; max-width: 760px; }
.art__t { font-size: 24px; font-weight: 700; letter-spacing: -.4px; }
.art__sub { margin: 8px 0 0; font-size: 17px; font-weight: 700; }
.art__p { font-size: 17px; line-height: 1.7; color: var(--muted); }
.art__list { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 6px; font-size: 17px; line-height: 1.6; color: var(--muted); }
.art__list li::marker { color: var(--accent); }
.terms__date { margin-top: 16px; padding: 24px 28px; background: var(--accent-soft); border-radius: 16px; font-size: 15px; line-height: 1.6; color: var(--ink); }

@media (max-width: 1180px) {
  .keys { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .terms { grid-template-columns: minmax(0, 1fr); gap: 32px; }
  .toc { position: static; max-height: none; }
  .toc__list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2px 16px; }
}
@media (max-width: 720px) {
  .keys { grid-template-columns: minmax(0, 1fr); }
  .toc__list { grid-template-columns: minmax(0, 1fr); }
  .art { grid-template-columns: minmax(0, 1fr); gap: 6px; padding: 24px 0; }
  .art__t { font-size: 21px; }
  .articles__h { font-size: 28px; }
}
</style>
