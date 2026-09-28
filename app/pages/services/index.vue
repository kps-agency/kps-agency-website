<template>
  <div>
    <section class="container head">
      <Breadcrumb :items="[{ label: 'Accueil', to: '/' }, { label: 'Expertises' }]" />
      <div class="eyebrow">Expertises</div>
      <h1 class="head__h1">Six expertises. Une seule équipe. Un objectif : votre croissance.</h1>
      <p class="lead head__p">Chaque expertise se mobilise seule ou en synergie. C’est dans leur articulation — un site bien référencé, nourri par des campagnes rentables et des contenus engageants — que naît la performance durable.</p>
    </section>
    <section class="container list">
      <div class="grid grid-3">
        <NuxtLink v-for="(s, i) in SERVICES" :key="s.slug" :to="`/services/${s.slug}`" class="item" :class="{ 'item--dark': i === 0 }">
          <span class="item__num">{{ s.num }}</span>
          <h2 class="item__t">{{ s.crumb }}</h2>
          <p class="item__d">{{ s.sub }}</p>
          <div class="item__pills"><span v-for="o in s.offers" :key="o.n">{{ o.t }}</span></div>
          <span class="item__cta">Découvrir →</span>
        </NuxtLink>
      </div>
    </section>
    <CtaBand title="Un projet en tête ?" text="Décrivez-nous votre besoin : nous revenons vers vous avec une recommandation claire et un devis personnalisé." />
  </div>
</template>

<script setup lang="ts">
import { SERVICES } from '~/data/content'
useSeoMeta({ title: 'Nos expertises', description: 'Création de sites, applications métier et mobiles, référencement SEO & GEO, marketing digital & ADS, social media : six expertises au sein d’une même équipe.' })
</script>

<style scoped>
.head { display: flex; flex-direction: column; gap: 24px; padding-top: 40px; padding-bottom: 64px; }
.head .eyebrow { margin-top: 32px; }
.head__h1 { font-size: 72px; line-height: 1.02; letter-spacing: -2.4px; font-weight: 800; max-width: 1100px; }
.head__p { max-width: 760px; }
.list { padding-bottom: 112px; }
.item { display: flex; flex-direction: column; gap: 16px; padding: 32px; min-height: 360px; background: var(--white); border: 1px solid var(--line); border-radius: 20px; color: var(--ink); transition: transform .2s ease; }
.item:hover { transform: translateY(-3px); color: var(--ink); }
.item--dark { background: var(--ink); color: var(--white); } .item--dark:hover { color: var(--white); }
.item__num { display: flex; align-items: center; justify-content: center; width: 52px; height: 52px; border-radius: 14px; background: var(--bg); font-family: var(--font-display); font-weight: 800; font-size: 18px; }
.item--dark .item__num { background: var(--accent); }
.item__t { font-size: 28px; letter-spacing: -.6px; font-weight: 700; }
.item__d { font-size: 16px; line-height: 1.55; color: var(--muted); }
.item--dark .item__d { color: var(--dark-muted); }
.item__pills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: auto; }
.item__pills span { font-size: 13px; padding: 6px 10px; border-radius: 8px; background: var(--bg); }
.item--dark .item__pills span { background: var(--dark-2); }
.item__cta { font-size: 15px; font-weight: 600; }
@media (max-width: 1180px) { .head__h1 { font-size: 52px; letter-spacing: -1.6px; } }
@media (max-width: 720px) { .head__h1 { font-size: 38px; letter-spacing: -1px; } .list { padding-bottom: 64px; } }
</style>
