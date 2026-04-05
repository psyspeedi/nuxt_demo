# Nuxt Demo — B2B Dashboard

Демонстрационный проект: B2B-дашборд с каталогом товаров, корзиной и управлением заказами.

**Демо:** http://hardovsky.uk:8080

---

## Стек

### Frontend (`/frontend`)

| | |
|---|---|
| **Nuxt 4** | SSR-фреймворк на Vue 3 |
| **Vuetify 3** | UI-компоненты в стиле Material Design |
| **Pinia** | Управление состоянием (с персистентностью) |
| **Vue Chart.js** | Графики (Chart.js обёртка для Vue) |
| **VueUse** | Утилиты (debounce, composables) |
| **TypeScript** | Статическая типизация |
| **ESLint + Husky** | Линтинг и pre-commit хуки |

### API (`/api`)

Минималистичный REST API на **Express + TypeScript**. Хранит данные в **SQLite** (better-sqlite3). Аутентификация через **JWT**.

---

## Запуск локально

### Требования

- Node.js 24+
- npm

### 1. API

```bash
cd api
npm install
cp .env.example .env   # задать JWT_SECRET
npm run dev
```

API будет доступен на `http://localhost:3001`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Приложение откроется на `http://localhost:3000`

---

## Запуск в Docker

```bash
cp .env.example .env
docker compose up -d --build
```

- Frontend: http://localhost:8080
- API: http://localhost:8081
