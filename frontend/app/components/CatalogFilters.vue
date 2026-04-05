<template>
  <div class="catalog-filters">
    <VTextField
      :model-value="modelValue.search"
      label="Поиск по названию или артикулу"
      prepend-inner-icon="mdi-magnify"
      clearable
      class="mb-4"
      @update:model-value="setSearch"
    />

    <VSelect
      :model-value="modelValue.category"
      :items="['Все категории', ...categories]"
      label="Категория"
      class="mb-4"
      @update:model-value="setCategory"
    />

    <VRow>
      <VCol cols="6">
        <VTextField
          :model-value="modelValue.minPrice"
          type="number"
          label="Цена от"
          density="compact"
          @update:model-value="setMinPrice"
        />
      </VCol>
      <VCol cols="6">
        <VTextField
          :model-value="modelValue.maxPrice"
          type="number"
          label="Цена до"
          density="compact"
          @update:model-value="setMaxPrice"
        />
      </VCol>
    </VRow>

    <VSwitch
      :model-value="modelValue.inStock"
      label="Только в наличии"
      color="primary"
      density="compact"
      class="mb-2"
      @update:model-value="setInStock"
    />

    <VBtn
      v-if="hasActiveFilters"
      variant="text"
      color="error"
      block
      @click="reset"
    >
      Сбросить фильтры
    </VBtn>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import type { ProductFilters } from '~~/types/product'

const props = defineProps<{
  categories: string[]
  modelValue: ProductFilters
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ProductFilters]
}>()

const localFilters = ref({ ...props.modelValue })

const hasActiveFilters = computed(() => {
  const f = props.modelValue
  return !!(f.search || f.category || f.minPrice !== undefined || f.maxPrice !== undefined || f.inStock)
})

const emitUpdate = () => {
  emit('update:modelValue', { ...localFilters.value })
}

const debouncedEmitUpdate = useDebounceFn(emitUpdate, 350)

const setSearch = (val: string | null | undefined) => {
  localFilters.value.search = val || undefined
  debouncedEmitUpdate()
}

const setCategory = (val: string | null | undefined) => {
  localFilters.value.category = val === 'Все категории' ? undefined : val
  emitUpdate()
}

const setMinPrice = (val: string | number | null | undefined) => {
  localFilters.value.minPrice = val ? Number(val) : undefined
  emitUpdate()
}

const setMaxPrice = (val: string | number | null | undefined) => {
  localFilters.value.maxPrice = val ? Number(val) : undefined
  emitUpdate()
}

const setInStock = (val: boolean | null | undefined) => {
  localFilters.value.inStock = val || false
  emitUpdate()
}

const reset = () => {
  localFilters.value = {
    search: undefined,
    category: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    inStock: false
  }
  emitUpdate()
}
</script>
