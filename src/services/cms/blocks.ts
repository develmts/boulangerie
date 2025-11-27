// src/services/cms/blocks.ts
// import { useRuntimeConfig } from 'nuxt/app'
import type { Locale } from '~/services/shopify'
import type { CmsBlock,ContentBlock } from '~/services/cms'
// import { MOCK_CONTENT, LEGAL_MOCK_CONTENT } from './contentful' 
import { getContentBySlug } from './contentful'
import { contentGetBlock } from './content'
import { sanityFetch } from './sanity'

// mogut a types.ts
// export type CmsBlock = {
//   slug: string
//   title: string
//   body: string
// }

type CmsSource = 'contentful' | 'sanity' | 'content'

function resolveCmsSource(): CmsSource {
  const env = process.env.NUXT_PUBLIC_CMS_SOURCE || 'content'

  if (env === 'sanity' || env === 'content' || env === 'contentful') {
    return env
  }

  // Valor per defecte si no hi ha res configurat o és incorrecte
  return 'contentful'
}

const CMS_SOURCE: CmsSource = resolveCmsSource()

/**
 * BACKEND: Contentful (ara mateix: mocks TS que tens a services/contentful.ts)
 */
async function getBlockFromContentful(
  slug: string,
  locale: Locale,
): Promise<CmsBlock | null> {
  // // Simulem una mica de latència, com feies abans amb contentful.ts
  // await new Promise(resolve => setTimeout(resolve, 50))

  // const legalBySlug = LEGAL_MOCK_CONTENT[slug]
  // if (legalBySlug) {
  //   const localized: ContentBlock | undefined =
  //     legalBySlug[locale] ?? legalBySlug['ca']

  //   if (localized) {
  //     return {
  //       slug,
  //       title: localized.title,
  //       body: localized.body ?? '',
  //     }
  //   }
  // }

  // const generalBySlug = MOCK_CONTENT[slug]
  // if (generalBySlug) {
  //   const localized: ContentBlock | undefined =
  //     generalBySlug[locale] ?? generalBySlug['ca']

  //   if (localized) {
  //     return {
  //       slug,
  //       title: localized.title,
  //       body: localized.body ?? '',
  //     }
  //   }
  // }
  return getContentBySlug(slug, locale)
  
  // console.warn(
  //   `[cms/contentful] cap bloc trobat per slug="${slug}", locale="${locale}".`,
  // )
  // return null
}

/**
 * BACKEND: Nuxt Content (stub actual → contentGetBlock() sempre retorna null)
 */
async function getBlockFromNuxtContent(
  slug: string,
  locale: Locale,
): Promise<CmsBlock | null> {
  const block = await contentGetBlock(slug, locale)
  if (!block) 
    return null
  return block
}

/**
 * BACKEND: Sanity (futur).
 * Ara mateix: warning + fallback a Contentful mocks.
 * El dia que tinguis esquemes i dades a Sanity, aquí hi posarem sanityFetch()
 * amb una query GROQ.
 */
async function getBlockFromSanity(
  slug: string,
  locale: Locale,
): Promise<CmsBlock | null> {
  console.warn(
    `[cms/sanity] getBlockFromSanity("${slug}", "${locale}") not implemented.`,
  )

  // Futur: aquí hi anirà alguna cosa tipus:
  // const data = await sanityFetch<YourType>(`*[_type=="block" && slug==$slug && language==$locale][0]`, { slug, locale })
  // if (!data) return null
  // return { slug, title: data.title, body: data.bodyHtml }

  return getBlockFromContentful(slug, locale)
}

/**
 * API pública: l’única funció que ha de fer servir el frontend per blocs.
 */
export async function getCmsBlock(
  slug: string,
  locale: Locale,
): Promise<CmsBlock | null> {

  const CMS_SOURCE= resolveCmsSource();

  switch (CMS_SOURCE) {
    case 'content':
      return getBlockFromNuxtContent(slug, locale)
    case 'sanity':
      return getBlockFromSanity(slug, locale)
    case 'contentful':
    default:
      return getBlockFromContentful(slug, locale)
  }
}
