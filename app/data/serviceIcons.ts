// Icônes des services (tracé unique, trait de 1,8 px sur une grille 24 × 24), partagées par le menu et les cartes de services.
export const ICON_PATHS = {
  web: 'M3 5h18v14H3zM3 9h18M7 7h.01M10 7h.01',
  app: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 16.5h7M16.5 13v7',
  mobile: 'M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM11 18h2',
  seo: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4M8 13l2-2 2 1.5 2.5-3',
  ads: 'M3 11v2a1 1 0 0 0 1 1h3l6 5V5L7 10H4a1 1 0 0 0-1 1zM17 8a5 5 0 0 1 0 8',
  social: 'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12zM9 11h.01M12 11h.01M15 11h.01',
  layers: 'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5',
  refresh: 'M3 12a9 9 0 0 1 15.5-6.3L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.3L3 16M3 21v-5h5',
  wrench: 'M14.7 6.3a4 4 0 0 0-5.2 5.2L3 18l3 3 6.5-6.5a4 4 0 0 0 5.2-5.2l-2.6 2.6-2.3-.6-.6-2.3z',
  help: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.6 9.4a2.5 2.5 0 1 1 3.7 2.2c-.8.5-1.3 1-1.3 1.9M12 17h.01',
  spark: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7z',
  // Icônes des offres (pages de service)
  store: 'M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9h16M9 20v-6h6v6',
  pen: 'M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 12h.01',
  cart: 'M3 4h2l2.4 11h10.2L20 7H6.2M9 20h.01M17 20h.01',
  users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1M17 3.5a4 4 0 0 1 0 7.5M22 21v-1a6 6 0 0 0-4-5.6',
  sliders: 'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M16 4v4M10 10v4M18 16v4',
  portal: 'M4 4h16v16H4zM12 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM7 18a5 5 0 0 1 10 0',
  zap: 'M13 2L4 14h7l-1 8 9-12h-7l1-8z',
  clipboard: 'M9 3h6v4H9zM9 5H6v16h12V5h-3M9 14l2 2 4-4',
  gauge: 'M4 18a9 9 0 1 1 16 0M12 14l4-5M12 14h.01',
  file: 'M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6',
  layout: 'M3 4h18v16H3zM3 9h18M9 9v11',
  devices: 'M3 5h13v10H3zM1 19h14M19 9h3v10h-3z',
  rocket: 'M5 15c-1.5 1.3-2 5-2 5s3.7-.5 5-2M12 15l-3-3c.9-2.9 3.4-8 11-9-1 7.6-6.1 10.1-9 11zM9 12H5l3-4h3M12 15v4l4-3v-3',
  image: 'M3 5h18v14H3zM8.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 19',
  share: 'M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.6 13.5l6.8 4M15.4 6.5l-6.8 4',
  chart: 'M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6',
  calendar: 'M4 5h16v16H4zM4 10h16M8 3v4M16 3v4',
  video: 'M3 6h12v12H3zM15 10l6-3v10l-6-3',
  palette: 'M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-.5-1.5 0-2.5 2-1 3.5-1A3.5 3.5 0 0 0 21 12a9 9 0 0 0-9-9zM7.5 12h.01M9.5 8h.01M14.5 8h.01',
  swap: 'M4 8h16M16 4l4 4-4 4M20 16H4M8 12l-4 4 4 4',
  download: 'M12 3v12M7 10l5 5 5-5M4 21h16',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM9 12l2 2 4-4',
  card: 'M3 6h18v12H3zM3 10h18M7 15h3',
  plug: 'M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0V8zM12 18v4',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  quote: 'M4 5h16v11H9l-5 4V5zM8 9h8M8 12h5',
  code: 'M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16',
  star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z'
}

/** Clé du service (Service.key) → nom de l'icône */
export const SERVICE_ICON: Record<string, keyof typeof ICON_PATHS> = {
  web: 'web', app: 'app', mobile: 'mobile', seo: 'seo', ads: 'ads', social: 'social', refonte: 'refresh', maintenance: 'wrench', saas: 'layers', geo: 'spark'
}

/** Tracé de l'icône d'un service ; point d'interrogation si la clé est inconnue (carte « Pas sûr de ce qu'il vous faut ? ») */
export const serviceIconPath = (key?: string) => ICON_PATHS[(key && SERVICE_ICON[key]) || 'help']

/** Clé du service → icône de chacune de ses quatre offres, dans l'ordre d'affichage */
export const OFFER_ICONS: Record<string, (keyof typeof ICON_PATHS)[]> = {
  web: ['store', 'pen', 'target', 'cart'],
  app: ['users', 'sliders', 'portal', 'zap'],
  seo: ['clipboard', 'gauge', 'file', 'target', 'spark'],
  mobile: ['layout', 'mobile', 'devices', 'rocket'],
  ads: ['target', 'image', 'share', 'chart'],
  social: ['calendar', 'image', 'video', 'users'],
  refonte: ['palette', 'refresh', 'swap', 'seo'],
  maintenance: ['download', 'shield', 'wrench', 'gauge'],
  saas: ['rocket', 'layers', 'card', 'plug'],
  geo: ['eye', 'quote', 'code', 'star']
}

/** Tracé de l'icône d'une offre ; à défaut, l'icône du service */
export const offerIconPath = (serviceKey: string, index: number) => {
  const name = OFFER_ICONS[serviceKey]?.[index]
  return name ? ICON_PATHS[name] : serviceIconPath(serviceKey)
}
