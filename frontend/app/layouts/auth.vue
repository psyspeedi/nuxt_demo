<template>
  <VApp style="background: #F5F7FA;">
    <div class="d-flex align-center justify-center" style="min-height: 100vh;">
      <div class="text-center">
        <VIcon icon="mdi-briefcase-outline" size="48" color="primary" class="mb-2" />
        <div class="text-h6 font-weight-bold mb-4">B2B Кабинет</div>
        <slot />
      </div>
    </div>
    <AppSnackbar />
  </VApp>
</template>
