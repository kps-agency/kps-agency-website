<template>
  <AdminResource
    table="promos" title="Promotions" singular="une promotion" :fields="FIELDS" :defaults="{ active: true }" :describe="describe"
    intro="Un bandeau en haut de toutes les pages du site. Une seule promotion s’affiche à la fois : la première de la liste qui est active et dont la période contient la date du jour."
    empty="Aucune promotion : le site n’affiche pas de bandeau."
  />
</template>

<script setup lang="ts">
import type { ResourceField } from '../Resource.vue'

// Promotions affichées en bandeau (table promos, composant PromoBar)
const FIELDS: ResourceField[] = [
  { key: 'text', label: 'Texte du bandeau', required: true, max: 140, wide: true, placeholder: 'Audit SEO offert pour toute demande de devis avant le 31 octobre' },
  { key: 'text_en', label: 'Texte en anglais (facultatif)', max: 140, wide: true, hint: 'Vide = le texte français s’affiche aussi sur la version anglaise.' },
  { key: 'cta_label', label: 'Libellé du lien (facultatif)', max: 40, placeholder: 'En profiter' },
  { key: 'cta_label_en', label: 'Libellé du lien en anglais', max: 40 },
  { key: 'cta_url', label: 'Adresse du lien', max: 300, wide: true, pattern: '(/|https://).*', placeholder: '/audit-gratuit', hint: 'Une page du site (/audit-gratuit, /contact…) ou une adresse complète en https://' },
  { key: 'starts_on', label: 'Début (facultatif)', type: 'date' },
  { key: 'ends_on', label: 'Fin (facultatif)', type: 'date', hint: 'Dernier jour d’affichage, inclus.' },
  { key: 'active', label: 'Promotion active', type: 'checkbox', wide: true }
]

const today = localDay(new Date())
function describe(p: Record<string, any>) {
  const period = p.starts_on || p.ends_on ? `${p.starts_on ? `du ${fmtDay(p.starts_on)}` : 'dès maintenant'} ${p.ends_on ? `au ${fmtDay(p.ends_on)}` : 'sans date de fin'}` : 'Sans limite de date'
  const state = !p.active ? { label: 'Désactivée' }
    : p.ends_on && p.ends_on < today ? { label: 'Terminée', cls: 'adm-badge--off' }
      : p.starts_on && p.starts_on > today ? { label: 'Programmée', cls: 'adm-badge--wait' } : { label: 'En cours', cls: 'adm-badge--on' }
  return { title: p.text, sub: `${period}${p.cta_url ? ` · lien vers ${p.cta_url}` : ''}`, badges: [state] }
}
</script>
