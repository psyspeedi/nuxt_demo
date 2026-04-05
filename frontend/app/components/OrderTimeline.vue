<template>
  <VTimeline density="compact" side="end">
    <VTimelineItem
      v-for="item in sortedHistory"
      :key="item.timestamp"
      :dot-color="STATUS_MAP[item.status].color"
      :icon="STATUS_MAP[item.status].icon"
      fill-dot
    >
      <div class="d-flex justify-space-between align-start">
        <div>
          <span class="font-weight-medium">{{ STATUS_MAP[item.status].label }}</span>
          <p class="text-caption text-medium-emphasis">
            {{ formatDateTime(item.timestamp) }}
          </p>
          <p v-if="item.comment" class="text-caption text-medium-emphasis font-italic mt-1">
            {{ item.comment }}
          </p>
        </div>
      </div>
    </VTimelineItem>
  </VTimeline>
</template>

<script setup lang="ts">
import type { OrderStatusHistory } from '~~/types/order'

const props = defineProps<{
  history: OrderStatusHistory[]
}>()

const sortedHistory = computed(() =>
  [...props.history].sort((a, b) =>
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )
)
</script>
