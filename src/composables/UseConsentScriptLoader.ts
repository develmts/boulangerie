import { useCookieConsent } from '~/composables/useCookieConsent'

export function useConsentScriptLoader() {
  const { consent } = useCookieConsent()

  function loadScript(category: 'analytics' | 'marketing', src: string) {
    if (!consent.value[category]) return

    const script = document.createElement('script')
    script.src = src
    script.async = true
    document.head.appendChild(script)
  }

  return { loadScript }
}
