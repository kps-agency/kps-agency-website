import { createSign } from 'node:crypto'

// Jeton d'accès Google pour le compte de service du site (JWT RS256, sans dépendance externe) : Google Analytics et Search Console.
// Même compte que l'agenda (NUXT_GOOGLE_SERVICE_ACCOUNT_EMAIL, NUXT_GOOGLE_PRIVATE_KEY) ; il doit être ajouté comme lecteur
// sur la propriété Google Analytics et sur la propriété Search Console.
const cache = new Map<string, { token: string; exp: number }>()
const b64url = (s: string) => Buffer.from(s).toString('base64url')

export function googleServiceAccount() {
  const c = useRuntimeConfig()
  const email = String(c.googleServiceAccountEmail || '')
  const privateKey = String(c.googlePrivateKey || '').replace(/\n/g, '\n')
  return email && privateKey ? { email, privateKey } : null
}

export async function googleToken(scope: string) {
  const account = googleServiceAccount()
  if (!account) throw createError({ statusCode: 503, statusMessage: 'Compte de service Google non configuré' })
  const hit = cache.get(scope)
  if (hit && hit.exp > Date.now() + 60_000) return hit.token
  const iat = Math.floor(Date.now() / 1000)
  const unsigned = `${b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${b64url(JSON.stringify({ iss: account.email, scope, aud: 'https://oauth2.googleapis.com/token', iat, exp: iat + 3600 }))}`
  const signature = createSign('RSA-SHA256').update(unsigned).sign(account.privateKey).toString('base64url')
  const res = await $fetch<{ access_token: string; expires_in: number }>('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${signature}` }).toString()
  })
  cache.set(scope, { token: res.access_token, exp: Date.now() + res.expires_in * 1000 })
  return res.access_token
}

/** Erreur d'une API Google transformée en message lisible dans l'admin */
export function googleError(err: unknown, api: string) {
  const e = err as { statusCode?: number; data?: { error?: { message?: string } }; message?: string }
  if (e?.statusCode === 503) return err as Error
  const denied = e?.statusCode === 403
  return createError({
    statusCode: 502,
    statusMessage: denied ? `${api} : le compte de service n’a pas accès à la propriété` : `${api} : ${(e?.data?.error?.message || e?.message || 'erreur').slice(0, 160)}`
  })
}

/** Période demandée par l'admin : 7, 28 ou 90 jours (28 par défaut) */
export const periodDays = (v: unknown) => ([7, 28, 90].includes(Number(v)) ? Number(v) : 28)
/** Jour AAAA-MM-JJ, n jours avant aujourd'hui */
export const dayAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10)
