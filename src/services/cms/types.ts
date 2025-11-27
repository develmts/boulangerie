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

  /**
   * HTML del cos quan ve de CMS que retornen HTML (Contentful, Sanity convertit)
   */
  body: string

  /**
   * Tipus de contingut ric:
   * - 'html'      → fem servir body/html
   * - 'nuxt-doc'  → fem servir nuxtContentDoc
   * - 'sanity-pt' → fem servir sanityPortableText
   */
  // kind?: RichContentKind

  // HTML explícit
  // html?: string

  // Nuxt Content AST/document
  nuxtContentDoc?: any

  // Sanity Portable Text raw blocks
  // sanityPortableText?: any

  // Qualsevol extra futur
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

  // Igual que CmsBlock, però a nivell de pàgina
  nuxtContentDoc?: any
}