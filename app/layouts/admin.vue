<template>
  <div class="adm">
    <slot />
  </div>
</template>

<style>
/* Espace d'administration : styles communs aux écrans et formulaires (app/pages/admin.vue, app/components/admin) */
.adm { min-height: 100vh; background: var(--bg); color: var(--ink); font-size: 15px; }
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

.adm-form { display: flex; flex-direction: column; gap: 20px; }
.adm-form__head { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.adm-form__actions { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.adm-form fieldset { border: 1px solid var(--line); border-radius: var(--r-md); padding: 16px; margin: 0; min-width: 0; }
.adm-form legend { padding: 0 8px; font-size: 13px; font-weight: 700; color: var(--muted-2); }

@media (max-width: 720px) {
  .adm-grid, .adm-grid--3 { grid-template-columns: minmax(0, 1fr); }
  .adm-card { padding: 16px; }
}
</style>
