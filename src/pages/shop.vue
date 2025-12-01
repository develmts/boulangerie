<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import ProductCard from '~/components/ProductCard.vue'
import ActionFeedback from '~/components/ActionFeedback.vue'
import { getProducts, type ShopifyProduct, type Locale } from '~/services/shopify'

import { useCart } from '~/composables/useCart'

const { t, locale } = useI18n()

const products = ref<ShopifyProduct[]>([])
const isLoading = ref(false)
const loadError = ref<string | null>(null)

// "all" = sense filtre; la resta són valors de product.category
const selectedCategory = ref<string>('all')
const sortMode = ref<'default' | 'price-asc' | 'price-desc'>('default')

const {
  addItem,
  cart,
  toggleCart,
} = useCart()

const cartItemCount = computed(() => cart.value?.totalQuantity || 0)
const isUserLoggedIn = ref(false)

async function loadProducts(currentLocale: Locale) {
  isLoading.value = true
  loadError.value = null

  try {
    const data = await getProducts(50, currentLocale)
    products.value = data
  } catch (err) {
    console.error('[shop] Error loading products', err)
    loadError.value =
      t('shop.error_loading') ?? 'Error loading products'
  } finally {
    isLoading.value = false
  }
}

/**
 * Categories disponibles derivades del mock (product.category).
 * No hi ha llista hardcoded: només el que diguin les dades.
 */
const availableCategories = computed<string[]>(() => {
  const set = new Set<string>()
  for (const p of products.value) {
    if (p.category) {
      set.add(p.category)
    }
  }
  return Array.from(set)
})

/**
 * Etiqueta de categoria per la UI.
 * Si no hi ha traducció, retornem la clau tal qual.
 */
function categoryLabel(cat: string): string {
  const map: Record<string, string> = {
    bread: t('shop.filters.categoryBread'),
    pastry: t('shop.filters.categoryPastries'),
    cake: t('shop.filters.categoryCakes'),
    savory: t('shop.filters.categorySavory') ?? 'savory',
    cookie: t('shop.filters.categoryCookies') ?? 'cookie',
  }
  return map[cat] ?? cat
}

const filteredProducts = computed<ShopifyProduct[]>(() => {
  let items = [...products.value]

  // Filtre per categoria
  if (selectedCategory.value !== 'all') {
    items = items.filter(
      (p) => p.category === selectedCategory.value,
    )
  }

  // Ordenació
  if (sortMode.value === 'price-asc') {
    items = items.sort((a, b) => a.priceMin - b.priceMin)
  } else if (sortMode.value === 'price-desc') {
    items = items.sort((a, b) => b.priceMin - a.priceMin)
  } else {
    // default: ordenar per títol
    items = items.sort((a, b) =>
      a.title.localeCompare(b.title),
    )
  }

  return items
})

onMounted(() => {
  loadProducts(locale.value as Locale)
})

watch(
  () => locale.value,
  (newLocale) => {
    loadProducts(newLocale as Locale)
  },
)
</script>

