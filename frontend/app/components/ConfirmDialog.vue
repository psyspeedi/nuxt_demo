<template>
  <VDialog
    :model-value="_state.visible"
    width="400"
    persistent
  >
    <VCard>
      <VCardTitle>
        {{ _state.options.title || 'Подтверждение' }}
      </VCardTitle>
      <VCardText>
        {{ _state.message }}
      </VCardText>
      <VCardActions>
        <VBtn variant="text" @click="_cancel">
          {{ _state.options.cancelText || 'Отмена' }}
        </VBtn>
        <VSpacer />
        <VBtn
          :color="_state.options.color || 'error'"
          @click="_accept"
        >
          {{ _state.options.confirmText || 'Подтвердить' }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
const { _state, _accept, _cancel } = useConfirm()
</script>
