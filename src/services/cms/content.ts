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
import type {
  ContentBlock,
  CmsBlock,
  CmsPage,
  // 🔹 nous tipus per a llistes CMS
  CmsListQuery,
  CmsListItem
} from './types'

// @ts-expect-error queryCollection is provided by Nuxt auto-imports
import { queryCollection } from '#imports'

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

  console.log('[contentBlock] start', { slug, locale, primaryPath })
  // Simulate Latency
  await new Promise(resolve => setTimeout(resolve, 200))

  let doc: any | null = null

  try {
    doc = await queryCollection('content')
      .where('path', '=', primaryPath)
      .first()
  } catch (err) {
    console.warn('[cms/content] error buscant a', primaryPath, err)
  }

  // Fallback a 'ca' si no trobem el locale específic
  if (!doc && locale !== 'ca') {
    const fallbackPath = `/ca/${slug}`
    try {
      doc = await queryCollection('content')
        .where('path', '=', fallbackPath)
        .first()
    } catch (err) {
      console.warn('[cms/content] error buscant a', fallbackPath, err)
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
    body: '',
    nuxtContentDoc: anyDoc,
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


/* -------------------------------------------------------------------------- */
/*            NOVA API: llistes CMS des de Nuxt Content (backend "content")   */
/* -------------------------------------------------------------------------- */

/**
 * Backend Nuxt Content per a l’API genèrica de llistes CMS.
 * Rep sempre UN sol objecte CmsListQuery com a paràmetre.
 *
 * De moment implementem:
 *   - collection: "blog"
 *
 * Futur:
 *   - altres col·leccions basades en Nuxt Content (faq, news, etc.)
 */
export async function contentListEntries(
  params: CmsListQuery
): Promise<CmsListItem[]> {
  const { collection, locale, limit, offset, sort } = params

  type GenericDoc = any

  let q = queryCollection(collection) as any as {
    where: (...args: any[]) => any
    order: (field: string, direction: 'ASC' | 'DESC') => any
    limit: (n: number) => any
    skip: (n: number) => any
    all: <T = GenericDoc>() => Promise<T[]>
  }

  // Filtre genèric per idioma: tots els docs amb path que comenci per "/<locale>/"
  q = q.where('path', 'LIKE', `/${locale}/%`)

  // Ordenació genèrica
  if (sort) {
    const dir = sort.direction === 'asc' ? 'ASC' : 'DESC'
    q = q.order(sort.field, dir)
  }

  if (typeof limit === 'number' && Number.isFinite(limit)) {
    q = q.limit(limit)
  }

  if (typeof offset === 'number' && Number.isFinite(offset)) {
    q = q.skip(offset)
  }

  const docs = await q.all<GenericDoc>()

  return docs.map<CmsListItem>((doc) => {
    const path: string | undefined = doc.path
    const slug =
      path?.split('/').filter(Boolean).pop() ??
      (doc.slug as string | undefined) ??
      String(doc.id ?? '')

    return {
      id: String(doc.id ?? slug),
      slug,
      title: doc.title,
      excerpt: (doc as any).excerpt,
      date: (doc as any).date,
      path,
      doc,
      readingTime: (doc as any).readingTime
    }
  })
}
