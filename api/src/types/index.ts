export type UserRole = 'admin' | 'manager' | 'viewer'
export type ProductUnit = 'шт' | 'кг' | 'л' | 'уп'
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface User {
  id: string
  email: string
  name: string
  company: string
  role: UserRole
}

export interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
  unit: ProductUnit
  description?: string
}

export interface OrderItem {
  productId: string
  productName: string
  sku: string
  quantity: number
  priceAtOrder: number
  unit: string
}

export interface OrderStatusHistory {
  status: OrderStatus
  timestamp: string
  comment?: string
}

export interface Order {
  id: string
  number: string
  createdAt: string
  updatedAt: string
  status: OrderStatus
  items: OrderItem[]
  totalAmount: number
  address: string
  comment?: string
  statusHistory: OrderStatusHistory[]
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  totalPages: number
}

export const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending:    ['confirmed', 'cancelled'],
  confirmed:  ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped:    ['delivered'],
  delivered:  [],
  cancelled:  [],
}
