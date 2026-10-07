<template>
  <div class="adm-head">
    <div>
      <h1>Réglages</h1>
      <p class="adm-sub">Les services reliés au site. Chacun se configure par des variables d’environnement dans Vercel (Settings → Environment Variables), décrites dans <code class="adm-code">.env.example</code> ; un redéploiement les prend en compte.</p>
    </div>
  </div>

  <div class="adm-stack">
    <section class="adm-card">
      <h2>Services reliés</h2>
      <p v-if="!integrations" class="adm-error" role="alert">Le serveur n’a pas répondu : vérifiez que <code class="adm-code">SUPABASE_SECRET_KEY</code> est renseignée dans Vercel.</p>
      <ul v-else class="services">
        <li v-for="s in SERVICES" :key="s.key">
          <div>
            <strong>{{ s.label }}</strong>
            <span class="adm-note">{{ s.use }}</span>
            <span v-if="!integrations[s.key]" class="adm-note">À renseigner : <code v-for="v in s.vars" :key="v" class="adm-code">{{ v }}</code></span>
          </div>
          <span class="adm-badge" :class="integrations[s.key] ? 'adm-badge--on' : 'adm-badge--warn'">{{ integrations[s.key] ? 'Relié' : 'À configurer' }}</span>
        </li>
      </ul>
    </section>

    <div class="adm-cols">
      <section class="adm-card">
        <h2>Mon compte</h2>
        <p>{{ email }} · {{ role === 'admin' ? 'Administrateur' : 'Éditeur' }}</p>
        <form class="adm-form password" @submit.prevent="changePassword">
          <label class="adm-field">Nouveau mot de passe
            <input v-model="password" type="password" required minlength="10" autocomplete="new-password">
            <small>10 caractères minimum.</small>
          </label>
          <p v-if="error" class="adm-error" role="alert">{{ error }}</p>
          <p v-if="done" class="adm-note" role="status">Mot de passe modifié.</p>
          <div class="adm-form__actions"><button type="submit" class="adm-btn" :disabled="saving">{{ saving ? 'Enregistrement…' : 'Changer mon mot de passe' }}</button></div>
        </form>
      </section>

      <section class="adm-card">
        <h2>Comment le site est mis à jour</h2>
        <ol class="how">
          <li>Vous enregistrez un contenu : il est conservé dans la base, pas encore visible en ligne.</li>
          <li>Vous cliquez sur « Publier le site » : Vercel reconstruit toutes les pages avec vos contenus.</li>
          <li>Deux à trois minutes plus tard, le site en ligne est à jour.</li>
        </ol>
        <p class="adm-note">Les demandes, les rendez-vous et les mesures sont, eux, toujours à jour : ils ne dépendent pas d’une publication.</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// Réglages : état des services externes (route /api/admin/status) et mot de passe du compte connecté
const { db, email, role, integrations } = useAdmin()

const SERVICES: { key: keyof AdminIntegrations; label: string; use: string; vars: string[] }[] = [
  { key: 'deployHook', label: 'Publication du site', use: 'Le bouton « Publier le site » relance un déploiement Vercel.', vars: ['NUXT_VERCEL_DEPLOY_HOOK'] },
  { key: 'cloudinary', label: 'Images (Cloudinary)', use: 'Envoi des visuels des articles et des réalisations.', vars: ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'] },
  { key: 'mail', label: 'E-mails', use: 'Notification de chaque demande et confirmation des rendez-vous.', vars: ['NUXT_SMTP_USER', 'NUXT_SMTP_PASSWORD'] },
  { key: 'calendar', label: 'Agenda', use: 'Créneaux proposés et rendez-vous inscrits dans l’agenda.', vars: ['NUXT_CALDAV_URL', 'NUXT_CALDAV_PASSWORD'] },
  { key: 'analytics', label: 'Google Analytics', use: 'Rubrique Audience et visites de la vue d’ensemble.', vars: ['NUXT_GOOGLE_SERVICE_ACCOUNT_EMAIL', 'NUXT_GOOGLE_PRIVATE_KEY', 'NUXT_GA_PROPERTY_ID'] },
  { key: 'searchConsole', label: 'Google Search Console', use: 'Rubrique Référencement : clics, affichages et positions.', vars: ['NUXT_GOOGLE_SERVICE_ACCOUNT_EMAIL', 'NUXT_GOOGLE_PRIVATE_KEY', 'NUXT_GSC_SITE_URL'] },
  { key: 'vercel', label: 'Suivi des déploiements', use: 'Rubrique Performances : avancement des mises en ligne.', vars: ['NUXT_VERCEL_TOKEN', 'NUXT_VERCEL_PROJECT_ID'] }
]

const password = ref('')
const saving = ref(false)
const error = ref('')
const done = ref(false)

async function changePassword() {
  error.value = ''
  done.value = false
  saving.value = true
  const { error: err } = await db().auth.updateUser({ password: password.value })
  saving.value = false
  if (err) { error.value = adminError(err); return }
  password.value = ''
  done.value = true
}
</script>

<style scoped>
.services { list-style: none; margin: 0; padding: 0; }
.services li { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 0; }
.services li + li { border-top: 1px solid var(--line); }
.services li > div { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.services code { margin-right: 6px; overflow-wrap: anywhere; }
.password { margin-top: 16px; max-width: 360px; }
.how { margin: 0 0 12px; padding-left: 20px; color: var(--muted); line-height: 1.7; }
</style>
