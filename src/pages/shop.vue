<!-- pages/shop.vue -->
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();

// En la fase de explotación, aquí se añadiría la lógica 
// para cargar *todos* los productos desde Shopify.
</script>

<template>
  <div class="page-container">
    <h1>{{ t('nav.shop') }}</h1>
    <p>Esta será la página completa de la tienda. En la versión final, mostrará categorías, filtros y todos los productos disponibles en Shopify.</p>
  
  </div>
</template>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 50px auto;
  padding: 20px;
}
h1 {
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-accent);
  padding-bottom: 10px;
}
</style>