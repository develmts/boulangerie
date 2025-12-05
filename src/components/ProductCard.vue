<!-- components/ProductCard.vue -->
<script setup lang="ts">
import { useCart } from "~/composables/useCart"
import { type ShopifyProduct } from '~/services/shopify'
const { t } = useI18n(); 

const props = defineProps<{ 
  product: ShopifyProduct 
  variant?: 'grid' | 'mini' | 'detail' | 'horizontal'
  showAddButton?: boolean
}>();

const { open: openOverlay } = useProductOverlay()

function handleImageClick() {
  // Evitem obrir overlay si ja som a variant "detail" (dins overlay)
  if (variant.value === 'detail') return
  openOverlay(props.product)
}

// const emit = defineEmits<{
//   (e: 'open-detail', product: ShopifyProduct): void
// }>()

const { addItem} = useCart();
const isAdding = ref(false)

const variant = computed(() => props.variant ?? 'grid')

const showAddButton = computed(() => {
  
  // Si el pare ho especifica, manen els props
  if (typeof props.showAddButton === 'boolean') {
    console.log("Parent", variant.value, props.showAddButton)
    return props.showAddButton
  }

  // Per defecte:
  //  - grid i horizontal → SÍ botó
  //  - mini i detail → NO botó
  if (variant.value === 'grid' || variant.value === 'horizontal') {
    console.log("Default",variant.value, true)
    return true
  }
  console.log("Default",variant.value, false)
  return false
})

const detailImages = computed(() => {
  // Si el producte té un array d’imatges, el fem servir
  const imgs = (props.product as any).images ?? []

  if (Array.isArray(imgs) && imgs.length > 0) {
    return imgs
  }

  // Sinó, fem servir només la featuredImage (com fins ara)
  return props.product.featuredImage ? [props.product.featuredImage] : []
})

const hasMultipleDetailImages = computed(() => detailImages.value.length > 1)

const currentDetailImageIndex = ref(0)

const currentDetailImage = computed(() => {
  return detailImages.value[currentDetailImageIndex.value] ?? null
})

function goPrevDetailImage() {
  if (!hasMultipleDetailImages.value) return
  const len = detailImages.value.length
  currentDetailImageIndex.value =
    (currentDetailImageIndex.value - 1 + len) % len
}

function goNextDetailImage() {
  if (!hasMultipleDetailImages.value) return
  const len = detailImages.value.length
  currentDetailImageIndex.value =
    (currentDetailImageIndex.value + 1) % len
}

// -----------------------------------------------------------------------------
// ADD TO CART
// -----------------------------------------------------------------------------
async function handleAddToCart() {
  if (!props.product.availableForSale) return;
  // isAdding.value = true;
  // await addToCart(props.product.id, 1);
  // isAdding.value = false;
  // alert(`${props.product.title} ${t('product.added')}`);
  // await addItem(props.product.id, 1);
  try {
    isAdding.value = true
    await addItem(props.product.id, 1)
    // ✅ NOMÉS afegim, no obrim cistella
  } finally {
    isAdding.value = false
  }  
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
  return (props.product.priceMin || props.product.priceMax).toFixed(2);
});
</script>

