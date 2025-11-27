<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  validateContactForm,
  type ContactFormData,
  type ContactValidationErrors,
} from '~/utils/contactValidation'
import { sendContactMessage } from '~/services/email'

const { locale, t } = useI18n()

const form = reactive<ContactFormData>({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  isSubmitting: false,
  submited: false,
  locale: locale.value as 'ca' | 'es' | 'en',
})

const errors = reactive<ContactValidationErrors>({})
const isSubmitting = ref(false)
const submitted = ref(false)

function clearErrors() {
  for (const key of Object.keys(errors) as (keyof ContactValidationErrors)[]) {
    delete errors[key]
  }
}

async function handleSubmit() {
  clearErrors()
  submitted.value = false

  form.locale = (locale.value as 'ca' | 'es' | 'en') ?? 'ca'

  const { valid, errors: validationErrors } = validateContactForm(form)

  if (!valid) {
    Object.assign(errors, validationErrors)
    return
  }

  isSubmitting.value = true
  try {
    // Call local email service to send the message
    const res = await sendContactMessage(form)
    // old direct fetch to API. MOved to service/email.ts
    // const res = await $fetch<{
    //   ok: boolean
    //   error?: string
    //   details?: ContactValidationErrors
    // }>('/api/send-email', {
    //   method: 'POST',
    //   body: form,
    // })

    if (!res.ok) {
      if (res.error === 'VALIDATION_ERROR' && res.details) {
        Object.assign(errors, res.details)
      } else {
        errors._form =
          t?.('contact.error_generic') ??
          'No s’ha pogut enviar el missatge. Torna-ho a provar.'
      }
      return
    }

    submitted.value = true
    form.name = ''
    form.email = ''
    form.phone = ''
    form.subject = ''
    form.message = ''
  } catch (err) {
    console.error('[ContactForm] send-email error', err)
    errors._form =
      t?.('contact.error_network') ??
      'Error de connexió. Torna-ho a provar més tard.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <form class="contact-form" @submit.prevent="handleSubmit">
      
    <div class="form-row">
      <label class="form-label" for="name">{{ t('contact.formName') }}</label>
      <input id="name" v-model="form.name" type="text" required class="form-input" />
    </div>

    <div class="form-row">
      <label class="form-label" for="email">{{ t('contact.formEmail') }}</label>
      <input id="email" v-model="form.email" type="email" required class="form-input" />
    </div>

    <div class="form-row">
      <label class="form-label" for="message">{{ t('contact.formMessage') }}</label>
      <textarea id="message" v-model="form.message" rows="4" required class="form-textarea" />
    </div>

    <div class="form-actions">
      <button type="submit" class="form-submit" :disabled="isSubmitting">
          <span v-if="!isSubmitting">{{ t('contact.formSubmit') }}</span>
          <span v-else>...</span>
      </button>

      <p v-if="submitted" class="form-feedback">
          {{ t('contact.formFeedback') }}
      </p>
    </div>
  </form>
</template>

<style scoped>
/* .contact-form {
  max-width: 540px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem;
  border-radius: var(--radius-md, 8px);
  background-color: var(--color-surface, #ffffff);
  box-shadow: var(--shadow-soft, 0 8px 20px rgba(0, 0, 0, 0.04));
  border: 1px solid var(--color-border, #e2e2e2);
} */

.field {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.35rem;
  color: var(--color-text-strong, #2b2118);
}

input,
textarea {
  width: 100%;
  padding: 0.55rem 0.7rem;
  border-radius: 6px;
  border: 1px solid var(--color-border, #d8d0c4);
  font-size: 0.95rem;
  font-family: inherit;
  box-sizing: border-box;
  background-color: var(--color-background, #faf7f2);
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--color-primary, #b55b3c);
  box-shadow: 0 0 0 1px rgba(181, 91, 60, 0.2);
  background-color: #fff;
}

textarea {
  resize: vertical;
  min-height: 120px;
}

.error {
  margin: 0.25rem 0 0;
  font-size: 0.8rem;
  color: var(--color-error, #b3261e);
}

.global-error {
  margin-bottom: 0.75rem;
}

.contact-success {
  margin-bottom: 0.75rem;
  padding: 0.6rem 0.8rem;
  border-radius: 6px;
  background-color: #e6f4ea;
  color: #1e6b3b;
  font-size: 0.85rem;
  border: 1px solid #c4e3cf;
}

/* .submit-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 140px;
  padding: 0.6rem 1.2rem;
  border-radius: 999px;
  border: none;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  background-color: var(--color-primary, #b55b3c);
  color: var(--color-on-primary, #ffffff);
  transition:
    background-color 0.15s ease,
    transform 0.08s ease,
    box-shadow 0.1s ease;
}

.submit-button:hover:enabled {
  background-color: var(--color-primary-dark, #94462c);
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.submit-button:active:enabled {
  transform: translateY(0);
  box-shadow: none;
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: default;
} */

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-inline: 0.5rem;
}

/* Per defecte (mòbil): label a sobre, camp a sota */
.form-row {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.35rem;
}

.form-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--contact-text-muted);
}

.form-input,
.form-textarea {
  width: 100%;
  box-sizing: border-box;
  border-radius: 10px;
  border: 1px solid var(--contact-border-subtle);
  padding: 0.6rem 0.75rem;
  font-size: 0.9rem;
  font-family: var(--contact-font-body, system-ui, sans-serif);
  outline: none;
  background: #fffdf8;
}

.form-input:focus,
.form-textarea:focus {
  border-color: var(--contact-accent);
  box-shadow: 0 0 0 1px rgba(194, 106, 61, 0.15);
}

.form-textarea {
  resize: none;
}

.form-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.form-submit {
  border-radius: var(--contact-radius-pill);
  background: var(--contact-accent);
  color: white;
  padding: 0.5rem 1.3rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
}

.form-submit:disabled {
  opacity: 0.7;
}

.form-feedback {
  font-size: 0.8rem;
  color: var(--contact-text-muted);
}

/* RESPONSIVE */
/* Desktop / pantalles mitjanes: label a l'esquerra, camp a la dreta */
@media (min-width: 768px) {
  .form-row {
    display: grid;
    grid-template-columns: 160px minmax(0, 1fr);
    column-gap: 1rem;
    align-items: flex-start;
  }

  .form-label {
    margin-top: 0.3rem; /* alineació superior amb el camp */
    text-align: left;
  }
}
</style>
