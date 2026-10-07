<template>
  <div class="adm">
    <slot />
  </div>
</template>

<style>
/* Espace d'administration : styles communs aux écrans et formulaires (app/pages/admin.vue, app/components/admin) */
/* --amber : état « à surveiller » des mesures (les états bon et mauvais reprennent --green et --red du site) */
.adm { --amber: #FBBF24; min-height: 100vh; background: var(--bg); color: var(--ink); font-size: 15px; }
.adm h1, .adm h2 { font-family: var(--font-display); font-weight: 900; letter-spacing: -0.4px; margin: 0; }
.adm h1 { font-size: 24px; }
.adm h2 { font-size: 20px; }

.adm-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 16px; border-radius: var(--r-md); border: 1px solid var(--line-2); background: var(--surface); color: var(--ink); font: inherit; font-weight: 600; font-size: 14px; cursor: pointer; white-space: nowrap; }
.adm-btn:hover { background: var(--surface-hover); }
.adm-btn:disabled { opacity: .5; cursor: not-allowed; }
.adm-btn--primary { background: var(--grad-neon); border-color: transparent; color: var(--white); }
.adm-btn--primary:hover { background: var(--grad-neon-hover); }
.adm-btn--danger { color: var(--red); }
.adm-btn--sm { padding: 6px 10px; font-size: 13px; border-radius: var(--r-sm); }

.adm-field { display: flex; flex-direction: column; gap: 6px; font-size: 13px; font-weight: 600; color: var(--muted); min-width: 0; }
.adm-field input, .adm-field select, .adm-field textarea { padding: 10px 12px; border: 1px solid var(--line-2); border-radius: var(--r-sm); background: var(--deep); color: var(--ink); font: inherit; font-size: 15px; font-weight: 400; width: 100%; }
.adm-field input:focus-visible, .adm-field select:focus-visible, .adm-field textarea:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
.adm-field textarea { resize: vertical; line-height: 1.5; }
.adm-field small { font-weight: 400; color: var(--muted-2); }
.adm-check { display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; }
.adm-check input { width: 18px; height: 18px; }
.adm-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.adm-grid--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.adm-span { grid-column: 1 / -1; }

.adm-card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-lg); padding: 24px; }
.adm-error { color: var(--red); font-size: 14px; margin: 0; }
.adm-note { color: var(--muted-2); font-size: 14px; margin: 0; }
.adm-badge { display: inline-block; padding: 3px 9px; border-radius: var(--r-pill); font-size: 12px; font-weight: 700; background: var(--line); color: var(--muted); white-space: nowrap; }
.adm-badge--on { background: rgba(34, 197, 94, .15); color: var(--green); }
.adm-badge--wait { background: var(--accent-soft); color: var(--accent-light); }
.adm-badge--off { background: rgba(248, 113, 113, .12); color: var(--red); }
.adm-badge--warn { background: rgba(251, 191, 36, .14); color: var(--amber); }

/* Écrans du tableau de bord (app/components/admin/section) */
.adm-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 24px; }
.adm-head small { font-size: 15px; font-weight: 600; color: var(--muted-2); margin-left: 6px; }
.adm-head__actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.adm-sub { margin: 6px 0 0; color: var(--muted-2); font-size: 14px; max-width: 70ch; }
.adm-stack { display: flex; flex-direction: column; gap: 20px; }
/* min-width: 0 : un tableau large défile dans son cadre au lieu d’élargir la page */
.adm-stack > *, .adm-cols > * { min-width: 0; }
.adm-kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; }
.adm-cols { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; align-items: start; }
.adm-cols--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.adm-card > h2 { font-size: 16px; font-weight: 700; letter-spacing: 0; margin-bottom: 16px; }
.adm-card > h2 small { font-weight: 400; color: var(--muted-2); font-size: 13px; margin-left: 6px; }

