<template>
  <NuxtLink to="/" class="logo" :class="{ 'logo--light': light }" aria-label="KPS Agency — accueil">
    <img src="/logo-kps.webp" alt="KPS Agency" width="311" height="120" class="logo__img">
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{ light?: boolean }>()
</script>

<style scoped>
.logo { display: inline-flex; align-items: center; flex: none; }
.logo__img { height: 58px; width: auto; }
/* Sur fond sombre, le logo passe en blanc monochrome pour rester lisible */
.logo--light .logo__img { filter: brightness(0) invert(1); }
@media (max-width: 720px) { .logo__img { height: 46px; } }
</style>
