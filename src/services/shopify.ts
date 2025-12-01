// src/services/shopify.ts
import { MOCK_LANG, MOCK_PRODUCTS_BASE } from '~/mock-data/shopifyProducts'

/* --------------------------------------------------------------------------
 * SHOPIFY MODE (mock vs real)
 * -------------------------------------------------------------------------- */

const SHOPIFY_MODE: 'mock' | 'real' =
  process.env.SHOPIFY_MODE == 'real' ? 'real' : 'mock'

/* --------------------------------------------------------------------------
 * LOCALES
 * -------------------------------------------------------------------------- */

export type Locale = 'ca' | 'es' | 'en'

/* --------------------------------------------------------------------------
 * SHOPIFY PURE MODEL (Storefront API PRODUCT)
 * -------------------------------------------------------------------------- */

/**
 * Model "baix nivell" proper al que retornaria Shopify Storefront.
 * Aquest és el tipus canònic intern de producte.
 */
export interface ProductImage {
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage: ProductImage | null;
  images: ProductImage[];
  priceMin: number;
  priceMax: number;
  availableForSale: boolean;
  category: string;
  isFeatured: boolean;
}

/**
 * Model simplificat per a la UI (llistes, targetes, etc.)
 * Deriva de ShopifyProduct via mapping (veure listStorefrontProducts).
 */
export type StorefrontProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  badge?: string;
  isFeatured?: boolean;
  category?: string;
};

/* --------------------------------------------------------------------------
 * MOCK PRODUCT DATA (Shopify Pure) — LOCALIZATION
 * -------------------------------------------------------------------------- */

function getMockProducts(locale: Locale): ShopifyProduct[] {
  return MOCK_PRODUCTS_BASE.map((p) => {
    const perHandle = MOCK_LANG[p.handle]
    const fallback = perHandle?.ca

    const localized =
      perHandle?.[locale] ??
      fallback ?? {
        title: p.title,
        description: p.description
      }

    return {
      ...p,
      title: localized.title,
      description: localized.description
    }
  })
}

/* --------------------------------------------------------------------------
 * PRODUCT FUNCTIONS (MOCK)
 * -------------------------------------------------------------------------- */

async function MockGetProductByHandle(
  handle: string,
  locale: Locale
): Promise<ShopifyProduct | null> {
  await new Promise((r) => setTimeout(r, 80))
  return getMockProducts(locale).find((p) => p.handle === handle) ?? null
}

async function MockGetAllProducts(
  limit = 20,
  locale: Locale
): Promise<ShopifyProduct[]> {
  await new Promise((r) => setTimeout(r, 80))
  return getMockProducts(locale).slice(0, limit)
}

/* --------------------------------------------------------------------------
 * PRODUCT FUNCTIONS (REAL — TO IMPLEMENT)
 * -------------------------------------------------------------------------- */

async function RealGetProductByHandle(
  handle: string,
  locale: Locale
): Promise<ShopifyProduct | null> {
  // TODO: fer crida real GraphQL a Shopify, amb @inContext(language: locale)
  return null
}

async function RealGetAllProducts(
  limit: number,
  locale: Locale
): Promise<ShopifyProduct[]> {
  // TODO: crida real GraphQL a Shopify (products(first: limit, ...))
  return []
}

/* --------------------------------------------------------------------------
 * PUBLIC PRODUCT API (stable, usada per la UI)
 * -------------------------------------------------------------------------- */

/**
 * API "canònica" per obtenir un producte cru (ShopifyProduct).
 */
export async function getProductByHandle(
  handle: string,
  locale: Locale = 'ca'
): Promise<ShopifyProduct | null> {
  return SHOPIFY_MODE === 'mock'
    ? MockGetProductByHandle(handle, locale)
    : RealGetProductByHandle(handle, locale)
}

/**
 * API "canònica" per obtenir llistes de productes crus (ShopifyProduct[]).
 */
export async function getProducts(
  limit: number = 20,
  locale: Locale = 'ca'
): Promise<ShopifyProduct[]> {
  return SHOPIFY_MODE === 'mock'
    ? MockGetAllProducts(limit, locale)
    : RealGetAllProducts(limit, locale)
}

export async function getFeaturedProducts(locale: Locale) {
  const all = await getProducts(undefined, locale)
  if (!all) return []
  return all.filter((p) => p.isFeatured)
}

/* --------------------------------------------------------------------------
 * VIEW-MODEL PER A LA UI (StorefrontProduct)
 * -------------------------------------------------------------------------- */

/**
 * Helper per a la UI: mapeja ShopifyProduct -> StorefrontProduct
 * Reutilitza getProducts, així no dupliquem lògica mock/real.
 */
