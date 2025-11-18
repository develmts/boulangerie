<!-- pages/index.vue (Versión MODIFICADA) -->
<script setup lang="ts">

import { getProducts, type Product , type Locale } from '~/services/shopify';
import { getContentBySlug, type ContentBlock } from '~/services/contentful';
import ProductCard from '~/components/ProductCard.vue';
definePageMeta({
  layout: 'default' // <-- Aquesta línia força l'ús
})

// composables
// import { useI18n } from 'vue-i18n'; 
const { t, locale } = useI18n(); 
// const switchLocalePath = useSwitchLocalePath(); 
// const localePath = useLocalePath(); 

const heroContent = ref<ContentBlock | null>(null);
const products = ref<Product[]>([]);
const loading = ref(true);  

const loadData = async (currentLocale: Locale) => {
    loading.value = true;
    
    // Assegurem que la càrrega es fa sense bloquejos amb try...finally
    try {
        const [content, prods] = await Promise.all([
            getContentBySlug('homepage-hero', currentLocale), // Crida al CMS simulat
            getProducts(3,currentLocale) // Crida a Shopify simulat
        ]);
        
        heroContent.value = content;
        products.value = prods;
        
    } catch (error) {
        console.error("Fallo crític en loadData:", error);
    } finally {
        // La clau per fer desaparèixer el missatge de 'Carregant'
        loading.value = false; 
    }
};

// Cargar datos al montar y cuando el idioma cambie
onMounted(() => loadData(locale.value));
watch(locale, (newLocale) => loadData(newLocale)); // <-- RECARGAR DATOS AL CAMBIAR IDIOMA
</script>

<template>
  <div class="maqueta-container">
    <!-- <header> -->

      <!-- <LanguageSwitcher class="switcher-fixed" />  -->

      <!-- Título y Navegación traducidos con $t -->
      <!-- 
      <h1>{{ t('header.title') }}</h1>
      <nav>
        <NuxtLink :to="localePath('/')">{{ t('nav.home') }}</NuxtLink> 
        <NuxtLink :to="localePath('/shop')">{{ t('nav.shop') }}</NuxtLink> 
        <NuxtLink :to="localePath('/contact')">{{ t('nav.contact') }}</NuxtLink>         
      </nav>
       -->

      <!-- <AppHeader /> -->

    <!-- </header> -->

    <!-- Indicador de Carga General traducido con $t -->
    <div v-if="loading" class="loading-message">
      {{ t('sections.loading') }}
    </div>

    <div v-else>
        <section class="hero">
        <div v-if="heroContent">
            <h2>{{ heroContent.title }}</h2>
            <p>{{ heroContent.body }}</p>
            <button class="cta-button">{{ t('cta.view_products') }}</button>
        </div>
        </section>

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

        <!-- 3. LOGÍSTICA (Contingut estètic) -->
        <section class="contact-placeholder">
          <h2>{{ t('sections.phase_2_title') }}</h2>
          <p>Aquesta maqueta està preparada per a les etapes de consolidació de negoci:</p>
          
          <div class="list-placeholder">
            <div class="list-item">
              <h3>Logística i Repartiment Local</h3>
              <p>Integració amb Shopify per a zones de lliurament i càlcul automàtic de tarifes (basat en codi postal). Preparat per a aplicacions d'optimització de rutes per al repartidor.</p>
            </div>
            <div class="list-item">
              <h3>Marketing en Xarxes (IA)</h3>
              <p>Estructura de contingut Headless llesta per al nostre Agente IA. El propietari podrà planificar i generar contingut d'Instagram/TikTok amb un compromís de temps mínim (1-2 hores/mes).</p>
            </div>
          </div>
        </section>       
    </div>
  </div>
</template>

<style scoped>

header {
  /* Habilitem el posicionament relatiu del header */
  position: relative; 
  
  /* Habilitem Flexbox per centrar el títol i la nav */
  display: flex;
  flex-direction: column;
  align-items: center; 

  padding-bottom: 20px;
  border-bottom: 2px solid var(--color-accent);
}

.switcher-fixed {
    /* Posicionament absolut per treure'l del flux normal del header */
    position: absolute;
    top: 20px;
    right: 20px;
}
/* Productes del dia */
.products {
  padding: 40px 0;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}
/* language switcher */ 
/* .language-switcher {
    position: absolute;
    top: 10px;
    right: 20px;
    display: flex;
    gap: 10px;
}
.lang-link {
    text-decoration: none;
    font-weight: normal;
    color: #888;
}
.lang-link.active {
    font-weight: bold;
    color: var(--color-primary);
} */

/* Estils afegits per al placeholder de logística */
.list-placeholder {
    display: flex;
    gap: 20px;
    margin-top: 20px;
}
.list-item {
    flex: 1;
    padding: 15px;
    border: 1px dashed #ccc;
    border-radius: 5px;
}
</style>