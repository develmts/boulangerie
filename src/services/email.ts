// services/email.ts
import type { NitroFetchRequest } from 'nitropack'

export type ContactFormPayload = {
  name: string
  email: string
  message: string
  phone?: string
  subject?: string
  locale?: string
}

export type ContactFormErrorDetails = Record<string, string[] | string>

export type ContactFormResponse = {
  ok: boolean
  error?: string
  details?: ContactFormErrorDetails
}

/**
 * Envia el formulari de contacte al backend (/api/send-email),
 * que al seu torn valida i envia via Mailjet.
 */
// export async function sendContactMessage(
//   payload: ContactFormPayload,
// ): Promise<ContactFormResponse> {
//   try {
//     const res = await $fetch<ContactFormResponse, NitroFetchRequest>(
//       '/api/send-email',
//       {
//         method: 'POST',
//         body: payload,
//       },
//     )

//     return res
//   } catch (err: any) {
//     console.error('[email] Error cridant /api/send-email:', err)

//     // Si el backend ha retornat JSON amb { ok, error, details },
//     // Nuxt el pot ficar a err.data
//     const data = err?.data as ContactFormResponse | undefined

//     if (data && typeof data.ok === 'boolean') {
//       return data
//     }

//     return {
//       ok: false,
//       error: 'NETWORK_OR_UNKNOWN_ERROR',
//     }
//   }
// }

// services/email.ts
import type {
  ContactFormData,
  ContactValidationErrors,
} from '~/utils/contactValidation'

export type SendEmailResponse = {
  ok: boolean
  error?: string
  details?: ContactValidationErrors
}

/**
 * Envia el formulari de contacte al backend `/api/send-email`.
 * 
 * - Retorna EXACTAMENT el mateix tipus que el $fetch original.
 * - Deixa que $fetch llanci en cas d'error de xarxa / server
 *   (el component seguirà fent el try/catch com fins ara).
 */
export async function sendContactMessage(
  form: ContactFormData,
): Promise<SendEmailResponse> {
  return await $fetch<SendEmailResponse>('/api/send-email', {
    method: 'POST',
    body: form,
  })
}

