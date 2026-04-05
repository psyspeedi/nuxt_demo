import type { ConfirmOptions } from '~~/types/composables'

type DialogState = {
  visible: boolean
  message: string
  options: ConfirmOptions
  resolve: ((value: boolean) => void) | null
}

const dialogState = reactive<DialogState>({
  visible: false,
  message: '',
  options: {},
  resolve: null
})

export const useConfirm = () => ({
  confirm(message: string, options?: ConfirmOptions): Promise<boolean> {
    dialogState.message = message
    dialogState.options = options || {}
    dialogState.visible = true
    return new Promise(resolve => {
      dialogState.resolve = resolve
    })
  },

  _accept: () => {
    dialogState.resolve?.(true)
    dialogState.visible = false
  },

  _cancel: () => {
    dialogState.resolve?.(false)
    dialogState.visible = false
  },

  _state: readonly(dialogState)
})
