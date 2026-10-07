<template>
  <div class="adm-head">
    <div>
      <h1>Utilisateurs <small>{{ users.length }}</small></h1>
      <p class="adm-sub">Les comptes qui peuvent se connecter à ce tableau de bord. Un éditeur gère les contenus et les demandes ; un administrateur gère en plus les comptes.</p>
    </div>
  </div>
  <p v-if="error" class="adm-error" role="alert">{{ error }}</p>
  <p v-if="notice" class="adm-note notice" role="status">{{ notice }}</p>

  <div class="adm-stack">
    <p v-if="loading" class="adm-note">Chargement…</p>
    <div v-else class="adm-table-wrap">
      <table class="adm-table">
        <thead><tr><th scope="col">Compte</th><th scope="col">Rôle</th><th scope="col">Dernière connexion</th><th scope="col"><span class="sr-only">Actions</span></th></tr></thead>
        <tbody>
          <tr v-for="u in users" :key="u.id + refused">
            <td class="wrap"><strong>{{ u.email }}</strong> <span v-if="u.id === me" class="adm-badge adm-badge--wait">Vous</span></td>
            <td>
              <label>
                <span class="sr-only">Rôle de {{ u.email }}</span>
                <select :value="u.role" :disabled="busy || u.id === me" @change="act({ action: 'role', userId: u.id, role: ($event.target as HTMLSelectElement).value }, `Rôle de ${u.email} modifié.`)">
                  <option value="admin">Administrateur</option>
                  <option value="editor">Éditeur</option>
                </select>
              </label>
            </td>
            <td>{{ u.lastSignInAt ? fmtDateTime(u.lastSignInAt) : 'Jamais' }}</td>
            <td class="num">
              <div class="adm-row__actions actions">
                <button type="button" class="adm-btn adm-btn--sm" :disabled="busy" @click="changePassword(u)">Nouveau mot de passe</button>
                <button v-if="u.id !== me" type="button" class="adm-btn adm-btn--sm adm-btn--danger" :disabled="busy" @click="remove(u)">Retirer l’accès</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <form class="adm-card adm-form" @submit.prevent="create">
      <h2>Ajouter un utilisateur</h2>
      <div class="adm-grid adm-grid--3">
        <label class="adm-field">E-mail<input v-model="form.email" type="email" required autocomplete="off"></label>
        <label class="adm-field">Mot de passe provisoire
          <input v-model="form.password" type="text" required :minlength="MIN_PASSWORD" autocomplete="off">
          <small>{{ MIN_PASSWORD }} caractères minimum. À transmettre par un canal sûr.</small>
        </label>
        <label class="adm-field">Rôle
          <select v-model="form.role"><option value="editor">Éditeur</option><option value="admin">Administrateur</option></select>
        </label>
      </div>
      <div class="adm-form__actions">
        <button type="submit" class="adm-btn adm-btn--primary" :disabled="busy">{{ busy ? 'Enregistrement…' : 'Ajouter' }}</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
// Comptes du tableau de bord : tout passe par le serveur (server/api/admin/users.post.ts), qui détient la clé secrète de Supabase.
interface User { id: string; email: string; role: 'admin' | 'editor'; createdAt: string; lastSignInAt: string | null }

const MIN_PASSWORD = 10
const { api } = useAdmin()

const users = ref<User[]>([])
const me = ref('')
const loading = ref(true)
const busy = ref(false)
const error = ref('')
const notice = ref('')
const refused = ref(0)
const form = reactive({ email: '', password: '', role: 'editor' })

/** Envoie une action au serveur, qui renvoie la liste à jour */
async function act(body: Record<string, string>, done = '') {
  error.value = ''
  notice.value = ''
  busy.value = true
  try {
    const res = await api<{ me: string; users: User[] }>('users', body)
    users.value = res.users
    me.value = res.me
    notice.value = done
    return true
  } catch (err) {
    error.value = adminError(err)
    // Un rôle refusé par le serveur resterait affiché dans la liste déroulante : les lignes sont redessinées
    refused.value++
    return false
  } finally {
    busy.value = false
    loading.value = false
  }
}

async function create() {
  if (await act({ action: 'create', ...form }, `${form.email} peut maintenant se connecter.`)) Object.assign(form, { email: '', password: '', role: 'editor' })
}

async function changePassword(u: User) {
  const password = prompt(`Nouveau mot de passe pour ${u.email} (${MIN_PASSWORD} caractères minimum) :`)
  if (password === null) return
  await act({ action: 'password', userId: u.id, password }, `Mot de passe de ${u.email} modifié.`)
}

async function remove(u: User) {
  if (!confirm(`Retirer l’accès de ${u.email} au tableau de bord ?`)) return
  await act({ action: 'remove', userId: u.id }, `${u.email} n’a plus accès au tableau de bord.`)
}

onMounted(() => act({ action: 'list' }))
</script>

<style scoped>
.notice { margin-bottom: 16px; color: var(--green); }
.actions { justify-content: flex-end; }
select { padding: 7px 10px; border: 1px solid var(--line-2); border-radius: var(--r-sm); background: var(--deep); color: var(--ink); font: inherit; font-size: 13px; font-weight: 600; }
</style>
