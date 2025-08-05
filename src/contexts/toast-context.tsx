"use client"

import * as React from "react"
import type { Toast, ToastOptions } from "@/types/toast"
import { TOAST_LIMIT, TOAST_REMOVE_DELAY } from "@/constants/toast"
import { generateToastId } from "@/lib/toast-utils"

type ActionType = 'ADD_TOAST' | 'UPDATE_TOAST' | 'DISMISS_TOAST' | 'REMOVE_TOAST' | 'REMOVE_ALL_TOASTS'

type Action =
  | { type: 'ADD_TOAST'; toast: Toast }
  | { type: 'UPDATE_TOAST'; toast: Partial<Toast> }
  | { type: 'DISMISS_TOAST'; toastId?: Toast['id'] }
  | { type: 'REMOVE_TOAST'; toastId?: Toast['id'] }
  | { type: 'REMOVE_ALL_TOASTS' };

interface State {
  toasts: Toast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({ type: "REMOVE_TOAST", toastId })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}


const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }
    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }
    case 'DISMISS_TOAST':
      if (action.toastId) {
        addToRemoveQueue(action.toastId)
      } else {
        state.toasts.forEach((toast) => addToRemoveQueue(toast.id))
      }
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toastId || action.toastId === undefined
            ? { ...t, open: false }
            : t
        ),
      }
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
    case 'REMOVE_ALL_TOASTS':
        state.toasts.forEach((toast) => addToRemoveQueue(toast.id))
        return {
            ...state,
            toasts: state.toasts.map((t) => ({ ...t, open: false })),
        }
    default:
      return state
  }
}

const listeners: Array<(state: State) => void> = []
let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

interface ToastContextType {
    toasts: Toast[]
    addToast: (options: ToastOptions) => { id: string, dismiss: () => void, update: (props: Partial<Toast>) => void }
    removeToast: (id: string) => void
    removeAllToasts: () => void
}

export const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])
  
  const addToast = React.useCallback((options: ToastOptions) => {
    const id = generateToastId()
    const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id })
    const update = (props: Partial<Toast>) => dispatch({ type: 'UPDATE_TOAST', toast: { ...props, id } })

    const newToast: Toast = {
      ...options,
      id,
      createdAt: new Date(),
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    }
    
    dispatch({ type: 'ADD_TOAST', toast: newToast })

    return { id, dismiss, update }
  }, [])

  const removeToast = React.useCallback((id: string) => {
    dispatch({ type: 'DISMISS_TOAST', toastId: id })
  }, [])

  const removeAllToasts = React.useCallback(() => {
    dispatch({ type: 'REMOVE_ALL_TOASTS' })
  }, [])


  return (
    <ToastContext.Provider value={{ toasts: state.toasts, addToast, removeToast, removeAllToasts }}>
      {children}
    </ToastContext.Provider>
  )
}
