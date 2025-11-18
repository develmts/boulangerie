// services/shopify.ts

// Mode global: ara mateix tot és MOCK.
// El dia que tinguis Shopify real, posa-ho a 'real' i implementa els TODO.
const SHOPIFY_MODE: 'mock' | 'real' = 'mock';

// -----------------------------------------------------------------------------
// Tipus bàsics comuns per a la "storefront-like interface"
// -----------------------------------------------------------------------------

// Idiomes que farem servir a nivell de codi.
// Quan passem a Shopify real, això es pot mapar a LanguageCode de Shopify.
export type Locale = 'ca' | 'es' | 'en';

// Tipus "style Shopify Storefront" per si després fem servir GraphQL directament.
// Ara mateix només es fan servir com a referència de contracte.
type GetProductReq = {
  handle: string;
  language?: Locale; // Shopify LanguageCode enum (adaptable)
};

type GetProductResponse = {
  data: {
    product: {
      id: string;
      title: string;
      description: string;
      priceRange: {
        minVariantPrice: {
          amount: string;
          currencyCode: string;
        };
      };
    } | null;
  };
  errors?: Array<{
    message: string;
    locations?: any[];
    path?: string[];
  }>;
};

// -----------------------------------------------------------------------------
// MOCKS estil Storefront GraphQL (shape semblant a la resposta real)
// -----------------------------------------------------------------------------
// NOTA: aquests mocks NO s'estan utilitzant directament ara mateix a la UI,
// però els deixem preparats per quan vulguis fer el pas a GraphQL.

export async function getProductMock(input: {
  handle: string;
  language?: Locale;
}): Promise<GetProductResponse> {
  // TODO (mode real): substituir aquest cos per una crida GraphQL real a Shopify
  return {
    data: {
      product: {
        id: 'gid://shopify/Product/1',
        title: `Mock product (${input.language ?? 'default'})`,
        description: 'This is a mocked product description.',
        priceRange: {
          minVariantPrice: {
            amount: '0.00',
            currencyCode: 'EUR',
          },
        },
      },
    },
  };
}

export async function getProductsMock(input: {
  first: number;
  language?: Locale;
}) {
  // TODO (mode real): substituir per una query GraphQL `products(first, query?)`
  return {
    data: {
      products: {
        nodes: Array.from({ length: input.first }).map((_, i) => ({
          id: `gid://shopify/Product/${i + 1}`,
          title: `Mock product ${i + 1} (${input.language ?? 'default'})`,
          description: 'Mock description',
          handle: `mock-product-${i + 1}`,
          priceRange: {
            minVariantPrice: {
              amount: '0.00',
              currencyCode: 'EUR',
            },
          },
        })),
      },
    },
  };
}

// -----------------------------------------------------------------------------
// Model de producte per a la UI (simplificat, però fàcil de mapar a Shopify)
// -----------------------------------------------------------------------------

export interface Product {
  id: string;
  name: string; // Nom per mostrar segons locale
  price: number;
  imageUrl: string;
  isAvailable: boolean;
}

// NOTA: les imatges es suposa que són a /public/imatges
const MOCK_PRODUCTS_BASE: Product[] = [
  {
    id: 'p-001',
    name: 'Croissant de Mantequilla',
    price: 2.5,
    imageUrl: '/imatges/p-001.png',
    isAvailable: true,
  },
  {
    id: 'p-002',
    name: 'Tarta de Zanahoria Familiar',
    price: 22.0,
    imageUrl: '/imatges/p-002.png',
    isAvailable: true,
  },
  {
    id: 'p-003',
    name: 'Pan de Centeno Orgánico',
    price: 4.8,
    imageUrl: '/imatges/p-003.png',
    isAvailable: false,
  },
];

// Noms per idioma, indexats per id de producte.
const MOCK_NAMES: Record<string, Record<Locale, string>> = {
  'p-001': {
    es: 'Croissant de Mantequilla',
    ca: 'Croissant de Mantega',
    en: 'Butter Croissant',
  },
  'p-002': {
    es: 'Tarta de Zanahoria Familiar',
    ca: 'Pastís de Pastanaga Familiar',
    en: 'Carrot Cake XXL',
  },
  'p-003': {
    es: 'Pan de centeno orgánico',
    ca: 'Pa de sègol orgànic',
    en: 'Organic rye bread',
  },
};

