<template>
  <VContainer class="fill-height justify-center" fluid>
    <VCard width="440" padding="40px">
      <h5 class="text-h5 text-center mb-1">Вход в систему</h5>
      <p class="text-subtitle-2 text-medium-emphasis text-center mb-2">Личный кабинет закупок</p>
      
      <VDivider class="my-4" />
      
      <VForm ref="formRef" @submit.prevent="handleLogin">
        <VTextField
          v-model="email"
          label="Email"
          prepend-inner-icon="mdi-email-outline"
          :rules="[required('Email обязателен'), emailRule('Некорректный email')]"
        />
        
        <VTextField
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          label="Пароль"
          prepend-inner-icon="mdi-lock-outline"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          :rules="[required('Пароль обязателен'), minLength(6, 'Минимум 6 символов')]"
          class="mt-4"
          @click:append-inner="showPassword = !showPassword"
        />
        
        <VBtn
          type="submit"
          block
          size="large"
          color="primary"
          :loading="authStore.loading"
          class="mt-6"
        >
          Войти
        </VBtn>
      </VForm>
      
      <VAlert
        type="info"
        variant="tonal"
        density="compact"
        class="mt-4"
      >
        Демо доступ: manager@b2b.com / demo1234
      </VAlert>
    </VCard>
  </VContainer>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  title: 'Вход'
})

const authStore = useAuthStore()
const formRef = ref()

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const required = (message: string) => (v: unknown) => !!v || message
// eslint-disable-next-line sonarjs/slow-regex
const emailRule = (message: string) => (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || message
const minLength = (len: number, message: string) => (v: string) => (v && v.length >= len) || message

onMounted(() => {
  if (authStore.isAuthenticated) {
    navigateTo('/')
  }
})

const handleLogin = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  await authStore.login(email.value, password.value)
}
</script>
