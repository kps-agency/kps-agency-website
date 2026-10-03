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
  spark: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7z'
}

/** Clé du service (Service.key) → nom de l'icône */
export const SERVICE_ICON: Record<string, keyof typeof ICON_PATHS> = {
  web: 'web', app: 'app', mobile: 'mobile', seo: 'seo', ads: 'ads', social: 'social', refonte: 'refresh', maintenance: 'wrench', saas: 'layers', geo: 'spark'
}

/** Tracé de l'icône d'un service ; point d'interrogation si la clé est inconnue (carte « Pas sûr de ce qu'il vous faut ? ») */
export const serviceIconPath = (key?: string) => ICON_PATHS[(key && SERVICE_ICON[key]) || 'help']
