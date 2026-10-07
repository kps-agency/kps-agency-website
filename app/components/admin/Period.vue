<template>
  <!-- Période d'une mesure : 7, 28 ou 90 jours (valeurs acceptées par les routes /api/admin) -->
  <div class="adm-seg" role="group" aria-label="Période">
    <button v-for="d in [7, 28, 90]" :key="d" type="button" :class="{ 'is-on': model === d }" :aria-pressed="model === d" @click="model = d">{{ d }} jours</button>
  </div>
</template>

<script setup lang="ts">
const model = defineModel<number>({ required: true })
</script>
