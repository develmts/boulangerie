import { describe, it, expect } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'

describe('Nuxt 4 migration smoke tests', async () => {
  // aixeca un Nuxt + Nitro per als tests
  await setup({
    // per defecte rootDir = '.', ja et va bé per Boulangerie
    // si vols evitar build cada vegada:
    // build: false,
  })

  it('home SSR ok i mostra la home', async () => {
    const html = await $fetch('/')
    expect(html).toContain('Boulangerie')      // H1 o similar
    expect(html).toContain('data-test="product-card"') // productes destacats
  })

  it('/ca/blog es carrega i llista articles', async () => {
    const html = await $fetch('/ca/blog')
    expect(html).toContain('data-test="blog-list"')
  })

  it('pàgina de producte es carrega', async () => {
    const html = await $fetch('/product/1')
    expect(html).toContain('data-test="product-title"')
    expect(html).toContain('data-test="add-to-cart"')
  })

  it('ruta d’error mostra ErrorCard', async () => {
    const html = await $fetch('/debug/error500') // quan la tinguis
    expect(html).toContain('data-test="error-card"')
  })
})
