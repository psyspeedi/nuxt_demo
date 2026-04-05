<template>
  <VApp :theme="isDark ? 'dark' : 'light'">
    <VNavigationDrawer
      v-model="drawer"
      :permanent="!isMobile"
      :temporary="isMobile"
      width="260"
    >
      <VListItem class="pa-4">
        <template #prepend>
          <VIcon icon="mdi-briefcase" size="28" color="primary" />
        </template>
        <VListItemTitle class="text-subtitle-1 font-weight-bold">
          B2B Кабинет
        </VListItemTitle>
      </VListItem>

      <VDivider />

      <VList nav>
        <VListItem
          to="/"
          :active="route.path === '/'"
          prepend-icon="mdi-view-dashboard"
          title="Дашборд"
        />
        <VListItem
          :to="'/catalog'"
          :active="route.path.startsWith('/catalog')"
          prepend-icon="mdi-package-variant-closed"
          title="Каталог"
        />
        <VListItem
          :to="'/orders'"
          :active="route.path.startsWith('/orders')"
          prepend-icon="mdi-clipboard-list-outline"
          title="Заказы"
        />
      </VList>

      <template #append>
        <VDivider />
        <VListItem
          v-if="authStore.user"
          class="pa-2"
        >
          <template #prepend>
            <VAvatar color="primary" size="40">
              <span class="text-white text-body-2">{{ authStore.userInitials }}</span>
            </VAvatar>
          </template>
          <VListItemTitle class="text-body-2 font-weight-medium">
            {{ authStore.user.name }}
          </VListItemTitle>
          <VListItemSubtitle class="text-caption">
            {{ authStore.user.company }}
          </VListItemSubtitle>
        </VListItem>
        <VBtn
          variant="text"
          color="error"
          prepend-icon="mdi-logout"
          class="ma-2"
          @click="authStore.logout()"
        >
          Выйти
        </VBtn>
      </template>
    </VNavigationDrawer>

    <VAppBar elevation="0" border="b">
      <VBtn
        v-if="isMobile"
        icon="mdi-menu"
        @click="drawer = !drawer"
      />
      <VAppBarTitle>
        {{ route.meta.title || '' }}
      </VAppBarTitle>
      <template #append>
        <VBtn
          :icon="isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night'"
          @click="toggleTheme"
        />
        <VBtn
          icon="mdi-cart-outline"
          @click="isCartOpen = true"
        >
          <VBadge
            v-if="cartStore.totalPositions > 0"
            :content="cartStore.totalPositions"
            color="primary"
          />
        </VBtn>
      </template>
    </VAppBar>

    <VMain>
      <slot />
    </VMain>

    <CartDrawer v-model="isCartOpen" />
    <AppSnackbar />
    <ConfirmDialog />
  </VApp>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const route = useRoute()
const { width } = useDisplay()

// isMobile вычисляется только после гидрации — SSR всегда возвращает width:0,
// что вызывало расхождение с клиентом. hasMounted гарантирует одинаковый
// начальный рендер на сервере и клиенте (permanent drawer).
const hasMounted = ref(false)
onMounted(() => { hasMounted.value = true })
const isMobile = computed(() => hasMounted.value && width.value < 960)

const authStore = useAuthStore()
const cartStore = useCartStore()

// useCookie — SSR-совместимое хранилище: одинаково читается и на сервере, и на клиенте
const isDarkCookie = useCookie<boolean>('color-scheme', {
  default: () => false,
  sameSite: 'lax',
})
const isDark = computed(() => isDarkCookie.value)

const drawer = ref(true)
const isCartOpen = ref(false)

const toggleTheme = () => {
  isDarkCookie.value = !isDarkCookie.value
}
</script>