<template>
  <div
    class="product-card card"
    :class="[
      `product-card--${variant}`,
      { 'unavailable': !product.availableForSale }
    ]"
  >
    <template v-if="variant === 'mini'">
      <div class="mini-layout">
        <img
          :src="imageSrc"
          :alt="product.featuredImage?.altText || product.title"
          class="mini-image"
          loading="lazy"
          @click="handleImageClick"
        />
        <div class="mini-info">
          <h4 data-testid="product-title" class="mini-title">
            {{ product.title }}
          </h4>
          <p class="mini-price">
            {{ displayPrice }} €
          </p>
          <!-- 
          <button
            v-if="showAddButton"
            type="button"
            class="product-button mini-button"
            @click="handleAddToCart"
            :disabled="isAdding"
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
          -->
        </div>
      </div>
    </template>

    <!-- ==========================
         VARIANT: HORIZONTAL
         ========================== -->
    <template v-else-if="variant === 'horizontal'">
      <div class="horizontal-layout">
        <div class="horizontal-image-wrapper">
          <img
            :src="imageSrc"
            :alt="product.featuredImage?.altText || product.title"
            class="horizontal-image"
            loading="lazy"
            @click="handleImageClick"
          />
        </div>
        <div class="horizontal-main">
          <h3 data-testid="product-title" class="horizontal-title">
            {{ product.title }}
          </h3>
          <p class="horizontal-price">
            {{ displayPrice }} €
          </p>
          <button 
            v-if="showAddButton"
            type="button"
            class="product-button horizontal-button product-card__add-to-cart"
            @click="handleAddToCart" 
            :disabled="isAdding"
            data-testid="add-to-cart"
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
    <!-- ==========================
        VARIANT: DETAIL (hero descriptiu)
        ========================== -->
    <template v-else-if="variant === 'detail'">
      <div class="detail-layout">
        <div class="detail-image-wrapper">
          <img
            v-if="currentDetailImage"
            :src="currentDetailImage.url"
            :alt="currentDetailImage.altText || product.title"
            class="detail-image"
            loading="lazy"
          />

          <!-- Fletxes només si hi ha més d’una imatge -->
          <button
            v-if="hasMultipleDetailImages"
            type="button"
            class="detail-nav detail-nav--prev"
            @click.stop="goPrevDetailImage"
            aria-label="Imatge anterior"
          >
            ‹
          </button>
          <button
            v-if="hasMultipleDetailImages"
            type="button"
            class="detail-nav detail-nav--next"
            @click.stop="goNextDetailImage"
            aria-label="Imatge següent"
          >
            ›
          </button>
        </div>

        <div class="detail-main">
          <h2 data-testid="product-title" class="detail-title">
            {{ product.title }}
          </h2>

          <!-- Ajusta al camp de descripció real que tinguis al ShopifyProduct -->
          <p v-if="product.description" class="detail-description">
            {{ product.description }}
          </p>

          <!-- Aquí hi podríem afegir, en el futur, info "zero comercial":
              origen, història, notes, al·lèrgens, etc. -->
        </div>
      </div>
    </template>


    <!-- ==========================
         VARIANT: GRID (DEFAULT)
         ========================== -->
    <template v-else>
      <!-- IMATGE -->
      <div class="product-image-wrapper">
        <img 
          :src="imageSrc" 
          :alt="product.featuredImage?.altText || product.title" 
          class="product-image"
          loading="lazy"
          @click="handleImageClick"
        />
      </div>

      <!-- INFO -->
      <div class="product-info">
        <h3 data-testid="product-title" class="product-title">
          {{ product.title }}
        </h3>

        <p class="product-price">
          {{ displayPrice }} €
        </p>

        <button 
          v-if="showAddButton"
          type="button"
          class="product-button"
          @click="handleAddToCart" 
          :disabled="isAdding"
          data-testid="add-to-cart"
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
    </template>
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

/* Producte no disponible (aspecte global) */
.unavailable {
  opacity: 0.7;
  filter: grayscale(0.6);
}

/* ==========================
   GRID (layout actual)
   ========================== */
.product-card--grid,
.product-card--detail {
  /* de moment, detail = grid */
}

.product-image-wrapper {
  width: 100%;
  height: 150px;
  margin-bottom: 0.6rem;
  overflow: hidden;
  border-radius: var(--radius-s);
  background: var(--color-bg-secondary);
}

.product-image {
  width: 100%;
  height: 100%;
  object-position: center center;  /* ⬅️ centra el “focus” de la imatge */
  object-fit: cover;
  display: block;
  transition: transform 0.25s ease-out;
}

