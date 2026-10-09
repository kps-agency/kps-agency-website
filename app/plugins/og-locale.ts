// Les langues du site sont déclarées sans région (« fr », « en ») pour que hreflang et <html lang> couvrent tous les francophones
// et tous les anglophones. Open Graph attend en revanche un code avec territoire : og:locale est donc réécrit en fr_FR / en_GB.
const OG_LOCALE: Record<string, string> = { fr: 'fr_FR', en: 'en_GB' }

export default defineNuxtPlugin(() => {
  injectHead().hooks.hook('tags:resolve', (ctx) => {
    for (const tag of ctx.tags) {
      const property = tag.tag === 'meta' ? String(tag.props.property ?? '') : ''
      if (property.startsWith('og:locale') && OG_LOCALE[tag.props.content as string]) tag.props.content = OG_LOCALE[tag.props.content as string]!
    }
  })
})
