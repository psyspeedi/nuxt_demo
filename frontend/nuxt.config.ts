export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },
  runtimeConfig: {
    public: {
      // Переопределяется через NUXT_PUBLIC_API_BASE в production
      // На SSR-сервере devProxy не работает — нужен полный URL до Express API
      apiBase: 'http://localhost:3001',
    },
  },
  nitro: {
    devProxy: {
      '/api': { target: 'http://localhost:3001/api', changeOrigin: true },
    },
  },
  modules: [
    ['@nuxt/eslint', { config: { typescriptTypeChecked: true } }],
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    'vuetify-nuxt-module',
  ],
  css: ['@mdi/font/css/materialdesignicons.min.css'],
  vuetify: {
    moduleOptions: {
      ssrClientHints: {
        reloadOnFirstRequest: false,
        viewportSize: true,
      },
    },
    vuetifyOptions: {
      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            colors: {
              primary: '#1565C0',
              secondary: '#546E7A',
              success: '#2E7D32',
              warning: '#E65100',
              error: '#C62828',
              surface: '#F5F7FA',
            },
          },
          dark: {
            colors: {
              primary: '#42A5F5',
            },
          },
        },
      },
      defaults: {
        VBtn: { rounded: 'lg' },
        VTextField: { variant: 'outlined', density: 'comfortable' },
        VSelect: { variant: 'outlined', density: 'comfortable' },
        VCard: { rounded: 'lg', elevation: 0 },
      },
      icons: {
        defaultSet: 'mdi',
      },
      locale: {
        locale: 'ru',
        fallback: 'en',
        messages: {
          ru: {
            dataTable: {
              itemsPerPageText: 'Строк на странице:',
              ariaLabel: {
                sortDescending: 'По убыванию.',
                sortAscending: 'По возрастанию.',
                sortNone: 'Без сортировки.',
                activateAscending: 'Сортировать по возрастанию.',
                activateDescending: 'Сортировать по убыванию.',
                activateNone: 'Сбросить сортировку.',
              },
              sortBy: 'Сортировать по',
            },
            dataFooter: {
              itemsPerPageText: 'Строк на странице:',
              itemsPerPageAll: 'Все',
              nextPage: 'Следующая страница',
              prevPage: 'Предыдущая страница',
              firstPage: 'Первая страница',
              lastPage: 'Последняя страница',
              pageText: '{0}–{1} из {2}',
            },
            noDataText: 'Нет данных',
            loading: 'Загрузка…',
          },
        },
      },
    },
  },
  app: {
    head: {
      title: 'B2B Кабинет',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },
  imports: {
    dirs: [
      'api',
      'composables',
      'lib',
      'stores',
    ],
  },
})
