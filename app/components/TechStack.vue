<template>
  <!-- Technologies utilisées, par famille : logos monochromes, couleur de la marque au survol -->
  <section id="technologies" class="tech theme-light">
    <div class="container">
      <div class="tech__head">
        <div class="eyebrow">{{ t.eyebrow }}</div>
        <h2 class="h2 h2--plain tech__h">{{ t.h2 }} <span class="text-gradient">{{ t.hi }}</span></h2>
        <p class="text-18">{{ t.p }}</p>
      </div>
      <div class="tech__groups" :class="{ 'is-open': open }">
        <div v-for="g in TECH_GROUPS" :key="g.id" class="tech__group">
          <h3 class="tech__label">{{ t.groups[g.id] }}</h3>
          <ul class="tech__list">
            <li v-for="it in g.items" :key="it.name" class="tech__item" :style="{ '--hover': it.hover }">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path :d="it.path" /></svg>
              {{ it.name }}
            </li>
          </ul>
        </div>
      </div>
      <button v-if="!open" type="button" class="btn btn--ghost btn--sm tech__more" @click="open = true">{{ t.more }}</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { HOME } from '~/data/home'
import { TECH_GROUPS } from '~/data/tech'

const { en } = useSite()
const t = computed(() => HOME[en.value ? 'en' : 'fr'].tech)
// Sur mobile, seules deux familles sont affichées tant qu'on n'a pas déplié
const open = ref(false)
</script>

<style scoped>
.tech { padding-block: var(--section-y); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); background: radial-gradient(50% 60% at 50% 0%, rgba(99, 102, 241, .12), transparent 70%), var(--bg); }
.tech__head { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px; margin-bottom: 56px; }
.tech__head .text-18 { max-width: 620px; }
.tech__h { max-width: 900px; }
.tech__groups { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
.tech__group { display: flex; flex-direction: column; gap: 16px; padding: 28px; background: var(--surface); border: 1px solid var(--line); border-radius: 20px; }
.tech__group:first-child { grid-column: 1 / -1; }
.tech__label { font-family: var(--font-body); font-size: 13px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: var(--muted-2); }
.tech__list { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 10px; }
.tech__item { display: inline-flex; align-items: center; gap: 10px; padding: 10px 16px; border-radius: 12px; background: rgba(255, 255, 255, .03); border: 1px solid var(--line); font-size: 16px; font-weight: 600; color: var(--ink-hover); transition: border-color .3s, background .3s, transform .3s; }
.tech__item svg { flex: none; color: var(--muted-2); transition: color .3s; }
.tech__item:hover { transform: translateY(-2px); border-color: color-mix(in srgb, var(--hover) 50%, transparent); background: color-mix(in srgb, var(--hover) 8%, transparent); }
.tech__item:hover svg { color: var(--hover); }
.tech__more { display: none; }

@media (max-width: 720px) {
  .tech__groups { grid-template-columns: minmax(0, 1fr); gap: 14px; }
  .tech__group { padding: 20px; }
  .tech__item { padding: 8px 12px; font-size: 14px; }
  .tech__groups:not(.is-open) .tech__group:nth-child(n + 3) { display: none; }
  .tech__more { display: flex; margin: 16px auto 0; min-height: 44px; }
}
</style>
