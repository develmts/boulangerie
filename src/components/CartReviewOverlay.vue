<!-- components/CartReviewOverlay.vue -->
<script setup lang="ts">
const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()
const { enrichedLines, cartSubtotal, cartTotalQuantity, clearCart } = useCart()

function handleClose() {
  emit('close')
}

function handleConfirm() {
  // Mock checkout de moment
  alert('Mock checkout: aquí aniria Shopify Checkout')
  clearCart()
  emit('close')
  navigateTo('/')
}
</script>

<template>
  <Teleport to="body">
    <transition name="cart-review-fade">
      <div
        v-if="open"
        class="cart-review-backdrop"
        role="presentation"
        @click.self="handleClose"
      >
        <section
          class="cart-review-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-review-title"
        >
          <!-- HEADER -->
          <header class="cart-review-header">
            <h2 id="cart-review-title">
              {{ t('cart.checkoutTitle') }}
            </h2>

            <button
              type="button"
              class="cart-review-close-button"
              @click="handleClose"
              aria-label="Close"
            >
              ×
            </button>
          </header>

          <!-- BODY -->
          <div class="cart-review-body" v-if="!enrichedLines?.length">
            <p class="cart-review-empty">
              {{ t('cart.isEmpty') }}
            </p>
          </div>

          <div class="cart-review-body" v-else>
            <!-- Secció resum comanda -->
            <section class="cart-review-section">
              <h3 class="cart-review-section-title">
                {{ t('cart.orderSummary') }}
              </h3>

              <ul class="checkout-lines">
                <li
                  v-for="line in enrichedLines"
                  :key="line.id"
                  class="checkout-line"
                >
                  <!-- Nom producte -->
                  <div class="col-title">
                    {{ line.productTitle }}
                  </div>

                  <!-- Quantitat -->
                  <div class="col-qty">
                    x{{ line.quantity }}
                  </div>

                  <!-- Preu unitari -->
                  <div class="col-unit">
                    {{ line.unitPrice.toFixed(2) }} €
                  </div>

                  <!-- Total línia -->
                  <div class="col-total">
                    {{ line.lineTotal.toFixed(2) }} €
                  </div>
                </li>
              </ul>
            </section>

            <!-- Secció totals -->
            <section class="cart-review-section">
              <h3 class="cart-review-section-title">
                {{ t('cart.totals') }}
              </h3>

              <div class="checkout-totals">
                <div>
                  <span>{{ t('cart.items') }}</span>
                  <span>{{ cartTotalQuantity }}</span>
                </div>
                <div>
                  <span>{{ t('cart.subtotal') }}</span>
                  <span>{{ cartSubtotal?.toFixed(2) }} €</span>
                </div>
              </div>
            </section>

            <!-- Secció reservada a futur (dades, enviaments, cupons, etc.) -->
            <section class="cart-review-section cart-review-section--future">
              <h3 class="cart-review-section-title">
                {{ t('cart.additionalInfoTitle') }}
              </h3>
              <p class="cart-review-section-hint">
                {{ t('cart.additionalInfoHint') }}
              </p>
              <!--
                FUTUR:
                - dades personals per clients no logats
                - adreça d'enviament
                - mètode d'enviament
                - codi de descompte
              -->
            </section>
          </div>

          <!-- FOOTER -->
          <footer class="cart-review-footer">
            <button
              type="button"
              class="cart-review-secondary"
              @click="handleClose"
            >
              {{ t('cart.backToCart') }}
            </button>

            <button
              type="button"
              class="cart-review-primary"
              :disabled="!enrichedLines?.length"
              @click="handleConfirm"
            >
              {{ t('cart.confirm') }}
            </button>
          </footer>
        </section>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
/* BACKDROP pantalla sencera */
.cart-review-backdrop {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: color-mix(
    in srgb,
    rgba(0, 0, 0, 0.4) 60%,
    rgba(0, 0, 0, 0.55)
  );
  backdrop-filter: blur(6px);
  box-sizing: border-box;
}

