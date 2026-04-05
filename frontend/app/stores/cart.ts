import { defineStore } from 'pinia'
import type { Product } from '~~/types/product'
import type { Order } from '~~/types/order'
import type { CartItem } from '~~/types/cart'

const DISCOUNT_THRESHOLD = 50_000
const DISCOUNT_RATE = 0.05

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const submitting = ref(false)

  const totalPositions = computed(() => items.value.length)

  const totalQuantity = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const totalAmount = computed(() =>
    items.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  )

  const discount = computed(() =>
    totalAmount.value > DISCOUNT_THRESHOLD ? totalAmount.value * DISCOUNT_RATE : 0
  )

  const totalAmountWithDiscount = computed(() =>
    totalAmount.value - discount.value
  )

  const isEmpty = computed(() => items.value.length === 0)

  const api = useApi()
  const notifications = useNotifications()

  const addItem = (product: Product, quantity = 1) => {
    const existing = items.value.find(item => item.product.id === product.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      items.value.push({ product, quantity })
    }
    notifications.success(`${product.name} добавлен в корзину`)
  }

  const removeItem = (productId: string) => {
    const index = items.value.findIndex(item => item.product.id === productId)
    if (index !== -1) {
      items.value.splice(index, 1)
    }
  }

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeItem(productId)
      return
    }
    const item = items.value.find(item => item.product.id === productId)
    if (item) {
      item.quantity = qty
    }
  }

  const clear = () => {
    items.value = []
  }

  const checkout = async (address: string, comment?: string): Promise<Order> => {
    submitting.value = true
    try {
      const order = await api.post<Order>('/orders', {
        items: items.value,
        address,
        comment
      })
      clear()
      notifications.success('Заказ успешно оформлен!')
      return order
    } catch (err) {
      notifications.error((err as Error).message)
      throw err
    } finally {
      submitting.value = false
    }
  }

  return {
    items,
    submitting,
    totalPositions,
    totalQuantity,
    totalAmount,
    discount,
    totalAmountWithDiscount,
    isEmpty,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    checkout
  }
}, {
  persist: {
    pick: ['items']
  }
})
