// src/composables/useCart.ts
import { ref , computed} from 'vue'
import {
  getProducts,
  addCartLines,
  clearCart as apiClearCart,
  getCart as apiGetCart,
  updateCartLineQuantity,
  removeCartLine,
  type Cart,
  Locale,
} from '~/services/shopify'

const products = await getProducts(undefined, 'ca' as Locale)   // Mock

// ✅ Estat compartit entre tots els components
const cart = ref<Cart | null>(null)
const isCartOpen = ref(false)
const isLoading = ref(false)

function openCart() {
  isCartOpen.value = true
}

function closeCart() {
  isCartOpen.value = false
}

function toggleCart() {
  isCartOpen.value = !isCartOpen.value
}

async function refreshCart() {
  isLoading.value = true
  cart.value = await apiGetCart()
  isLoading.value = false
}

export function useCart() {
  // Primer ús: assegurem que hi ha cistella carregada
  if (!cart.value && !isLoading.value) {
    refreshCart()
  }

  const productsById = computed(() => {
    const map = new Map<string, { title: string; price: number }>()
    for (const p of products) {   // on allProducts ve del mock o de Shopify
      map.set(p.id, { title: p.title, price:  p.priceMin })
    }
    return map
  })

  const enrichedLines = computed(() =>
    cart.value?.lines.map((line) => {

      const info = productsById.value.get(line.productId) 
      return {
        ...line,
        productTitle: info?.title ?? line.productId,
        unitPrice: info?.price ?? 0,
        lineTotal: (info?.price ?? 0) * line.quantity,
      }
    }),
  )

  const cartSubtotal = computed(() =>
    enrichedLines.value?.reduce((sum, line) => sum + line.lineTotal, 0),
  )

  const cartTotalQuantity = computed(() =>
    enrichedLines.value?.reduce((sum, line) => sum + line.quantity, 0),
  )



  async function addItem(productId: string, quantity = 1) {
    isLoading.value = true
    await addCartLines([{ productId, quantity }])
    await refreshCart()
    isLoading.value = false

    // ❌ IMPORTANT: NO cridem openCart() aquí.
    // Només afegim al carro; obrir/tancar depèn de la UI.
  }

  async function updateItem(lineId: string, qty: number) {
    isLoading.value = true
    await updateCartLineQuantity(lineId, qty)
    await refreshCart()
    isLoading.value = false
  }

  async function removeItem(lineId: string) {
    isLoading.value = true
    await removeCartLine(lineId)
    await refreshCart()
    isLoading.value = false
  }

  async function clearCart() {
    isLoading.value = true
    await apiClearCart()
    await refreshCart()
    isLoading.value = false
  }

  return {
    cart,
    isLoading,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
    addItem,
    updateItem,
    removeItem,
    enrichedLines,
    cartSubtotal,
    cartTotalQuantity,
    clearCart,
  }
}



