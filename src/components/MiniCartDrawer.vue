<!-- components/MiniCartDrawer.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useCart } from '~/composables/useCart'
const { t } = useI18n()
const {
  cart,
  isCartOpen,
  closeCart,
  isLoading,
  updateItem,
  removeItem,
  clearCart,
  enrichedLines,
  cartTotalQuantity,
  cartSubtotal
} = useCart()

const hasItems = computed(() => (cart.value?.lines.length ?? 0) > 0)

const localePath = useLocalePath()

const isCartReviewOpen = ref(false)


function goToCheckout() {
  closeCart()
  isCartReviewOpen.value = true
}
</script>

<template>
  <transition name="mini-cart-fade">
    <div
      v-if="isCartOpen"
      class="mini-cart-overlay"
      @click.self="closeCart"
      aria-label="Shopping cart overlay"
    >
      <aside class="mini-cart" aria-label="Shopping cart">
        <header class="mini-cart__header">
          <h2 class="mini-cart__title">{{ t('cart.label') }}</h2>
          <button
            type="button"
            class="mini-cart__close"
            @click="closeCart"
            aria-label="Tancar cistella"
          >
            ✕
          </button>
        </header>

        <div class="mini-cart__body">
          <p v-if="isLoading">Actualitzant cistella...</p>

          <p v-else-if="!hasItems">
            {{ t('cart.noProducts') }}
           
          </p>

          <ul v-else class="mini-cart__list">
            <li
              v-for="line in enrichedLines"
              :key="line.id"
              class="mini-cart__item"
              data-testid="cart-line"
            >
              <div class="mini-cart__info">
                <div class="mini-cart__name">
                  {{ line.productTitle }}
                </div>
                <div class="mini-cart__qty">
                  {{ line.quantity }}
                  <span v-if="line.unitPrice">
                    · {{ line.unitPrice.toFixed(2) }} €
                  </span>
                </div>
                <div class="mini-cart__linrTotal">
                  {{ (line.quantity * line.unitPrice).toFixed(2) }} €
                </div>
              </div>
              <!-- CANVI: abans era cart-line-remove -->
              <button
                type="button"
                class="mini-cart__remove" 
                @click="removeItem(line.id)"
              >
                ✕
              </button>
            </li>
          </ul>

          <div class="mini-cart-summary" v-if="enrichedLines?.length">
            <div class="mini-cart-summary-row">
              <span>{{ t('cart.items') }}</span>
              <span>{{ cartTotalQuantity }}</span>
            </div>
            <div class="mini-cart-summary-row">
              <span>{{ t('cart.subtotal') }}</span>
              <span>{{ cartSubtotal?.toFixed(2) }} €</span>
            </div>
          </div>
        </div>

        <footer class="mini-cart__footer" v-if="hasItems">
          <button
            type="button"
            class="mini-cart__checkout"
            @click="goToCheckout"
            data-testid="checkout"
          >
            {{ t('cart.checkout') }}
          </button>
          <button type="button" class="mini-cart__clear" @click="clearCart">
            {{t('cart.clearCart')}}
          </button>
        </footer>
      </aside>
    </div>
  </transition>
  <!-- Overlay global, fora del drawer -->
  <CartReviewOverlay
    :open="isCartReviewOpen"
    @close="isCartReviewOpen = false"
  />
</template>

<style scoped>
/* Overlay que cobreix tota la pantalla i fa blur del fons */
.mini-cart-overlay {
  position: fixed;
  inset: 0;
  z-index: 12000;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 0.75rem;
}

/* Panell de cistella */
.mini-cart {
  width: min(380px, 100vw - 1.5rem);
  max-height: 80vh;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.18);
  padding: 0.75rem 0.75rem 0.9rem;
  display: flex;
  flex-direction: column;
}

/* Capçalera */
.mini-cart__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.mini-cart__title {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
}

.mini-cart__close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

/* Cos */
.mini-cart__body {
  flex: 1;
  overflow-y: auto;
  font-size: 0.85rem;
}

.mini-cart__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.5rem;
}

.mini-cart__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.4rem 0.3rem;
  border-radius: 10px;
  background: #faf5ee;
}

/* INFO: nom + qty + total en una sola línia amb columnes */
.mini-cart__info {
  display: grid;
  grid-template-columns: 1fr auto auto;
  column-gap: 0.75rem;
  align-items: center;
  flex: 1; /* CANVI: perquè ocupi tot l’ample disponible */
}

.mini-cart__name {
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mini-cart__qty,
.mini-cart__linrTotal {
  white-space: nowrap;
  text-align: right; /* CANVI: números alineats a la dreta */
}

.mini-cart__qty input {
  width: 3rem;
  font-size: 0.8rem;
}

/* SUMMARY: correcció del selector */
.mini-cart-summary {               /* CANVI: abans .min-cart-summary */
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  padding-top: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.mini-cart-summary-row {
  display: flex;
  justify-content: space-between;
  margin: 0.15rem 0;
}

/* Botons */
.mini-cart__remove,
.mini-cart__clear {
  border-radius: 999px;
  border: none;
  padding: 0.35rem 0.8rem;
  font-size: 0.8rem;
  cursor: pointer;
}

.mini-cart__remove {
  background: #f2d3d0;
}

.mini-cart__clear {
  background: #eee3d3;
}

.mini-cart__clear:hover {
  background: var(--color-primary);
  color: var(--color-surface);
}

.mini-cart__checkout {
  border-radius: 999px;
  border: none;
  padding: 0.35rem 0.8rem;
  font-size: 0.8rem;
  cursor: pointer;
  background: #eee3d3;
}

.mini-cart__checkout:hover {
  background: var(--color-primary);
  color: var(--color-surface);
}

.mini-cart__footer {
  margin-top: 0.5rem;
  display: flex;
  justify-content: flex-end;
}

/* Animació */
.mini-cart-fade-enter-active,
.mini-cart-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.mini-cart-fade-enter-from,
.mini-cart-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* MOBILE: centrat i més estret (max 370px) */
@media (max-width: 640px) {
  .mini-cart-overlay {
    justify-content: center;
    align-items: flex-start;
    padding-inline: 0.75rem;
  }

  .mini-cart {
    width: 100%;
    max-width: 370px;
    max-height: 75vh;
  }
}
</style>
