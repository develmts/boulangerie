// src/services/cms/pages.ts
import type { Locale } from '~/services/shopify'
import type { CmsBlock, CmsPage } from '~/services/cms'
import { getCmsBlock } from './blocks'

// Moved to types.ts
// export type CmsPage = {
//   slug: string
//   locale: Locale
//   title: string
//   body: string
// }

/**
 * Versió "pàgina" del CMS.
 * De moment, simplement reusa getCmsBlock(slug, locale).
 * Quan tinguis Sanity real o Nuxt Content estructurat amb "pages",
 * aquí hi podem fer una query específica si cal.
 */
export async function getCmsPage(
  slug: string,
  locale: Locale,
): Promise<CmsPage | null> {
  const block: CmsBlock | null = await getCmsBlock(slug, locale)
  if (!block) return null

  return {
    slug,
    locale,
    title: block.title,
    body: block.body,
    nuxtContentDoc: block.nuxtContentDoc
  }
}
