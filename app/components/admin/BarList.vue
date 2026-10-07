<template>
  <!-- Classement : une barre par ligne, valeur à droite -->
  <p v-if="!items.length" class="adm-note">{{ empty }}</p>
  <ol v-else class="bars">
    <li v-for="item in items" :key="item.label" :title="`${item.label} : ${format(item.value)}`">
      <span class="bars__label">{{ item.label }}</span>
      <span class="bars__value">{{ format(item.value) }}</span>
      <span class="bars__track"><span class="bars__fill" :style="{ width: `${Math.max(1, (item.value / max) * 100)}%` }" /></span>
    </li>
  </ol>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ items: { label: string; value: number }[]; format?: (v: number) => string; empty?: string }>(), { format: fmtInt, empty: 'Aucune donnée sur la période.' })
const max = computed(() => Math.max(1, ...props.items.map(i => i.value)))
</script>

<style scoped>
.bars { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
.bars li { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 6px 12px; font-size: 14px; }
.bars__label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--muted); }
.bars__value { font-weight: 700; font-variant-numeric: tabular-nums; }
.bars__track { grid-column: 1 / -1; height: 6px; border-radius: 3px; background: var(--line); }
.bars__fill { display: block; height: 100%; border-radius: 3px; background: var(--accent); }
</style>
