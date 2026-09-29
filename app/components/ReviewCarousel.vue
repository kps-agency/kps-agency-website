<template>
  <div
    class="rc"
    role="region"
    :aria-roledescription="t.carousel"
    :aria-label="t.region"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    @focusin="focus = true"
    @focusout="focus = false"
  >
    <div ref="track" class="rc__track" aria-live="off" @scroll.passive="onScroll" @pointerdown="restart">
      <figure
        v-for="(rv, i) in reviews"
        :key="rv.name"
        class="rc__slide review"
        role="group"
        aria-roledescription="avis"
        :aria-label="`${i + 1} ${t.of} ${reviews.length}`"
      >
        <div class="review__stars" :aria-label="`${rv.rating} ${t.stars}`">
          <svg v-for="n in rv.rating" :key="n" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path :d="STAR" /></svg>
        </div>
        <div class="review__body">
          <blockquote :id="`review-${i}`" ref="quotes" class="review__q" lang="fr" :class="{ 'is-clamped': !expanded.has(i) }">{{ rv.text }}<template v-if="rv.truncated"> …</template></blockquote>
          <button
            type="button"
            class="review__more"
            :class="{ 'is-hidden': !overflowing[i] && !expanded.has(i) }"
            :tabindex="!overflowing[i] && !expanded.has(i) ? -1 : undefined"
            :aria-hidden="!overflowing[i] && !expanded.has(i) ? 'true' : undefined"
            :aria-expanded="expanded.has(i)"
            :aria-controls="`review-${i}`"
            @click="toggle(i)"
          >{{ expanded.has(i) ? t.less : t.more }}</button>
        </div>
        <figcaption class="review__who">
          <span class="review__ini">{{ rv.name.charAt(0).toUpperCase() }}</span>
          <span><strong>{{ rv.name }}</strong><span>{{ t.google }} · {{ month(rv.date) }}<template v-if="rv.translated"> · {{ t.translated }}</template><template v-else-if="en"> · {{ t.original }}</template></span></span>
        </figcaption>
      </figure>
    </div>

    <div class="rc__nav">
      <div class="rc__dots">
        <button
          v-for="p in pages"
          :key="p"
          type="button"
          class="rc__dot"
          :class="{ 'is-on': p - 1 === current }"
          :aria-label="`${t.goto} ${p}`"
          :aria-current="p - 1 === current"
          @click="goTo(p - 1, true)"
        />
      </div>
      <div class="rc__arrows">
        <button type="button" class="rc__btn" :aria-label="playing ? t.pause : t.play" @click="userPaused = !userPaused">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path v-if="playing" d="M7 5h3v14H7zM14 5h3v14h-3z" /><path v-else d="M8 5v14l11-7z" /></svg>
        </button>
        <button type="button" class="rc__btn" :aria-label="t.prev" @click="goTo(current - 1, true)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button type="button" class="rc__btn" :aria-label="t.next" @click="goTo(current + 1, true)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Review } from '~/data/content'

const props = withDefaults(defineProps<{ reviews: Review[]; interval?: number }>(), { interval: 5000 })

const { en, locale } = useSite()
const t = useLocaleText({
  fr: { carousel: 'carrousel', region: 'Avis Google de nos clients', of: 'sur', stars: 'étoiles sur 5', more: 'Voir plus', less: 'Voir moins', google: 'Avis Google', translated: 'traduit de l’anglais', original: '', goto: 'Aller à l’avis', pause: 'Mettre en pause le défilement', play: 'Reprendre le défilement', prev: 'Avis précédent', next: 'Avis suivant' },
  en: { carousel: 'carousel', region: 'Our clients’ Google reviews', of: 'of', stars: 'stars out of 5', more: 'Read more', less: 'Show less', google: 'Google review', translated: 'translated into French by Google', original: 'original in French', goto: 'Go to review', pause: 'Pause autoplay', play: 'Resume autoplay', prev: 'Previous review', next: 'Next review' }
})
const month = (ym: string) => new Intl.DateTimeFormat(locale.value === 'en' ? 'en-GB' : 'fr-FR', { month: 'long', year: 'numeric' }).format(new Date(`${ym}-01T12:00:00`))

const STAR = 'M12 2l3 7 7 .6-5.3 4.7 1.6 7.2L12 17.8 5.7 21.5l1.6-7.2L2 9.6 9 9z'

const track = ref<HTMLElement>()
const current = ref(0)
const perView = ref(3)
const hover = ref(false)
const focus = ref(false)
const userPaused = ref(false)
const reducedMotion = ref(false)
const hidden = ref(false)

// Nombre de positions possibles : on s'arrête quand le dernier avis est visible
const pages = computed(() => Math.max(1, props.reviews.length - perView.value + 1))
const playing = computed(() => !userPaused.value && !reducedMotion.value)

