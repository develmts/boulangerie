// src/services/store/storeApi.ts

import type {
  Locale,
  StoreProduct,
  StorefrontProduct,
  Cart,
  CartLineInput,
  StoreUser,
  StoreSession
} from './types'

import * as localStore from './localStore'
import * as shopifyStore from './shopifyStore'

/* -------------------------------------------------------------------------- */
/*  SELECCIÓ DE BACKEND                                                       */
/* -------------------------------------------------------------------------- */

type BackendKind = 'local' | 'shopify'

/**
 * Backend per defecte:
 * - 'local' si STORE_BACKEND no és 'shopify'
 */
const BACKEND: BackendKind =
  process.env.STORE_BACKEND === 'shopify' ? 'shopify' : 'local'

/* -------------------------------------------------------------------------- */
/*  CONTRACTE COMÚ PER A TOTS ELS BACKENDS                                   */
/* -------------------------------------------------------------------------- */

interface StoreBackend {
  /* Productes */
  getProductByHandle(handle: string, locale: Locale): Promise<StoreProduct | null>
  getProducts(limit: number, locale: Locale): Promise<StoreProduct[]>
  getFeaturedProducts(locale: Locale): Promise<StoreProduct[]>
  listStorefrontProducts(locale: Locale, limit: number): Promise<StorefrontProduct[]>

  /* Cistella */
  createCart(initialLines?: CartLineInput[]): Promise<Cart>
  getCart(cartId?: string): Promise<Cart>
  addCartLines(cartId: string | undefined, lines: CartLineInput[]): Promise<Cart>
  updateCartLineQuantity(
    cartId: string | undefined,
    lineId: string,
    quantity: number
  ): Promise<Cart>
  removeCartLine(cartId: string | undefined, lineId: string): Promise<Cart>
  clearCart(cartId: string | undefined): Promise<Cart>

  /* Usuaris */
  getCurrentUser(token?: string): Promise<StoreUser | null>
  signInWithEmail(email: string, password: string): Promise<StoreSession>
  signOut(token: string): Promise<void>
}

/* -------------------------------------------------------------------------- */
/*  IMPLEMENTACIÓ BACKEND LOCAL                                               */
/* -------------------------------------------------------------------------- */

const localBackend: StoreBackend = {
  /* Productes */
  getProductByHandle: localStore.getProductByHandle,
  getProducts: localStore.getProducts,
  getFeaturedProducts: localStore.getFeaturedProducts,
  listStorefrontProducts: localStore.listStorefrontProducts,

  /* Cistella */
  createCart: localStore.createCart,
  getCart: localStore.getCart,
  addCartLines: localStore.addCartLines,
  updateCartLineQuantity: localStore.updateCartLineQuantity,
  removeCartLine: localStore.removeCartLine,
  clearCart: localStore.clearCart,

  /* Usuaris */
  getCurrentUser: localStore.getCurrentUser,
  signInWithEmail: localStore.signInWithEmail,
  signOut: localStore.signOut
}

/* -------------------------------------------------------------------------- */
/*  IMPLEMENTACIÓ BACKEND SHOPIFY                                             */
/* -------------------------------------------------------------------------- */

const shopifyBackend: StoreBackend = {
  /* Productes */
  getProductByHandle: shopifyStore.getProductByHandle,
  getProducts: shopifyStore.getProducts,
  getFeaturedProducts: shopifyStore.getFeaturedProducts,
  listStorefrontProducts: shopifyStore.listStorefrontProducts,

  /* Cistella (requereix cartId) */
  createCart: shopifyStore.createCart,
  getCart: (cartId?: string) => {
    if (!cartId) {
      return Promise.reject(
        new Error('[storeApi] cartId is required for Shopify backend')
      )
    }
    return shopifyStore.getCart(cartId)
  },
  addCartLines: (cartId: string | undefined, lines: CartLineInput[]) => {
    if (!cartId) {
      return Promise.reject(
        new Error('[storeApi] cartId is required for Shopify backend')
      )
    }
    return shopifyStore.addCartLines(cartId, lines)
  },
  updateCartLineQuantity: (
    cartId: string | undefined,
    lineId: string,
    quantity: number
  ) => {
    if (!cartId) {
      return Promise.reject(
        new Error('[storeApi] cartId is required for Shopify backend')
      )
    }
    return shopifyStore.updateCartLineQuantity(cartId, lineId, quantity)
  },
  removeCartLine: (cartId: string | undefined, lineId: string) => {
    if (!cartId) {
      return Promise.reject(
        new Error('[storeApi] cartId is required for Shopify backend')
      )
    }
    return shopifyStore.removeCartLine(cartId, lineId)
  },
  clearCart: (cartId: string | undefined) => {
    if (!cartId) {
      return Promise.reject(
        new Error('[storeApi] cartId is required for Shopify backend')
      )
    }
    return shopifyStore.clearCart(cartId)
  },

  /* Usuaris (ara mateix stubs a shopifyStore) */
  getCurrentUser: shopifyStore.getCurrentUser,
  signInWithEmail: shopifyStore.signInWithEmail,
  signOut: shopifyStore.signOut
}

