<script setup lang="ts">
import { useCookieConsent } from '~/composables/useCookieConsent'
import type { CookieCategory } from '~/composables/useCookieConsent'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { consent, updateCategory } = useCookieConsent()
const { t } = useI18n()

function toggle(cat: CookieCategory) {
  updateCategory(cat, !consent.value[cat])
}

function handleClose() {
  emit('close')
}
</script>

<template>
  <div
    class="cookie-settings-card"
    role="dialog"
    aria-modal="true"
  >
    <h2 class="settings-title">
      {{ t('cookies.settings.title', 'Configuració de cookies') }}
    </h2>

    <p class="settings-intro">
      {{
        t(
          'cookies.settings.intro',
          'Pots canviar les preferències de cookies no necessàries. Les cookies tècniques són imprescindibles per al funcionament correcte del lloc.'
        )
      }}
    </p>

    <div class="row">
      <div class="row-text">
        <h3>{{ t('cookies.categories.necessary', 'Cookies necessàries') }}</h3>
        <p>
          {{
            t(
              'cookies.categories.necessaryDesc',
              'Impedeixen errors i permeten funcions bàsiques. Sempre actives.'
            )
          }}
        </p>
      </div>
      <span class="badge">
        {{ t('cookies.labels.alwaysOn', 'Sempre actives') }}
      </span>
    </div>

    <button
      type="button"
      class="row clickable"
      @click="toggle('preferences')"
    >
      <div class="row-text">
        <h3>{{ t('cookies.categories.preferences', 'Preferències') }}</h3>
        <p>
          {{
            t(
              'cookies.categories.preferencesDesc',
              'Recorden idioma o configuracions de l’usuari.'
            )
          }}
        </p>
      </div>
      <input type="checkbox" :checked="consent.preferences" readonly />
    </button>

    <button
      type="button"
      class="row clickable"
      @click="toggle('analytics')"
    >
      <div class="row-text">
        <h3>{{ t('cookies.categories.analytics', 'Analítiques') }}</h3>
        <p>
          {{
            t(
              'cookies.categories.analyticsDesc',
              'Ens ajuden a entendre com s’utilitza el web (estadístiques).'
            )
          }}
        </p>
      </div>
      <input type="checkbox" :checked="consent.analytics" readonly />
    </button>

    <button
      type="button"
      class="row clickable"
      @click="toggle('marketing')"
    >
      <div class="row-text">
        <h3>{{ t('cookies.categories.marketing', 'Màrqueting') }}</h3>
        <p>
          {{
            t(
              'cookies.categories.marketingDesc',
              'Cookies de seguiment i publicitat personalitzada.'
            )
          }}
        </p>
      </div>
      <input type="checkbox" :checked="consent.marketing" readonly />
    </button>

    <div class="actions">
      <button
        type="button"
        class="btn btn-primary"
        @click="handleClose"
      >
        {{ t('cookies.actions.saveAndClose', 'Desar i tancar') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.cookie-settings-card {
  width: min(520px, 100vw - 32px); /* 👈 igual que el banner */
  background: var(--color-surface, #fff);
  border-radius: 14px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 1rem 1.25rem;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.settings-title {
  margin: 0 0 0.3rem;
  font-size: 1rem;
  font-weight: 600;
}

.settings-intro {
  margin: 0 0 0.6rem;
  font-size: 0.85rem;
  color: var(--color-text-muted, #555);
}

.row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.55rem 0;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  background: transparent;
  border-radius: 0;
}

.row:first-of-type {
  border-top: none;
}

.row-text h3 {
  margin: 0 0 0.2rem;
  font-size: 0.9rem;
}

.row-text p {
  margin: 0;
  font-size: 0.8rem;
  color: var(--color-text-muted, #666);
}

.badge {
  font-size: 0.75rem;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  background: #eee;
  color: #555;
}

.clickable {
  cursor: pointer;
  border: none;
  text-align: left;
}

input[type='checkbox'] {
  width: 18px;
  height: 18px;
  pointer-events: none;
}

.actions {
  margin-top: 0.7rem;
  text-align: right;
}

.btn {
  border-radius: 999px;
  padding: 0.4rem 1rem;
  font-size: 0.85rem;
  cursor: pointer;
  border: 1px solid transparent;
}

.btn-primary {
  background: var(--color-primary);
  color: #fff;
}

/* Mobile */
@media (max-width: 640px) {
  .cookie-settings-card {
    padding-inline: 1rem;
  }

  .row {
    align-items: flex-start;
  }
}
</style>

