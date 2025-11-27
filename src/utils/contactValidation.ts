// utils/contactValidation.ts

export type ContactFormData = {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  isSubmitting: boolean
  submited: boolean
  locale?: 'ca' | 'es' | 'en'
}

export type ContactValidationErrors = {
  name?: string
  email?: string
  subject?: string
  message?: string
  phone?: string
  _form?: string
}

function isValidEmail(email: string): boolean {
  // Validació simple però decent
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validateContactForm(
  data: ContactFormData,
): { valid: boolean; errors: ContactValidationErrors } {
  const errors: ContactValidationErrors = {}

  const name = (data.name || '').trim()
  const email = (data.email || '').trim()
  const subject = (data.subject || '').trim()
  const message = (data.message || '').trim()
  const phone = (data.phone || '').trim()

  // Nom: opcionalment obligatori (jo el faria obligatori)
  if (!name) {
    errors.name = 'El nom és obligatori.'
  } else if (name.length < 2) {
    errors.name = 'El nom és massa curt.'
  } else if (name.length > 80) {
    errors.name = 'El nom és massa llarg.'
  }

  // Email: obligatori i format bàsic
  if (!email) {
    errors.email = 'El correu és obligatori.'
  } else if (!isValidEmail(email)) {
    errors.email = 'El correu no sembla vàlid.'
  }

  // Subject: opcional, però si el posa, que tingui sentit
  if (subject && subject.length > 120) {
    errors.subject = 'L’assumpte és massa llarg.'
  }

  // Missatge: obligatori, amb mida mínima
  if (!message) {
    errors.message = 'El missatge és obligatori.'
  } else if (message.length < 10) {
    errors.message = 'El missatge és massa curt.'
  } else if (message.length > 4000) {
    errors.message = 'El missatge és massa llarg.'
  }

  // Telèfon: opcional, però si el posa, fem un mínim de sanitat
  if (phone) {
    const digits = phone.replace(/[^\d]/g, '')
    if (digits.length < 6) {
      errors.phone = 'El telèfon sembla massa curt.'
    } else if (digits.length > 20) {
      errors.phone = 'El telèfon sembla massa llarg.'
    }
  }

  const valid = Object.keys(errors).length === 0
  return { valid, errors }
}
