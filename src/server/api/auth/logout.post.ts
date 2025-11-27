// src/server/api/auth/logout.post.ts
import { defineEventHandler, deleteCookie } from 'h3'

const CUSTOMER_COOKIE_NAME = 'shopify_customer_token'

/**
 * Logs the customer out by clearing the auth cookie.
 *
 * In a real implementation you might also:
 *  - Call Shopify to revoke the customerAccessToken (optional)
 */
export default defineEventHandler(async (event) => {
  deleteCookie(event, CUSTOMER_COOKIE_NAME, {
    path: '/',
  })

  return {
    ok: true,
  }
})
