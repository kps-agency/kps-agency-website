// Envoie les visuels de public/images/ sur Cloudinary (identifiant : kps/<dossier>/<nom>, sans extension).
// À relancer après l'ajout d'une image : node --env-file=.env scripts/cloudinary-upload.mjs [filtre]
// Variables requises : CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
import { createHash } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const { CLOUDINARY_CLOUD_NAME: cloud, CLOUDINARY_API_KEY: key, CLOUDINARY_API_SECRET: secret } = process.env
if (!cloud || !key || !secret) {
  console.error('CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET doivent être renseignés dans .env')
  process.exit(1)
}

const IMAGES = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images')
const VARIANT = /-(150|300|400|600|800)$/ // déclinaisons locales : Cloudinary redimensionne à la volée
const filter = process.argv[2] ?? ''

const files = (await readdir(IMAGES, { recursive: true, withFileTypes: true }))
  .filter(f => f.isFile() && /\.(webp|png|jpe?g|avif)$/i.test(f.name))
  .map(f => join(f.parentPath, f.name))
  .filter(f => !VARIANT.test(f.replace(/\.\w+$/, '')) && f.includes(filter))
  .sort()

let failed = 0
for (const file of files) {
  const publicId = 'kps/' + relative(IMAGES, file).replace(/\\/g, '/').replace(/\.\w+$/, '')
  const params = { overwrite: 'true', public_id: publicId, timestamp: String(Math.floor(Date.now() / 1000)) }
  const signature = createHash('sha1')
    .update(Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&') + secret)
    .digest('hex')

  const body = new FormData()
  for (const [k, v] of Object.entries(params)) body.append(k, v)
  body.append('api_key', key)
  body.append('signature', signature)
  body.append('file', new Blob([await readFile(file)]))

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: 'POST', body })
  const json = await res.json()
  if (res.ok) console.log(`${publicId}  ${json.width}×${json.height}`)
  else { failed++; console.error(`${publicId}  ÉCHEC : ${json.error?.message ?? res.status}`) }
}
console.log(`${files.length - failed}/${files.length} image(s) envoyée(s)`)
process.exit(failed ? 1 : 0)
