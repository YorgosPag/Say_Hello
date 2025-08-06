import {
  Home,
  Settings,
  Users,
  Building,
  Library,
  Briefcase,
  Archive,
  Keyboard,
  BarChart,
  Phone,
  Target,
  ClipboardList,
  Filter,
  Users2,
  Bell,
  AppWindow,
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
  {
    title: "CRM",
    icon: AppWindow,
    href: "/crm",
    badge: "PRO",
    subItems: [
        { title: 'Dashboard', icon: BarChart, href: '/crm/dashboard' },
        { title: 'Διαχείριση Πελατών', icon: Users, href: '/crm/customers' },
        { title: 'Επικοινωνίες', icon: Phone, href: '/crm/communications' },
        { title: 'Leads & Ευκαιρίες', icon: Target, href: '/crm/leads' },
        { title: 'Εργασίες & Ραντεβού', icon: ClipboardList, href: '/crm/tasks' },
        { title: 'Πωλήσεις Pipeline', icon: Filter, href: '/crm/pipeline' },
        { title: 'Ομάδες & Ρόλοι', icon: Users2, href: '/crm/teams' },
        { title: 'Ειδοποιήσεις', icon: Bell, href: '/crm/notifications' },
    ]
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
