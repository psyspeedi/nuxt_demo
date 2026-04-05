<template>
  <VDialog
    :model-value="modelValue"
    width="560"
    persistent
    @update:model-value="close"
  >
    <VCard>
      <VCardTitle class="text-h6">Оформление заказа</VCardTitle>
      <VDivider />

      <VCardText>
        <VForm ref="formRef">
          <VTextarea
            v-model="address"
            label="Адрес доставки *"
            placeholder="г. Москва, ул. Примерная, д. 1, офис 42"
            rows="2"
            auto-grow
            :rules="[required('Адрес обязателен'), minLength(10, 'Минимум 10 символов')]"
          />

          <VTextarea
            v-model="comment"
            label="Комментарий к заказу"
            rows="3"
            counter="500"
            class="mt-4"
          />

          <div class="d-flex justify-space-between align-center mt-4">
            <span class="text-subtitle-1">К оплате:</span>
            <span class="text-h6 font-weight-bold text-primary">
              {{ formatCurrency(cartStore.totalAmountWithDiscount) }}
            </span>
          </div>

          <div v-if="cartStore.discount > 0" class="text-caption text-success mt-1">
            Включая скидку 5%: -{{ formatCurrency(cartStore.discount) }}
          </div>
        </VForm>
      </VCardText>

      <VCardActions>
        <VSpacer />
        <VBtn variant="text" @click="close">
          Отмена
        </VBtn>
        <VBtn
          color="primary"
          :loading="cartStore.submitting"
          @click="handleCheckout"
        >
          Оформить заказ
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'success': [orderId: string]
}>()

const cartStore = useCartStore()

const formRef = ref()
const address = ref('')
const comment = ref('')

const required = (message: string) => (v: unknown) => !!v || message
const minLength = (len: number, message: string) => (v: string) => (v && v.length >= len) || message

const close = () => {
  emit('update:modelValue', false)
  formRef.value?.reset()
  address.value = ''
  comment.value = ''
}

const handleCheckout = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  const order = await cartStore.checkout(address.value, comment.value)
  emit('success', order.id)
  navigateTo('/orders/' + order.id)
  close()
}
</script>
