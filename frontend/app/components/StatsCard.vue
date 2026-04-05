<template>
  <VCard rounded="lg" border height="100%">
    <VSkeletonLoader v-if="loading" type="list-item-avatar-two-line" />
    <VCardText v-else class="d-flex align-start ga-4">
      <VAvatar :color="`${color}-lighten-4`" size="56" rounded="lg">
        <VIcon :color="color" size="28" :icon="icon" />
      </VAvatar>
      <div>
        <p class="text-subtitle-2 text-medium-emphasis">{{ title }}</p>
        <p class="text-h5 font-weight-bold">{{ value }}</p>
        <p v-if="subtitle" class="text-caption text-medium-emphasis">{{ subtitle }}</p>
      </div>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  value: string | number
  subtitle?: string
  icon: string
  color?: string
  loading?: boolean
}>(), {
  subtitle: undefined,
  color: 'primary',
  loading: false,
})
</script>
