<template>
  <VListItem>
    <template #prepend>
      <VAvatar size="40" color="surface" class="mr-3">
        <VImg v-if="item.product.imageUrl" :src="item.product.imageUrl" />
        <VIcon v-else icon="mdi-package-variant" />
      </VAvatar>
    </template>

    <VListItemTitle class="body-2 font-weight-medium">
      {{ item.product.name }}
    </VListItemTitle>
    <VListItemSubtitle class="caption">
      {{ item.product.sku }}
    </VListItemSubtitle>

    <template #append>
      <VBtn
        icon="mdi-delete"
        size="small"
        color="error"
        variant="text"
        @click="$emit('remove')"
      />
    </template>
  </VListItem>

  <VListItem class="pl-14">
    <div class="d-flex align-center gap-4">
      <span class="text-body-2">{{ formatCurrency(item.product.price) }} за {{ item.product.unit }}</span>

      <VTextField
        :model-value="item.quantity"
        type="number"
        min="1"
        max="9999"
        density="compact"
        style="width: 80px;"
        hide-details
        @update:model-value="$emit('update:quantity', Number($event))"
      />

      <span class="font-weight-bold text-primary">
        {{ formatCurrency(item.product.price * item.quantity) }}
      </span>
    </div>
  </VListItem>
</template>

<script setup lang="ts">
import type { CartItem } from '~~/types/cart'

defineProps<{
  item: CartItem
}>()

defineEmits<{
  'update:quantity': [qty: number]
  'remove': []
}>()
</script>
