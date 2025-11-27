// composables/useAuthUI.ts
import { useCustomer } from '~/composables/useCustomer'
import { useAuthOverlay } from '~/composables/useAuthOverlay'

export function useAuthUI() {
  const { customer, isLoggedIn, loading, hydrate, logout } = useCustomer()
  const { open, close, isOpen, mode } = useAuthOverlay()

  function openDefault() {
    // decideix automàticament login vs account
    console.log('[useAuthUI] openDefault called')
    const nextMode = isLoggedIn.value ? 'account' : 'login'
    open(nextMode)

  }

  return {
    // estat
    customer,
    isLoggedIn,
    loading,
    isOverlayOpen: isOpen,
    overlayMode: mode,

    // accions
    hydrate,
    logout,
    openDefault,
    openOverlay: open,
    closeOverlay: close,
  }
}
