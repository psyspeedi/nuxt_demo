<template>
  <VChip
    :color="STATUS_MAP[status].color"
    :size="size"
    :prepend-icon="STATUS_MAP[status].icon"
    label
  >
    {{ STATUS_MAP[status].label }}
  </VChip>
</template>

<script setup lang="ts">
import type { OrderStatus } from '~~/types/order'

withDefaults(defineProps<{
  status: OrderStatus
  size?: 'x-small' | 'small' | 'default'
}>(), {
  size: 'small'
})
</script>
