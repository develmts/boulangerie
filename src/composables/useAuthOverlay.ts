// composables/useAuthOverlay.ts
export type AuthOverlayMode = 'login' | 'account' | 'register' 

export function useAuthOverlay() {
  const isOpen = useState<boolean>('auth-overlay-open', () => false)
  const mode = useState<AuthOverlayMode>('auth-overlay-mode', () => 'login')

  function open(newMode: AuthOverlayMode) {
    mode.value = newMode
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  return {
    isOpen,
    mode,
    open,
    close,
  }
}
