<template>
  <!-- Équipe de la page L'agence : membres listés dans TEAM (app/data/content.ts). Affichée seulement si SHOW_TEAM est à true. -->
  <section v-if="SHOW_TEAM && TEAM.length" class="container section team">
    <div class="team__head">
      <div class="eyebrow">{{ t.eyebrow }}</div>
      <h2 class="h2 h2--52">{{ t.h2 }}</h2>
    </div>
    <ul class="team__grid">
      <li v-for="m in TEAM" :key="m.name" class="member">
        <img v-if="m.photo" :src="m.photo" :alt="m.name" class="member__photo" width="320" height="320" loading="lazy" decoding="async">
        <span v-else class="member__photo member__photo--ini" aria-hidden="true">{{ initials(m.name) }}</span>
        <h3 class="member__name">{{ m.name }}</h3>
        <p class="member__role">{{ m.role[lang] }}</p>
        <p v-if="m.bio" class="member__bio">{{ m.bio[lang] }}</p>
        <NuxtLink v-if="AUTHORS[m.name]" :to="link.author(m.name)" class="member__in">{{ t.articles }} →</NuxtLink>
        <a v-if="m.linkedin" :href="m.linkedin" target="_blank" rel="noopener" class="member__in">LinkedIn<span class="sr-only"> — {{ m.name }}</span> ↗</a>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { AUTHORS, SHOW_TEAM, TEAM } from '~/data/content'

const { en, link } = useSite()
const lang = computed(() => (en.value ? 'en' : 'fr'))
const t = useLocaleText({
  fr: { eyebrow: 'L’équipe', h2: 'Les personnes derrière vos projets.', articles: 'Lire ses articles' },
  en: { eyebrow: 'The team', h2: 'The people behind your projects.', articles: 'Read their articles' }
})
const initials = (name: string) => name.split(/\s+/).map(w => w.charAt(0)).join('').slice(0, 2).toUpperCase()
</script>

<style scoped>
.team__head { display: flex; flex-direction: column; gap: 16px; margin-bottom: 48px; }
.team__grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; }
.member { display: flex; flex-direction: column; gap: 8px; padding: 24px; background: var(--surface); border: 1px solid var(--line); border-radius: 20px; }
.member__photo { width: 100%; height: auto; aspect-ratio: 1; margin-bottom: 12px; border-radius: 14px; object-fit: cover; }
.member__photo--ini { display: flex; align-items: center; justify-content: center; background: var(--accent-soft); color: var(--accent); font-family: var(--font-display); font-size: 56px; font-weight: 900; }
.member__name { font-size: 20px; font-weight: 700; letter-spacing: -.3px; }
.member__role { font-size: 14px; font-weight: 600; color: var(--accent); }
.member__bio { font-size: 16px; line-height: 1.55; color: var(--muted); }
.member__in { align-self: flex-start; margin-top: auto; padding-top: 8px; font-size: 14px; font-weight: 600; color: var(--ink); }
.member__in:hover { color: var(--accent); }
@media (max-width: 1180px) {
  .team__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 720px) {
  .team__grid { grid-template-columns: minmax(0, 1fr); }
  .member__photo { max-width: 200px; }
  .member__in { display: inline-flex; align-items: center; min-height: 44px; }
}
</style>
