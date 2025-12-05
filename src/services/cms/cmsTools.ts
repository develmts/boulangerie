// src/services/cms/cmsTools.ts
export type CmsSource = 'contentful' | 'sanity' | 'content'

export function resolveCmsSource(): CmsSource {
  const env = process.env.NUXT_PUBLIC_CMS_SOURCE || 'content'

  if (env === 'sanity' || env === 'content' || env === 'contentful') {
    return env
  }

  // Valor per defecte si no hi ha res configurat o és incorrecte
  return 'contentful'
}

export function logCmsSource(prefix: string, source: CmsSource) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[cms] [${prefix}] using source="${source}"`)
  }
}
