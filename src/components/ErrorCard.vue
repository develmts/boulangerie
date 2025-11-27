<!-- components/ErrorCard.vue -->
<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  statusCode?: number | null
  title?: string
  description?: string
  mode?: 'modal' | 'inline'
  compact?: boolean
}>(), {
  mode: 'inline',
  compact: false,
})

const emit = defineEmits<{
  (e: 'primary'): void
}>()

const resolvedTitle = computed(() => {
  if (props.title) return props.title

  if (props.statusCode === 404) {
    return 'No hem trobat el que es buscava.'
  }

  if (
    props.statusCode !== null &&
    props.statusCode !== undefined &&
    props.statusCode >= 500 &&
    props.statusCode < 600
  ) {
    return 'S’ha produït un error intern.'
  }

  return 'S’ha produït un error.'
})

const resolvedDescription = computed(() => {
  if (props.description) return props.description

  if (props.statusCode === 404) {
    return 'Comprova l’adreça o torna a la pàgina principal.'
  }

  if (
    props.statusCode !== null &&
    props.statusCode !== undefined &&
    props.statusCode >= 500 &&
    props.statusCode < 600
  ) {
    return 'Torna-ho a provar més tard.'
  }

  return 'Torna-ho a provar més tard.'
})
</script>

<template>
  <!-- Modal mode -->
  <div v-if="mode === 'modal'" class="error-overlay">
    <div class="error-card" :class="{ 'error-card--compact': compact }">
      <div class="error-card__header">
        <span v-if="statusCode" class="error-card__code">
          {{ statusCode }}
        </span>
        <h2 class="error-card__title">
          {{ resolvedTitle }}
        </h2>
      </div>

      <p class="error-card__description">
        {{ resolvedDescription }}
      </p>

      <div class="error-card__actions">
        <slot name="actions">
          <button type="button" class="error-card__button" @click="emit('primary')">
            Tancar
          </button>
        </slot>
      </div>
    </div>
  </div>

  <!-- Inline mode -->
  <div v-else class="error-inline-wrapper">
    <div class="error-card" :class="{ 'error-card--compact': compact }">
      <div class="error-card__header">
        <span v-if="statusCode" class="error-card__code">
          {{ statusCode }}
        </span>
        <h2 class="error-card__title">
          {{ resolvedTitle }}
        </h2>
      </div>

      <p class="error-card__description">
        {{ resolvedDescription }}
      </p>

      <div class="error-card__actions">
        <slot name="actions">
          <button type="button" class="error-card__button" @click="emit('primary')">
            Tancar
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* -------- Overlay (modal) -------- */
.error-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;

  /* Semàntic: fons translúcid + blur */
  backdrop-filter: var(--overlay-blur, blur(6px));
  background: var(--overlay-bg, rgba(0, 0, 0, 0.1));
}

/* -------- Inline wrapper -------- */
.error-inline-wrapper {
  margin: 1.5rem 0;
}

/* -------- Targeta -------- */
.error-card {
  max-width: 480px;
  width: min(100% - 2rem, 480px);
  padding: 1.5rem 1.75rem;

  border-radius: var(--radius-lg, 1rem);
  background: var(--surface);
  border: 1px solid var(--surface-border);
  box-shadow: var(--surface-shadow);

  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.error-card--compact {
  max-width: 380px;
  padding: 1.25rem 1.5rem;
}

/* -------- Header -------- */
.error-card__header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.error-card__code {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;

  background: var(--badge-bg, rgba(0,0,0,0.05));
  color: var(--badge-fg, var(--text-muted));
}

.error-card__title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-strong);
}

/* -------- Descripció -------- */
.error-card__description {
  margin: 0.25rem 0 0.5rem;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--text-muted);
}

/* -------- Accions -------- */
.error-card__actions {
  margin-top: 0.25rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

/* -------- Botó (semantic) -------- */
.error-card__button {
  border-radius: 999px;
  border: 1px solid var(--button-border);
  padding: 0.45rem 1.1rem;
  font-size: 0.9rem;
  font-weight: 500;

  cursor: pointer;

  background: var(--button-bg);
  color: var(--button-fg);
  transition: background-color 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
}

.error-card__button:hover {
  background: var(--button-bg-hover);
  transform: translateY(-1px);
}

.error-card__button:active {
  transform: translateY(0);
  box-shadow: none;
}
</style>
