<template>
  <!-- Témoignages signés issus des études de cas (admin → Réalisations → Témoignage). Rien n'est affiché tant qu'aucun n'est saisi. -->
  <div v-if="quoted.length" class="cq">
    <figure v-for="p in quoted" :key="p.slug" class="cq__item">
      <blockquote class="cq__q">« {{ p.study!.quote }} »</blockquote>
      <figcaption class="cq__who">
        <img v-if="p.study!.quotePhoto" :src="small(p.study!.quotePhoto)" alt="" class="cq__photo" width="48" height="48" loading="lazy" decoding="async">
        <span v-else class="cq__photo cq__photo--ini" aria-hidden="true">{{ p.study!.quoteAuthor.charAt(0).toUpperCase() }}</span>
        <span class="cq__id">
          <strong>{{ p.study!.quoteAuthor }}</strong>
          <span>{{ [p.study!.quoteRole, p.client].filter(Boolean).join(' · ') }}</span>
        </span>
        <NuxtLink :to="link.project(p.slug)" class="cq__more">{{ en ? 'Read the case study' : 'Lire l’étude de cas' }} →</NuxtLink>
      </figcaption>
    </figure>
  </div>
</template>

<script setup lang="ts">
import { hasQuote } from '~/data/content'

const props = withDefaults(defineProps<{ max?: number }>(), { max: 3 })
const { en, link, projects } = useSite()
const { small } = useCloudImage()
const quoted = computed(() => projects.value.filter(hasQuote).slice(0, props.max))
</script>

<style scoped>
.cq { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 40px; }
.cq__item { display: flex; flex-direction: column; gap: 24px; margin: 0; padding: 32px; background: var(--surface); border: 1px solid var(--line); border-radius: 20px; }
.cq__q { margin: 0; font-size: 18px; line-height: 1.6; color: var(--ink); }
.cq__who { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; margin-top: auto; padding-top: 20px; border-top: 1px solid var(--line-soft); }
.cq__photo { flex: none; width: 48px; height: 48px; border-radius: 999px; object-fit: cover; }
.cq__photo--ini { display: flex; align-items: center; justify-content: center; background: var(--accent-soft); color: var(--accent); font-weight: 700; }
.cq__id { display: flex; flex-direction: column; gap: 2px; font-size: 14px; color: var(--muted); }
.cq__id strong { font-size: 16px; color: var(--ink); }
.cq__more { margin-left: auto; font-size: 14px; font-weight: 600; color: var(--accent); }
.cq__more:hover { text-decoration: underline; }
@media (max-width: 720px) {
  .cq { grid-template-columns: minmax(0, 1fr); }
  .cq__item { padding: 24px; }
  .cq__more { margin-left: 0; width: 100%; display: inline-flex; align-items: center; min-height: 44px; }
}
</style>
