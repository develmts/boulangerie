// src/server/api/auth/me.get.ts
import { defineEventHandler, getCookie } from 'h3'

const FORCE_MOCK_LOGGED_IN = false

const CUSTOMER_COOKIE_NAME = 'shopify_customer_token'

/**
 * Returns the current authenticated customer (mock).
 *
 * Real behaviour should:
 *  - Read the Shopify customerAccessToken from the cookie
 *  - Call Shopify Storefront API:
 *      query customer(customerAccessToken: $token) { ... }
 *  - Map the result to your internal Customer model
 */
export default defineEventHandler(async (event) => {

  if (FORCE_MOCK_LOGGED_IN) {
    return {
      loggedIn: true,
      customer: {
        email: 'demo.user@example.com',
        firstName: 'Demo',
        lastName: 'User',
      },
    }
  }

  const token = getCookie(event, CUSTOMER_COOKIE_NAME)

  if (!token) {
    return {
      loggedIn: false,
      customer: null,
    }
  }

  // ---------------------------------------------------------------------------
  // MOCK DECODE
  // ---------------------------------------------------------------------------
  // In this mock, the cookie value *is* the email. In a real version, this
  // should be a Shopify customerAccessToken and you would fetch the profile
  // from the Storefront API using that token.
  // ---------------------------------------------------------------------------

  const email = token
  const firstName = email.split('@')[0] || 'Customer'

  const customer = {
    email,
    firstName,
    lastName: null as string | null,
  }

  return {
    loggedIn: true,
    customer,
  }
})
