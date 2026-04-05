export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  return proxyRequest(event, `${config.apiInternalBase}${event.path}`)
})
