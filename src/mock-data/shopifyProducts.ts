// src/mock-data/shopifyProducts.ts
import { createCdnHelper } from '~/utils/cdn'
import type { Locale, ShopifyProduct, ProductImage } from '~/services/shopify'

const cdn = createCdnHelper('https://develmts.github.io/dev-cdn/projects').cdnFor

function makeMockImage(slug: string, alt?: string): ProductImage {
  return {
    url: cdn('boulangerie', `products/${slug}.png`),
    altText: alt ?? slug,
    width: null,
    height: null
  }
}

/* --------------------------------------------------------------------------
 * MOCK LOCALIZATION (titles + descriptions unificats)
 * -------------------------------------------------------------------------- */

export const MOCK_LANG: Record<
  string,
  Record<Locale, { title: string; description: string }>
> = {
  'baguette-tradition': {
    ca: {
      title: 'Baguette tradicional',
      description: 'Baguette cruixent elaborada amb massa mare i fermentació lenta.'
    },
    es: {
      title: 'Baguette tradicional',
      description: 'Baguette crujiente elaborada con masa madre y fermentación lenta.'
    },
    en: {
      title: 'Traditional baguette',
      description: 'Crispy baguette made with sourdough and slow fermentation.'
    }
  },

  'croissant-mantega': {
    ca: {
      title: 'Croissant de mantega',
      description: 'Croissant fullat 100% mantega.'
    },
    es: {
      title: 'Croissant de mantequilla',
      description: 'Croissant hojaldrado 100% mantequilla.'
    },
    en: {
      title: 'Butter croissant',
      description: '100% butter flaky croissant.'
    }
  },

  'napolitana-xocolata': {
    ca: {
      title: 'Napolitana de xocolata',
      description: 'Massa de croissant amb dues barres de xocolata negra.'
    },
    es: {
      title: 'Napolitana de chocolate',
      description: 'Masa de croissant con dos barritas de chocolate negro.'
    },
    en: {
      title: 'Neapolitan chocolate cake',
      description: 'Croissant dough with two sticks of dark chocolate.'
    }
  },

  'pa-de-cereals': {
    ca: {
      title: 'Pa de cereals',
      description: 'Pa d’escorça cruixent elaborat amb barreja de cereals i llavors.'
    },
    es: {
      title: 'Pan de cereales',
      description: 'Pan de corteza crujiente elaborado con mezcla de cereales y semillas.'
    },
    en: {
      title: 'Multigrain bread',
      description: 'Crusty loaf made with mixed grains and seeds.'
    }
  },

  'brioix-cacau': {
    ca: {
      title: 'Brioix de cacau',
      description: 'Brioix tendre i esponjós amb cacau pur a la massa.'
    },
    es: {
      title: 'Brioche de cacao',
      description: 'Brioche tierno y esponjoso con cacao puro en la masa.'
    },
    en: {
      title: 'Cocoa brioche',
      description: 'Soft, fluffy brioche enriched with pure cocoa.'
    }
  },

  'roll-canel-la': {
    ca: {
      title: 'Roll de canyella',
      description: 'Rotlle dolç de massa esponjosa amb farcit de canyella i sucre morè.'
    },
    es: {
      title: 'Roll de canela',
      description: 'Rollo dulce de masa esponjosa con relleno de canela y azúcar moreno.'
    },
    en: {
      title: 'Cinnamon roll',
      description: 'Soft sweet roll filled with cinnamon and brown sugar.'
    }
  },

  'tartaleta-fruita-fresca': {
    ca: {
      title: 'Tartaleta de fruita fresca',
      description: 'Base cruixent de pasta brisa amb crema suau i fruita de temporada.'
    },
    es: {
      title: 'Tartaleta de fruta fresca',
      description: 'Base crujiente de masa brisa con crema suave y fruta de temporada.'
    },
    en: {
      title: 'Fresh fruit tartlet',
      description: 'Crispy shortcrust base with smooth cream and seasonal fresh fruit.'
    }
  },

  'coca-verdura': {
    ca: {
      title: 'Coca de verdures',
      description: 'Coca salada amb verdures rostides i oli d’oliva verge extra.'
    },
    es: {
      title: 'Coca de verduras',
      description: 'Coca salada con verduras asadas y aceite de oliva virgen extra.'
    },
    en: {
      title: 'Roasted vegetable coca',
      description: 'Savory flatbread topped with roasted vegetables and extra virgin olive oil.'
    }
  },

  'galeta-xips-xocolata': {
    ca: {
      title: 'Galeta amb xips de xocolata',
      description: 'Galeta cruixent per fora i tendra per dins amb xips de xocolata.'
    },
    es: {
      title: 'Galleta con chips de chocolate',
      description: 'Galleta crujiente por fuera y tierna por dentro con chips de chocolate.'
    },
    en: {
      title: 'Chocolate chip cookie',
      description: 'Crispy-edged, soft-centered cookie with chocolate chips.'
    }
  },

  'focaccia-romanesa': {
    ca: {
      title: 'Focaccia romana',
      description: 'Focaccia alta i esponjosa amb oli d’oliva, herbes i sal gruixuda.'
    },
    es: {
      title: 'Focaccia romana',
      description: 'Focaccia alta y esponjosa con aceite de oliva, hierbas y sal gruesa.'
    },
    en: {
      title: 'Roman focaccia',
      description: 'Tall, airy focaccia with olive oil, herbs and coarse salt.'
    }
  }
}


