<!-- components/MiniCartDrawer.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useCart } from '~/composables/useCart'

const {
  cart,
  isCartOpen,
  closeCart,
  isLoading,
  updateItem,
  removeItem,
  clearCart,
} = useCart()

const hasItems = computed(() => (cart.value?.lines.length ?? 0) > 0)
</script>

<template>
  <transition name="mini-cart-fade">
    <!-- Overlay de pantalla sencera amb blur, només si la cistella és oberta -->
    <div
      v-if="isCartOpen"
      class="mini-cart-overlay"
      @click.self="closeCart"
      aria-label="Shopping cart overlay"
    >
      <aside class="mini-cart" aria-label="Shopping cart">
        <header class="mini-cart__header">
          <h2 class="mini-cart__title">Cistella (mock)</h2>
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
            Encara no hi ha productes a la cistella.
          </p>

          <ul v-else class="mini-cart__list">
            <li
              v-for="line in cart?.lines"
              :key="line.id"
              class="mini-cart__item"
            >
              <div class="mini-cart__info">
                <!-- Mock: només productId; més endavant mapejarem a producte complet -->
                <div class="mini-cart__name">
                  {{ line.productId }}
                </div>
                <div class="mini-cart__qty">
                  <label>
                    Q:
                    <input
                      type="number"
                      min="1"
                      :value="line.quantity"
                      @change="updateItem(
                        line.id,
                        Number(($event.target as HTMLInputElement).value) || 1
                      )"
                    />
                  </label>
                </div>
              </div>
              <button
                type="button"
                class="mini-cart__remove"
                @click="removeItem(line.id)"
              >
                X
              </button>
            </li>
          </ul>
        </div>

        <footer class="mini-cart__footer" v-if="hasItems">
          <button type="button" class="mini-cart__clear" @click="clearCart">
            Buidar cistella
          </button>
        </footer>
      </aside>
    </div>
  </transition>
</template>

<style scoped>
/* Overlay que cobreix tota la pantalla i fa blur del fons */
.mini-cart-overlay {
  position: fixed;
  inset: 0;
  z-index: 12000;
  background: rgba(0, 0, 0, 0.25);      /* enfosqueix */
  backdrop-filter: blur(6px);           /* BLUR del que hi ha sota */
  display: flex;
  justify-content: flex-end;            /* desktop: enganxat a la dreta */
  align-items: flex-start;              /* enganxat a dalt */
  padding: 0.75rem;                     /* separació de les vores */
}

/* Panell de cistella */
.mini-cart {
  width: min(380px, 100vw - 1.5rem);    /* proporcional al viewport */
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

.mini-cart__name {
  font-weight: 500;
}

.mini-cart__qty input {
  width: 3rem;
  font-size: 0.8rem;
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
    justify-content: center;          /* centrat horitzontalment */
    align-items: flex-start;
    padding-inline: 0.75rem;
  }

  .mini-cart {
    width: 100%;
    max-width: 370px;                 /* límit dur perquè no surti de la pantalla */
    max-height: 75vh;
  }
}
</style>
