import type { ProductUnit } from './enums'

export { ProductUnit } from './enums'

export type Product = {
  id: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
  unit: ProductUnit
  imageUrl?: string
  description?: string
}

export type ProductFilters = {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  page?: number
  limit?: number
}

export type PaginatedResponse<T> = {
  items: T[]
  total: number
  page: number
  totalPages: number
}
