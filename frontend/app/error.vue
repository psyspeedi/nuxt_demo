<template>
  <VApp style="background: #F5F7FA;">
    <div class="d-flex align-center justify-center" style="min-height: 100vh;">
      <div class="text-center">
        <VIcon icon="mdi-alert-octagram" size="80" color="error" class="mb-4" />
        <h1 class="text-h3 mb-2">{{ error.statusCode || 500 }}</h1>
        <h3 class="text-h6 mb-6">
          {{ error.statusCode === 404 ? 'Страница не найдена' : 'Внутренняя ошибка сервера' }}
        </h3>
        <VBtn color="primary" @click="handleError">
          На главную
        </VBtn>
      </div>
    </div>
  </VApp>
</template>

<script setup lang="ts">
defineProps<{
  error: {
    statusCode: number
    message: string
  }
}>()

const handleError = () => clearError({ redirect: '/' })
</script>
