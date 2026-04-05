import { NotificationType, type Notification } from '~~/types/composables'

const notifications = ref<Notification[]>([])

export const useNotifications = () => ({
  notifications: readonly(notifications),

  show(message: string, type: NotificationType, timeout = 4000): void {
    const id = Date.now().toString()
    notifications.value.push({ id, message, type, timeout })
    setTimeout(() => {
      this.dismiss(id)
    }, timeout)
  },

  success(message: string): void {
    this.show(message, NotificationType.Success)
  },

  error(message: string): void {
    this.show(message, NotificationType.Error)
  },

  warning(message: string): void {
    this.show(message, NotificationType.Warning)
  },

  info(message: string): void {
    this.show(message, NotificationType.Info)
  },

  dismiss(id: string): void {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }
})
