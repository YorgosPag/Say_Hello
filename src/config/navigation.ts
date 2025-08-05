import {
  Home,
  Settings,
  Users
} from "lucide-react"
import type { MenuItem } from "@/types/sidebar"

export const mainMenuItems: MenuItem[] = [
  {
    title: "Αρχική",
    icon: Home,
    href: "/",
    badge: null,
  },
  {
    title: "Επαφές",
    icon: Users,
    href: "/contacts",
    badge: null,
  }
]

export const toolsMenuItems: MenuItem[] = []

export const settingsMenuItem: MenuItem[] = [
    { title: "Ρυθμίσεις", icon: Settings, href: "/settings" }
]
