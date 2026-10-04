<template>
  <div class="imgf">
    <div class="imgf__preview">
      <img v-if="preview || model" :src="preview || image(model!)" alt="">
      <span v-else>Aucune image</span>
    </div>
    <div class="imgf__side">
      <label class="adm-btn adm-btn--sm" :class="{ 'is-off': busy || !name }">
        {{ busy ? 'Envoi…' : model ? 'Remplacer l’image' : 'Choisir une image' }}
        <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" :disabled="busy || !name" @change="onFile">
      </label>
      <button v-if="model && removable" type="button" class="adm-btn adm-btn--sm adm-btn--danger" @click="model = null; preview = ''">Retirer</button>
      <p class="adm-note">{{ name ? 'Format 16:9 conseillé, 1600 px de large. JPG, PNG, WebP ou AVIF, 10 Mo maximum.' : 'Renseignez d’abord le slug.' }}</p>
      <p v-if="error" class="adm-error" role="alert">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Image envoyée sur Cloudinary sous kps/<dossier>/<nom> ; la valeur enregistrée est le chemin /images/<dossier>/<nom>.webp
const props = defineProps<{ folder: 'blog' | 'realisations'; name: string; removable?: boolean }>()
const model = defineModel<string | null>()
const { uploadImage } = useAdmin()
const { image } = useCloudImage()

const busy = ref(false)
const error = ref('')
// Aperçu local : après un remplacement, l'adresse Cloudinary ne change pas et resterait en cache
const preview = ref('')

async function onFile(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  error.value = ''
  if (file.size > 10 * 1024 * 1024) { error.value = 'Image trop lourde (10 Mo maximum).'; return }
  busy.value = true
  try {
    model.value = await uploadImage(file, props.folder, props.name)
    preview.value = URL.createObjectURL(file)
  } catch (err) {
    error.value = adminError(err)
  } finally {
    busy.value = false
  }
}
</script>

<style scoped>
.imgf { display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap; }
.imgf__preview { width: 240px; max-width: 100%; aspect-ratio: 16 / 9; border-radius: var(--r-sm); border: 1px solid var(--line-2); background: var(--deep); overflow: hidden; display: grid; place-items: center; color: var(--muted-2); font-size: 13px; }
.imgf__preview img { width: 100%; height: 100%; object-fit: cover; object-position: top center; }
.imgf__side { display: flex; flex-direction: column; gap: 10px; align-items: flex-start; flex: 1; min-width: 200px; }
.imgf input[type="file"] { position: absolute; width: 1px; height: 1px; opacity: 0; }
.imgf label:focus-within { outline: 2px solid var(--accent); outline-offset: 1px; }
.is-off { opacity: .5; cursor: not-allowed; }
</style>
