<template>
  <div class="snackbar-container">
    <TransitionGroup name="snackbar">
      <VAlert
        v-for="notification in notifications"
        :key="notification.id"
        :type="NOTIFICATION_MAP[notification.type].type"
        :icon="NOTIFICATION_MAP[notification.type].icon"
        variant="elevated"
        density="compact"
        closable
        class="snackbar-item"
        @click:close="dismiss(notification.id)"
      >
        {{ notification.message }}
      </VAlert>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { NotificationType } from '~~/types/composables'

const NOTIFICATION_MAP: Record<NotificationType, { type: 'success' | 'error' | 'warning' | 'info'; icon: string }> = {
  [NotificationType.Success]: { type: 'success', icon: 'mdi-check-circle' },
  [NotificationType.Error]:   { type: 'error',   icon: 'mdi-alert-circle' },
  [NotificationType.Warning]: { type: 'warning', icon: 'mdi-alert' },
  [NotificationType.Info]:    { type: 'info',    icon: 'mdi-information' },
}

const { notifications, dismiss } = useNotifications()
</script>

<style scoped>
.snackbar-container {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 360px;
  max-width: calc(100vw - 32px);
  pointer-events: none;
}

.snackbar-item {
  pointer-events: auto;
}

.snackbar-enter-active,
.snackbar-leave-active {
  transition: all 0.3s ease;
}

.snackbar-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.snackbar-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
