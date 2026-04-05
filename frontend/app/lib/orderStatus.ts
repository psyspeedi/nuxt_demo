import { OrderStatus } from '~~/types/order'

export const STATUS_MAP: Record<OrderStatus, { label: string; color: string; icon: string }> = {
  [OrderStatus.Pending]:    { label: 'Ожидает',      color: 'orange',       icon: 'mdi-clock-outline' },
  [OrderStatus.Confirmed]:  { label: 'Подтверждён',  color: 'blue',         icon: 'mdi-check' },
  [OrderStatus.Processing]: { label: 'В обработке',  color: 'deep-purple',  icon: 'mdi-progress-wrench' },
  [OrderStatus.Shipped]:    { label: 'Отправлен',    color: 'cyan-darken-1',icon: 'mdi-truck-delivery-outline' },
  [OrderStatus.Delivered]:  { label: 'Доставлен',    color: 'success',      icon: 'mdi-check-circle-outline' },
  [OrderStatus.Cancelled]:  { label: 'Отменён',      color: 'error',        icon: 'mdi-close-circle-outline' },
} as const
