<template>
  <VContainer fluid>
    <VRow class="mb-6">
      <VCol>
        <h5 class="text-h5 mb-1">Добро пожаловать, {{ authStore.user?.name }}</h5>
        <p class="text-subtitle-1 text-medium-emphasis">
          {{ authStore.user?.company }}
        </p>
        <p class="text-body-2 text-medium-emphasis">
          {{ currentDate }}
        </p>
      </VCol>
    </VRow>

    <VRow class="mb-6">
      <VCol cols="12" sm="6" lg="3">
        <StatsCard
          title="Заказов за месяц"
          :value="ordersStore.currentMonthOrders.length"
          icon="mdi-clipboard-text-outline"
          color="blue"
          :loading="ordersStore.loading"
        />
      </VCol>
      <VCol cols="12" sm="6" lg="3">
        <StatsCard
          title="Сумма за месяц"
          :value="formatCurrency(ordersStore.currentMonthTotal)"
          icon="mdi-currency-rub"
          color="green"
          :loading="ordersStore.loading"
        />
      </VCol>
      <VCol cols="12" sm="6" lg="3">
        <StatsCard
          title="В обработке"
          :value="processingCount"
          icon="mdi-progress-clock"
          color="orange"
          :loading="ordersStore.loading"
        />
      </VCol>
      <VCol cols="12" sm="6" lg="3">
        <StatsCard
          title="Позиций в корзине"
          :value="cartStore.totalPositions"
          :subtitle="formatCurrency(cartStore.totalAmount)"
          icon="mdi-cart-outline"
          color="deep-purple"
        />
      </VCol>
    </VRow>

    <VRow>
      <VCol cols="12" md="8">
        <SpendingChart :orders="ordersStore.orders" />
      </VCol>
      <VCol cols="12" md="4">
        <VCard rounded="lg" border>
          <VCardTitle class="text-subtitle-1 font-weight-medium">
            Быстрые действия
          </VCardTitle>
          <VCardText>
            <VBtn
              block
              color="primary"
              class="mb-2"
              @click="navigateTo('/catalog')"
            >
              Перейти в каталог
            </VBtn>
            <VBtn
              block
              variant="outlined"
              @click="navigateTo('/orders')"
            >
              Все заказы
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <VRow class="mt-4">
      <VCol>
        <VCard rounded="lg" border>
          <VCardTitle class="d-flex justify-space-between align-center">
            <span class="text-subtitle-1 font-weight-medium">Последние заказы</span>
            <VBtn
              variant="text"
              size="small"
              @click="navigateTo('/orders')"
            >
              Все заказы
            </VBtn>
          </VCardTitle>
          <VTable density="comfortable" hover>
            <thead>
              <tr>
                <th>Номер</th>
                <th>Дата</th>
                <th>Статус</th>
                <th>Сумма</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="ordersStore.loading">
                <td colspan="4" class="text-center">
                  <VSkeletonLoader type="table-row@5" />
                </td>
              </tr>
              <tr
                v-else-if="ordersStore.recentOrders.length === 0"
              >
                <td colspan="4" class="text-center text-medium-emphasis">
                  Заказов пока нет
                </td>
              </tr>
              <tr
                v-for="order in ordersStore.recentOrders"
                v-else
                :key="order.id"
                style="cursor: pointer;"
                @click="navigateTo('/orders/' + order.id)"
              >
                <td class="font-weight-medium">{{ order.number }}</td>
                <td>{{ formatDate(order.createdAt) }}</td>
                <td>
                  <OrderStatusChip :status="order.status" />
                </td>
                <td class="font-weight-medium">{{ formatCurrency(order.totalAmount) }}</td>
              </tr>
            </tbody>
          </VTable>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import { formatCurrency, formatDate } from '~/lib/format'
import { OrderStatus } from '~~/types/order'

definePageMeta({
  title: 'Дашборд'
})

const authStore = useAuthStore()
const ordersStore = useOrdersStore()
const cartStore = useCartStore()

// Дата вычисляется только на клиенте — серверный и браузерный timezone могут
// различаться и вызывать hydration mismatch
const currentDate = ref('')
onMounted(() => {
  currentDate.value = new Intl.DateTimeFormat('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())
})

const processingCount = computed(() =>
  ordersStore.orders.filter(o =>
    o.status === OrderStatus.Confirmed || o.status === OrderStatus.Processing
  ).length
)

await useAsyncData('dashboard', async () => {
  await ordersStore.fetchOrders({ limit: 100 })
  return true
})
</script>
