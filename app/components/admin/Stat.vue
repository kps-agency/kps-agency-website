<template>
  <!-- Chiffre clé, avec son évolution par rapport à la période précédente -->
  <div class="adm-card stat">
    <span class="stat__label">{{ label }}</span>
    <strong class="stat__value">{{ value }}</strong>
    <span v-if="change !== undefined && change !== null" class="stat__delta" :class="good ? 'is-up' : 'is-down'">
      <span aria-hidden="true">{{ change >= 0 ? '▲' : '▼' }}</span> {{ fmtPct(Math.abs(change), 0) }} <small>vs période précédente</small>
    </span>
    <span v-else-if="hint" class="stat__hint">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string; value: string | number; hint?: string
  /** Évolution relative (0,12 = +12 %) ; null ou absent = non affichée */
  change?: number | null
  /** Une baisse est une bonne nouvelle (ex. position moyenne dans Google) */
  lowerIsBetter?: boolean
}>()
const good = computed(() => (props.change ?? 0) >= 0 !== !!props.lowerIsBetter)
</script>

<style scoped>
.stat { display: flex; flex-direction: column; gap: 6px; padding: 20px; min-width: 0; }
.stat__label { font-size: 13px; font-weight: 600; color: var(--muted-2); }
.stat__value { font-family: var(--font-display); font-size: 32px; font-weight: 900; letter-spacing: -0.8px; line-height: 1.1; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
.stat__delta, .stat__hint { font-size: 13px; color: var(--muted-2); }
.stat__delta.is-up { color: var(--green); }
.stat__delta.is-down { color: var(--red); }
.stat__delta small { color: var(--muted-2); font-size: 12px; }
</style>