/* -------------------------------------------------------------------------- */
/*  SELECCIÓ DE BACKEND I GESTIÓ DE CARTID                                   */
/* -------------------------------------------------------------------------- */

function backend(): StoreBackend {
  return BACKEND === 'shopify' ? shopifyBackend : localBackend
}

/**
 * cartId actual quan el backend és Shopify.
 * En aquest nivell és només un valor en memòria.
 */
let currentCartId: string | null = null

async function ensureCartForBackend(): Promise<Cart> {
  const b = backend()

  // En backend local, ignorem cartId
  if (BACKEND === 'local') {
    return b.getCart(undefined)
  }

  // En backend Shopify, cal gestionar cartId
  if (!currentCartId) {
    const created = await b.createCart([])
    currentCartId = created.id
    return created
  }

  return b.getCart(currentCartId)
}

/* -------------------------------------------------------------------------- */
/*  RE-EXPORT DE TIPUS                                                        */
/* -------------------------------------------------------------------------- */

export type {
  StoreProduct,
  StorefrontProduct,
  Cart,
  CartLineInput,
  StoreUser,
  StoreSession
}
export type { Locale } from './types'

/* -------------------------------------------------------------------------- */
/*  API PÚBLICA PER A LA UI                                                  */
/* -------------------------------------------------------------------------- */

/* Productes */

export async function getProductByHandle(
  handle: string,
  locale: Locale = 'ca'
) {
  return backend().getProductByHandle(handle, locale)
}

export async function getProducts(
  limit: number = 20,
  locale: Locale = 'ca'
) {
  return backend().getProducts(limit, locale)
}

export async function getFeaturedProducts(locale: Locale) {
  return backend().getFeaturedProducts(locale)
}

export async function listStorefrontProducts(
  locale: Locale,
  limit: number = 20
) {
  return backend().listStorefrontProducts(locale, limit)
}

/* Cistella */

/**
 * Crea una cistella nova al backend actual.
 * En backend Shopify, actualitza currentCartId.
 */
export async function createCart(
  initialLines: CartLineInput[] = []
): Promise<Cart> {
  const b = backend()
  const cart = await b.createCart(initialLines)

  if (BACKEND === 'shopify') {
    currentCartId = cart.id
  }

  return cart
}

/**
 * Retorna la cistella actual:
 * - En backend local, usa l’única cistella existent.
 * - En backend Shopify, crea una cistella si encara no n’hi ha.
 */
export async function getCart(): Promise<Cart> {
  return ensureCartForBackend()
}

/**
 * Afegeix línies a la cistella actual.
 * - En backend local, ignora cartId.
 * - En backend Shopify, usa currentCartId (i crea cart si cal).
 */
export async function addCartLines(lines: CartLineInput[]): Promise<Cart> {
  const b = backend()
  const cart = await ensureCartForBackend()
  const cartId = BACKEND === 'shopify' ? cart.id : undefined

  return b.addCartLines(cartId, lines)
}

export async function updateCartLineQuantity(
  lineId: string,
  quantity: number
): Promise<Cart> {
  const b = backend()
  const cart = await ensureCartForBackend()
  const cartId = BACKEND === 'shopify' ? cart.id : undefined

  return b.updateCartLineQuantity(cartId, lineId, quantity)
}

export async function removeCartLine(lineId: string): Promise<Cart> {
  const b = backend()
  const cart = await ensureCartForBackend()
  const cartId = BACKEND === 'shopify' ? cart.id : undefined

  return b.removeCartLine(cartId, lineId)
}

export async function clearCart(): Promise<Cart> {
  const b = backend()
  const cart = await ensureCartForBackend()
  const cartId = BACKEND === 'shopify' ? cart.id : undefined

  const cleared = await b.clearCart(cartId)

  if (BACKEND === 'shopify') {
    currentCartId = cleared.id
  }

  return cleared
}

/**
 * Manté la signatura simple que fas servir a la UI.
 * Internament delega en addCartLines.
 */
export async function addToCart(
  productId: string,
  quantity: number
): Promise<boolean> {
  await addCartLines([{ productId, quantity }])
  return true
}

/* Usuaris */

export async function getCurrentUser(token?: string) {
  return backend().getCurrentUser(token)
}

export async function signInWithEmail(email: string, password: string) {
  return backend().signInWithEmail(email, password)
}

export async function signOut(token: string) {
  return backend().signOut(token)
}
