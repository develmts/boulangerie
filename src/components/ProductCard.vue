<!-- components/ProductCard.vue -->
<script setup lang="ts">
import { addToCart, type ShopifyProduct } from '~/services/shopify'
const { t } = useI18n(); 

const props = defineProps<{ product: ShopifyProduct }>();

const isAdding = ref(false);

// -----------------------------------------------------------------------------
// ADD TO CART
// -----------------------------------------------------------------------------
async function handleAddToCart() {
  if (!props.product.availableForSale) return;
  isAdding.value = true;
  await addToCart(props.product.id, 1);
  isAdding.value = false;
  alert(`${props.product.title} ${t('product.added')}`);
}

// -----------------------------------------------------------------------------
// IMATGE (fallback)
// -----------------------------------------------------------------------------
const imageSrc = computed(() => {
  return props.product.featuredImage?.url ?? '/placeholder-product.png';
});

// -----------------------------------------------------------------------------
// PREU (ara displayPrice)
// -----------------------------------------------------------------------------
const displayPrice = computed(() => {
  return props.product.priceMin.toFixed(2);
});
</script>

<template>
  <div
    class="product-card card"
    :class="{ 'unavailable': !product.availableForSale }"
  >
    <!-- IMATGE -->
    <div class="product-image-wrapper">
      <img 
        :src="imageSrc" 
        :alt="product.featuredImage?.altText || product.title" 
        class="product-image"
        loading="lazy"
      />
    </div>

    <!-- INFO -->
    <div class="product-info">
      <h3 class="product-title">
        {{ product.title }}
      </h3>

      <p class="product-price">
        {{ displayPrice }} €
      </p>

      <button 
        type="button"
        class="product-button"
        @click="handleAddToCart" 
        :disabled="!product.availableForSale || isAdding"
      >
        <span v-if="!product.availableForSale">
          {{ t('product.unavailable') }}
        </span>
        <span v-else-if="isAdding">
          {{ t('product.adding') }}
        </span>
        <span v-else>
          {{ t('product.add_to_cart') }}
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  /* .card (global) ja aporta: background, border, radius, shadow.
     Aquí definim layout específic de producte. */
  padding: 0.9rem 0.9rem 1rem;
  text-align: center;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

/* Hover només si està disponible */
.product-card:hover:not(.unavailable) {
  transform: translateY(-4px);
  box-shadow: var(--shadow-strong);
}

/* IMATGE */
.product-image-wrapper {
  width: 100%;
  max-height: 150px;
  margin-bottom: 0.6rem;
  overflow: hidden;
  border-radius: var(--radius-s);
  background: var(--color-bg-secondary);
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.25s ease-out;
}

.product-card:hover:not(.unavailable) .product-image {
  transform: scale(1.03);
}

/* INFO */
.product-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Títol */
.product-title {
  margin: 0 0 0.3rem;
  font-size: 1rem;
  font-family: var(--font-heading);
  color: var(--color-text-brand);
}

/* Preu */
.product-price {
  margin: 0 0 0.6rem;
  font-weight: 600;
  font-size: 1rem;
  color: var(--color-text-strong);
}

/* Botó Afegir… integrat amb theme system */
.product-button {
  padding: 0.45rem 1rem;
  border-radius: 999px;
  border: none;
  cursor: pointer;

  background: var(--color-button);
  color: var(--color-surface);

  font-size: 0.85rem;
  font-weight: 500;
  font-family: var(--font-body);
  white-space: nowrap;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  box-shadow: var(--shadow-soft);
  transition:
    background 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.1s ease-out,
    opacity 0.15s ease;
}

.product-button:hover:not(:disabled) {
  background: var(--color-button-hover);
  box-shadow: var(--shadow-strong);
  transform: translateY(-1px);
}

.product-button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: var(--shadow-soft);
}

/* Estat disabled (no disponible o afegint) */
.product-button:disabled {
  cursor: default;
  opacity: 0.7;
  background: var(--color-bg-secondary);
  color: var(--color-text-muted);
  box-shadow: none;
  border: 1px solid var(--color-border-subtle);
}

/* Producte no disponible (aspecte global) */
.unavailable {
  opacity: 0.7;
  filter: grayscale(0.6);
}
</style>
