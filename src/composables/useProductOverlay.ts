// src/composables/useProductDetailOverlay.ts
import { ref } from 'vue'
import type { ShopifyProduct } from '~/services/shopify'

const isOpen = ref(false)
const selectedProduct = ref<ShopifyProduct | null>(null)

export function useProductOverlay() {
  function open(product: ShopifyProduct) {
    selectedProduct.value = product
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  return {
    isOpen,
    selectedProduct,
    open,
    close,
  }
}
