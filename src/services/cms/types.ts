// src/services/cms/types.ts
import type { Locale } from '~/services/shopify'

export type RichContentKind = 'html' | 'nuxt-doc' | 'sanity-pt'


/**
 * Forma localitzada i simple per als mocks (Contentful TS storage).
 * NO porta slug ni metadades.
 */
export type StoredLocalizedBlock = {
  title: string
  body: string
}


/**
 * Tipus unificat per a qualsevol CMS (Contentful, Nuxt Content, Sanity).
 * Sempre hem d'entregar aquest format cap al frontend.
 */
export type ContentBlock = {
  slug: string
  title: string
  body: string

  // Nuxt Content AST/document
  nuxtContentDoc?: any

  // Futurs formats Sanity / HTML / etc.
  // [key: string]: any
}


export type CmsBlock = {
  slug: string
  title: string
  body: string
  nuxtContentDoc?: any
}

export type CmsPage = {
  slug: string
  locale: Locale
  title: string
  body: string
  nuxtContentDoc?: any
}


/* -------------------------------------------------------------------------- */
/*                               NOUS TIPUS CMS                               */
/* -------------------------------------------------------------------------- */

/**
 * Identificador genèric de col·lecció. Oberta: blog, news, faq, legal...
 */
export type CmsCollectionKey = string

/**
 * Direcció d’ordenació
 */
export type CmsListSortDirection = 'asc' | 'desc'

/**
 * Definició d’ordenació d’una llista CMS
 */
export type CmsListSort = {
  field: string
  direction: CmsListSortDirection
}

/**
 * Query unificada (UN SOL PARÀMETRE) per a llistes CMS.
 */
export type CmsListQuery = {
  collection: CmsCollectionKey
  locale: Locale
  sort?: CmsListSort | null
  limit?: number | null
  offset?: number | null
  filters?: Record<string, unknown> | null
}

/**
 * Forma normalitzada que el frontend rebrà per cada element de llista.
 */
export type CmsListItem<TDoc = unknown> = {
  id: string
  slug: string
  title?: string
  excerpt?: string
  date?: string | Date
  path?: string
  doc?: TDoc              // Document cru del backend (Nuxt Content, Sanity, etc.)
}

/**
 * Tipus de backend CMS disponible.
 * Aconsellable tenir-lo present en molts llocs.
 */
export type CmsSource = 'contentful' | 'sanity' | 'content'