/* --------------------------------------------------------------------------
 * MOCK PRODUCT DATA (base, sense localització)
 * -------------------------------------------------------------------------- */

export const MOCK_PRODUCTS_BASE: ShopifyProduct[] = [
  {
    id: 'gid://shopify/Product/1',
    handle: 'baguette-tradition',
    title: 'Baguette Tradition',
    description: 'Baguette cruixent elaborada amb massa mare i fermentació lenta.',
    featuredImage: makeMockImage('baguette'),
    images: [makeMockImage('baguette'), makeMockImage('p-003')],
    priceMin: 1.2,
    priceMax: 1.2,
    availableForSale: true,
    category: 'bread',
    isFeatured: true
  },
  {
    id: 'gid://shopify/Product/2',
    handle: 'croissant-mantega',
    title: 'Croissant de Mantega',
    description: 'Croissant fullat 100% mantega.',
    featuredImage: makeMockImage('croissant'),
    images: [makeMockImage('croissant')],
    priceMin: 1.4,
    priceMax: 1.4,
    availableForSale: true,
    category: 'pastry',
    isFeatured: true
  },
  {
    id: 'gid://shopify/Product/3',
    handle: 'napolitana-xocolata',
    title: 'Napolitana de Xocolata',
    description: 'Massa de croissant amb dues barres de xocolata negra.',
    featuredImage: makeMockImage('napolitana-xoco'),
    images: [makeMockImage('napolitana-xoco')],
    priceMin: 1.6,
    priceMax: 1.6,
    availableForSale: true,
    category: 'pastry',
    isFeatured: true
  },
  {
    id: 'gid://shopify/Product/4',
    handle: 'pa-de-cereals',
    title: 'Pa de cereals',
    description: 'Pa d’escorça cruixent elaborat amb barreja de cereals i llavors.',
    featuredImage: makeMockImage('pa-de-cereals'),
    images: [makeMockImage('pa-de-cereals')],
    priceMin: 2.8,
    priceMax: 2.8,
    availableForSale: true,
    category: 'bread',
    isFeatured: true   // producte del dia
  },
  {
    id: 'gid://shopify/Product/5',
    handle: 'brioix-cacau',
    title: 'Brioix de cacau',
    description: 'Brioix tendre i esponjós amb cacau pur a la massa.',
    featuredImage: makeMockImage('brioix-cacau'),
    images: [makeMockImage('brioix-cacau')],
    priceMin: 2.0,
    priceMax: 2.0,
    availableForSale: true,
    category: 'pastry',
    isFeatured: false
  },
  {
    id: 'gid://shopify/Product/6',
    handle: 'roll-canel-la',
    title: 'Roll de canyella',
    description: 'Rotlle dolç de massa esponjosa amb farcit de canyella i sucre morè.',
    featuredImage: makeMockImage('rol-canel-la'),
    images: [makeMockImage('rol-canel-la')],
    priceMin: 2.2,
    priceMax: 2.2,
    availableForSale: true,
    category: 'pastry',
    isFeatured: false
  },
  {
    id: 'gid://shopify/Product/7',
    handle: 'tartaleta-fruita-fresca',
    title: 'Tartaleta de fruita fresca',
    description: 'Base cruixent de pasta brisa amb crema suau i fruita de temporada.',
    featuredImage: makeMockImage('tartaleta-fruita-fresca'),
    images: [makeMockImage('tartaleta-fruita-fresca'), makeMockImage('tartaleta-fruita-fresca-2')],
    priceMin: 3.5,
    priceMax: 3.5,
    availableForSale: true,
    category: 'cake',
    isFeatured: true   // producte del dia
  },
  {
    id: 'gid://shopify/Product/8',
    handle: 'coca-verdura',
    title: 'Coca de verdures',
    description: 'Coca salada amb verdures rostides i oli d’oliva verge extra.',
    featuredImage: makeMockImage('coca-verdura'),
    images: [makeMockImage('coca-verdura'), makeMockImage('coca-verdura-2')],
    priceMin: 3.0,
    priceMax: 3.0,
    availableForSale: true,
    category: 'savory',
    isFeatured: false
  },
  {
    id: 'gid://shopify/Product/9',
    handle: 'galeta-xips-xocolata',
    title: 'Galeta amb xips de xocolata',
    description: 'Galeta cruixent per fora i tendra per dins amb xips de xocolata.',
    featuredImage: makeMockImage('galeta-xips-xocolata'),
    images: [makeMockImage('galeta-xips-xocolata')],
    priceMin: 1.0,
    priceMax: 1.0,
    availableForSale: true,
    category: 'cookie',
    isFeatured: false
  },
  {
    id: 'gid://shopify/Product/10',
    handle: 'focaccia-romanesa',
    title: 'Focaccia romana',
    description: 'Focaccia alta i esponjosa amb oli d’oliva, herbes i sal gruixuda.',
    featuredImage: makeMockImage('focaccia-romanesa'),
    images: [makeMockImage('focaccia-romanesa')],
    priceMin: 3.2,
    priceMax: 3.2,
    availableForSale: true,
    category: 'savory',
    isFeatured: false
  }
]

