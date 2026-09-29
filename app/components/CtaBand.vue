<template>
  <section class="cta" :class="{ 'cta--white': white }">
    <div class="container">
      <div class="cta__box">
        <div class="cta__text">
          <h2 class="h2 h2--48 cta__title">{{ title }}</h2>
          <p v-if="text" class="cta__p">{{ text }}</p>
        </div>
        <NuxtLink :to="to ?? link.contact()" class="btn btn--light">{{ label ?? t.quote }} →</NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ title: string; text?: string; label?: string; to?: string; white?: boolean }>()
const { link } = useSite()
const t = useLocaleText({ fr: { quote: 'Demander un devis' }, en: { quote: 'Get a quote' } })
</script>

<style scoped>
.cta { padding-bottom: 96px; }
.cta--white { background: var(--white); }
.cta__box { display: flex; justify-content: space-between; align-items: center; gap: 48px; padding: 64px 72px; border-radius: 32px; background: var(--accent); color: var(--white); }
.cta__text { display: flex; flex-direction: column; gap: 14px; max-width: 760px; }
.cta__p { font-size: 18px; line-height: 1.55; color: var(--accent-soft); }
.btn--light { flex-shrink: 0; }
@media (max-width: 960px) {
  .cta__box { flex-direction: column; align-items: flex-start; padding: 48px 32px; }
}
</style>
