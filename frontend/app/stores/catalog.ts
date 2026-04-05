import { defineStore } from 'pinia'
import type { Product, ProductFilters, PaginatedResponse } from '~~/types/product'

export const useCatalogStore = defineStore('catalog', () => {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const total = ref(0)
  const totalPages = ref(0)
  const categories = ref<string[]>([])

  const isEmpty = computed(() => products.value.length === 0)

  const api = useApi()

  const fetchProducts = async (params: ProductFilters) => {
    loading.value = true
    try {
      const response = await api.get<PaginatedResponse<Product>>(
        '/products',
        params as Record<string, unknown>
      )
      products.value = response.items ?? []
      total.value = response.total ?? 0
      totalPages.value = response.totalPages ?? 0
    } finally {
      loading.value = false
    }
  }

  const fetchCategories = async () => {
    const response = await api.get<{ categories: string[] }>('/products/categories')
    categories.value = response.categories ?? []
  }

  return {
    products,
    loading,
    total,
    totalPages,
    categories,
    isEmpty,
    fetchProducts,
    fetchCategories,
  }
})
