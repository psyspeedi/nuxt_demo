<template>
  <VContainer fluid>
    <div v-if="pending" class="pa-4">
      <VRow>
        <VCol cols="12" md="8">
          <VSkeletonLoader type="article" />
        </VCol>
        <VCol cols="12" md="4">
          <VSkeletonLoader type="article" />
        </VCol>
      </VRow>
    </div>

    <div v-else-if="error || !order" class="d-flex flex-column align-center justify-center" style="min-height: 60vh;">
      <VIcon icon="mdi-alert-circle-outline" size="80" color="error" class="mb-4" />
      <h3 class="text-h6 mb-4">Заказ не найден</h3>
      <VBtn color="primary" @click="navigateTo('/orders')">
        К списку заказов
      </VBtn>
    </div>

    <template v-else>
      <VBtn
        variant="text"
        prepend-icon="mdi-arrow-left"
        class="mb-4"
        @click="navigateTo('/orders')"
      >
        Назад к заказам
      </VBtn>

      <VRow align="center" class="mb-4">
        <VCol>
          <h1 class="text-h5">Заказ {{ order.number }}</h1>
        </VCol>
        <VCol cols="auto">
          <OrderStatusChip :status="order.status" size="default" />
        </VCol>
      </VRow>

      <VCard rounded="lg" border class="mb-4">
        <VCardTitle class="text-subtitle-1 font-weight-medium">
          Информация о заказе
        </VCardTitle>
        <VCardText>
          <VRow>
            <VCol cols="12" sm="6">
              <div class="text-caption text-medium-emphasis">Дата создания</div>
              <div>{{ formatDateTime(order.createdAt) }}</div>
            </VCol>
            <VCol cols="12" sm="6">
              <div class="text-caption text-medium-emphasis">Последнее обновление</div>
              <div>{{ formatDate(order.updatedAt) }}</div>
            </VCol>
            <VCol cols="12">
              <div class="text-caption text-medium-emphasis">Адрес доставки</div>
              <div>{{ order.address }}</div>
            </VCol>
            <VCol v-if="order.comment" cols="12">
              <div class="text-caption text-medium-emphasis">Комментарий</div>
              <div>{{ order.comment }}</div>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>

      <VCard rounded="lg" border class="mb-4">
        <VCardTitle class="text-subtitle-1 font-weight-medium">
          Управление статусом
        </VCardTitle>
        <VCardText>
          <VRow align="center">
            <VCol>
              <span class="text-body-2 mr-2">Текущий статус:</span>
              <OrderStatusChip :status="order.status" size="default" />
            </VCol>
            <VCol v-if="availableTransitions.length > 0" cols="auto">
              <VBtnGroup>
                <VBtn
                  v-for="status in availableTransitions"
                  :key="status"
                  :loading="ordersStore.updating"
                  size="small"
                  @click="handleStatusChange(status)"
                >
                  <VIcon :icon="getStatusIcon(status)" size="small" class="mr-1" />
                  {{ getStatusLabel(status) }}
                </VBtn>
              </VBtnGroup>
            </VCol>
          </VRow>

          <VAlert
            v-if="STATUS_TRANSITIONS[order.status].length === 0"
            type="info"
            variant="tonal"
            density="compact"
            class="mt-4"
          >
            Это финальный статус. Дальнейшее изменение невозможно.
          </VAlert>
        </VCardText>
      </VCard>

      <VCard rounded="lg" border class="mb-4">
        <VCardTitle class="text-subtitle-1 font-weight-medium">
          Состав заказа
        </VCardTitle>
        <VTable density="comfortable">
          <thead>
            <tr>
              <th>Наименование</th>
              <th>Артикул</th>
              <th>Кол-во</th>
              <th>Ед. изм.</th>
              <th>Цена</th>
              <th>Сумма</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in order.items" :key="item.productId">
              <td>{{ item.productName }}</td>
              <td>{{ item.sku }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.unit }}</td>
              <td>{{ formatCurrency(item.priceAtOrder) }}</td>
              <td>{{ formatCurrency(item.priceAtOrder * item.quantity) }}</td>
            </tr>
            <tr class="font-weight-bold">
              <td colspan="5" class="text-right">Итого:</td>
              <td>{{ formatCurrency(order.totalAmount) }}</td>
            </tr>
          </tbody>
        </VTable>
      </VCard>

      <VCard rounded="lg" border>
        <VCardTitle class="text-subtitle-1 font-weight-medium">
          История статусов
        </VCardTitle>
        <VCardText>
          <OrderTimeline :history="order.statusHistory" />
        </VCardText>
      </VCard>
    </template>
  </VContainer>
</template>

<script setup lang="ts">
import { STATUS_TRANSITIONS, type OrderStatus } from '~~/types/order'
import { STATUS_MAP } from '~/lib/orderStatus'
import { formatCurrency, formatDateTime } from '~/lib/format'

definePageMeta({
  title: 'Заказ'
})

const route = useRoute()
const ordersStore = useOrdersStore()

const { pending, error } = await useAsyncData(
  'order-' + route.params.id,
  () => ordersStore.fetchOrder(route.params.id as string)
)

const order = computed(() => ordersStore.currentOrder)

const availableTransitions = computed(() => {
  if (!order.value) return []
  return STATUS_TRANSITIONS[order.value.status] || []
})

const getStatusLabel = (status: OrderStatus) => STATUS_MAP[status]?.label || status
const getStatusIcon = (status: OrderStatus) => STATUS_MAP[status]?.icon || 'mdi-help'

const handleStatusChange = async (status: OrderStatus) => {
  if (!order.value) return
  await ordersStore.updateStatus(order.value.id, status)
}
</script>
