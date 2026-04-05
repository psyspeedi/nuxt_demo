import { defineStore } from 'pinia'
import type { Order, OrderFilters, OrderStatus } from '~~/types/order'

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref<Order[]>([])
  const dashboardOrders = ref<Order[]>([])
  const currentOrder = ref<Order | null>(null)
  const loading = ref(false)
  const dashboardLoading = ref(false)
  const updating = ref(false)
  const total = ref(0)
  const totalPages = ref(0)

  const api = useApi()
  const notifications = useNotifications()

  const orderById = (id: string) => orders.value.find(o => o.id === id)

  const recentOrders = computed(() =>
    [...dashboardOrders.value]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  )

  const currentMonthOrders = computed(() => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    return dashboardOrders.value.filter(o => new Date(o.createdAt) >= startOfMonth)
  })

  const currentMonthTotal = computed(() =>
    currentMonthOrders.value.reduce((sum, o) => sum + o.totalAmount, 0)
  )

  const processingCount = computed(() =>
    dashboardOrders.value.filter(o => o.status === 'processing').length
  )

  const fetchDashboardStats = async () => {
    dashboardLoading.value = true
    try {
      const response = await api.get<{ items: Order[], total: number, totalPages: number }>(
        '/orders',
        { limit: 1000 } as Record<string, unknown>
      )
      dashboardOrders.value = response.items ?? []
    } finally {
      dashboardLoading.value = false
    }
  }

  const fetchOrders = async (params?: OrderFilters) => {
    loading.value = true
    try {
      const response = await api.get<{ items: Order[], total: number, totalPages: number }>(
        '/orders',
        params as Record<string, unknown>
      )
      orders.value = response.items ?? []
      total.value = response.total ?? 0
      totalPages.value = response.totalPages ?? 0
    } finally {
      loading.value = false
    }
  }

  const fetchOrder = async (id: string): Promise<Order> => {
    const response = await api.get<Order>(`/orders/${id}`)
    currentOrder.value = response
    return response
  }

  const updateStatus = async (id: string, status: OrderStatus, comment?: string) => {
    const orderIndex = orders.value.findIndex(o => o.id === id)
    const oldStatus = orders.value[orderIndex]?.status
    const oldOrder = currentOrder.value

    if (orderIndex !== -1) {
      orders.value[orderIndex] = { ...orders.value[orderIndex], status }
    }
    if (currentOrder.value?.id === id) {
      currentOrder.value = { ...currentOrder.value, status }
    }

    updating.value = true
    try {
      const response = await api.patch<Order>(`/orders/${id}/status`, { status, comment })
      if (orderIndex !== -1) {
        orders.value[orderIndex] = response
      }
      if (currentOrder.value?.id === id) {
        currentOrder.value = response
      }
      notifications.success('Статус обновлён')
    } catch (err) {
      if (orderIndex !== -1) {
        orders.value[orderIndex] = { ...orders.value[orderIndex], status: oldStatus }
      }
      if (currentOrder.value?.id === id && oldOrder) {
        currentOrder.value = oldOrder
      }
      notifications.error((err as Error).message)
      throw err
    } finally {
      updating.value = false
    }
  }

  return {
    orders,
    dashboardOrders,
    currentOrder,
    loading,
    dashboardLoading,
    updating,
    total,
    totalPages,
    orderById,
    recentOrders,
    currentMonthOrders,
    currentMonthTotal,
    processingCount,
    fetchOrders,
    fetchDashboardStats,
    fetchOrder,
    updateStatus
  }
})
