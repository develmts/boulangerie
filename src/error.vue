<!-- error.vue -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import type { NuxtError } from 'nuxt/app'
import { clearError as nuxtClearError } from 'nuxt/app'
import ErrorCard from '~/components/ErrorCard.vue'

const props = defineProps<{
  error: NuxtError
}>()

// Just to kill Chrome DevTools spamming / .well-known/appspecific/...
const raw = props.error as any
const url = raw.url || raw.cause?.url || ''
// const url = props.error?.url || props.error?.cause?.url || ''

if (url.includes('/.well-known/appspecific/com.chrome.devtools.json')) {
  nuxtClearError()
}

const statusCode = computed(() => {
  const raw = Number(props.error.statusCode)
  if (!Number.isFinite(raw) || raw <= 0) return 500
  return raw
})

const showDebug = ref(false)
const isDev = import.meta.dev

function toggleDebug() {
  if (!isDev) return
  showDebug.value = !showDebug.value
}

function goHome() {
  nuxtClearError({ redirect: '/' })
}

const formattedError = computed(() => {
  try {
    return JSON.stringify(props.error, null, 2)
  } catch {
    return String(props.error)
  }
})

// Log complet només en dev (consola, no UI)
if (isDev) {
  // eslint-disable-next-line no-console
  console.error('[Nuxt Error - DEV]', props.error)
}
</script>

<template>
  <div class="error-page">
    <!-- 404 → modal + botó Tornar + link detalls -->
    <ErrorCard
      v-if="statusCode === 404"
      mode="modal"
      :status-code="404"
    >
      <template #actions>
        <div class="error-actions">
          <button class="error-card__button" type="button" @click="goHome">
            Tornar a l’inici
          </button>

          <button
            v-if="isDev"
            type="button"
            class="error-debug-link"
            @click="toggleDebug"
          >
            Detalls tècnics
          </button>
        </div>

        <Transition name="error-debug-fade">
          <div
            v-if="isDev && showDebug"
            class="error-debug-inline"
          >
            <div class="error-debug-inline__header">
              <span>Detalls tècnics</span>
              <button
                type="button"
                class="error-debug-inline__close"
                @click="toggleDebug"
              >
                ×
              </button>
            </div>
            <pre class="error-debug-inline__pre">
{{ formattedError }}
            </pre>
          </div>
        </Transition>
      </template>
    </ErrorCard>

    <!-- 5xx / altres → modal sense accions, només link detalls en dev -->
    <ErrorCard
      v-else
      mode="modal"
      :status-code="statusCode"
    >
      <template #actions>
        <div class="error-actions">
          <button
            v-if="isDev"
            type="button"
            class="error-debug-link"
            @click="toggleDebug"
          >
            Detalls tècnics
          </button>
        </div>

        <Transition name="error-debug-fade">
          <div
            v-if="isDev && showDebug"
            class="error-debug-inline"
          >
            <div class="error-debug-inline__header">
              <span>Detalls tècnics</span>
              <button
                type="button"
                class="error-debug-inline__close"
                @click="toggleDebug"
              >
                ×
              </button>
            </div>
            <pre class="error-debug-inline__pre">
{{ formattedError }}
            </pre>
          </div>
        </Transition>
      </template>
    </ErrorCard>
  </div>
</template>

<style scoped>
.error-page {
  min-height: 100vh;
}

/* Accions a la part baixa de l’ErrorCard */
.error-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

/* Mini link per debug (ara una mica més visible però discret) */
.error-debug-link {
  border: none;
  background: transparent;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  opacity: 0.5;
  text-decoration: none;
  color: var(--text-muted);
  border-radius: 999px;
  border: 1px solid var(--surface-border);
}

.error-debug-link:hover {
  opacity: 0.9;
}

/* Panell de debug inline dins la targeta */
.error-debug-inline {
  margin-top: 0.75rem;
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid var(--surface-border);
  background: var(--code-bg, #05060a);
  color: var(--code-fg, #f5f5f5);
  font-size: 0.75rem;
  overflow: hidden;
}

.error-debug-inline__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem 0.75rem;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.error-debug-inline__header span {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.68rem;
  opacity: 0.8;
}

.error-debug-inline__close {
  border: none;
  background: transparent;
  color: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0 0.2rem;
  line-height: 1;
  opacity: 0.7;
}

.error-debug-inline__close:hover {
  opacity: 1;
}

.error-debug-inline__pre {
  margin: 0;
  padding: 0.5rem 0.75rem 0.75rem;
  max-height: 16rem;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
}

/* Transició suau d’entrada/sortida del panell */
.error-debug-fade-enter-active,
.error-debug-fade-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.error-debug-fade-enter-from,
.error-debug-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