// Helper per triar el nom segons locale sense mutar el producte base.
function localizeProductName(product: Product, locale: Locale): Product {
  const names = MOCK_NAMES[product.id];
  const localizedName =
    names?.[locale] ?? names?.ca ?? product.name;

  // Retornem una còpia per no mutar l'array original
  return {
    ...product,
    name: localizedName,
  };
}

// -----------------------------------------------------------------------------
// Funcions de catàleg actuals – signatures estables per futura Shopify real
// -----------------------------------------------------------------------------

export async function getProductById(
  productId: string,
  locale: Locale = 'ca',
): Promise<Product | null> {
  if (SHOPIFY_MODE === 'mock') {
    await new Promise((resolve) => setTimeout(resolve, 150));
    console.log(`✅ SHOPIFY MOCK: EXECUCIÓ COMPLETA per ${locale}.`);

    const baseProd =
      MOCK_PRODUCTS_BASE.find((p) => p.id === productId) || null;

    if (!baseProd) return null;

    return localizeProductName(baseProd, locale);
  }

  // TODO (mode real): recuperar producte per ID via Shopify (probablement via handle/metafield)
  throw new Error('getProductById (real) no està implementat encara.');
}

export async function getProducts(
  limit: number = 3,
  locale: Locale = 'ca',
): Promise<Product[]> {
  if (SHOPIFY_MODE === 'mock') {
    await new Promise((resolve) => setTimeout(resolve, 150));
    console.log(
      '✅ SHOPIFY MOCK: EXECUCIÓ COMPLETA. Retornant productes.',
    );

    const baseList = MOCK_PRODUCTS_BASE.slice(0, limit);
    const ret: Product[] = baseList.map((prod) =>
      localizeProductName(prod, locale),
    );

    return ret;
  }

  // TODO (mode real): usar Storefront API -> products(first, query?) o collection(handle)
  throw new Error('getProducts (real) no està implementat encara.');
}

// -----------------------------------------------------------------------------
// MODEL DE CART (mock) – pensat per poder mapar després a Shopify Storefront
// -----------------------------------------------------------------------------

export interface CartLineInput {
  productId: string;
  quantity: number;
}

export interface CartLine {
  id: string; // id de línia de carro (no el productId)
  productId: string;
  quantity: number;
}

export interface Cart {
  id: string;
  lines: CartLine[];
  totalQuantity: number;
}

// Cart mock en memòria (singleton per a aquesta instància).
let MOCK_CART: Cart = {
  id: 'mock-cart',
  lines: [],
  totalQuantity: 0,
};

// Helper intern per recalcular el totalQuantity
function recalcCartTotals(cart: Cart): Cart {
  const totalQuantity = cart.lines.reduce(
    (sum, line) => sum + line.quantity,
    0,
  );
  return {
    ...cart,
    totalQuantity,
  };
}

// Helper intern: assegura que tenim un cart (en un futur podria crear-lo via API)
function ensureMockCart(): Cart {
  MOCK_CART = recalcCartTotals(MOCK_CART);
  return MOCK_CART;
}

// -----------------------------------------------------------------------------
// Funcions de Cart – ara mock, però amb signatures "serioses"
// -----------------------------------------------------------------------------

export async function createCart(
  initialLines: CartLineInput[] = [],
): Promise<Cart> {
  if (SHOPIFY_MODE === 'mock') {
    await new Promise((resolve) => setTimeout(resolve, 120));

    const lines: CartLine[] = initialLines.map((line, idx) => ({
      id: `mock-line-${Date.now()}-${idx}`,
      productId: line.productId,
      quantity: line.quantity,
    }));

    MOCK_CART = {
      id: 'mock-cart',
      lines,
      totalQuantity: 0,
    };

    MOCK_CART = recalcCartTotals(MOCK_CART);

    console.log(
      `🛒 SHOPIFY CART MOCK: createCart amb ${lines.length} línies.`,
    );

    return ensureMockCart();
  }

  // TODO (mode real): cartCreate via Storefront API
  throw new Error('createCart (real) no està implementat encara.');
}

