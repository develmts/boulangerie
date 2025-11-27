// src/services/cms/content.ts
//
// Connector per a Nuxt Content (@nuxt/content@2.8.5)
// Llegeix blocs i pàgines des de /content/<locale>/<slug>.md
//
// Exemples d'estructura:
//
// /content
//   /ca
//     avis-legal.md        # slug = "avis-legal"
//     about.md             # slug = "about"
//   /es
//     aviso-legal.md
//   /en
//     legal-notice.md
//
// Cada .md amb com a mínim:
//
// ---
// title: Títol visible
// ---
//
// Cos de la pàgina…

// import { serverQueryContent as queryContent  } from '#content/server'
import type { Locale } from '~/services/shopify'
import type { ContentBlock, CmsBlock, CmsPage} from './types'

/**
 * Llegeix un bloc de contingut (hero, seccions, fragments) des de Nuxt Content.
 *
 * Path esperat:
 *   /content/<locale>/<slug>.md
 *
 * Exemple:
 *   contentGetBlock('avis-legal', 'ca')
 *   → busca /content/ca/avis-legal.md
 *
 * Fallback:
 *   - Si no troba el locale demanat i no és 'ca',
 *     torna a provar amb 'ca' com a locale de reserva.
 */
export async function contentGetBlock(
  slug: string,
  locale: Locale,
): Promise<CmsBlock | null> {
  const primaryPath = `/${locale}/${slug}`

  // Simulate Latency
  await new Promise(resolve => setTimeout(resolve, 200))

  let doc
  try {
    doc = await queryContent(primaryPath)
      .findOne()
  }catch(err){
    console.warn('cms/content] error buscant a', primaryPath,err)
  }

  // Fallback a 'ca' si no trobem el locale específic
  if (!doc && locale !== 'ca') {
    const fallbackPath = `/ca/${slug}`
    try {
      doc = await queryContent(fallbackPath)
        .findOne()
    }catch(err){
      console.warn('cms/content] error buscant a', fallbackPath,err)
    }

    if (!doc) {
      console.warn(
        `[cms/content] contentGetBlock: cap bloc trobat ni per "${primaryPath}" ni pel fallback "${fallbackPath}".`,
      )
      return null
    }
  }

  if (!doc) {
    console.warn(
      `[cms/content] contentGetBlock: cap bloc trobat per path="${primaryPath}".`,
    )
    return null
  }

  const anyDoc = doc as any

  const block: ContentBlock = {
    slug,
    title: anyDoc.title ?? slug,
    // NO intentem HTML aquí → el cos es renderitzarà amb <ContentRenderer>
    body: '',
    nuxtContentDoc: anyDoc
  }

  return block
}


/**
 * Llegeix una pàgina completa (about, legal, etc.) des de Nuxt Content.
 *
 * Ara mateix és un "intermediari": reutilitza la lògica de contentGetBlock,
 * perquè l'estructura de paths és la mateixa:
 *
 *   /content/<locale>/<slug>.md
 */
export async function contentGetPage(
  slug: string,
  locale: Locale,
): Promise<CmsPage | null> {
  const block = await contentGetBlock(slug, locale)
  if (!block) return null

  const page: CmsPage = {
    slug,
    locale,
    title: block.title,
    body: block.body,
    nuxtContentDoc: block.nuxtContentDoc, // 👈 molt important
  }

  return page
}
