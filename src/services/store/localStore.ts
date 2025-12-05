// src/services/store/localStore.ts
import type {
  Locale,
  ProductImage,
  StoreProduct,
  StorefrontProduct,
  Cart,
  CartLine,
  CartLineInput,
  StoreUser,
  StoreSession
} from './types'

// Reutilitzem les dades existents, però les renombrem internament
import {
  MOCK_LANG as PRODUCT_LANG,
  MOCK_PRODUCTS_BASE as PRODUCTS_BASE
} from '~/mock-data/shopifyProducts'

/* -------------------------------------------------------------------------- */
/*  UTILITATS COMUNES                                                         */
/* -------------------------------------------------------------------------- */

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/* -------------------------------------------------------------------------- */
/*  PRODUCTES                                                                 */
/* -------------------------------------------------------------------------- */

function getLocalizedProducts(locale: Locale): StoreProduct[] {
  return PRODUCTS_BASE.map((p) => {
    const perHandle = PRODUCT_LANG[p.handle]
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

export async function getProductByHandle(
  handle: string,
  locale: Locale
): Promise<StoreProduct | null> {
  await delay(40)
  return getLocalizedProducts(locale).find((p) => p.handle === handle) ?? null
}

export async function getProducts(
  limit: number,
  locale: Locale
): Promise<StoreProduct[]> {
  await delay(40)
  return getLocalizedProducts(locale).slice(0, limit)
}

export async function getFeaturedProducts(
  locale: Locale
): Promise<StoreProduct[]> {
  const all = await getProducts(100, locale)
  return all.filter((p) => p.isFeatured)
}

export async function listStorefrontProducts(
  locale: Locale,
  limit: number
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
    isFeatured: p.isFeatured,
    category: p.category
  }))
}

/* -------------------------------------------------------------------------- */
/*  CISTELLA EN MEMÒRIA                                                       */
/* -------------------------------------------------------------------------- */

let LOCAL_CART: Cart = {
  id: 'local-cart',
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

function ensureCart(): Cart {
  LOCAL_CART = recalcCartTotals(LOCAL_CART)
  return LOCAL_CART
}

export async function createCart(
  initialLines: CartLineInput[] = []
): Promise<Cart> {
  await delay(40)
  LOCAL_CART = {
    id: 'local-cart',
    lines: initialLines.map((l, i) => ({
      id: `line-${Date.now()}-${i}`,
      productId: l.productId,
      quantity: l.quantity
    })),
    totalQuantity: 0
  }
  return ensureCart()
}

/**
 * cartId es pot ignorar en aquest backend, ja que només hi ha una cistella.
 */
export async function getCart(_cartId?: string): Promise<Cart> {
  await delay(20)
  return ensureCart()
}

export async function addCartLines(
  _cartId: string | undefined,
  lines: CartLineInput[]
): Promise<Cart> {
  await delay(20)
  const cart = ensureCart()
  const newLines = [...cart.lines]

  for (const line of lines) {
    const existing = newLines.find((l) => l.productId === line.productId)
    if (existing) {
      existing.quantity += line.quantity
    } else {
      newLines.push({
        id: `line-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        productId: line.productId,
        quantity: line.quantity
      })
    }
  }

  LOCAL_CART = recalcCartTotals({ ...cart, lines: newLines })
  return ensureCart()
}

export async function updateCartLineQuantity(
  _cartId: string | undefined,
  lineId: string,
  quantity: number
): Promise<Cart> {
  await delay(20)
  const cart = ensureCart()
  LOCAL_CART = recalcCartTotals({
    ...cart,
    lines: cart.lines.map((l) =>
      l.id === lineId ? { ...l, quantity } : l
    )
  })
  return ensureCart()
}

export async function removeCartLine(
  _cartId: string | undefined,
  lineId: string
): Promise<Cart> {
  await delay(20)
  const cart = ensureCart()
  LOCAL_CART = recalcCartTotals({
    ...cart,
    lines: cart.lines.filter((l) => l.id !== lineId)
  })
  return ensureCart()
}

export async function clearCart(
  _cartId: string | undefined
): Promise<Cart> {
  await delay(20)
  LOCAL_CART = { id: 'local-cart', lines: [], totalQuantity: 0 }
  return ensureCart()
}

/* -------------------------------------------------------------------------- */
/*  USUARIS I SESSIONS EN MEMÒRIA                                             */
/* -------------------------------------------------------------------------- */

type LocalUserRecord = StoreUser & {
  password: string
}

const LOCAL_USERS: LocalUserRecord[] = [
  {
    id: 'user-1',
    email: 'demo@example.com',
    name: 'Demo User',
    locale: 'ca',
    password: 'demo123'
  }
]

/**
 * Taula simple de sessions: token → userId
 */
const LOCAL_SESSIONS = new Map<string, string>()

function generateToken(): string {
  return (
    'sess-' +
    Date.now().toString(36) +
    '-' +
    Math.random().toString(36).slice(2)
  )
}

export async function getCurrentUser(token?: string): Promise<StoreUser | null> {
  await delay(10)
  if (!token) return null
  const userId = LOCAL_SESSIONS.get(token)
  if (!userId) return null
  const record = LOCAL_USERS.find((u) => u.id === userId)
  if (!record) return null

  const { password, ...user } = record
  return user
}

/**
 * Backend local minimalista per proves:
 * - password en clar
 * - sense recuperació, sense expires, etc.
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<StoreSession> {
  await delay(40)
  const record = LOCAL_USERS.find((u) => u.email === email)

  if (!record || record.password !== password) {
    throw new Error('Credencials no vàlides.')
  }

  const token = generateToken()
  LOCAL_SESSIONS.set(token, record.id)

  const { password: _pw, ...user } = record
  return {
    user,
    token
  }
}

export async function signOut(token: string): Promise<void> {
  await delay(10)
  LOCAL_SESSIONS.delete(token)
}
