<!-- components/AuthOverlay.vue -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthUI } from '~/composables/useAuthUI'

const { t } = useI18n()

// useAuthUI orquestra overlay + customer
const {
  isOverlayOpen,
  overlayMode,
  openOverlay,
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

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------
const isAdmin = computed(() => customer.value?.role === 'admin')

// LOGIN form
const loginEmail = ref('')
const loginPassword = ref('')
const loginError = ref<string | null>(null)

// REGISTRE form
const registerEmail = ref('')
const registerPassword = ref('')
const registerFirstName = ref('')
const registerLastName = ref('')
const registerError = ref<string | null>(null)

const { login, register } = useCustomer()

async function handleLoginSubmit() {
  loginError.value = null

  const res = await login(loginEmail.value, loginPassword.value)

  if (!res.ok) {
    loginError.value = res.message || 'Error desconegut'
    return
  }

  closeOverlay()
}

async function handleRegisterSubmit() {
  registerError.value = null

  const res = await register({
    email: registerEmail.value,
    password: registerPassword.value,
    firstName: registerFirstName.value,
    lastName: registerLastName.value,
  })

  if (!res.ok) {
    registerError.value = res.message || 'Error desconegut'
    return
  }

  closeOverlay()
}

async function handleLogout() {
  logout()
  closeOverlay()
}

// function handleViewProfile() {
//   // Obrim el mode 'profile'
//   openOverlay('profile')
// }

async function handleChangePassword() {
  // Placeholder: més endavant hi podem posar un formulari real
  closeOverlay()
}

function goBackToAccount() {
  openOverlay('account')
}

// watch(
//   () => customer.value,
//   (val) => {
//     console.log('[AuthOverlay] customer canviat:', val)
//   },
//   { immediate: true }
// )

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

            <form class="auth-form" @submit.prevent="handleLoginSubmit">
              <label>
                <span>Email</span>
                <input
                  type="email"
                  v-model="loginEmail"
                  required
                  placeholder="email@example.com"
                />
              </label>

              <label>
                <span>{{ t('nav.password') }}</span>
                <input
                  type="password"
                  v-model="loginPassword"
                  required
                  placeholder="••••••••"
                />
              </label>

              <p v-if="loginError" class="auth-error">
                {{ loginError }}
              </p>

              <button type="submit" class="auth-submit">
                {{ t('nav.login') }}
              </button>

              <button
                type="button"
                class="auth-secondary-btn"
                @click="openOverlay('register')"
              >
                {{ t('userMenu.noAccount') || 'No tens compte? Registra’t' }}
              </button>
            </form>
          </template>
          <!-- MODE: REGISTER -->
          <template v-else-if="overlayMode === 'register'">
            <h2>{{ t('nav.register') }}</h2>

            <form class="auth-form" @submit.prevent="handleRegisterSubmit">
              <label>
                <span>{{ t('user.firstName') || 'Nom' }}</span>
                <input
                  type="text"
                  v-model="registerFirstName"
                  required
                  placeholder="Nom"
                />
              </label>

              <label>
                <span>{{ t('user.lastName') || 'Cognom' }}</span>
                <input
                  type="text"
                  v-model="registerLastName"
                  required
                  placeholder="Cognom"
                />
              </label>

              <label>
                <span>Email</span>
                <input
                  type="email"
                  v-model="registerEmail"
                  required
                  placeholder="email@example.com"
                />
              </label>

              <label>
                <span>{{ t('nav.password') }}</span>
                <input
                  type="password"
                  v-model="registerPassword"
                  required
                  placeholder="••••••••"
                />
              </label>

              <p v-if="registerError" class="auth-error">
                {{ registerError }}
              </p>

              <button type="submit" class="auth-submit">
                {{ t('nav.register') }}
              </button>

              <button
                type="button"
                class="auth-secondary-btn"
                @click="openOverlay('login')"
              >
                {{ t('userMenu.haveAccount') || 'Ja tens compte? Inicia sessió' }}
              </button>
            </form>
          </template>
          <!-- MODE: ACCOUNT (perfil + links) -->
          <template v-else>
            <h2>{{ t('nav.account') }}</h2>

            <p v-if="loading">{{ t('sections.loading') }}</p>

            <template v-else>
              <template v-if="isLoggedIn">
                <!-- RESUM DE PERFIL -->
                <div class="profile-summary">
                  <div class="profile-avatar">
                    <span>
                      {{ (customer?.firstName?.[0] || customer?.email?.[0] || '?').toUpperCase() }}
                    </span>
                  </div>

                  <div class="profile-text">
                    <p class="profile-name">
                      {{ customer?.firstName || customer?.email }}
                    </p>
                    <p class="profile-email" v-if="customer?.email">
                      {{ customer.email }}
                    </p>
                    <p class="profile-role" v-if="isAdmin">
                      {{ t('userMenu.roleAdmin') || 'Administrador/a' }}
                    </p>
                  </div>
                </div>

                <!-- ACCIONS D’USUARI -->
                <ul class="auth-menu-list">
                  <li>
                    <button
                      type="button"
                      class="auth-menu-item"
                      @click="handleChangePassword"
                    >
                      {{ t('userMenu.changePassword') || 'Canviar contrasenya' }}
                    </button>
                  </li>
                </ul>

                <!-- BLOC ADMIN (només admins) -->
                <div v-if="isAdmin" class="auth-admin-section">
                  <p class="auth-admin-title">
                    {{ t('userMenu.adminSection') || 'Panell d’administració' }}
                  </p>
                  <ul class="auth-menu-list">
                    <li>
                      <NuxtLink
                        to="/analytics"
                        class="auth-menu-item auth-menu-item--link"
                        @click.native="closeOverlay"
                      >
                        {{ t('admin.analytics') || 'Analytics' }}
                      </NuxtLink>
                    </li>
                    <li>
                      <NuxtLink
                        to="/orders"
                        class="auth-menu-item auth-menu-item--link"
                        @click.native="closeOverlay"
                      >
                        {{ t('admin.orders') || 'Gestió de comandes' }}
                      </NuxtLink>
                    </li>
                    <li>
                      <NuxtLink
                        to="/prodmgm"
                        class="auth-menu-item auth-menu-item--link"
                        @click.native="closeOverlay"
                      >
                        {{ t('admin.products') || 'Gestió de productes' }}
                      </NuxtLink>
                    </li>
                  </ul>
                </div>

                <!-- LOGOUT -->
                <button
                  type="button"
                  class="auth-overlay-logout"
                  @click="handleLogout"
                >
                  {{ t('nav.logout') }}
                </button>
              </template>

              <p v-else class="auth-text">
                Encara no has iniciat sessió (mock). En la versió final 
                podràs gestionar les teves dades i comandes aquí.
              </p>
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
  background: rgba(0,0,0,0.28);
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
  font-size: 0.95rem;
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
  margin-top: 1.2rem;
}

