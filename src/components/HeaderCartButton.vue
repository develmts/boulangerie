<!-- components/HeaderCartButton.vue -->
<script setup lang="ts">

import { ComputedRefSymbol } from '@vue/reactivity'
import { ShoppingCart} from 'lucide-vue-next'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
const localePath = useLocalePath()

import { useCart } from '~/composables/useCart'

const props = defineProps<{
  /**
   * Ruta “canònica” on l’usuari veurà el carro.
   * De moment per defecte /shop, futurament podria ser /cart.
   */
  to?: string
}>()

const { t } = useI18n()


const { 
  // cartItemCount,
  isLoading,
  cart,
  addItem,
  toggleCart,
} = useCart()

const targetPath = computed(() => props.to ?? '/shop')

// const totalQuantity = computed(() => cart.value?.totalQuantity ?? 0)

const cartItemCount = computed(() => cart.value?.totalQuantity || 0) 

// Mostrem el badge si:
// - s’està carregant (per indicar activitat)
// - o hi ha almenys 1 producte al cart
const showBadge = computed(() => {
  if (isLoading.value) return true
  const ret = cart.value?.totalQuantity || 0
  return ret > 0
})



</script>

<template>
  <button type="button" class="icon-button" aria-label="Cart" @click="toggleCart()">
    <div class="icon-badge-wrapper">
      <ShoppingCart class="icon" />
      <CartBadge
        :count="cartItemCount"
        :loading="isLoading"
        :hide-if-zero="false"
      />
    </div>
    <span class="icon-label">
      {{ t('shop.cart.label') }}
    </span>
  </button>
</template>

<style scoped>
.header-cart-button {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;

  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  text-decoration: none;

  background: var(--color-button);
  color: var(--color-surface);

  font-size: 0.85rem;
  font-weight: 500;
  font-family: var(--button-font, var(--font-body));

  box-shadow: var(--shadow-soft);
  transition:
    background 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.1s ease-out,
    opacity 0.15s ease;
}

.header-cart-button:hover {
  background: var(--color-button-hover, var(--color-primary));
  box-shadow: var(--shadow-strong);
  transform: translateY(-1px);
}

.header-cart-button:active {
  transform: translateY(0);
  box-shadow: var(--shadow-soft);
}

/* Icona */
.header-cart-button__icon-svg {
  width: 1.1rem;
  height: 1.1rem;
  display: block;
}

/* Badge */
.header-cart-button__badge {
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.25rem;

  border-radius: 999px;
  background: var(--color-accent);
  color: var(--color-surface);

  font-size: 0.75rem;
  font-weight: 600;
  font-family: var(--button-font, var(--font-body));

  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Puntet animat en mode loading */
.header-cart-button__badge-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: var(--color-surface);
  opacity: 0.9;
  animation: cart-badge-pulse 0.9s ease-in-out infinite;
}

@keyframes cart-badge-pulse {
  0% { transform: scale(0.8); opacity: 0.7; }
  50% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0.8); opacity: 0.7; }
}

/* Si a mobile vols només icona + badge, pots amagar el text: */
@media (max-width: 640px) {
  .header-cart-button__label {
    display: none;
  }
}


/*imported from shop.vue*/
.icon-button {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  border-radius: 999px;
  border: 1px solid transparent;
  padding: 0.2rem 0.6rem;
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
  color:var( --color-bg);
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-label {
  white-space: nowrap;
}



</style>
