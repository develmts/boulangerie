<!-- components/ProductCard.vue -->
<script setup lang="ts">
import { addToCart, type Product } from '~/services/shopify';
const { t } = useI18n(); 
const props = defineProps<{ product: Product }>();

const isAdding = ref(false);

async function handleAddToCart() {
  if (!props.product.isAvailable) return;
  isAdding.value = true;
  await addToCart(props.product.id, 1);
  isAdding.value = false;
  alert(`${props.product.name} añadido!`);
}

function getProductURL(product: Product): string {
  return `/_nuxt/assets/images/${product.id}.png`;
}
</script>

<template>
  <div class="product-card" :class="{ 'unavailable': !product.isAvailable }">
    <img :src="product.imageUrl" alt="Producto de ejemplo" class="product-image" />     
    <div class="product-info">
      <h3>{{ product.name }}</h3>
      <p class="product-price">{{ product.price.toFixed(2) }} €</p>
      <button 
        @click="handleAddToCart" 
        :disabled="!product.isAvailable || isAdding"
      >
        <span v-if="!product.isAvailable">{{ t('product.unavailable') }}</span>
        <span v-else-if="isAdding">{{ t('product.adding') }}</span>
        <span v-else>{{ t('product.add_to_cart') }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.product-card {

  border: 1px solid var(--color-border); 
  padding: 15px;
  text-align: center;
  border-radius: var(--radius-md); /* Utilitza la variable de radi */
  background-color: var(--color-surface); /* Usa el blanc de la variable */
  box-shadow: var(--shadow-card); /* Utilitza l'ombra definida */
  transition: transform 0.2s, box-shadow 0.2s;
}
.product-card:hover:not(.unavailable) {
    transform: translateY(-5px);
     box-shadow: 0 5px 15px rgba(0,0,0,0.1); /* Opcionalment, una ombra més intensa */
}
.product-image {
  width: 100%;
  max-height: 150px;
  object-fit: cover;
  border-radius: 4px;
}
.product-price {
  font-weight: bold;
  color: var(--color-primary);
  margin: 8px 0;
}
.unavailable {
  opacity: 0.6;
  filter: grayscale(1);
}
</style>