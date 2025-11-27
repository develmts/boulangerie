<script setup lang="ts">
import { useCookieConsent } from '~/composables/useCookieConsent'
import CookieSettings from '~/components/CookieSettings.vue'
import { useI18n } from 'vue-i18n'

const { hasAnswered, acceptAll, rejectAll } = useCookieConsent()
const { t } = useI18n()

const show = computed(() => !hasAnswered.value)
const showSettings = ref(false)

function handleAcceptAll() {
  acceptAll()
}

function handleRejectAll() {
  rejectAll()
}

function handleOpenSettings() {
  showSettings.value = true
}

function handleCloseSettings() {
  showSettings.value = false
}
</script>

<template>
  <transition name="cookie-fade">
    <div
      v-if="show"
      class="cookie-modal-overlay"
      aria-live="polite"
    >
      <div class="cookie-modal-positioner">
        <transition name="cookie-switch" mode="out-in">
          <!-- Modal de configuració (ocupa exactament el mateix espai) -->
          <CookieSettings
            v-if="showSettings"
            key="settings"
            @close="handleCloseSettings"
          />

          <!-- Banner bàsic -->
          <div
            v-else
            key="banner"
            class="cookie-card"
            role="dialog"
            aria-modal="true"
          >
            <h3 class="cookie-title">
              {{ t('cookies.banner.title', 'Utilitzem cookies') }}
            </h3>

            <p class="cookie-text">
              {{
                t(
                  'cookies.banner.body',
                  'Fem servir cookies per millorar l’experiència i analitzar l’ús del lloc. Pots acceptar totes, rebutjar-les o configurar-les.'
                )
              }}
            </p>

            <div class="cookie-actions">
              <button
                type="button"
                class="btn btn-outline"
                @click="handleRejectAll"
              >
                {{ t('cookies.actions.reject', 'Rebutjar') }}
              </button>

              <button
                type="button"
                class="btn btn-ghost"
                @click="handleOpenSettings"
              >
                {{ t('cookies.actions.configure', 'Configurar') }}
              </button>

              <button
                type="button"
                class="btn btn-primary"
                @click="handleAcceptAll"
              >
                {{ t('cookies.actions.accept', 'Acceptar') }}
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.cookie-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 9999;

  display: flex;
  justify-content: center;
  align-items: flex-start;

  /* cap padding lateral que distorsioni l'ample real del viewport */
  padding: 0;
  box-sizing: border-box;
}

.cookie-modal-positioner {
  /* offset vertical sota AppHeader */
  margin-top: 80px;
  width: 100%;
  display: flex;
  justify-content: center;
  pointer-events: none; /* l’overlay no intercepta clics fora de la targeta */
}

/* Targeta del banner */
.cookie-card {
  pointer-events: auto;
  width: min(520px, 100vw - 32px); /* 👈 CLAU: mai més ample que el viewport */
  background: var(--color-surface, #fff);
  border-radius: 14px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 1rem 1.25rem;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.cookie-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.cookie-text {
  font-size: 0.9rem;
  margin: 0;
  color: var(--color-text-muted, #555);
}

.cookie-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 0.4rem;
}

.btn {
  border-radius: 999px;
  padding: 0.4rem 0.9rem;
  font-size: 0.85rem;
  cursor: pointer;
  border: 1px solid transparent;
  white-space: nowrap;
}

.btn-primary {
  background: var(--color-primary);
  color: #fff;
}

.btn-outline {
  background: transparent;
  border-color: rgba(0, 0, 0, 0.16);
  color: var(--color-text, #222);
}

.btn-ghost {
  background: transparent;
  color: var(--color-text-muted, #555);
}

/* Mobile */
@media (max-width: 640px) {
  .cookie-modal-positioner {
    margin-top: 70px;
  }

  .cookie-card {
    padding-inline: 1rem;
  }

  .cookie-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .btn {
    width: 100%;
    text-align: center;
    white-space: normal; /* important per NO desbordar horitzontalment */
  }
}

/* Animació overlay */
.cookie-fade-enter-active,
.cookie-fade-leave-active {
  transition: opacity 0.2s ease;
}
.cookie-fade-enter-from,
.cookie-fade-leave-to {
  opacity: 0;
}

/* Animació entre banner i settings (switch) */
.cookie-switch-enter-active,
.cookie-switch-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.cookie-switch-enter-from,
.cookie-switch-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>

