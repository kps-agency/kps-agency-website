<template>
  <div class="faq">
    <div v-for="(item, i) in items" :key="i" class="faq__item">
      <h3 class="faq__h">
        <button :id="`${uid}-q${i}`" type="button" class="faq__q" :aria-expanded="open === i" :aria-controls="`${uid}-a${i}`" @click="open = open === i ? -1 : i">
          <span class="faq__label"><span v-if="numbered" class="faq__n">{{ String(i + 1).padStart(2, '0') }}</span>{{ item[0] }}</span>
          <span class="faq__sign" aria-hidden="true">{{ open === i ? '−' : '+' }}</span>
        </button>
      </h3>
      <div v-show="open === i" :id="`${uid}-a${i}`" role="region" :aria-labelledby="`${uid}-q${i}`">
        <p class="faq__a" :class="{ 'faq__a--numbered': numbered }">{{ item[1] }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ items: [string, string][]; numbered?: boolean }>()
const uid = useId()
const open = ref(0)
</script>

<style scoped>
.faq { display: flex; flex-direction: column; border-top: 1px solid var(--line-2); }
.faq__item { border-bottom: 1px solid var(--line-2); }
.faq__h { font-family: var(--font-body); font-size: inherit; }
.faq__q { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 24px; padding: 24px 0; background: none; border: none; text-align: left; font-size: 20px; font-weight: 600; color: var(--ink); }
.faq__label { display: flex; gap: 20px; }
.faq__n { color: var(--muted-3); font-weight: 500; width: 28px; flex-shrink: 0; }
.faq__sign { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; flex-shrink: 0; border-radius: 99px; border: 1px solid var(--line-3); font-size: 20px; font-weight: 400; }
.faq__a { padding: 0 60px 26px 0; font-size: 17px; line-height: 1.6; color: var(--muted); }
.faq__a--numbered { padding-left: 48px; }
@media (max-width: 720px) {
  .faq__q { font-size: 17px; }
  .faq__a, .faq__a--numbered { padding: 0 0 22px; }
}
</style>
