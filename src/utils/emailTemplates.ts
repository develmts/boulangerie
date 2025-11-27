// server/utils/emailTemplates.ts


import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export type ContactEmailPayload = {
  bakeryName: string
  locale: 'ca' | 'es' | 'en'
  customerName: string
  customerEmail: string
  customerPhone?: string
  subject?: string
  message: string
  ip?: string
  sentAt?: string
}

function esc(value: string | undefined | null): string {
  return (value ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function buildContactEmailHtml(payload: ContactEmailPayload): string {
  const {
    bakeryName,
    locale,
    customerName,
    customerEmail,
    customerPhone,
    subject,
    message,
    ip,
    sentAt,
  } = payload

  const now = sentAt ?? new Date().toLocaleString(locale)
  const year = new Date().getFullYear()

  const ipPart = ip ? ` des de l'IP ${esc(ip)}` : ''

  const phoneBlock = customerPhone
    ? `<p class="label">Telèfon</p><p class="value">${esc(
        customerPhone,
      )}</p>`
    : ''

  const subjectBlock = subject
    ? `<p class="label">Assumpte</p><p class="value">${esc(subject)}</p>`
    : ''

  // let html = contactTemplateRaw
  let html= loadEmailTemplate('contact-owner.html')

  html = html.replace(/__LOCALE__/g, locale)
  html = html.replace(/__SUBJECT__/g, esc(subject || 'Nou missatge de contacte'))
  html = html.replace(/__BAKERY_NAME__/g, esc(bakeryName))
  html = html.replace(/__CUSTOMER_NAME__/g, esc(customerName))
  html = html.replace(/__CUSTOMER_EMAIL__/g, esc(customerEmail))
  html = html.replace(/__MESSAGE__/g, esc(message))
  html = html.replace(/__SENT_AT__/g, esc(now))
  html = html.replace(/__IP_PART__/g, ipPart)
  html = html.replace(/__YEAR__/g, String(year))
  html = html.replace(/__PHONE_BLOCK__/g, phoneBlock)
  html = html.replace(/__SUBJECT_BLOCK__/g, subjectBlock)

  return html
}


export function loadEmailTemplate(filename: string): string {
  const templatePath = join(process.cwd(), 'src/server/templates', filename)
  return readFileSync(templatePath, 'utf8')
}

export const TPL_OWNER = loadEmailTemplate('contact-owner.html')
export const TPL_CUSTOMER = loadEmailTemplate('contact-customer.html')
