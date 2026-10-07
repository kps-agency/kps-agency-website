<template>
  <!-- Courbe d'une seule série dans le temps : survol = repère vertical + valeur du jour -->
  <figure ref="box" class="chart">
    <svg v-if="width && points.length > 1" :viewBox="`0 0 ${width} ${height}`" :width="width" :height="height" role="img" :aria-label="`${label} : ${summary ?? total}`" @pointermove="hover" @pointerleave="at = null">
      <g v-for="t in ticks" :key="t.v">
        <line :x1="PAD_L" :x2="width - PAD_R" :y1="t.y" :y2="t.y" class="chart__grid" />
        <text :x="PAD_L - 8" :y="t.y + 4" text-anchor="end" class="chart__tick">{{ format(t.v) }}</text>
      </g>
      <path :d="area" class="chart__area" />
      <path :d="line" class="chart__line" />
      <text v-for="x in xLabels" :key="x.i" :x="x.x" :y="height - 6" :text-anchor="x.anchor" class="chart__tick">{{ fmtDayShort(points[x.i]!.date) }}</text>
      <g v-if="at !== null">
        <line :x1="px(at)" :x2="px(at)" :y1="PAD_T" :y2="height - PAD_B" class="chart__cross" />
        <circle :cx="px(at)" :cy="py(points[at]!.value)" r="5" class="chart__dot" />
      </g>
    </svg>
    <p v-else-if="width" class="adm-note chart__empty">Pas encore assez de données sur la période.</p>
    <div v-if="at !== null && points[at]" class="chart__tip" :style="{ left: `${Math.min(Math.max(px(at), 70), width - 70)}px` }">
      <strong>{{ format(points[at]!.value) }}</strong>
      <span>{{ fmtDay(points[at]!.date) }}</span>
    </div>
  </figure>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  points: { date: string; value: number }[]; label: string; height?: number; format?: (v: number) => string
  /** Résumé lu par les lecteurs d'écran ; par défaut, le total de la période (à remplacer quand additionner n'a pas de sens : scores, taux) */
  summary?: string
}>(), { height: 220, format: fmtInt })

const PAD_L = 44
const PAD_R = 12
const PAD_T = 12
const PAD_B = 26

const box = ref<HTMLElement>()
const width = ref(0)
const at = ref<number | null>(null)
let observer: ResizeObserver | undefined
onMounted(() => {
  // Première mesure immédiate : un onglet en arrière-plan ne déclenche pas le ResizeObserver
  width.value = Math.floor(box.value!.clientWidth)
  observer = new ResizeObserver(([entry]) => { width.value = Math.floor(entry!.contentRect.width) })
  observer.observe(box.value!)
})
onBeforeUnmount(() => observer?.disconnect())

/** Maximum de l'axe arrondi à une valeur « ronde » (2, 4 ou 10 × 10ⁿ) : la graduation du milieu reste un nombre entier */
const top = computed(() => {
  const max = Math.max(1, ...props.points.map(p => p.value))
  const pow = 10 ** Math.floor(Math.log10(max))
  return [2, 4, 10].map(m => m * pow).find(v => v >= max)!
})
const px = (i: number) => PAD_L + (i / Math.max(1, props.points.length - 1)) * (width.value - PAD_L - PAD_R)
const py = (v: number) => PAD_T + (1 - v / top.value) * (props.height - PAD_T - PAD_B)
const ticks = computed(() => [0, top.value / 2, top.value].map(v => ({ v, y: py(v) })))
const line = computed(() => props.points.map((p, i) => `${i ? 'L' : 'M'}${px(i).toFixed(1)},${py(p.value).toFixed(1)}`).join(''))
const area = computed(() => `${line.value}L${px(props.points.length - 1).toFixed(1)},${py(0)}L${px(0)},${py(0)}Z`)
const xLabels = computed(() => {
  const last = props.points.length - 1
  return [{ i: 0, anchor: 'start' }, { i: Math.round(last / 2), anchor: 'middle' }, { i: last, anchor: 'end' }].map(l => ({ ...l, x: px(l.i) }))
})
const total = computed(() => `${props.format(props.points.reduce((s, p) => s + p.value, 0))} au total sur ${props.points.length} jours`)

function hover(e: PointerEvent) {
  const x = e.clientX - box.value!.getBoundingClientRect().left
  const i = Math.round(((x - PAD_L) / (width.value - PAD_L - PAD_R)) * (props.points.length - 1))
  at.value = Math.min(props.points.length - 1, Math.max(0, i))
}
</script>

<style scoped>
.chart { position: relative; margin: 0; min-height: 60px; }
.chart svg { display: block; touch-action: pan-y; }
.chart__grid { stroke: var(--line); stroke-width: 1; }
.chart__tick { fill: var(--muted-2); font-size: 11px; font-variant-numeric: tabular-nums; }
.chart__line { fill: none; stroke: var(--accent); stroke-width: 2; stroke-linejoin: round; stroke-linecap: round; }
.chart__area { fill: var(--accent); opacity: .1; }
.chart__cross { stroke: var(--line-3); stroke-width: 1; }
.chart__dot { fill: var(--accent); stroke: var(--surface); stroke-width: 2; }
.chart__tip { position: absolute; top: 0; transform: translateX(-50%); display: flex; flex-direction: column; gap: 2px; padding: 8px 12px; border: 1px solid var(--line-2); border-radius: var(--r-sm); background: var(--deep); font-size: 12px; color: var(--muted-2); white-space: nowrap; pointer-events: none; }
.chart__tip strong { font-size: 15px; color: var(--ink); font-variant-numeric: tabular-nums; }
.chart__empty { padding: 24px 0; }
</style>
