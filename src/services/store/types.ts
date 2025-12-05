// src/services/store/types.ts

export type Locale = 'ca' | 'es' | 'en'

export interface ProductImage {
  url: string
  altText?: string | null
  width?: number | null
  height?: number | null
}

/**
 * Model “baix nivell” comú per a tots els backends de botiga.
 */
export interface StoreProduct {
  id: string
  handle: string
  title: string
  description: string
  featuredImage: ProductImage | null
  images: ProductImage[]
  priceMin: number
  priceMax: number
  availableForSale: boolean
  category: string
  isFeatured: boolean
}

/**
 * Model simplificat per a la UI (targetes, llistats).
 */
export type StorefrontProduct = {
  id: string
  handle: string
  title: string
  description: string
  price: string
  imageUrl: string
  badge?: string
  isFeatured?: boolean
  category?: string
}

/* ------------------------------ Cart ---------------------------------- */

export interface CartLineInput {
  productId: string
  quantity: number
}

export interface CartLine {
  id: string
  productId: string
  quantity: number
}

export interface Cart {
  id: string
  lines: CartLine[]
  totalQuantity: number
}

/* ------------------------------ Usuaris -------------------------------- */

export interface StoreUser {
  id: string
  email: string
  name?: string | null
  locale?: Locale
}

/**
 * Sessió d’usuari de botiga (local o Shopify).
 * El token pot ser un JWT, un id de sessió, etc.
 */
export interface StoreSession {
  user: StoreUser
  token: string
}
