// services/contentful.ts

export interface ContentBlock {
  title: string;
  body: string;
}

const MOCK_CONTENT: Record<string, Record<string, ContentBlock>> = {
  'homepage-hero': {
    'ca': {
      title: 'Fornejant Tradició, sabor i Felicitat',
      body: 'Desde que vam començar, som sinonim de qualitat artesanal. Descubreix els nostres productes.',
    },
    'es': {
      title: 'Horneando Tradición, Sabor y Felicidad',
      body: 'Desde hace tres generaciones, nuestra panadería es sinónimo de calidad artesana. Descubra nuestros panes de masa madre y pastelería diaria.',
    },
    'en': {
      title: 'Baking Tradition, Flavor, and Happiness',
      body: 'For three generations, our bakery has been synonymous with artisan quality. Discover our sourdough breads and daily pastries.',
    }
  },
  'about-us': {
    'ca': {
        title: 'Som així',
        body: 'Nomes utilitzem ingredients locals y técniques lentes per assegurar el millor resultat.'
    },    
    'es': {
        title: 'Nuestra Filosofía',
        body: 'Usamos solo ingredientes locales y técnicas lentas para asegurar el mejor sabor y la mejor digestión.'
    },
    'en': {
        title: 'Our Philosophy',
        body: 'We only use local ingredients and slow techniques to ensure the best flavor and best digestion.'
    }
  },
};

export async function getContentBySlug(slug: string, locale:string): Promise<ContentBlock | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
   console.log(`✅ CONTENTFUL MOCK: EXECUCIÓ COMPLETA per ${locale}.`);
  // Intenta devolver el idioma solicitado, si no existe, devuelve el catala por defecto.
  return MOCK_CONTENT[slug]?.[locale] || MOCK_CONTENT[slug]?.['ca'] || null;
}