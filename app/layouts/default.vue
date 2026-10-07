<template>
  <div class="layout">
    <PromoPopup />
    <SiteHeader />
    <main id="contenu">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.layout { min-height: 100vh; display: flex; flex-direction: column; }
main { flex: 1; }
</style>
