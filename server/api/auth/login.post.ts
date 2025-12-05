// src/server/api/auth/login.post.ts
import { defineEventHandler, readBody, setCookie } from 'h3'

const CUSTOMER_COOKIE_NAME = 'shopify_customer_token'

type LoginBody = {
  email?: string
  password?: string
}

/**
 * Mock login endpoint.
 *
 * In a real implementation this should:
 *  - Call Shopify Storefront API (customerAccessTokenCreate)
 *  - Store the customerAccessToken in a secure HttpOnly cookie
 *  - Optionally return a light customer profile for immediate UI use
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<LoginBody>(event)

  const email = body?.email?.trim()
  const password = body?.password?.trim()

  if (!email || !password) {
    return {
      ok: false,
      error: 'MISSING_CREDENTIALS',
      message: 'Email and password are required.',
    }
  }

  // ---------------------------------------------------------------------------
  // MOCK BEHAVIOUR
  // ---------------------------------------------------------------------------
  // For now, we accept any non-empty email/password and treat it as a valid login.
  // The cookie value is simply the email. In a real-world scenario this should
  // store the Shopify customerAccessToken instead.
  // ---------------------------------------------------------------------------

  const cookieValue = email // MOCK: direct email; later → Shopify accessToken
  const oneWeekMs = 7 * 24 * 60 * 60 * 1000
  const expiresAt = new Date(Date.now() + oneWeekMs)

  setCookie(event, CUSTOMER_COOKIE_NAME, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  })

  // Basic mock customer profile derived from email
  const firstName = email.split('@')[0] || 'Customer'

  return {
    ok: true,
    customer: {
      email,
      firstName,
      lastName: null as string | null,
    },
  }
})
