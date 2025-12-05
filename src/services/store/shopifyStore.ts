// src/services/store/shopifyStore.ts

import type {
  Locale,
  ProductImage,
  StoreProduct,
  StorefrontProduct,
  Cart,
  CartLineInput,
  CartLine,
  StoreUser,
  StoreSession
} from './types'

/* -------------------------------------------------------------------------- */
/*  CONFIG: STORE + API                                                       */
/* -------------------------------------------------------------------------- */

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || ''
const SHOPIFY_STOREFRONT_API_TOKEN =
  process.env.SHOPIFY_STOREFRONT_API_TOKEN || ''
const SHOPIFY_STOREFRONT_API_VERSION =
  process.env.SHOPIFY_STOREFRONT_API_VERSION || '2024-01'

const SHOPIFY_STOREFRONT_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_STOREFRONT_API_VERSION}/graphql.json`

if (!SHOPIFY_STORE_DOMAIN) {
  console.warn('[shopifyStore] Missing SHOPIFY_STORE_DOMAIN env var')
}
if (!SHOPIFY_STOREFRONT_API_TOKEN) {
  console.warn('[shopifyStore] Missing SHOPIFY_STOREFRONT_API_TOKEN env var')
}

/* -------------------------------------------------------------------------- */
/*  LOCALES → SHOPIFY LANGUAGE CODES                                          */
/* -------------------------------------------------------------------------- */

function toShopifyLanguage(locale: Locale): string {
  switch (locale) {
    case 'ca':
      return 'CA'
    case 'es':
      return 'ES'
    case 'en':
    default:
      return 'EN'
  }
}

/* -------------------------------------------------------------------------- */
/*  LOW LEVEL: GRAPHQL HELPERS                                                */
/* -------------------------------------------------------------------------- */

interface GraphQLResponse<T> {
  data?: T
  errors?: { message: string }[]
}

async function shopifyFetch<T>(
  query: string,
  variables: Record<string, any> = {}
): Promise<T> {
  const res = await fetch(SHOPIFY_STOREFRONT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_API_TOKEN
    },
    body: JSON.stringify({ query, variables })
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    console.error('[shopifyStore] HTTP error', res.status, text)
    throw new Error(`Shopify Storefront HTTP error ${res.status}`)
  }

  const json = (await res.json()) as GraphQLResponse<T>

  if (json.errors && json.errors.length > 0) {
    console.error('[shopifyStore] GraphQL errors', json.errors)
    throw new Error(json.errors.map((e) => e.message).join('; '))
  }

  if (!json.data) {
    throw new Error('Shopify Storefront: empty data')
  }

  return json.data
}

/* -------------------------------------------------------------------------- */
/*  PRODUCT MAPPER                                                            */
/* -------------------------------------------------------------------------- */

function mapShopifyProduct(node: any): StoreProduct {
  const priceMin = parseFloat(
    node.priceRange?.minVariantPrice?.amount ?? '0'
  )
  const priceMax = parseFloat(
    node.priceRange?.maxVariantPrice?.amount ?? '0'
  )

  const featuredImage: ProductImage | null = node.featuredImage
    ? {
        url: node.featuredImage.url,
        altText: node.featuredImage.altText ?? null,
        width: node.featuredImage.width ?? null,
        height: node.featuredImage.height ?? null
      }
    : null

  const images: ProductImage[] = (node.images?.edges ?? []).map(
    (edge: any) => ({
      url: edge.node.url,
      altText: edge.node.altText ?? null,
      width: edge.node.width ?? null,
      height: edge.node.height ?? null
    })
  )

  const mainCollection = node.collections?.edges?.[0]?.node?.handle ?? ''
  const category =
    node?.metafields?.find((m: any) => m.key === 'category')?.value ??
    mainCollection ??
    ''

  const isFeatured =
    node?.metafields?.find((m: any) => m.key === 'is_featured')?.value ===
      'true' ||
    node.collections?.edges?.some(
      (edge: any) => edge.node.handle === 'featured'
    ) ||
    false

  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description ?? '',
    featuredImage,
    images,
    priceMin,
    priceMax,
    availableForSale: !!node.availableForSale,
    category,
    isFeatured
  }
}

/* -------------------------------------------------------------------------- */
/*  PRODUCT QUERIES                                                           */
/* -------------------------------------------------------------------------- */

export async function getProductByHandle(
  handle: string,
  locale: Locale = 'ca'
): Promise<StoreProduct | null> {
  const language = toShopifyLanguage(locale)

  const query = `
    query ProductByHandle($handle: String!, $language: LanguageCode) @inContext(language: $language) {
      product(handle: $handle) {
        id
        handle
        title
        description
        availableForSale
        featuredImage {
          url
          altText
          width
          height
        }
        images(first: 10) {
          edges {
            node {
              url
              altText
              width
              height
            }
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        collections(first: 5) {
          edges {
            node {
              handle
              title
            }
          }
        }
        metafields(identifiers: [
          { namespace: "custom", key: "category" },
          { namespace: "custom", key: "is_featured" }
        ]) {
          key
          value
        }
      }
    }
  `

  type Resp = {
    product: any | null
  }

  const data = await shopifyFetch<Resp>(query, { handle, language })

  if (!data.product) return null

  return mapShopifyProduct(data.product)
}

export async function getProducts(
  limit: number = 20,
  locale: Locale = 'ca'
): Promise<StoreProduct[]> {
  const language = toShopifyLanguage(locale)

  const query = `
    query ProductsList($limit: Int!, $language: LanguageCode) @inContext(language: $language) {
      products(first: $limit, sortKey: TITLE) {
        edges {
          node {
            id
            handle
            title
            description
            availableForSale
            featuredImage {
              url
              altText
              width
              height
            }
            images(first: 10) {
              edges {
                node {
                  url
                  altText
                  width
                  height
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            collections(first: 5) {
              edges {
                node {
                  handle
                  title
                }
              }
            }
            metafields(identifiers: [
              { namespace: "custom", key: "category" },
              { namespace: "custom", key: "is_featured" }
            ]) {
              key
              value
            }
          }
        }
      }
    }
  `

  type Resp = {
    products: {
      edges: { node: any }[]
    }
  }

  const data = await shopifyFetch<Resp>(query, {
    limit,
    language
  })

  const nodes = data.products?.edges?.map((e) => e.node) ?? []
  return nodes.map(mapShopifyProduct)
}

export async function getFeaturedProducts(
  locale: Locale
): Promise<StoreProduct[]> {
  const all = await getProducts(50, locale)
  return all.filter((p) => p.isFeatured)
}

/* -------------------------------------------------------------------------- */
/*  VIEW-MODEL (StorefrontProduct)                                            */
/* -------------------------------------------------------------------------- */

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
    isFeatured: p.isFeatured,
    category: p.category
  }))
}

/* -------------------------------------------------------------------------- */
/*  CART (Storefront API)                                                     */
/* -------------------------------------------------------------------------- */
/**
 * IMPORTANT:
 * A la Storefront API, les cistelles treballen amb IDs de variants,
 * no amb IDs de producte.
 */

function mapCartLinesFromShopify(cart: any): CartLine[] {
  const edges = cart?.lines?.edges ?? []
  return edges.map((edge: any) => {
    const node = edge.node
    return {
      id: node.id,
      productId: node.merchandise?.id ?? '',
      quantity: node.quantity
    }
  })
}

function calcTotalQuantity(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.quantity, 0)
}

export async function createCart(
  initialLines: CartLineInput[] = []
): Promise<Cart> {
  const mutation = `
    mutation CreateCart($lines: [CartLineInput!]) {
      cartCreate(input: { lines: $lines }) {
        cart {
          id
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const variables = {
    lines: initialLines.map((l) => ({
      quantity: l.quantity,
      merchandiseId: l.productId
    }))
  }

  type Resp = {
    cartCreate: {
      cart: any | null
      userErrors: { field: string[]; message: string }[]
    }
  }

  const data = await shopifyFetch<Resp>(mutation, variables)

  if (data.cartCreate.userErrors?.length) {
    console.error('[shopifyStore] cartCreate errors', data.cartCreate.userErrors)
    throw new Error(
      data.cartCreate.userErrors.map((e) => e.message).join('; ')
    )
  }

  const cartNode = data.cartCreate.cart
  if (!cartNode) {
    throw new Error('cartCreate returned null cart')
  }

  const lines = mapCartLinesFromShopify(cartNode)

  return {
    id: cartNode.id,
    lines,
    totalQuantity: calcTotalQuantity(lines)
  }
}

export async function getCart(cartId: string): Promise<Cart> {
  const query = `
    query GetCart($id: ID!) {
      cart(id: $id) {
        id
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                }
              }
            }
          }
        }
      }
    }
  `

  type Resp = { cart: any | null }

  const data = await shopifyFetch<Resp>(query, { id: cartId })

  if (!data.cart) {
    throw new Error(`Cart ${cartId} not found`)
  }

  const lines = mapCartLinesFromShopify(data.cart)

  return {
    id: data.cart.id,
    lines,
    totalQuantity: calcTotalQuantity(lines)
  }
}

export async function addCartLines(
  cartId: string,
  lines: CartLineInput[]
): Promise<Cart> {
  const mutation = `
    mutation AddCartLines($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const variables = {
    cartId,
    lines: lines.map((l) => ({
      quantity: l.quantity,
      merchandiseId: l.productId
    }))
  }

  type Resp = {
    cartLinesAdd: {
      cart: any | null
      userErrors: { field: string[]; message: string }[]
    }
  }

  const data = await shopifyFetch<Resp>(mutation, variables)

  if (data.cartLinesAdd.userErrors?.length) {
    console.error('[shopifyStore] cartLinesAdd errors', data.cartLinesAdd.userErrors)
    throw new Error(
      data.cartLinesAdd.userErrors.map((e) => e.message).join('; ')
    )
  }

  const cartNode = data.cartLinesAdd.cart
  if (!cartNode) {
    throw new Error('cartLinesAdd returned null cart')
  }

  const updatedLines = mapCartLinesFromShopify(cartNode)

  return {
    id: cartNode.id,
    lines: updatedLines,
    totalQuantity: calcTotalQuantity(updatedLines)
  }
}

export async function updateCartLineQuantity(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<Cart> {
  const mutation = `
    mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const variables = {
    cartId,
    lines: [
      {
        id: lineId,
        quantity
      }
    ]
  }

  type Resp = {
    cartLinesUpdate: {
      cart: any | null
      userErrors: { field: string[]; message: string }[]
    }
  }

  const data = await shopifyFetch<Resp>(mutation, variables)

  if (data.cartLinesUpdate.userErrors?.length) {
    console.error(
      '[shopifyStore] cartLinesUpdate errors',
      data.cartLinesUpdate.userErrors
    )
    throw new Error(
      data.cartLinesUpdate.userErrors.map((e) => e.message).join('; ')
    )
  }

  const cartNode = data.cartLinesUpdate.cart
  if (!cartNode) {
    throw new Error('cartLinesUpdate returned null cart')
  }

  const lines = mapCartLinesFromShopify(cartNode)

  return {
    id: cartNode.id,
    lines,
    totalQuantity: calcTotalQuantity(lines)
  }
}

export async function removeCartLine(
  cartId: string,
  lineId: string
): Promise<Cart> {
  const mutation = `
    mutation RemoveCartLines($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const variables = {
    cartId,
    lineIds: [lineId]
  }

  type Resp = {
    cartLinesRemove: {
      cart: any | null
      userErrors: { field: string[]; message: string }[]
    }
  }

  const data = await shopifyFetch<Resp>(mutation, variables)

  if (data.cartLinesRemove.userErrors?.length) {
    console.error(
      '[shopifyStore] cartLinesRemove errors',
      data.cartLinesRemove.userErrors
    )
    throw new Error(
      data.cartLinesRemove.userErrors.map((e) => e.message).join('; ')
    )
  }

  const cartNode = data.cartLinesRemove.cart
  if (!cartNode) {
    throw new Error('cartLinesRemove returned null cart')
  }

  const lines = mapCartLinesFromShopify(cartNode)

  return {
    id: cartNode.id,
    lines,
    totalQuantity: calcTotalQuantity(lines)
  }
}

export async function clearCart(cartId: string): Promise<Cart> {
  const current = await getCart(cartId)
  if (!current.lines.length) return current

  const lineIds = current.lines.map((l) => l.id)

  const mutation = `
    mutation RemoveCartLines($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  type Resp = {
    cartLinesRemove: {
      cart: any | null
      userErrors: { field: string[]; message: string }[]
    }
  }

  const data = await shopifyFetch<Resp>(mutation, {
    cartId,
    lineIds
  })

  if (data.cartLinesRemove.userErrors?.length) {
    console.error(
      '[shopifyStore] clearCart errors',
      data.cartLinesRemove.userErrors
    )
    throw new Error(
      data.cartLinesRemove.userErrors.map((e) => e.message).join('; ')
    )
  }

  const cartNode = data.cartLinesRemove.cart
  if (!cartNode) {
    throw new Error('clearCart returned null cart')
  }

  const lines = mapCartLinesFromShopify(cartNode)

  return {
    id: cartNode.id,
    lines,
    totalQuantity: calcTotalQuantity(lines)
  }
}

/**
 * Afegir línies a una cistella existent.
 * Aquí assumim que ja tens el cartId resolt (via cookie, sessió, etc.).
 */
export async function addToCart(
  cartId: string,
  productId: string,
  quantity: number
): Promise<boolean> {
  await addCartLines(cartId, [{ productId, quantity }])
  return true
}

/* -------------------------------------------------------------------------- */
/*  USUARIS / SESSIONS (STUBS PER A FUTURA INTEGRACIÓ)                        */
/* -------------------------------------------------------------------------- */

export async function getCurrentUser(_token?: string): Promise<StoreUser | null> {
  // TODO: integrar amb el sistema de clients de Shopify si cal.
  return null
}

export async function signInWithEmail(
  _email: string,
  _password: string
): Promise<StoreSession> {
  // TODO: integrar amb el sistema d'autenticació de Shopify o un servei extern.
  throw new Error('signInWithEmail (Shopify) no està implementat encara.')
}

export async function signOut(_token: string): Promise<void> {
  // TODO: invalidar sessió / token si es fa servir un sistema de sessions centralitzat.
  return
}
