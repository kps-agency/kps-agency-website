<template>
  <!-- Promotion en cours, gérée dans l'admin (table promos de Supabase, lue au build) -->
  <div v-if="promo" class="promo" role="region" :aria-label="en ? 'Current offer' : 'Offre en cours'">
    <span>{{ (en && promo.textEn) || promo.text }}</span>
    <component :is="external ? 'a' : NuxtLink" v-if="promo.ctaUrl && label" v-bind="external ? { href: promo.ctaUrl, target: '_blank', rel: 'noopener' } : { to: promo.ctaUrl }" class="promo__cta">{{ label }} →</component>
  </div>
</template>

<script setup lang="ts">
import cms from '#cms'
import { currentPromo } from '#shared/cms'
import { NuxtLink } from '#components'

const { en } = useSite()
// Le site est figé au build : la page s'affiche d'abord avec le jour du build (useState, identique côté serveur et navigateur),
// puis la période est recalculée dans le navigateur pour qu'une promotion commence et s'arrête à la bonne date
const day = useState('promo-day', () => new Date().toISOString().slice(0, 10))
onMounted(() => { day.value = new Date().toISOString().slice(0, 10) })
const promo = computed(() => currentPromo(cms?.promos, day.value))
const label = computed(() => (en.value && promo.value?.ctaLabelEn) || promo.value?.ctaLabel)
const external = computed(() => /^https?:\/\//.test(promo.value?.ctaUrl ?? ''))
</script>

<style scoped>
.promo { display: flex; justify-content: center; align-items: center; flex-wrap: wrap; gap: 6px 16px; padding: 10px 20px; background: var(--grad-brand); color: var(--white); font-size: 14px; font-weight: 600; text-align: center; }
.promo__cta { text-decoration: underline; text-underline-offset: 3px; white-space: nowrap; }
.promo__cta:hover { color: var(--white); opacity: .85; }
</style>
