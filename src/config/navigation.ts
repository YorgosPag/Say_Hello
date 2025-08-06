import {
  Home,
  Settings,
  Users,
  Building,
  Library,
  Briefcase,
  Archive,
  Keyboard,
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
    title: "Ευρετήριο Ακινήτων",
    icon: Library,
    href: "/properties",
    badge: "Νέο",
  },
  {
    title: "Επαφές",
    icon: Users,
    href: "/contacts",
    badge: null,
  },
  {
    title: "Έργα",
    icon: Briefcase,
    href: "/audit",
    badge: null,
  },
  {
    title: "Κτίρια",
    icon: Building,
    href: "/buildings",
    badge: null,
  },
  {
    title: "Μονάδες (Units)",
    icon: Archive,
    href: "/units",
    badge: null,
  },
]

export const toolsMenuItems: MenuItem[] = []

export const settingsMenuItem: MenuItem[] = [
    { 
      title: "Ρυθμίσεις", 
      icon: Settings, 
      href: "/settings",
      subItems: [
        { title: 'Συντομεύσεις', icon: Keyboard, href: '/settings/shortcuts' }
      ]
    }
]