<template>
  <section class="shop-page">
    <div class="shop-inner">
      <!-- TOP BAR: TÍTOL + ICONES BÀSIQUES DE TENDA -->
      <header class="shop-header">
        <div class="shop-title-group">
          <h1 class="shop-title">
            {{ t('shop.title') }}
          </h1>
          <p class="shop-subtitle">
            {{ t('shop.subtitle') }}
          </p>
        </div>

        <div class="shop-actions">
        </div>
      </header>

      <!-- TOOLBAR FILTRES/ORDENACIÓ -->
      <div class="shop-toolbar">
        <div class="toolbar-left">
          <label class="toolbar-label" for="shop-category">
            {{ t('shop.filters.categoryLabel') }}
          </label>
          <select
            id="shop-category"
            v-model="selectedCategory"
            class="toolbar-select"
          >
            <option value="all">
              {{ t('shop.filters.categoryAll') }}
            </option>

            <!-- Categories derivades del mock -->
            <option
              v-for="cat in availableCategories"
              :key="cat"
              :value="cat"
            >
              {{ categoryLabel(cat) }}
            </option>
          </select>
        </div>

        <div class="toolbar-right">
          <span class="toolbar-count">
            {{ filteredProducts.length }} {{ t('shop.filters.resultsSuffix') }}
          </span>

          <label class="toolbar-label toolbar-label--small" for="shop-sort">
            {{ t('shop.filters.sortLabel') }}
          </label>
          <select
            id="shop-sort"
            v-model="sortMode"
            class="toolbar-select toolbar-select--compact"
          >
            <option value="default">
              {{ t('shop.filters.sortDefault') }}
            </option>
            <option value="price-asc">
              {{ t('shop.filters.sortPriceAsc') }}
            </option>
            <option value="price-desc">
              {{ t('shop.filters.sortPriceDesc') }}
            </option>
          </select>
        </div>
      </div>

      <!-- ESTATS: LOADING / ERROR / LLISTA -->
      <div v-if="isLoading" class="shop-state">
        <ActionFeedback mode="spinner" :size="48" />
      </div>

      <div v-else-if="loadError" class="shop-state shop-state--error">
        <p>{{ loadError }}</p>
      </div>

      <div v-else class="shop-grid">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          layout="horizontal"
          :showAddButton="true"
          @add-to-cart="addItem(product.id, 1)"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.shop-page {
  --shop-bg: #f9f4ec;
  --shop-card-bg: #ffffff;
  --shop-border-subtle: #e5ddd0;
  --shop-accent: #c26a3d;
  --shop-accent-soft: rgba(194, 106, 61, 0.07);
  --shop-text-main: #2b2620;
  --shop-text-muted: #7a6f63;
  --shop-radius-lg: 16px;
  --shop-radius-pill: 999px;
  --shop-shadow-soft: 0 10px 30px rgba(0, 0, 0, 0.05);

  background: radial-gradient(circle at top left, #fdf6ea 0, #f9f4ec 40%, #f7f0e4 100%);
  padding: 2.2rem 1.25rem 3rem;
  color: var(--shop-text-main);
}

.shop-inner {
  max-width: 1120px;
  margin: 0 auto;
}

/* HEADER + ICONES */
.shop-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.shop-title-group {
  flex: 1;
}

.shop-title {
  font-family: var(--font-headings, system-ui, sans-serif);
  font-size: 1.9rem;
  line-height: 1.2;
  margin: 0 0 0.4rem;
  letter-spacing: 0.02em;
}

.shop-subtitle {
  margin: 0;
  font-size: 0.95rem;
  color: var(--shop-text-muted);
}

.shop-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon-button {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  border-radius: 999px;
  border: 1px solid transparent;
  padding: 0.25rem 0.7rem;
  background: #f2e7d8;
  cursor: pointer;
  font-size: 0.78rem;
  color: var(--shop-text-main);
}

.icon-button:hover {
  background: #ecdcc8;
}

.icon {
  width: 16px;
  height: 16px;
}

.icon-badge-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.badge {
  position: absolute;
  top: -0.25rem;
  right: -0.35rem;
  min-width: 1.1rem;
  height: 1.1rem;
  border-radius: 999px;
  background: var(--shop-accent);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-label {
  white-space: nowrap;
}

/* TOOLBAR */
.shop-toolbar {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 0.75rem 0.9rem;
  border-radius: 999px;
  background: #f2e7d8;
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.toolbar-label {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: var(--shop-text-muted);
}

.toolbar-label--small {
  font-size: 0.72rem;
}

.toolbar-select {
  border-radius: 999px;
  border: 1px solid var(--shop-border-subtle);
  background: #fffdf8;
  font-size: 0.85rem;
  padding: 0.3rem 0.7rem;
  outline: none;
}

.toolbar-select:focus {
  border-color: var(--shop-accent);
  box-shadow: 0 0 0 1px rgba(194, 106, 61, 0.16);
}

.toolbar-select--compact {
  padding-inline: 0.5rem;
}

.toolbar-count {
  margin-right: auto;
  font-size: 0.8rem;
  color: var(--shop-text-muted);
}

/* ESTATS */
.shop-state {
  padding: 1.5rem 0.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: var(--shop-text-muted);
}

.shop-state--error {
  color: #b3261e;
}

/* GRID */
.shop-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.2rem;
}

/* RESPONSIVE */
@media (min-width: 720px) {
  .shop-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .shop-toolbar {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .shop-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1040px) {
  .shop-title {
    font-size: 2.1rem;
  }

  .shop-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
