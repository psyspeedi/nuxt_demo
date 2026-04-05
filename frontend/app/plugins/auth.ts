// Инициализация авторизации один раз при старте приложения (на сервере и клиенте).
// Заменяет fetchMe() в middleware, чтобы не делать запрос на каждой навигации.
export default defineNuxtPlugin(async () => {
  const auth = useAuthStore()
  if (auth.token && !auth.user) {
    await auth.fetchMe().catch(() => auth.logout())
  }
})
