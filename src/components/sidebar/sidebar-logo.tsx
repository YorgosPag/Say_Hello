"use client"

import { Feather } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"

export function SidebarLogo() {
  const { state } = useSidebar()

  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
        <Feather className="h-6 w-6" />
      </div>
      {state === "expanded" && (
        <div className="flex flex-col">
          <span className="text-base font-bold text-foreground">
            Λευκός Κάμβας
          </span>
          <span className="text-xs text-muted-foreground">v1.0</span>
        </div>
      )}
    </div>
  )
}
