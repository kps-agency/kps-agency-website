<template>
  <div>
    <section class="container intro">
      <div class="eyebrow">L’agence</div>
      <h1 class="intro__h1">Plus qu’une agence, votre co-pilote digital.</h1>
      <div class="intro__cols">
        <p class="intro__lead">Nous combinons créativité humaine et intelligence data pour construire des présences digitales qui font grandir les entreprises.</p>
        <p class="intro__p">Basée à Paris, KPS réunit au sein d’une même équipe six expertises complémentaires : création de sites, applications métier, applications mobiles, référencement SEO &amp; GEO, marketing digital et social media. Une organisation pensée pour que stratégie, design, technologie et acquisition avancent dans la même direction.</p>
      </div>
    </section>

    <section class="container photo-wrap"><div class="photo">[Photo de l’équipe ou des locaux]</div></section>

    <section class="bg-white section--96">
      <div class="container">
        <div class="head">
          <div class="eyebrow">Notre ADN</div>
          <h2 class="h2 h2--52">Trois convictions guident chacun de nos projets.</h2>
        </div>
        <div class="grid grid-3">
          <div v-for="a in adn" :key="a.n" class="adn">
            <span class="adn__n">{{ a.n }}</span>
            <h3 class="adn__t">{{ a.t }}</h3>
            <p class="adn__d">{{ a.d }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="container section">
      <div class="head head--row">
        <div class="head__col">
          <div class="eyebrow">Méthode</div>
          <h2 class="h2 h2--52">Une méthode claire, du brief au décollage.</h2>
        </div>
        <p class="text-18 head__p">Un cadre précis, des étapes validées ensemble, aucune zone d’ombre.</p>
      </div>
      <ol class="method">
        <li v-for="s in steps" :key="s.n" class="method__row">
          <span class="method__n">{{ s.n }}</span>
          <h3 class="method__t">{{ s.t }}</h3>
          <p class="method__d">{{ s.d }}</p>
        </li>
      </ol>
    </section>

    <section class="bg-dark section--96">
      <div class="container">
        <div class="head">
          <div class="eyebrow">Pourquoi KPS</div>
          <h2 class="h2 h2--52">L’exigence d’une grande agence, l’agilité d’une équipe engagée.</h2>
        </div>
        <div class="grid grid-4">
          <div v-for="w in why" :key="w.tag" class="why">
            <span class="why__tag">{{ w.tag }}</span>
            <h3 class="why__t">{{ w.t }}</h3>
            <p class="why__d">{{ w.d }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="container section">
      <h2 class="h2 h2--52 team__h">Le Crew KPS</h2>
      <div class="grid grid-4">
        <div v-for="n in 4" :key="n" class="member">
          <div class="member__photo">[Photo]</div>
          <span class="member__name">[Prénom Nom]</span>
          <span class="member__role">[Rôle]</span>
        </div>
      </div>
    </section>

    <CtaBand title="Envie de travailler avec nous ?" label="Parler de votre projet" />
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'L’agence', description: 'KPS Agency, agence digitale basée à Paris : six expertises réunies au sein d’une même équipe pour faire grandir les entreprises.' })
const adn = [
  { n: '01', t: 'Vision stratégique', d: 'Nous ne nous contentons pas d’exécuter. Nous construisons une feuille de route précise pour vous aider à dominer votre marché.' },
  { n: '02', t: 'Le Crew KPS', d: 'Une équipe de passionnés qui devient l’extension directe de votre marque et s’engage sur vos objectifs.' },
  { n: '03', t: 'Croissance accélérée', d: 'Des résultats tangibles : plus de visibilité, plus d’engagement, plus de conversions.' }
]
const steps = [
  { n: '01', t: 'Cadrage', d: 'Nous analysons votre marché, vos concurrents et vos objectifs pour définir ensemble les priorités et le périmètre du projet.' },
  { n: '02', t: 'Stratégie & conception', d: 'Parcours utilisateurs, maquettes, plan média : la stratégie prend forme et vous la validez avant toute production.' },
  { n: '03', t: 'Production', d: 'Design, développement, contenus ou campagnes : nos équipes produisent avec exigence et vous associent à chaque jalon.' },
  { n: '04', t: 'Lancement & croissance', d: 'Mise en ligne, mesure des performances, optimisation continue. Un projet digital ne s’arrête pas le jour de sa livraison.' }
]
const why = [
  { tag: '# 360°', t: 'Une vision globale', d: 'Site, référencement, publicité et contenus conçus ensemble, pour une présence cohérente.' },
  { tag: '# DATA', t: 'Des décisions fondées sur la donnée', d: 'Audits, analyses d’audience, suivi des KPIs : des recommandations appuyées sur des chiffres.' },
  { tag: '# RÉACTIVITÉ', t: 'Le rythme du digital', d: 'Le digital n’attend pas. Nous livrons vite pour que vous gardiez une longueur d’avance.' },
  { tag: '# EXIGENCE', t: 'Une qualité premium', d: 'L’image de votre marque est sacrée. Chaque livrable est pensé, relu et optimisé.' }
]
</script>

