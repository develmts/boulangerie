<!-- pages/index.vue (Versión adaptada a Shopify Pure) -->
<script setup lang="ts">

// IMPORTS CORREGITS
import { 
  getProducts, 
  type ShopifyProduct, 
  type Locale 
} from '~/services/shopify';

import { getContentBySlug, type ContentBlock } from '~/services/contentful';
import ProductCard from '~/components/ProductCard.vue';
import HeroSection from '~/components/HeroSection.vue';
import { useCdn } from '~/composable/useCdn';


definePageMeta({
  layout: 'default'
});

// composables
const { t, locale } = useI18n(); 
const localePath = useLocalePath();
const { cdnUrl } = useCdn();

// STATE
const heroContent = ref<ContentBlock | null>(null);

// 👇 Producte ara és ShopifyProduct (model oficial)
const products = ref<ShopifyProduct[]>([]);

const loading = ref(true);  

// LOADER
const loadData = async (currentLocale: Locale) => {
  loading.value = true;

  try {
    const [content, prods] = await Promise.all([
      getContentBySlug('homepage-hero', currentLocale),
      getProducts(3, currentLocale)   // <-- ja retorna ShopifyProduct[]
    ]);
    // const prods = await getProducts(3, currentLocale);
    heroContent.value = content;
    products.value = prods;

  } catch (error) {
    console.error("Fallo crític en loadData:", error);
  } finally {
    loading.value = false;
  }
};

// Carga inicial + recàrrega per canvi d'idioma
onMounted(() => loadData(locale.value as Locale));
watch(locale, (newLocale) => loadData(newLocale as Locale));

</script>

<template>
  <div class="maqueta-container">

    <!-- LOADING -->
    <div v-if="loading" class="loading-message">
      {{ t('sections.loading') }}
    </div>

    <div v-else>

      <!-- HERO -->
      <div v-if="heroContent">
        
        <!-- <h2>{{ heroContent.title }}</h2>
        <p>{{ heroContent.body }}</p>
        <button class="cta-button">{{ t('cta.view_products') }}</button> 
        -->
        <HeroSection
          :title="t('home.hero.title')"
          :subtitle="t('home.hero.subtitle')"
          :primary-label="t('home.hero.primaryCta')"
          :primary-to="localePath('/shop')"
          :secondary-label="t('home.hero.secondaryCta')"
          :secondary-to="localePath('/contact')"
          :image-src="cdnUrl('boulangerie','hero/hero-croissants.webp')"
          :image-alt="t('home.hero.imageAlt')"
        />
      </div>

      <!-- PRODUCTES -->
      <section class="products">
        <h2>{{ t('product.heading') }}</h2>

        <div class="product-grid">
          <ProductCard 
            v-for="product in products"
            :key="product.id"
            :product="product"
          />
        </div>
      </section>

      <!-- PHASE 2 -->
      <section class="contact-placeholder">
        <h2>{{ t('sections.phase_2_title') }}</h2>
        <p>Aquesta maqueta està preparada per a les etapes de consolidació de negoci:</p>
        
        <div class="list-placeholder">
          <div class="list-item">
            <h3>Logística i Repartiment Local</h3>
            <p>Integració amb Shopify…</p>
          </div>
          <div class="list-item">
            <h3>Marketing en Xarxes (IA)</h3>
            <p>…</p>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
/* El teu CSS intacte */
header {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center; 
  padding-bottom: 20px;
  border-bottom: 2px solid var(--color-accent);
}
.switcher-fixed {
  position: absolute;
  top: 20px;
  right: 20px;
}

.products {
  padding: 40px 0;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.list-placeholder {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.list-item {
  flex: 1;
  padding: 15px;
  border: 1px dashed var(--color-border-subtle);
  border-radius: 5px;
}
</style>
