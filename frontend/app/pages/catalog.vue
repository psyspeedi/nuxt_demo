<template>
  <VContainer fluid>
    <VRow>
      <VCol cols="12" md="3" class="d-none d-md-block">
        <VCard rounded="lg" border class="pa-4">
          <div class="text-subtitle-1 font-weight-medium mb-4">Фильтры</div>
          <CatalogFilters
            v-model="filters"
            :categories="catalogStore.categories"
          />
        </VCard>
      </VCol>

      <VCol cols="12" md="9">
        <div class="d-flex justify-space-between align-center mb-4">
          <div>
            <h1 class="text-h6">Каталог товаров</h1>
            <p class="text-body-2 text-medium-emphasis">
              Найдено: {{ catalogStore.total }} позиций
            </p>
          </div>
          <VBtn
            v-if="isMobile"
            color="primary"
            variant="outlined"
            @click="showFilters = true"
          >
            Фильтры
          </VBtn>
        </div>

        <VCard rounded="lg" border>
          <VDataTableServer
            :headers="catalogHeaders"
            :items="catalogStore.products"
            :items-length="catalogStore.total"
            :loading="catalogStore.loading"
            :items-per-page="12"
            :items-per-page-options="[{ value:12,title:'12' },{ value:24,title:'24' },{ value:48,title:'48' }]"
            @update:options="handleTableOptions"
          >
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template #item.name="{ item }">
              <div>
                <div class="body-2 font-weight-medium">{{ item.name }}</div>
                <div class="caption text-medium-emphasis">{{ item.sku }}</div>
                <VChip size="x-small" variant="outlined" class="mt-1">
                  {{ item.category }}
                </VChip>
              </div>
            </template>

            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template #item.price="{ item }">
              <div>
                <div class="font-weight-medium">{{ formatCurrency(item.price) }} / {{ item.unit }}</div>
                <div v-if="item.stock > 0" class="text-success text-caption">
                  В наличии
                </div>
                <div v-else class="text-error text-caption">
                  Нет в наличии
                </div>
              </div>
            </template>

            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template #item.actions="{ item }">
              <VBtn
                v-if="!isInCart(item.id)"
                color="primary"
                size="small"
                :disabled="item.stock === 0"
                prepend-icon="mdi-cart-plus"
                @click="cartStore.addItem(item)"
              >
                В корзину
              </VBtn>
              <VBtn
                v-else
                color="success"
                size="small"
                variant="outlined"
                prepend-icon="mdi-check"
                @click="navigateTo('/')"
              >
                В корзине
              </VBtn>
            </template>
          </VDataTableServer>
        </VCard>
      </VCol>
    </VRow>

    <VBottomSheet v-if="isMobile" v-model="showFilters">
      <VCard rounded="t-lg" padding="16px">
        <div class="d-flex justify-space-between align-center mb-4">
          <div class="text-subtitle-1 font-weight-medium">Фильтры</div>
          <VBtn icon="mdi-close" variant="text" @click="showFilters = false" />
        </div>
        <CatalogFilters
          v-model="filters"
          :categories="catalogStore.categories"
        />
      </VCard>
    </VBottomSheet>
  </VContainer>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { formatCurrency } from '~/lib/format'

definePageMeta({
  title: 'Каталог'
})

const { width } = useDisplay()
const isMobile = computed(() => import.meta.client && width.value < 960)

const catalogHeaders = [
  { title: 'Наименование', key: 'name', sortable: false },
  { title: 'Цена / Ед. изм.', key: 'price', sortable: false },
  { title: '', key: 'actions', sortable: false, align: 'end' as const },
]

const catalogStore = useCatalogStore()
const cartStore = useCartStore()

const { filters } = useFilters({
  defaults: {
    search: '',
    category: '',
    minPrice: undefined,
    maxPrice: undefined,
    inStock: false
  },
  debounceFields: ['search']
})

const showFilters = ref(false)

const isInCart = (productId: string) =>
  cartStore.items.some(item => item.product.id === productId)

const handleTableOptions = async ({ page, itemsPerPage }: { page: number; itemsPerPage: number }) => {
  await catalogStore.fetchProducts({
    ...filters.value,
    page,
    limit: itemsPerPage
  })
}

// Первичная загрузка: на сервере (SSR) и при первом открытии на клиенте
await useAsyncData('catalog-init', async () => {
  await Promise.all([
    catalogStore.fetchCategories(),
    catalogStore.fetchProducts({ ...filters.value, page: 1, limit: 12 }),
  ])
  return true
})

// Реактивное обновление при смене фильтров на клиенте
watch(filters, () => {
  catalogStore.fetchProducts({ ...filters.value, page: 1 })
}, { deep: true })
</script>