/* Sélecteur à segments (période, filtre de statut, langue) */
.adm-seg { display: inline-flex; flex-wrap: wrap; border: 1px solid var(--line-2); border-radius: var(--r-sm); overflow: hidden; }
.adm-seg button { padding: 7px 14px; background: none; border: 0; color: var(--muted); font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; }
.adm-seg button + button { border-left: 1px solid var(--line-2); }
.adm-seg button:hover { color: var(--ink); }
.adm-seg button.is-on { background: var(--accent-soft); color: var(--accent-light); }
.adm-search { padding: 8px 12px; border: 1px solid var(--line-2); border-radius: var(--r-sm); background: var(--deep); color: var(--ink); font: inherit; font-size: 14px; min-width: 220px; }

/* Listes de contenus */
.adm-list { list-style: none; margin: 0; padding: 0; border: 1px solid var(--line); border-radius: var(--r-lg); background: var(--surface); overflow: hidden; }
.adm-row { display: flex; align-items: center; gap: 14px; padding: 14px 18px; flex-wrap: wrap; }
.adm-row + .adm-row { border-top: 1px solid var(--line); }
.adm-row__thumb { width: 96px; height: 54px; object-fit: cover; object-position: top center; border-radius: 6px; flex-shrink: 0; }
.adm-row__main { flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 4px; overflow-wrap: anywhere; }
.adm-row__title { padding: 0; border: 0; background: none; color: var(--ink); font: inherit; font-weight: 700; font-size: 16px; text-align: left; cursor: pointer; }
.adm-row__title:hover { color: var(--accent-light); }
.adm-row__actions { display: flex; gap: 6px; flex-wrap: wrap; }

/* Tableaux de données */
/* position: relative : les libellés masqués (.sr-only) des cellules restent dans le cadre défilant */
.adm-table-wrap { position: relative; overflow-x: auto; border: 1px solid var(--line); border-radius: var(--r-lg); background: var(--surface); }
.adm-card .adm-table-wrap { border: 0; border-radius: 0; margin: 0 -24px -8px; }
.adm-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.adm-table th { padding: 12px 18px; text-align: left; font-size: 12px; font-weight: 700; color: var(--muted-2); text-transform: uppercase; letter-spacing: .5px; white-space: nowrap; border-bottom: 1px solid var(--line); }
.adm-table td { padding: 12px 18px; border-top: 1px solid var(--line); vertical-align: middle; }
.adm-table tr:first-child td { border-top: 0; }
.adm-table .num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
.adm-table td.wrap { overflow-wrap: anywhere; min-width: 180px; }
.adm-link { color: var(--accent-light); text-decoration: underline; text-underline-offset: 3px; }

/* Encadré « à configurer » d'une mesure qui dépend d'un service externe */
.adm-setup { border-style: dashed; display: flex; flex-direction: column; gap: 10px; }
.adm-setup h2 { font-size: 16px; }
.adm-setup ol { margin: 0; padding-left: 20px; color: var(--muted); font-size: 14px; line-height: 1.7; }
.adm-setup code, .adm-code { background: var(--line); padding: 1px 6px; border-radius: 4px; font-size: 13px; }

.adm-form { display: flex; flex-direction: column; gap: 20px; }
/* Le sélecteur de langue ne s’étire pas sur toute la largeur du formulaire */
.adm-form > .adm-seg { align-self: flex-start; }
.adm-form__head { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.adm-form__actions { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.adm-form fieldset { border: 1px solid var(--line); border-radius: var(--r-md); padding: 16px; margin: 0; min-width: 0; }
.adm-form legend { padding: 0 8px; font-size: 13px; font-weight: 700; color: var(--muted-2); }

@media (max-width: 720px) {
  .adm-grid, .adm-grid--3 { grid-template-columns: minmax(0, 1fr); }
  .adm-card { padding: 16px; }
  .adm-cols, .adm-cols--3 { grid-template-columns: minmax(0, 1fr); }
  .adm-card .adm-table-wrap { margin-inline: -16px; }
  .adm-search { min-width: 0; width: 100%; }
}
</style>