export async function listStorefrontProducts(
  locale: Locale,
  limit: number = 20
): Promise<StorefrontProduct[]> {
  const raw = await getProducts(limit, locale)

  return raw.map((p) => ({
    id: p.id,
    handle: p.handle,
    title: p.title,
    description: p.description,
    price: p.priceMin.toFixed(2) + ' €',
    imageUrl: p.featuredImage ? p.featuredImage.url : '',
    badge: p.availableForSale ? undefined : 'Out of stock',
    isFeatured: false,
    category: p.category
  }))
}

/* --------------------------------------------------------------------------
 * CART INTERFACES
 * -------------------------------------------------------------------------- */

export interface CartLineInput {
  productId: string;
  quantity: number;
}

export interface CartLine {
  id: string;
  productId: string;
  quantity: number;
}

export interface Cart {
  id: string;
  lines: CartLine[];
  totalQuantity: number;
}

/* --------------------------------------------------------------------------
 * CART MOCK (en memòria)
 * -------------------------------------------------------------------------- */

let MOCK_CART: Cart = {
  id: 'mock-cart',
  lines: [],
  totalQuantity: 0
}

function recalcCartTotals(cart: Cart): Cart {
  const totalQuantity = cart.lines.reduce(
    (sum, line) => sum + line.quantity,
    0
  )
  return { ...cart, totalQuantity }
}

function ensureMockCart(): Cart {
  MOCK_CART = recalcCartTotals(MOCK_CART)
  return MOCK_CART
}

/* --------------------------------------------------------------------------
 * CART FUNCTIONS (MOCK + REAL PLACEHOLDERS)
 * -------------------------------------------------------------------------- */

export async function createCart(
  initialLines: CartLineInput[] = []
): Promise<Cart> {
  if (SHOPIFY_MODE === 'mock') {
    await new Promise((r) => setTimeout(r, 80))
    MOCK_CART = {
      id: 'mock-cart',
      lines: initialLines.map((l, i) => ({
        id: `mock-line-${Date.now()}-${i}`,
        productId: l.productId,
        quantity: l.quantity
      })),
      totalQuantity: 0
    }
    return ensureMockCart()
  }
  // TODO (mode real): cartCreate via Storefront API
  throw new Error('createCart (real) no implementat encara.')
}

export async function getCart(): Promise<Cart> {
  if (SHOPIFY_MODE === 'mock') {
    await new Promise((r) => setTimeout(r, 40))
    return ensureMockCart()
  }
  // TODO (mode real): cart(id: ...) via Storefront API
  throw new Error('getCart (real) not implemented.')
}

export async function addCartLines(
  lines: CartLineInput[]
): Promise<Cart> {
  if (SHOPIFY_MODE === 'mock') {
    await new Promise((r) => setTimeout(r, 40))
    const cart = ensureMockCart()
    const newLines = [...cart.lines]

    for (const line of lines) {
      const existing = newLines.find((l) => l.productId === line.productId)
      if (existing) {
        existing.quantity += line.quantity
      } else {
        newLines.push({
          id: `mock-line-${Date.now()}-${Math.random()
            .toString(16)
            .slice(2)}`,
          productId: line.productId,
          quantity: line.quantity
        })
      }
    }

    MOCK_CART = recalcCartTotals({ ...cart, lines: newLines })
    return ensureMockCart()
  }
  // TODO (mode real): cartLinesAdd
  throw new Error('addCartLines (real) no implementat encara.')
}

export async function updateCartLineQuantity(
  lineId: string,
  quantity: number
): Promise<Cart> {
  if (SHOPIFY_MODE === 'mock') {
    await new Promise((r) => setTimeout(r, 40))
    const cart = ensureMockCart()
    MOCK_CART = recalcCartTotals({
      ...cart,
      lines: cart.lines.map((l) =>
        l.id === lineId ? { ...l, quantity } : l
      )
    })
    return ensureMockCart()
  }
  // TODO (mode real): cartLinesUpdate
  throw new Error('updateCartLineQuantity (real) no implementat encara.')
}

export async function removeCartLine(lineId: string): Promise<Cart> {
  if (SHOPIFY_MODE === 'mock') {
    await new Promise((r) => setTimeout(r, 40))
    const cart = ensureMockCart()
    MOCK_CART = recalcCartTotals({
      ...cart,
      lines: cart.lines.filter((l) => l.id !== lineId)
    })
    return ensureMockCart()
  }
  // TODO (mode real): cartLinesRemove
  throw new Error('removeCartLine (real) no implementat encara.')
}

export async function clearCart(): Promise<Cart> {
  if (SHOPIFY_MODE === 'mock') {
    await new Promise((r) => setTimeout(r, 40))
    MOCK_CART = { id: 'mock-cart', lines: [], totalQuantity: 0 }
    return ensureMockCart()
  }
  // TODO (mode real): buidar cart via Storefront API
  throw new Error('clearCart (real) no implementat encara.')
}

// Manté la signatura original de addToCart per compatibilitat amb la UI
export async function addToCart(
  productId: string,
  quantity: number
): Promise<boolean> {
  await addCartLines([{ productId, quantity }])
  return true
}
