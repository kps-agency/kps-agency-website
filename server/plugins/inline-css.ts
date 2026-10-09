// Pages rendues côté serveur : tout leur CSS est déjà inséré dans le HTML (features.inlineStyles dans nuxt.config.ts).
// Les balises <link rel="stylesheet"> qui redemandaient les mêmes styles bloquaient le rendu : elles sont retirées.
// Les pages sans rendu serveur (/admin, 200.html, 404.html) n'ont pas de CSS inséré et gardent leurs feuilles de style.
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html, { event }) => {
    const noSsr = getRouteRules(event).ssr === false || !!getRequestHeader(event, 'x-nuxt-no-ssr') || !!event.context.nuxt?.noSSR
    if (noSsr) return
    html.head = html.head.map(chunk => chunk.replace(/<link rel="stylesheet"[^>]*>/g, ''))
  })
})