<style scoped>
.intro { display: flex; flex-direction: column; gap: 32px; padding-top: 112px; padding-bottom: 80px; }
.intro__h1 { font-size: 96px; line-height: .98; letter-spacing: -3.2px; font-weight: 800; max-width: 1180px; }
.intro__cols { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 64px; margin-top: 24px; }
.intro__lead { font-size: 22px; line-height: 1.5; }
.intro__p { font-size: 18px; line-height: 1.65; color: var(--muted); }
.photo-wrap { padding-bottom: 96px; }
.photo { height: 520px; border-radius: 28px; background: #E6ECF5; display: flex; align-items: center; justify-content: center; color: var(--muted-2); font-size: 15px; }
.head { display: flex; flex-direction: column; gap: 16px; margin-bottom: 48px; }
.head--row { flex-direction: row; justify-content: space-between; align-items: flex-end; gap: 48px; }
.head__col { display: flex; flex-direction: column; gap: 16px; }
.head__p { max-width: 440px; }
.adn { display: flex; flex-direction: column; gap: 16px; padding: 40px 36px; min-height: 280px; background: var(--bg); border: 1px solid var(--line); border-radius: 20px; }
.adn__n { font-family: var(--font-display); font-size: 44px; font-weight: 800; color: var(--accent); }
.adn__t { font-size: 28px; letter-spacing: -.6px; font-weight: 700; }
.adn__d { font-size: 17px; line-height: 1.6; color: var(--muted); }
.method { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--line-2); }
.method__row { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: 24px; padding: 32px 0; border-bottom: 1px solid var(--line-2); align-items: baseline; }
.method__n { grid-column: span 1; font-family: var(--font-display); font-size: 28px; font-weight: 800; color: var(--accent); }
.method__t { grid-column: span 4; font-size: 30px; letter-spacing: -.6px; font-weight: 700; }
.method__d { grid-column: span 7; font-size: 17px; line-height: 1.6; color: var(--muted); }
.why { display: flex; flex-direction: column; gap: 14px; padding: 32px 28px; min-height: 230px; background: var(--dark-2); border-radius: 20px; }
.why__tag { align-self: flex-start; font-size: 12px; font-weight: 700; letter-spacing: 1.2px; padding: 6px 10px; border-radius: 999px; background: var(--dark-line); color: #C3CDFF; }
.why__t { font-size: 23px; font-weight: 700; }
.why__d { font-size: 15px; line-height: 1.6; color: var(--dark-muted); }
.team__h { margin-bottom: 40px; }
.member { display: flex; flex-direction: column; gap: 14px; }
.member__photo { height: 300px; border-radius: 20px; background: var(--line); display: flex; align-items: center; justify-content: center; color: var(--muted-2); font-size: 14px; }
.member__name { font-size: 18px; font-weight: 600; }
.member__role { font-size: 15px; color: var(--muted-2); margin-top: -8px; }
@media (max-width: 1180px) {
  .intro__h1 { font-size: 64px; letter-spacing: -2px; }
  .intro__cols { grid-template-columns: minmax(0, 1fr); gap: 24px; }
  .head--row { flex-direction: column; align-items: flex-start; }
  .method__n { grid-column: span 2; }
  .method__t { grid-column: span 10; }
  .method__d { grid-column: 3 / -1; margin-top: 10px; }
  .photo { height: 400px; }
}
@media (max-width: 720px) {
  .intro { padding-top: 64px; }
  .intro__h1 { font-size: 42px; letter-spacing: -1.2px; }
  .photo { height: 260px; }
  .method__t { font-size: 24px; }
  .method__d { grid-column: 1 / -1; }
}
</style>
