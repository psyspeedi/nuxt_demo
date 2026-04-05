import type { NotificationType } from './enums'

export { NotificationType } from './enums'

export type Notification = {
  id: string
  message: string
  type: NotificationType
  timeout: number
}

export type ConfirmOptions = {
  title?: string
  confirmText?: string
  cancelText?: string
  color?: string
}

export type UseFiltersOptions<T extends Record<string, unknown>> = {
  defaults: T
  debounceFields?: (keyof T)[]
  debounceMs?: number
}