/* Targeta central (una mica més grossa, estil pàgina contacte) */
.cart-review-card {
  width: 100%;
  max-width: 760px; /* una mica més gran que la card típica */
  max-height: min(640px, 90vh);
  background: var(--color-surface, #ffffff);
  border-radius: var(--radius-xl, 20px);
  box-shadow: var(
    --shadow-soft,
    0 16px 40px rgba(0, 0, 0, 0.18)
  );
  padding: 1.5rem 1.75rem 1.25rem;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* HEADER */
.cart-review-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.cart-review-header h2 {
  margin: 0;
  font-family: var(--font-headings, system-ui);
  font-size: 1.4rem;
  color: var(--color-primary, #c26a3d);
}

.cart-review-close-button {
  flex: 0 0 auto;
  border: none;
  border-radius: 999px;
  width: 2rem;
  height: 2rem;
  font-size: 1.3rem;
  line-height: 1;
  background: transparent;
  color: var(--color-muted-text, #6b5a4c);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}

.cart-review-close-button:hover {
  background: rgba(0, 0, 0, 0.04);
  color: var(--color-text, #2e2620);
}

/* COS scrollable */
.cart-review-body {
  flex: 1 1 auto;
  overflow: auto;
  padding: 0.25rem 0 0.5rem;
}

/* Seccions del cos, preparades per afegir futures parts */
.cart-review-section {
  margin-bottom: 1rem;
}

.cart-review-section:last-of-type {
  margin-bottom: 0;
}

.cart-review-section-title {
  margin: 0 0 0.5rem;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 600;
  color: var(--color-muted-text, #7a6555);
}

/* Secció futur (per dades, enviaments, cupons...) */
.cart-review-section--future {
  margin-top: 1.2rem;
  padding-top: 0.8rem;
  border-top: 1px dashed rgba(0, 0, 0, 0.08);
}

.cart-review-section-hint {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-muted-text, #8a7a6b);
}

/* Llista de línies: una sola línia per producte amb 4 columnes */
.checkout-lines {
  list-style: none;
  padding: 0;
  margin: 0;
}

.checkout-line {
  display: grid;
  grid-template-columns: 1fr auto auto auto; /* títol, qty, unit, total */
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.checkout-line:last-child {
  border-bottom: none;
}

/* COLUMNES */
.col-title {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-text, #2e2620);
  overflow-wrap: anywhere;
}

.col-qty {
  font-size: 0.9rem;
  color: var(--color-muted-text, #6b5a4c);
  white-space: nowrap;
}

.col-unit {
  font-size: 0.9rem;
  color: var(--color-muted-text, #6b5a4c);
  white-space: nowrap;
}

.col-total {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text, #2e2620);
  white-space: nowrap;
}

/* Bloc de totals */
.checkout-totals {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  padding-top: 0.75rem;
  margin-top: 0.25rem;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.checkout-totals div {
  display: flex;
  justify-content: space-between;
}

/* Missatge de cistella buida */
.cart-review-empty {
  text-align: center;
  font-size: 0.95rem;
  color: var(--color-muted-text, #6b5a4c);
  padding: 1.5rem 0.5rem;
}

/* FOOTER (botons) */
.cart-review-footer {
  flex: 0 0 auto;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.cart-review-primary,
.cart-review-secondary {
  border-radius: 999px;
  padding: 0.55rem 1.4rem;
  font-size: 0.9rem;
  font-weight: 500;
  font-family: var(--button-font, var(--font-body, system-ui));
  cursor: pointer;
  border: none;
  transition:
    background 0.18s ease,
    color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.1s ease-out;
}

/* Botó principal */
.cart-review-primary {
  background: var(--color-button, var(--color-primary, #c26a3d));
  color: var(--color-surface, #ffffff);
  box-shadow: var(--shadow-soft, 0 6px 14px rgba(0, 0, 0, 0.12));
}

.cart-review-primary:hover:not(:disabled) {
  background: var(--color-button-hover, #a8562e);
  box-shadow: var(--shadow-strong, 0 10px 26px rgba(0, 0, 0, 0.16));
  transform: translateY(-1px);
}

.cart-review-primary:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: var(--shadow-soft, 0 6px 14px rgba(0, 0, 0, 0.12));
}

.cart-review-primary:disabled {
  opacity: 0.5;
  cursor: default;
  box-shadow: none;
}

/* Botó secundari */
.cart-review-secondary {
  background: transparent;
  color: var(--color-text, #2e2620);
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.cart-review-secondary:hover {
  background: rgba(0, 0, 0, 0.04);
}

/* Animació d’entrada/sortida */
.cart-review-fade-enter-active,
.cart-review-fade-leave-active {
  transition: opacity 0.18s ease;
}

.cart-review-fade-enter-from,
.cart-review-fade-leave-to {
  opacity: 0;
}

/* 📱 Responsiu mòbil */
@media (max-width: 768px) {
  .cart-review-backdrop {
    padding: 0.75rem;
    align-items: flex-start;
  }

  .cart-review-card {
    margin-top: 4rem; /* deixa respirar sota l’app header */
    max-height: calc(100vh - 4.5rem);
    padding: 1.1rem 1.1rem 1rem;
    border-radius: var(--radius-l, 16px);
  }

  .cart-review-header h2 {
    font-size: 1.2rem;
  }

  .checkout-line {
    gap: 0.75rem;
    grid-template-columns: 1fr auto auto auto;
  }

  .col-title {
    font-size: 0.9rem;
  }

  .col-unit,
  .col-total {
    font-size: 0.85rem;
  }
}
</style>
