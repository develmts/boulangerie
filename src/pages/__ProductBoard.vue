<!-- pages/ProductBoard.vue -->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
// import { useI18n } from '#imports'
import ProductCard from '~/components/ProductCard.vue'
import { getProducts, type ShopifyProduct, type Locale } from '~/services/shopify'

const { locale } = useI18n()

const products = ref<ShopifyProduct[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)


const { open } = useProductOverlay()

// Carreguem uns quants productes de prova
onMounted(async () => {
  try {
    const data = await getProducts(undefined, locale.value as Locale)
    products.value = (data ?? []).slice(0, 3) // 3 primers per la demo
  } catch (e: any) {
    console.error('[ProductBoard] Error carregant productes', e)
    error.value = e?.message ?? 'Error carregant productes'
  } finally {
    isLoading.value = false
  }
})

const hasProducts = computed(() => products.value.length > 0)
</script>

<template>
  <main class="product-board">
    <h1 class="product-board__title">
      ProductCard – tauler de variants
    </h1>

    <p class="product-board__subtitle">
      Pàgina de prova per veure <code>ProductCard</code> amb tots els productes
      en cada variant: <strong>grid</strong>, <strong>mini</strong>,
      <strong>horizontal</strong> i <strong>detail</strong>.
    </p>

    <div v-if="isLoading" class="product-board__status">
      Carregant productes de prova...
    </div>

    <div v-else-if="error" class="product-board__status product-board__status--error">
      Error: {{ error }}
    </div>

    <div v-else-if="!hasProducts" class="product-board__status">
      No s'han trobat productes de prova.
    </div>

    <section v-else class="product-board__content">
      <!-- GRID -->
      <section class="product-board__variant-section">
        <h2 class="product-board__variant-title">Variant: grid (per defecte)</h2>
        <div class="product-board__cards-grid">
          <ProductCard
            v-for="product in products"
            :key="product.id + '-grid'"
            :product="product"
            variant="grid"
            @open-detail="open(product)"
          />
        </div>
      </section>

      <!-- MINI -->
      <section class="product-board__variant-section">
        <h2 class="product-board__variant-title">Variant: mini</h2>
        <div class="product-board__cards-column">
          <ProductCard
            v-for="product in products"
            :key="product.id + '-mini'"
            :product="product"
            variant="mini"
          />
        </div>
      </section>

      <!-- HORIZONTAL -->
      <section class="product-board__variant-section">
        <h2 class="product-board__variant-title">Variant: horizontal</h2>
        <div class="product-board__cards-column">
          <ProductCard
            v-for="product in products"
            :key="product.id + '-horizontal'"
            :product="product"
            variant="horizontal"
          />
        </div>
      </section>

      <!-- DETAIL (hero descriptiu) -->
      <section class="product-board__variant-section">
        <h2 class="product-board__variant-title">Variant: detail (vista hero per overlay)</h2>
        <div class="product-board__cards-column">
          <ProductCard
            v-for="product in products"
            :key="product.id + '-detail'"
            :product="product"
            variant="detail"
            :showAddButton="false"  
          />
        </div>
      </section>
    </section>
  </main>
</template>

<style scoped>
.product-board {
  max-width: 960px;
  margin: 0 auto;
  padding: 3rem 1rem 3rem;
}

.product-board__title {
  margin: 0 0 0.3rem;
  font-size: 1.6rem;
  font-family: var(--font-heading, system-ui);
}

.product-board__subtitle {
  margin: 0 0 1.5rem;
  font-size: 0.95rem;
  color: var(--color-text-muted, #666);
}

.product-board__status {
  padding: 1rem;
  border-radius: 0.5rem;
  background: var(--color-bg-secondary, #f4f4f4);
  color: var(--color-text-strong, #333);
  font-size: 0.95rem;
}

.product-board__status--error {
  background: #ffe5e5;
  color: #961b1b;
}

.product-board__content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Secció de cada variant */
.product-board__variant-section {
  padding: 1rem 1.1rem;
  border-radius: 0.75rem;
  background: var(--color-surface, #fff);
  box-shadow: var(--shadow-soft, 0 4px 12px rgba(0,0,0,0.06));
}

.product-board__variant-title {
  margin: 0 0 0.8rem;
  font-size: 1.1rem;
  font-family: var(--font-heading, system-ui);
  color: var(--color-text-brand, #7a4b2d);
}

/* Layout per als cards de grid */
.product-board__cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 1rem;
}

/* Layout per mini / horizontal / detail (columna) */
.product-board__cards-column {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.product-board__cards-column :deep(.product-card) {
  margin: 0;
}

@media (max-width: 640px) {
  .product-board {
    padding-inline: 0.75rem;
  }
}
</style>
