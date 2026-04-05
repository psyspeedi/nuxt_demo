import { useDebounceFn } from '@vueuse/core'
import type { UseFiltersOptions } from '~~/types/composables'

export const useFilters = <T extends Record<string, unknown>>(options: UseFiltersOptions<T>) => {
  const { defaults, debounceFields = [], debounceMs = 350 } = options

  const route = useRoute()
  const router = useRouter()

  const filters = ref<T>({ ...defaults } as T)

  const stringFields = Object.keys(defaults).filter(k => typeof defaults[k] === 'string') as (keyof T)[]
  const debounceFieldsSet = new Set(debounceFields.length > 0 ? debounceFields : stringFields)

  const deserializeValue = (key: keyof T, queryValue: string): unknown => {
    const defaultVal = defaults[key]
    if (typeof defaultVal === 'boolean') return queryValue === 'true'
    if (typeof defaultVal === 'number') return Number(queryValue)
    return queryValue
  }

  const initFilters = () => {
    const query = route.query
    const newFilters = { ...defaults } as T

    for (const key of Object.keys(defaults) as (keyof T)[]) {
      const queryValue = query[key as string]
      if (queryValue !== undefined && queryValue !== '') {
        (newFilters as Record<keyof T, unknown>)[key] = deserializeValue(key, queryValue as string)
      }
    }

    filters.value = newFilters
  }

  const updateQuery = (key: keyof T, value: unknown) => {
    const queryKey = key as string
    if (value === undefined || value === '' || value === null || value === false) {
      // eslint-disable-next-line sonarjs/no-unused-vars
      const { [queryKey]: _removed, ...cleanQuery } = route.query
      router.replace({ query: cleanQuery })
    } else {
      router.replace({ query: { ...route.query, [queryKey]: String(value) } })
    }
  }

  const debouncedUpdateQuery = useDebounceFn((key: keyof T, value: unknown) => {
    updateQuery(key, value)
  }, debounceMs)

  const setFilter = <K extends keyof T>(key: K, value: T[K]) => {
    filters.value[key] = value
    if (debounceFieldsSet.has(key)) {
      debouncedUpdateQuery(key, value)
    } else {
      updateQuery(key, value)
    }
  }

  const resetFilters = () => {
    filters.value = { ...defaults } as T
    router.replace({ query: {} })
  }

  const hasActiveFilters = computed(() => {
    return Object.keys(defaults).some(key => {
      const k = key as keyof T
      const defaultVal = defaults[k]
      const currentVal = filters.value[k]
      if (defaultVal === undefined || defaultVal === '' || defaultVal === false) {
        return currentVal !== undefined && currentVal !== '' && currentVal !== false
      }
      return currentVal !== defaultVal
    })
  })

  initFilters()

  return {
    filters,
    setFilter,
    resetFilters,
    hasActiveFilters,
  }
}
