// Tableau de bord : rôle du compte connecté et services externes configurés (aucune valeur secrète n'est renvoyée).
export default defineEventHandler(async (event) => {
  const user = await requireAdmin(event)
  const c = useRuntimeConfig(event)
  const env = process.env
  return {
    role: user.adminRole,
    integrations: {
      deployHook: !!c.vercelDeployHook,
      vercel: !!(c.vercelToken && c.vercelProjectId),
      analytics: !!(googleServiceAccount() && c.gaPropertyId),
      searchConsole: !!(googleServiceAccount() && c.gscSiteUrl),
      cloudinary: !!(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET),
      mail: !!(c.smtpUser && c.smtpPassword),
      calendar: c.calendarProvider === 'google' ? !!c.googleCalendarId : !!(c.caldavUrl && c.caldavPassword)
    }
  }
})
