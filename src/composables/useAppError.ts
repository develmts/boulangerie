// composables/useAppError.ts
import { ref, computed } from 'vue'

export interface AppErrorPayload {
  statusCode?: number | null
  title?: string
  description?: string
  /** Espai per info extra per a logs, debug, etc. (no es mostra a la UI) */
  details?: unknown
}

/**
 * Petit “error store” a nivell d'aplicació.
 * - Qualsevol component/pàgina pot cridar showError(...)
 * - El layout pot llegir `error` i `isVisible` per mostrar l'ErrorCard.
 */
const currentError = ref<AppErrorPayload | null>(null)
const visible = ref(false)

export function useAppError() {
  /**
   * Mostra un error a nivell d'aplicació.
   * Normalment faràs servir això des d'una pàgina o composable d'API.
   */
  function showError(payload: AppErrorPayload) {
    currentError.value = payload
    visible.value = true
  }

  /**
   * Helper específic per errors HTTP (404, 500, etc.)
   * Pots reutilitzar-lo a rutes, fetchers, etc.
   */
  function showHttpError(statusCode: number, overrides?: Omit<AppErrorPayload, 'statusCode'>) {
    showError({
      statusCode,
      ...overrides,
    })
  }

  /**
   * Amaga l'error actual (el layout el pot cridar quan es tanca el modal,
   * o quan l'usuari prem el botó "Tancar" / "Tornar a l'inici").
   */
  function clearError() {
    visible.value = false
    currentError.value = null
  }

  const error = computed(() => currentError.value)
  const isVisible = computed(() => visible.value)

  return {
    error,
    isVisible,
    showError,
    showHttpError,
    clearError,
  }
}
