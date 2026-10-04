// Bouton « Publier le site » de l'admin : relance un déploiement Vercel, qui relit les articles et les réalisations dans Supabase.
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const hook = String(useRuntimeConfig(event).vercelDeployHook || '')
  if (!hook) throw createError({ statusCode: 503, statusMessage: 'Deploy Hook non configuré' })
  const res = await fetch(hook, { method: 'POST' })
  if (!res.ok) throw createError({ statusCode: 502, statusMessage: 'Vercel a refusé la publication' })
  return { ok: true }
})
