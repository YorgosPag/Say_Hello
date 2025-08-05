"use client"

import * as React from "react"

export function useKeyboardShortcut(
  key: string,
  callback: (e: KeyboardEvent) => void,
  options: {
    metaKey?: boolean
    ctrlKey?: boolean
  } = { metaKey: true, ctrlKey: true }
) {
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        e.key === key &&
        (e.metaKey || e.ctrlKey)
      ) {
        e.preventDefault()
        callback(e)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [key, callback, options])
}
