// composables/useCookieConsent.ts
import { useCookie } from 'nuxt/app'

export type CookieCategory = 'necessary' | 'preferences' | 'analytics' | 'marketing'

export interface CookieConsentState {
  necessary: boolean
  preferences: boolean
  analytics: boolean
  marketing: boolean
}

const DEFAULT_STATE: CookieConsentState = {
  necessary: true,
  preferences: false,
  analytics: false,
  marketing: false
}

export function useCookieConsent() {
  const consent = useCookie<CookieConsentState | null>('cookie-consent-v2', {
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 any
    default: () => null
  })

  // const hasAnswered = computed(() => {
  //   return consent.value !== null && consent.value !== undefined
  // })

  const hasAnswered = computed(() => {return consent.value !== null })

  // Per llegir l'estat efectiu (si no hi ha consent, usem DEFAULT_STATE)
  const effectiveConsent = computed<CookieConsentState>(() => {
    return consent.value ?? DEFAULT_STATE
  })


  function acceptAll() {
    consent.value = {
      necessary: true,
      preferences: true,
      analytics: true,
      marketing: true
    }
  }

  function rejectAll() {
    consent.value = {
      necessary: true,
      preferences: false,
      analytics: false,
      marketing: false
    }
  }

  function updateCategory(cat: CookieCategory, value: boolean) {
    const base = consent.value ?? DEFAULT_STATE
    consent.value = {
      ...base,
      [cat]: value
    }
  }

  return {
    consent: effectiveConsent, // 👈 fora de la composable sempre veuràs un estat “sencer”
    hasAnswered,
    acceptAll,
    rejectAll,
    updateCategory
  }
}
