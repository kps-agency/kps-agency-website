<template>
  <NuxtLink :to="link.home()" class="logo" :class="{ 'logo--light': light }" :aria-label="en ? 'KPS Agency — home' : 'KPS Agency — accueil'">
    <img src="/logo-kps-150.webp" srcset="/logo-kps-150.webp 1x, /logo-kps.webp 2x" alt="KPS Agency" width="311" height="120" class="logo__img">
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{ light?: boolean }>()
const { en, link } = useSite()
</script>

<style scoped>
.logo { display: inline-flex; align-items: center; flex: none; }
.logo__img { height: 58px; width: auto; }
/* Pied de page : logo en blanc monochrome */
.logo--light .logo__img { filter: brightness(0) invert(1); }


@media (max-width: 720px) { .logo { min-height: 44px; } .logo__img { height: 40px; } }
</style>
