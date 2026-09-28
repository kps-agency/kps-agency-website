<template>
  <NuxtLink to="/" class="logo" :class="{ 'logo--light': light }" aria-label="KPS Agency — accueil">
    <span class="logo__mark">K</span>
    KPS Agency
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{ light?: boolean }>()
</script>

<style scoped>
.logo { display: inline-flex; align-items: center; gap: 10px; font-family: var(--font-display); font-weight: 800; font-size: 24px; letter-spacing: -0.5px; color: var(--ink); }
.logo:hover { color: var(--ink); }
.logo--light, .logo--light:hover { color: var(--white); }
.logo__mark { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 10px; background: var(--accent); color: var(--white); font-size: 16px; }
</style>
