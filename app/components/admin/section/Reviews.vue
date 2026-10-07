<template>
  <AdminResource
    table="reviews" title="Avis clients" singular="un avis" :fields="FIELDS" :defaults="{ rating: 5, published: true, truncated: false, translated: false }" :describe="describe"
    intro="Les avis affichés sur l’accueil et la page Agence, et dont la moyenne figure dans les bandeaux de confiance. À recopier tels quels depuis la fiche Google : un avis inventé ou réécrit expose l’agence."
    empty="Aucun avis en base : le site affiche la liste d’origine. Ajoutez-en un pour la remplacer."
  />
</template>

<script setup lang="ts">
import type { ResourceField } from '../Resource.vue'

// Avis Google repris sur le site (table reviews)
const FIELDS: ResourceField[] = [
  { key: 'name', label: 'Nom affiché sur Google', required: true, max: 80 },
  { key: 'month', label: 'Mois de l’avis', type: 'month', required: true },
  { key: 'text', label: 'Texte de l’avis', type: 'textarea', required: true, max: 1200, wide: true },
  { key: 'rating', label: 'Note', type: 'select', options: [5, 4, 3, 2, 1].map(n => ({ value: n, label: `${n} étoile${n > 1 ? 's' : ''}` })) },
  { key: 'published', label: 'Affiché sur le site', type: 'checkbox' },
  { key: 'truncated', label: 'Avis coupé par Google (« … Plus »)', type: 'checkbox' },
  { key: 'translated', label: 'Avis traduit en français', type: 'checkbox' }
]

const describe = (r: Record<string, any>) => ({
  title: r.name,
  sub: `${'★'.repeat(r.rating)} · ${new Date(`${r.month}-01T00:00:00`).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })} · ${r.text.slice(0, 110)}${r.text.length > 110 ? '…' : ''}`,
  badges: [{ label: r.published ? 'Affiché' : 'Masqué', cls: r.published ? 'adm-badge--on' : '' }]
})
</script>
