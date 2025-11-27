<!-- components/AuthOverlay.vue -->
<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthUI } from '~/composables/useAuthUI'

const { t } = useI18n()

const {
  isOverlayOpen,
  overlayMode,
  closeOverlay,
  customer,
  isLoggedIn,
  loading,
  hydrate,
  logout,
} = useAuthUI()

onMounted(() => {
  hydrate()
})

function handleLogout() {
  logout()
  closeOverlay()
}

// De moment, aquestes dues opcions només tanquen el menú.
// Més endavant poden obrir submodals dins del mateix AuthOverlay.
function handleViewProfile() {
  // TODO: obrir vista/forma de perfil (mock)
  closeOverlay()
}

function handleChangePassword() {
  // TODO: obrir formulari canvi de password (mock)
  closeOverlay()
}
</script>

<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="isOverlayOpen"
        class="auth-overlay-backdrop"
        @click.self="closeOverlay"
      >
        <div class="auth-overlay-card">
          <!-- MODE: LOGIN -->
          <template v-if="overlayMode === 'login'">
            <h2>{{ t('nav.login') }}</h2>
            <p class="auth-text">
              Aquí hi aniria el formulari de login/registre quan connectem amb Shopify.
            </p>
            <p class="auth-text">
              De moment, la compra es podrà fer com a convidat des del checkout de Shopify.
            </p>
          </template>

          <!-- MODE: ACCOUNT (MENÚ DE COMPTE) -->
          <template v-else>
            <!-- <h2>{{ t('nav.account') }}</h2> -->

            <p v-if="loading">{{ t('sections.loading') }}</p>

            <template v-else>
              <!-- <p v-if="isLoggedIn" class="auth-text">
                {{ t('userMenu.welcome') }}
                <strong>{{ customer?.firstName || customer?.email }}</strong>
              </p> -->
              <h2 v-if="isLoggedIn" class="auth-text">
                {{ t('userMenu.welcome') }}
                <strong>{{ customer?.firstName || customer?.email }}</strong>
              </h2>

              <p v-else class="auth-text">
                Encara no has iniciat sessió (mock). En la versió final 
                podràs gestionar les teves dades i comandes aquí.
              </p>

              <ul
                v-if="isLoggedIn"
                class="auth-menu-list"
              >
                <li>
                  <button
                    type="button"
                    class="auth-menu-item"
                    @click="handleViewProfile"
                  >
                    {{ t('userMenu.profile') || 'Veure / editar perfil' }}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    class="auth-menu-item"
                    @click="handleChangePassword"
                  >
                    {{ t('userMenu.changePassword') || 'Canviar contrasenya' }}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    class="auth-menu-item auth-menu-item--danger"
                    @click="handleLogout"
                  >
                    {{ t('nav.logout') }}
                  </button>
                </li>
              </ul>
            </template>
          </template>

          <button
            type="button"
            class="auth-overlay-close"
            @click="closeOverlay"
          >
            ✕
          </button>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.auth-overlay-backdrop {
  position: fixed;
  inset: 0;
  /* fosc + blur com la cistella */
  background: rgba(0,0,0,0.28);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);

  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
}

.auth-overlay-card {
  position: relative;
  max-width: 480px;
  width: 100%;
  background: var(--color-surface);
  border-radius: var(--radius-l);
  box-shadow: var(--shadow-strong);
  padding: 1.6rem 1.4rem;
}

.auth-text {
  margin: 0.3rem 0;
  font-size:1.2rem;
}

.auth-overlay-close {
  position: absolute;
  top: 0.5rem;
  right: 0.6rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
}

.auth-overlay-logout {
  margin-top: 1rem;
}

/* Menú de compte */
.auth-menu-list {
  list-style: none;
  margin: 0.8rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.auth-menu-item {
  width: 100%;
  text-align: left;
  border: none;
  border-radius: 999px;
  padding: 0.45rem 0.9rem;
  background: var(--color-muted);
  cursor: pointer;
  font-size: 0.9rem;
  transition:
    background 0.15s ease,
    transform 0.08s ease;
}

.auth-menu-item:hover {
  background: var(--color-muted-strong);
  transform: translateY(-1px);
}

.auth-menu-item--danger {
  background: rgba(191, 53, 53, 0.08);
  color: #b3261e;
}

.auth-menu-item--danger:hover {
  background: rgba(191, 53, 53, 0.16);
}
</style>
