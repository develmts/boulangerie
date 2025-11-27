// server/api/send-email.post.ts
import { defineEventHandler, readBody } from 'h3'
import { buildContactEmailHtml } from '~/utils/emailTemplates'
import {
  validateContactForm,
  type ContactFormData,
} from '~/utils/contactValidation'

export default defineEventHandler(async (event) => {
  // 🔹 NOMÉS una declaració de body, amb el tipus correcte
  const body = await readBody<ContactFormData>(event)
  
  const apiKey = process.env.MAILJET_API_KEY
  const apiSecret = process.env.MAILJET_API_SECRET
  const sender = process.env.MAILJET_SENDER
  const ownerEmail = process.env.CONTACT_OWNER_EMAIL || sender
  const bakeryName = process.env.BAKERY_NAME || 'Boulangerie Demo'

  if (!apiKey || !apiSecret || !sender || !ownerEmail) {
    console.error('[send-email] Falten variables d’entorn Mailjet')
    return {
      ok: false,
      error: 'Mailjet NO configurat correctament',
    }
  }

  // 🔹 VALIDACIÓ SERVER-SIDE amb la funció compartida
  const { valid, errors } = validateContactForm(body)

  if (!valid) {
    console.warn('[send-email] VALIDATION_ERROR', errors)
    return {
      ok: false,
      error: 'VALIDATION_ERROR',
      details: errors,
    }
  }

  const locale = body.locale ?? 'ca'

  // IP per a meta-informació
  const ipHeader = event.node.req.headers['x-forwarded-for'] as
    | string
    | undefined
  const ip =
    ipHeader?.split(',')[0]?.trim() ||
    event.node.req.socket.remoteAddress ||
    undefined

  // HTML bonic amb la plantilla externa
  const html = buildContactEmailHtml({
    bakeryName,
    locale,
    customerName: body.name,
    customerEmail: body.email,
    customerPhone: body.phone,
    subject: body.subject,
    message: body.message,
    ip,
  })

  const subject =
    body.subject && body.subject.trim().length > 0
      ? `[Boulangerie] ${body.subject.trim()}`
      : '[Boulangerie] Nou missatge des del web'

  try {
    const response = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(apiKey + ':' + apiSecret).toString('base64'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Messages: [
          {
            From: {
              Email: sender,
              Name: bakeryName,
            },
            To: [
              {
                Email: ownerEmail,
                Name: 'Boulangerie',
              },
            ],
            ReplyTo: {
              Email: body.email,
              Name: body.name,
            },
            Subject: subject,
            TextPart: body.message,
            HTMLPart: html,
          },
        ],
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('[send-email] Error Mailjet', result)
      return {
        ok: false,
        error: 'Error enviant el correu via Mailjet',
        details: result,
      }
    }

    // Aquí, més endavant, hi afegirem el logging estructurat dels emails
    return { ok: true, result }
  } catch (err) {
    console.error('[send-email] Exception', err)
    return {
      ok: false,
      error: 'Error inesperat enviant el correu',
    }
  }
})
