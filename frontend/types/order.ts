import { OrderStatus } from './enums'
import type { ProductUnit } from './enums'

export { OrderStatus } from './enums'

export const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.Pending]:    [OrderStatus.Confirmed, OrderStatus.Cancelled],
  [OrderStatus.Confirmed]:  [OrderStatus.Processing, OrderStatus.Cancelled],
  [OrderStatus.Processing]: [OrderStatus.Shipped, OrderStatus.Cancelled],
  [OrderStatus.Shipped]:    [OrderStatus.Delivered],
  [OrderStatus.Delivered]:  [],
  [OrderStatus.Cancelled]:  [],
}

export type OrderStatusHistory = {
  status: OrderStatus
  timestamp: string
  comment?: string
}

export type OrderItem = {
  productId: string
  productName: string
  sku: string
  quantity: number
  priceAtOrder: number
  unit: ProductUnit | string
}

export type Order = {
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

export type OrderFilters = {
  status?: OrderStatus | ''
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}

export type ApiError = {
  statusCode: number
  message: string
}
