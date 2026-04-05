<template>
  <VNavigationDrawer
    :model-value="modelValue"
    location="right"
    width="420"
    temporary
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <VToolbar color="surface" border="b">
      <VToolbarTitle>
        Корзина
        <VChip size="small" class="ml-2">
          {{ cartStore.totalPositions }}
        </VChip>
      </VToolbarTitle>
      <VBtn icon="mdi-close" @click="$emit('update:modelValue', false)" />
    </VToolbar>

    <div v-if="cartStore.isEmpty" class="d-flex flex-column align-center justify-center fill-height pa-8">
      <VIcon icon="mdi-cart-outline" size="80" color="medium-emphasis" />
      <p class="text-body-1 text-medium-emphasis mt-4">Корзина пуста</p>
      <VBtn color="primary" class="mt-4" @click="goToCatalog">
        Перейти в каталог
      </VBtn>
    </div>

    <div v-else class="d-flex flex-column fill-height">
      <VList class="flex-grow-1 overflow-y-auto">
        <template v-for="(item, index) in cartStore.items" :key="item.product.id">
          <CartItemRow
            :item="item"
            @update:quantity="cartStore.updateQuantity(item.product.id, $event)"
            @remove="cartStore.removeItem(item.product.id)"
          />
          <VDivider v-if="index < cartStore.items.length - 1" />
        </template>
      </VList>

      <VCardActions border="t" padding="16px" class="flex-column">
        <div class="w-100">
          <div class="d-flex justify-space-between mb-1">
            <span class="text-body-2">Товаров на сумму</span>
            <span>{{ formatCurrency(cartStore.totalAmount) }}</span>
          </div>

          <div v-if="cartStore.discount > 0" class="d-flex justify-space-between mb-1 text-success">
            <span>Скидка 5%</span>
            <span>-{{ formatCurrency(cartStore.discount) }}</span>
          </div>

          <VDivider class="my-2" />

          <div class="d-flex justify-space-between">
            <span class="text-subtitle-1 font-weight-bold">К оплате</span>
            <span class="text-h6 font-weight-bold text-primary">
              {{ formatCurrency(cartStore.totalAmountWithDiscount) }}
            </span>
          </div>
        </div>

        <VBtn
          block
          color="primary"
          size="large"
          class="mt-4"
          @click="isCheckoutOpen = true"
        >
          Оформить заказ
        </VBtn>

        <VBtn
          v-if="!cartStore.isEmpty"
          block
          variant="text"
          color="error"
          class="mt-2"
          @click="handleClear"
        >
          Очистить корзину
        </VBtn>
      </VCardActions>
    </div>

    <CheckoutDialog
      v-model="isCheckoutOpen"
      @success="handleCheckoutSuccess"
    />
  </VNavigationDrawer>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
const cartStore = useCartStore()
const { confirm } = useConfirm()

const isCheckoutOpen = ref(false)

const goToCatalog = () => {
  emit('update:modelValue', false)
  navigateTo('/catalog')
}

const handleClear = async () => {
  await confirm('Очистить корзину?', { confirmText: 'Очистить' })
  cartStore.clear()
}

const handleCheckoutSuccess = () => {
  isCheckoutOpen.value = false
  emit('update:modelValue', false)
}
</script>
