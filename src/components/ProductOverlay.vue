<!-- components/ProductOverlay.vue -->
<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import ProductCard from '~/components/ProductCard.vue'
import { useProductOverlay } from '~/composables/useProductOverlay'

const { isOpen, selectedProduct, close } = useProductOverlay()

function onBackdropClick(event: MouseEvent) {
  // Només tanquem si cliquem al fons, no dins del panel
  if (event.target === event.currentTarget) {
    close()
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <!-- Teleport: fa que l'overlay vagi directament al <body>,
       encara que el component estigui inclòs dins el layout -->
  <Teleport to="body">
    <Transition name="product-overlay-fade">
      <div
        v-if="isOpen && selectedProduct"
        class="product-overlay__backdrop"
        @click="onBackdropClick"
      >
        <section class="product-overlay__panel">
          <!-- Botó de tancar discret -->
          <button
            type="button"
            class="product-overlay__close"
            @click.stop="close"
            aria-label="Tancar detall de producte"
          >
            ×
          </button>

          <!-- Hero detail, zero comercial -->
          <ProductCard
            :product="selectedProduct"
            variant="detail"
            :showAddButton="false"
          />
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Fons a pantalla completa amb blur */
.product-overlay__backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);
}

/* Panel centrat amb la card a dins */
.product-overlay__panel {
  position: relative;
  max-width: 960px;
  width: min(96vw, 960px);

  max-height: 90vh;
  overflow-y: auto;

  border-radius: 1rem;
  background: var(--color-surface, #fff);
  box-shadow: var(--shadow-strong, 0 18px 45px rgba(0, 0, 0, 0.35));

  padding: 1.3rem 1.5rem;
}

/* Botó de tancar discret, cantonada superior dreta */
.product-overlay__close {
  position: absolute;
  top: 0.6rem;
  right: 0.7rem;

  width: 1.8rem;
  height: 1.8rem;
  border-radius: 999px;
  border: none;
  padding: 0;

  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
  background: color-mix(in srgb, var(--color-bg-secondary, #f4f4f4) 60%, transparent);
  color: var(--color-text-muted, #666);

  display: flex;
  align-items: center;
  justify-content: center;

  transition:
    background 0.15s ease,
    transform 0.1s ease,
    color 0.15s ease;
}

.product-overlay__close:hover {
  background: color-mix(in srgb, var(--color-bg-secondary, #f4f4f4) 90%, transparent);
  color: var(--color-text-strong, #222);
  transform: scale(1.03);
}

.product-overlay__close:active {
  transform: scale(0.96);
}

/* Animació d'entrada/sortida */
.product-overlay-fade-enter-active,
.product-overlay-fade-leave-active {
  transition: opacity 0.18s ease;
}

.product-overlay-fade-enter-from,
.product-overlay-fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .product-overlay__panel {
    width: 96vw;
    padding: 1rem 0.9rem 1.1rem;
    border-radius: 0.9rem;
  }

  .product-overlay__close {
    top: 0.4rem;
    right: 0.5rem;
  }
}
</style>
