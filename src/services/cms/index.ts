// src/services/cms/index.ts

/**
 * Punt d'entrada únic del CMS.
 *
 * Des de la resta del projecte, importa sempre des d'aquí:
 *
 *   import { getCmsBlock, getCmsPage } from '~/services/cms'
 *
 * i així podem canviar la implementació interna (Contentful, Nuxt Content,
 * Sanity, etc.) sense tocar cap pàgina ni component.
 */

// API d'alt nivell (el que ha d'usar el frontend)
export * from './types'
export * from './blocks'
export * from './pages'

// Client de Sanity (ara en mode "futur", opcional per al frontend)
export * from './sanity'

// Més endavant, quan creem aquests fitxers, podrem afegir:
export * from './contentful'
export * from './content'