.product-card--grid:hover:not(.unavailable) .product-image,
.product-card--detail:hover:not(.unavailable) .product-image {
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

/* ==========================
   MINI
   ========================== */
.product-card--mini {
  padding: 0.5rem 0.75rem;
  text-align: left;
}

.mini-layout {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.mini-image {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-s);
  object-fit: cover;
  background: var(--color-bg-secondary);
}

.mini-info {
  display: flex;
  flex-direction: column;
}

.mini-title {
  margin: 0;
  font-size: 0.9rem;
  font-family: var(--font-body);
}

.mini-price {
  margin: 0.1rem 0 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-brand);
}

/* ==========================
   HORIZONTAL
   ========================== */
.product-card--horizontal {
  padding: 0.75rem;
  text-align: left;
}

.horizontal-layout {
  display: flex;
  gap: 0.8rem;
}

.horizontal-image-wrapper {
  flex-shrink: 0;
  width: 110px;
  height: 90px;
  border-radius: var(--radius-s);
  overflow: hidden;
  background: var(--color-bg-secondary);
}

.horizontal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.horizontal-main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.horizontal-title {
  margin: 0 0 0.35rem;
  font-size: 1rem;
  font-family: var(--font-heading);
  color: var(--color-text-brand);
}

.horizontal-price {
  margin: 0 0 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-strong);
}

.horizontal-button {
  margin-top: 0.1rem;
}

/* ==========================
   DETAIL (hero descriptiu)
   ========================== */

.product-card--detail {
  padding: 1.4rem 1.6rem;
  text-align: left;
}

.detail-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1.6fr);
  gap: 1.25rem;
  align-items: flex-start;
}

.detail-image-wrapper {
  position: relative;
  border-radius: var(--radius-m);
  overflow: hidden;
  background: var(--color-bg-secondary);
  max-height: 340px;
}

.detail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  display: block;
}

.detail-main {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  justify-content: center; /* ⬅️ centra el text en alçada a desktop */
}

.detail-title {
  margin: 0;
  font-size: 1.6rem;              /* ⬅️ una mica més gran que grid */
  font-family: var(--font-heading);
  color: var(--color-text-brand);
}

.detail-description {
  margin: 0;
  font-size: 1.02rem;             /* ⬅️ una mica més gran que el body normal */
  line-height: 1.6;
  color: var(--color-text);
}


/* Placeholder per futura meta “no comercial” (origen, història, etc.)
.detail-meta {
  margin: 0.25rem 0 0;
  padding: 0;
  list-style: none;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}
.detail-meta li + li {
  margin-top: 0.2rem;
}
*/

.detail-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
  font-size:400%; 
  font-weight: bolder;
  background: rgba(0, 0, 0, 0.0);  /* fully transparent */
  /* color: var(--color-surface,); */
  color: color-mix(in srgb, var(--color-surface) 20%, transparent);

  display: inline-flex;
  align-items: center;
  justify-content: center;

  transition:
    background 0.15s ease,
    transform 0.1s ease-out,
    opacity 0.15s ease;
}

.detail-nav--prev {
  left: -0.6rem;
}

.detail-nav--next {
  right: -0.6rem;
}

.detail-nav:hover {
  /* background: rgba(0, 0, 0, 0.5); */
  color: color-mix(in srgb, var(--color-surface) 40%, transparent);
  transform: translateY(-50%) scale(1.03);
}

.detail-nav:active {
  transform: translateY(-50%) scale(0.98);
}

@media (max-width: 768px) {
  .detail-layout {
    grid-template-columns: 1fr;
    align-items: flex-start; /* a mòbil millor no centrar verticalment */
  }

  .detail-image-wrapper {
    max-height: 260px;
  }

  .detail-main {
    justify-content: flex-start;
  }
}



@media (max-width: 600px) {
  .horizontal-layout {
    align-items: center;
  }
}
</style>
