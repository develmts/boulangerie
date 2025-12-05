import { describe, it, expect } from 'vitest'
import { setup, createPage } from '@nuxt/test-utils/e2e'

describe('Cart & checkout (browser)', async () => {
  await setup({
    browser: true,
    browserOptions: {
      type: 'chromium',
      // launch: { headless: false }, // si algun dia vols veure-ho
    },
  })

  it('afegir producte a la cistella i obrir overlay', async () => {
    const page = await createPage('/product/1')

    // si uses data-testid:
    await page.getByTestId('add-to-cart').click()
    await page.getByTestId('open-cart').click()
    await page.getByTestId('checkout').click()

    const overlayVisible = await page
      .getByTestId('cart-review-overlay')
      .isVisible()

    expect(overlayVisible).toBe(true)
  })
})
