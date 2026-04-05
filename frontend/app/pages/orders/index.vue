<template>
  <VContainer fluid>
    <VCard rounded="lg" border class="mb-4 pa-4">
      <VRow align="center">
        <VCol cols="12" sm="4">
          <VSelect
            v-model="filters.status"
            :items="statusOptions"
            label="Статус"
            clearable
            density="comfortable"
          />
        </VCol>
        <VCol cols="12" sm="3">
          <VTextField
            v-model="filters.dateFrom"
            label="Дата от"
            type="date"
            density="comfortable"
            clearable
          />
        </VCol>
        <VCol cols="12" sm="3">
          <VTextField
            v-model="filters.dateTo"
            label="Дата до"
            type="date"
            density="comfortable"
            clearable
          />
        </VCol>
        <VCol cols="12" sm="2">
          <VBtn
            v-if="hasActiveFilters"
            variant="text"
            color="error"
            @click="resetFilters"
          >
            Сбросить
          </VBtn>
        </VCol>
      </VRow>
    </VCard>

    <VCard rounded="lg" border>
      <VDataTableServer
        :headers="ordersHeaders"
        :items="ordersStore.orders"
        :items-length="ordersStore.total"
        :loading="ordersStore.loading"
        :items-per-page="10"
        :items-per-page-options="[{ value:10,title:'10' },{ value:25,title:'25' },{ value:50,title:'50' }]"
        hover
        @update:options="handleTableOptions"
        @click:row="(_, { item }) => navigateTo('/orders/' + item.id)"
      >
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.number="{ item }">
          <span class="font-weight-medium text-primary cursor-pointer">
            {{ item.number }}
          </span>
        </template>

        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.createdAt="{ item }">
          {{ formatDate(item.createdAt) }}
        </template>

        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.status="{ item }">
          <OrderStatusChip :status="item.status" />
        </template>

        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.items="{ item }">
          {{ item.items.length }}
        </template>

        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.totalAmount="{ item }">
          <span class="font-weight-medium">{{ formatCurrency(item.totalAmount) }}</span>
        </template>

        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.actions="{ item }">
          <VBtn
            icon="mdi-eye-outline"
            size="small"
            variant="text"
            @click.stop="navigateTo('/orders/' + item.id)"
          />
        </template>

        <template #no-data>
          <div class="text-center pa-8">
            <template v-if="hasActiveFilters">
              <p class="text-body-1 mb-2">Заказы не найдены по выбранным фильтрам</p>
              <VBtn color="primary" variant="text" @click="resetFilters">
                Сбросить
              </VBtn>
            </template>
            <template v-else>
              <p class="text-body-1 mb-2">Заказов пока нет</p>
              <VBtn color="primary" variant="text" @click="navigateTo('/catalog')">
                Перейти в каталог
              </VBtn>
            </template>
          </div>
        </template>
      </VDataTableServer>
    </VCard>
  </VContainer>
</template>

<script setup lang="ts">
import { STATUS_TRANSITIONS, type OrderStatus } from '~~/types/order'
import { STATUS_MAP } from '~/lib/orderStatus'
import { formatCurrency, formatDate } from '~/lib/format'

definePageMeta({
  title: 'Заказы'
})

const ordersStore = useOrdersStore()

const ordersHeaders = [
  { title: 'Номер',    key: 'number',      sortable: false },
  { title: 'Дата',     key: 'createdAt',   sortable: false },
  { title: 'Статус',   key: 'status',      sortable: false },
  { title: 'Позиций',  key: 'items',       sortable: false },
  { title: 'Сумма',    key: 'totalAmount', sortable: false },
  { title: '',         key: 'actions',     sortable: false, align: 'end' as const },
]

const { filters, resetFilters, hasActiveFilters } = useFilters({
  defaults: {
    status: '',
    dateFrom: '',
    dateTo: ''
  }
})

const getStatusLabel = (status: OrderStatus) => STATUS_MAP[status]?.label || status

const statusOptions = computed(() => [
  { title: 'Все статусы', value: '' },
  ...Object.keys(STATUS_TRANSITIONS).map((value) => ({
    title: getStatusLabel(value as OrderStatus),
    value
  }))
])

const handleTableOptions = ({ page, itemsPerPage }: { page: number; itemsPerPage: number }) => {
  ordersStore.fetchOrders({ ...filters.value, page, limit: itemsPerPage })
}

await useAsyncData('orders-list', async () => {
  await ordersStore.fetchOrders({ page: 1, limit: 10 })
  return true
})

watch(filters, () => {
  ordersStore.fetchOrders({ ...filters.value, page: 1 })
}, { deep: true })
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
