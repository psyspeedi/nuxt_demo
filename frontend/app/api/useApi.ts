import { FetchError } from 'ofetch'

export type ApiMethods = {
  get: <T>(url: string, params?: Record<string, unknown>) => Promise<T>
  post: <T>(url: string, body?: Record<string, unknown>) => Promise<T>
  patch: <T>(url: string, body?: Record<string, unknown>) => Promise<T>
  del: <T>(url: string) => Promise<T>
}

export const useApi = (): ApiMethods => {
  const token = useCookie<string | null>('auth_token')

  const apiBase = '/api'

  const request = async <T>(url: string, opts: Parameters<typeof $fetch>[1] = {}): Promise<T> => {
    const fullUrl = `${apiBase}${url}`
    try {
      return await $fetch<T>(fullUrl, {
        ...opts,
        headers: token.value ? { Authorization: `Bearer ${token.value}` } : {}
      })
    } catch (err) {
      if (err instanceof FetchError && err.status === 401) {
        token.value = null
        await navigateTo('/login')
      }
      if (err instanceof FetchError) {
        throw new Error(err.data?.message || err.message || 'Ошибка запроса')
      }
      throw err
    }
  }

  return {
    get: <T>(url: string, params?: Record<string, unknown>) =>
      request<T>(url, { query: params }),
    post: <T>(url: string, body?: Record<string, unknown>) =>
      request<T>(url, { method: 'POST', body }),
    patch: <T>(url: string, body?: Record<string, unknown>) =>
      request<T>(url, { method: 'PATCH', body }),
    del: <T>(url: string) =>
      request<T>(url, { method: 'DELETE' }),
  }
}
