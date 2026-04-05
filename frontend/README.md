# B2B Procurement Dashboard

## О проекте
B2B личный кабинет для управления корпоративными закупками. Функциональность: авторизация, каталог с фильтрами, корзина, оформление заказов, отслеживание статусов, дашборд с аналитикой.

## Стек
- Nuxt 4 (SPA режим)
- Vue 3 Composition API + TypeScript
- Pinia + pinia-plugin-persistedstate
- Vuetify 3 (Material Design)
- Chart.js / vue-chartjs
- @vueuse/core

## Быстрый старт
```bash
npm install
npm run dev
# → http://localhost:3000
```

## Демо-доступ
- Email: manager@b2b.com
- Пароль: demo1234

## Структура проекта
```
b2b-dashboard/
├── app/
│   ├── components/
│   │   ├── catalog/
│   │   │   ├── CatalogFilters.vue
│   │   │   └── CatalogTable.vue
│   │   ├── cart/
│   │   │   ├── CartDrawer.vue
│   │   │   ├── CartItemRow.vue
│   │   │   └── CheckoutDialog.vue
│   │   ├── orders/
│   │   │   ├── OrdersTable.vue
│   │   │   ├── OrderStatusChip.vue
│   │   │   └── OrderTimeline.vue
│   │   ├── dashboard/
│   │   │   ├── StatsCard.vue
│   │   │   └── SpendingChart.vue
│   │   └── shared/
│   │       ├── AppSnackbar.vue
│   │       └── ConfirmDialog.vue
│   ├── composables/
│   │   ├── useApi.ts
│   │   ├── useFilters.ts
│   │   └── useNotifications.ts
│   │   └── useConfirm.ts
│   ├── layouts/
│   │   ├── default.vue
│   │   └── auth.vue
│   ├── middleware/
│   │   └── auth.ts
│   ├── pages/
│   │   ├── login.vue
│   │   ├── index.vue
│   │   ├── catalog.vue
│   │   └── orders/
│   │       ├── index.vue
│   │       └── [id].vue
│   ├── stores/
│   │   ├── auth.ts
│   │   ├── cart.ts
│   │   ├── catalog.ts
│   │   └── orders.ts
│   ├── types/
│   │   └── index.ts
│   ├── plugins/
│   │   ├── vuetify.ts
│   │   └── pinia-persist.client.ts
│   └── error.vue
└── server/
    ├── data/
    │   └── mock.ts
    └── api/
        ├── auth/
        │   ├── login.post.ts
        │   └── me.get.ts
        ├── products/
        │   └── index.get.ts
        └── orders/
            ├── index.get.ts
            ├── index.post.ts
            ├── [id].get.ts
            └── [id]/
                └── status.patch.ts
```

## Ключевые архитектурные решения

### Nuxt server routes как mock backend
Вместо отдельного json-server — встроенные server routes Nuxt. Монорепо, единый процесс, простая замена на реальный API (достаточно поменять baseURL в useApi.ts).

### Синхронизация фильтров с URL
Все фильтры каталога и списка заказов отражаются в URL query параметрах. Пользователь может: поделиться ссылкой с фильтрами, вернуться назад кнопкой браузера. Реализовано через composable useFilters.ts.

### Оптимистичные обновления статусов
При смене статуса заказа: UI обновляется мгновенно, запрос идёт в фоне. При ошибке — автоматический откат к предыдущему статусу. Реализовано в ordersStore.updateStatus().

### Персистентность корзины
Корзина сохраняется в localStorage между сессиями через pinia-plugin-persistedstate. Пользователь не теряет товары при перезагрузке страницы.

### Автоматическая скидка
При сумме заказа свыше 50 000 ₽ автоматически применяется скидка 5%. Рассчитывается реактивно в cart store, отображается в корзине и диалоге оформления.

## Что было бы в продакшне
- JWT авторизация с refresh токенами (httpOnly cookie)
- SSR + гидратация для SEO и производительности
- Отдельный backend сервис (NestJS / Fastify)
- E2E тесты (Playwright)
- Unit тесты stores и composables (Vitest)
- i18n (vue-i18n) для мультиязычности
- WebSocket для real-time обновления статусов