// Textes limités à quelques lignes ; « Voir plus » n'apparaît que si le texte dépasse
const quotes = ref<HTMLElement[]>([])
// Estimation côté serveur (textes longs), affinée par la mesure réelle une fois la page chargée
const overflowing = ref<boolean[]>(props.reviews.map(r => r.text.length > 200))
const expanded = ref(new Set<number>())
function checkOverflow() {
  overflowing.value = props.reviews.map((_, i) => {
    const el = quotes.value[i]
    return !!el && el.scrollHeight > el.clientHeight + 1
  })
}
function toggle(i: number) {
  const s = new Set(expanded.value)
  if (s.has(i)) s.delete(i)
  else s.add(i)
  expanded.value = s
}

function slideWidth() {
  const el = track.value?.children[0] as HTMLElement | undefined
  if (!el || !track.value) return 0
  return el.offsetWidth + parseFloat(getComputedStyle(track.value).columnGap || '0')
}

function goTo(i: number, fromUser = false) {
  if (!track.value) return
  const n = pages.value
  current.value = ((i % n) + n) % n
  track.value.scrollTo({ left: current.value * slideWidth(), behavior: reducedMotion.value ? 'auto' : 'smooth' })
  if (fromUser) restart()
}

let scrollTimer: ReturnType<typeof setTimeout> | undefined
function onScroll() {
  clearTimeout(scrollTimer)
  scrollTimer = setTimeout(() => {
    const w = slideWidth()
    if (w && track.value) current.value = Math.min(pages.value - 1, Math.round(track.value.scrollLeft / w))
  }, 80)
}

let timer: ReturnType<typeof setInterval> | undefined
function restart() {
  clearInterval(timer)
  timer = setInterval(() => {
    if (playing.value && !hover.value && !focus.value && !hidden.value && !expanded.value.size) goTo(current.value + 1)
  }, props.interval)
}

function measure() {
  const w = window.innerWidth
  perView.value = w <= 640 ? 1 : w <= 1024 ? 2 : 3
  if (current.value > pages.value - 1) goTo(pages.value - 1)
  nextTick(checkOverflow)
}
const onVisibility = () => { hidden.value = document.hidden }

onMounted(() => {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion.value = mq.matches
  mq.addEventListener?.('change', e => { reducedMotion.value = e.matches })
  measure()
  document.fonts?.ready.then(checkOverflow) // les polices changent la hauteur du texte
  window.addEventListener('resize', measure, { passive: true })
  document.addEventListener('visibilitychange', onVisibility)
  restart()
})
onBeforeUnmount(() => {
  clearInterval(timer)
  clearTimeout(scrollTimer)
  window.removeEventListener('resize', measure)
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>

<style scoped>
.rc { display: flex; flex-direction: column; gap: 28px; }
.rc__track { --per: 3; display: grid; grid-auto-flow: column; grid-auto-columns: calc((100% - (var(--per) - 1) * 24px) / var(--per)); column-gap: 24px; align-items: start; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; overscroll-behavior-x: contain; }
.rc__track::-webkit-scrollbar { display: none; }
.rc__slide { scroll-snap-align: start; }

.review { display: flex; flex-direction: column; gap: 20px; padding: 28px; border: 1px solid var(--line); border-radius: 20px; background: var(--bg); }
.review__stars { display: flex; gap: 4px; color: #C27803; }
.review__body { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
.review__q { font-size: 17px; line-height: 1.55; }
.review__q.is-clamped { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 4; line-clamp: 4; overflow: hidden; min-height: calc(1.55em * 4); }
.review__more { padding: 0; border: none; background: none; font-size: 14px; font-weight: 600; color: var(--accent); text-decoration: underline; text-underline-offset: 3px; }
.review__more:hover { color: var(--accent-hover); }
.review__more.is-hidden { visibility: hidden; } /* garde la place : toutes les cartes fermées ont la même hauteur */
.review__who { display: flex; align-items: center; gap: 12px; margin-top: auto; font-size: 14px; }
.review__who > span:last-child { display: flex; flex-direction: column; min-width: 0; }
.review__who > span:last-child > * { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.review__who strong { font-weight: 600; }
.review__who span span { color: var(--muted-2); }
.review__ini { flex: none; width: 44px; height: 44px; border-radius: 99px; background: var(--accent-tint); display: flex; align-items: center; justify-content: center; font-weight: 600; color: var(--accent); }

.rc__nav { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
.rc__dots { display: flex; flex-wrap: wrap; }
/* Zone tactile de 24 px, point visuel de 8 px */
.rc__dot { display: inline-flex; align-items: center; justify-content: center; min-width: 24px; height: 24px; padding: 0 4px; border: none; background: none; }
.rc__dot::before { content: ''; width: 8px; height: 8px; border-radius: 99px; background: var(--line-3); transition: width .25s, background .25s; }
.rc__dot.is-on::before { width: 28px; background: var(--accent); }
.rc__arrows { display: flex; gap: 8px; }
.rc__btn { display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; border: 1px solid var(--line-3); border-radius: 99px; background: var(--white); color: var(--ink); transition: background .15s, color .15s, border-color .15s; }
.rc__btn:hover { background: var(--ink); border-color: var(--ink); color: var(--white); }

@media (max-width: 1024px) { .rc__track { --per: 2; } }
@media (max-width: 640px) { .rc__track { --per: 1; grid-auto-columns: 86%; } }
</style>
