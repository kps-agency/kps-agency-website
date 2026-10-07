interface Deployment { uid: string; state?: string; readyState?: string; created: number; ready?: number; target?: string | null; meta?: { githubCommitMessage?: string; githubCommitRef?: string } }

// Dernières mises en ligne du site (API Vercel). Configuration : NUXT_VERCEL_TOKEN, NUXT_VERCEL_PROJECT_ID et, pour une équipe, NUXT_VERCEL_TEAM_ID.
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const c = useRuntimeConfig(event)
  if (!c.vercelToken || !c.vercelProjectId) throw createError({ statusCode: 503, statusMessage: 'API Vercel non configurée' })
  const query = new URLSearchParams({ projectId: String(c.vercelProjectId), limit: '8', ...(c.vercelTeamId ? { teamId: String(c.vercelTeamId) } : {}) })
  const res = await $fetch<{ deployments: Deployment[] }>(`https://api.vercel.com/v6/deployments?${query}`, { headers: { authorization: `Bearer ${c.vercelToken}` } })
    .catch(() => { throw createError({ statusCode: 502, statusMessage: 'Vercel : lecture des déploiements impossible' }) })
  return {
    deployments: res.deployments.map(d => ({
      id: d.uid, state: d.state ?? d.readyState ?? 'UNKNOWN', createdAt: d.created, seconds: d.ready ? Math.round((d.ready - d.created) / 1000) : null,
      production: d.target === 'production', message: d.meta?.githubCommitMessage?.split('\n')[0] ?? '', branch: d.meta?.githubCommitRef ?? ''
    }))
  }
})
