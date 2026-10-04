import { createHash } from 'node:crypto'

// Signe un envoi d'image vers Cloudinary : le navigateur envoie ensuite le fichier directement à Cloudinary, sans passer par le serveur.
// Identifiants limités à kps/blog/… et kps/realisations/… (mêmes identifiants que scripts/cloudinary-upload.mjs).
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const { CLOUDINARY_CLOUD_NAME: cloud, CLOUDINARY_API_KEY: key, CLOUDINARY_API_SECRET: secret } = process.env
  if (!cloud || !key || !secret) throw createError({ statusCode: 503, statusMessage: 'Cloudinary non configuré' })

  const body = await readBody<{ folder?: string; name?: string }>(event)
  if (!['blog', 'realisations'].includes(body?.folder ?? '') || !/^[a-z0-9-]{1,80}$/.test(body?.name ?? '')) {
    throw createError({ statusCode: 400, statusMessage: 'Nom d’image invalide' })
  }
  // invalidate : une image remplacée est renouvelée sur le CDN
  const params: Record<string, string> = { invalidate: 'true', overwrite: 'true', public_id: `kps/${body.folder}/${body.name}`, timestamp: String(Math.floor(Date.now() / 1000)) }
  const signature = createHash('sha1').update(Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&') + secret).digest('hex')
  return { url: `https://api.cloudinary.com/v1_1/${cloud}/image/upload`, fields: { ...params, api_key: key, signature } }
})
