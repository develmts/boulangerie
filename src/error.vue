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
    <!-- 404 → modal + botó Tornar + mini link detalls -->
    <ErrorCard
      v-if="statusCode === 404"
      mode="modal"
      :status-code="404"
    >
      <template #actions>
        <button class="error-card__button" type="button" @click="goHome">
          Tornar a l’inici
        </button>

        <button
          v-if="isDev"
          type="button"
          class="error-debug-link"
          @click="toggleDebug"
        >
          detalls
        </button>
      </template>
    </ErrorCard>

    <!-- 5xx / altres → modal sense accions, només mini link detalls en dev -->
    <ErrorCard
      v-else
      mode="modal"
      :status-code="statusCode"
    >
      <template #actions>
        <button
          v-if="isDev"
          type="button"
          class="error-debug-link"
          @click="toggleDebug"
        >
          detalls
        </button>
      </template>
    </ErrorCard>

    <!-- Panell de debug (només dev, i només si s’ha clicat “detalls”) -->
    <div v-if="isDev && showDebug" class="error-debug-panel">
      <pre class="error-debug-panel__pre">
{{ formattedError }}
      </pre>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  /* El modal ja centra la targeta; aquí només assegurem que ocupa tota la pantalla
     per si cal algun fons o context. */
  min-height: 100vh;
}

/* Mini link “gairebé invisible” per debug */
.error-debug-link {
  border: none;
  background: transparent;
  font-size: 0.75rem;
  padding: 0;
  margin-left: 0.5rem;
  cursor: pointer;
  opacity: 0.25;
  text-decoration: none;
  color: var(--text-muted);
}

.error-debug-link:hover {
  opacity: 0.6;
  text-decoration: underline;
}

/* Panell de debug discret, només en dev */
.error-debug-panel {
  position: fixed;
  inset: auto 0 0 0;
  max-height: 40vh;
  overflow: auto;
  padding: 0.75rem 1rem;
  background: var(--surface);
  border-top: 1px solid var(--surface-border);
  box-shadow: 0 -8px 20px rgba(0, 0, 0, 0.08);
  font-size: 0.75rem;
}

.error-debug-panel__pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
}
</style>