/* Formularis */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-top: 0.6rem;
}

.auth-form label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  font-weight: 500;
}

.auth-form input {
  margin-top: 0.3rem;
  padding: 0.55rem 0.6rem;
  border-radius: var(--radius-m);
  border: 1px solid #ddd;
  font-size: 0.95rem;
}

.auth-error {
  color: #b30000;
  background: #ffe5e5;
  padding: 0.4rem 0.6rem;
  border-radius: var(--radius-m);
  font-size: 0.85rem;
}

/* Botons */
.auth-submit {
  margin-top: 0.4rem;
  padding: 0.55rem 0.8rem;
  border: none;
  border-radius: var(--radius-m);
  background: var(--color-primary);
  color: white;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background 0.2s;
}

.auth-submit:hover {
  background: var(--color-primary-hover, #b45c32);
}

.auth-secondary-btn {
  margin-top: 0.4rem;
  padding: 0.45rem 0.7rem;
  border-radius: var(--radius-m);
  border: 1px solid #ddd;
  background: #faf7f2;
  cursor: pointer;
  font-size: 0.85rem;
}

/* Perfil */
.profile-summary {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0.4rem 0 0.8rem;
}

.profile-avatar {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: var(--color-muted, #f5f1ea);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
}

.profile-text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.profile-name {
  margin: 0;
  font-weight: 600;
}

.profile-email {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.85;
}

.profile-role {
  margin: 0;
  font-size: 0.8rem;
  color: #b3261e;
}

/* Menú compte + admin */
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
  background: var(--color-muted, #f5f1ea);
  cursor: pointer;
  font-size: 0.9rem;
  transition:
    background 0.15s ease,
    transform 0.08s ease;
}

.auth-menu-item:hover {
  background: var(--color-muted-strong, #ece1d3);
  transform: translateY(-1px);
}

.auth-menu-item--link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.auth-admin-section {
  margin-top: 1rem;
  padding-top: 0.6rem;
  border-top: 1px solid rgba(0,0,0,0.06);
}

.auth-admin-title {
  margin: 0 0 0.4rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.7;
}

/* Assegura que la targeta no desborda en pantalles petites */
.auth-overlay-card {
  max-width: 480px;
  width: 100%;
  max-width: min(480px, 92vw);
  box-sizing: border-box;
}

/* Formulari i botons ocupen sempre l'ample de la targeta */
.auth-form,
.auth-menu-list {
  width: 100%;
}

.auth-form input,
.auth-submit,
.auth-secondary-btn,
.auth-menu-item,
.auth-menu-item--link {
  width: 100%;
  box-sizing: border-box;
}

/* Que el text llarg (emails, links) no trenqui el layout */
.profile-email,
.auth-menu-item,
.auth-menu-item--link {
  overflow-wrap: anywhere;
  word-break: break-word;
}

/* Evitar que el grup perfil + text es faci massa ample */
.profile-summary {
  flex-wrap: wrap;
}

/* En mòbil, reduïm una mica la mida si cal */
@media (max-width: 480px) {
  .auth-overlay-card {
    padding: 1.2rem 1rem;
  }
}

</style>
