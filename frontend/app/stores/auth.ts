import { defineStore } from 'pinia'
import type { User } from '~~/types/user'

const TOKEN_MAX_AGE = 60 * 60 * 24 * 7 // 7 дней

export const useAuthStore = defineStore('auth', () => {
  const token = useCookie<string | null>('auth_token', {
    maxAge: TOKEN_MAX_AGE,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    default: () => null,
  })

  // useState передаёт значение из SSR в клиент через Nuxt payload —
  // без этого user=null при гидрации вызывал hydration mismatch
  const user = useState<User | null>('auth-user', () => null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)

  const userInitials = computed(() => {
    const name = user.value?.name
    if (!name) return ''
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return (parts[0]![0] ?? '') + (parts[1]![0] ?? '')
    }
    return name.substring(0, 2)
  })

  const api = useApi()
  const notifications = useNotifications()

  const login = async (email: string, password: string) => {
    loading.value = true
    try {
      const response = await api.post<{ token: string; user: User }>('/auth/login', { email, password })
      token.value = response.token
      user.value = response.user
      await navigateTo('/')
    } catch (err) {
      notifications.error((err as Error).message)
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    token.value = null
    user.value = null
    await navigateTo('/login')
  }

  const fetchMe = async () => {
    user.value = await api.get<User>('/auth/me')
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    userInitials,
    login,
    logout,
    fetchMe,
  }
})