export async function getCart(): Promise<Cart> {
  if (SHOPIFY_MODE === 'mock') {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return ensureMockCart();
  }

  // TODO (mode real): cart(id: ...) via Storefront API
  throw new Error('getCart (real) no està implementat encara.');
}

export async function addCartLines(
  lines: CartLineInput[],
): Promise<Cart> {
  if (SHOPIFY_MODE === 'mock') {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const cart = ensureMockCart();
    const newLines: CartLine[] = [...cart.lines];

    for (const line of lines) {
      const existing = newLines.find(
        (l) => l.productId === line.productId,
      );
      if (existing) {
        existing.quantity += line.quantity;
      } else {
        newLines.push({
          id: `mock-line-${Date.now()}-${Math.random()
            .toString(16)
            .slice(2)}`,
          productId: line.productId,
          quantity: line.quantity,
        });
      }
    }

    MOCK_CART = recalcCartTotals({
      ...cart,
      lines: newLines,
    });

    console.log(
      `🛒 SHOPIFY CART MOCK: addCartLines, total línies: ${MOCK_CART.lines.length}.`,
    );

    return ensureMockCart();
  }

  // TODO (mode real): cartLinesAdd
  throw new Error('addCartLines (real) no està implementat encara.');
}

export async function updateCartLineQuantity(
  lineId: string,
  quantity: number,
): Promise<Cart> {
  if (SHOPIFY_MODE === 'mock') {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const cart = ensureMockCart();
    const newLines = cart.lines.map((line) =>
      line.id === lineId ? { ...line, quantity } : line,
    );

    MOCK_CART = recalcCartTotals({
      ...cart,
      lines: newLines,
    });

    console.log(
      `🛒 SHOPIFY CART MOCK: updateCartLineQuantity per ${lineId} -> ${quantity}.`,
    );

    return ensureMockCart();
  }

  // TODO (mode real): cartLinesUpdate
  throw new Error(
    'updateCartLineQuantity (real) no està implementat encara.',
  );
}

export async function removeCartLine(
  lineId: string,
): Promise<Cart> {
  if (SHOPIFY_MODE === 'mock') {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const cart = ensureMockCart();
    const newLines = cart.lines.filter((l) => l.id !== lineId);

    MOCK_CART = recalcCartTotals({
      ...cart,
      lines: newLines,
    });

    console.log(
      `🛒 SHOPIFY CART MOCK: removeCartLine ${lineId}.`,
    );

    return ensureMockCart();
  }

  // TODO (mode real): cartLinesRemove
  throw new Error('removeCartLine (real) no està implementat encara.');
}

export async function clearCart(): Promise<Cart> {
  if (SHOPIFY_MODE === 'mock') {
    await new Promise((resolve) => setTimeout(resolve, 80));

    MOCK_CART = {
      id: 'mock-cart',
      lines: [],
      totalQuantity: 0,
    };

    console.log('🛒 SHOPIFY CART MOCK: clearCart.');

    return ensureMockCart();
  }

  // TODO (mode real): buidar cart via Storefront API (o recrear-ne un de nou)
  throw new Error('clearCart (real) no està implementat encara.');
}

// -----------------------------------------------------------------------------
// addToCart original – mantenim signatura per compatibilitat
// -----------------------------------------------------------------------------
// Ara reutilitza addCartLines, però la UI pot continuar fent servir addToCart()
// sense saber res del model complet de Cart.

export async function addToCart(
  productId: string,
  quantity: number,
): Promise<boolean> {
  await addCartLines([{ productId, quantity }]);
  console.log(
    `🛒 Shopify Mock: Producto ${productId} (${quantity} unidades) añadido al carrito virtual.`,
  );
  return true;
}
