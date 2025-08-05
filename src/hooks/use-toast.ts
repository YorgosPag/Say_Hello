"use client"

import { useContext } from 'react'
import { ToastContext } from '@/contexts/toast-context'
import { toastPresets } from '@/lib/toast-presets'

export function useToast() {
  const context = useContext(ToastContext)
  
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }

  const { toasts, addToast, removeToast, removeAllToasts } = context

  return {
    toasts,
    toast: addToast,
    dismiss: removeToast,
    dismissAll: removeAllToasts,
    // Convenience methods
    success: (message: string) => addToast(toastPresets.success(message)),
    error: (message: string) => addToast(toastPresets.error(message)),
    warning: (message: string) => addToast(toastPresets.warning(message)),
    info: (message: string) => addToast(toastPresets.info(message)),
    loading: (message: string) => addToast(toastPresets.loading(message)),
  }
}
