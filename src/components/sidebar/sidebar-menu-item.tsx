"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import {
  SidebarMenuItem as SidebarMenuItemPrimitive,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import { SidebarBadge } from "@/components/sidebar/sidebar-badge"
import { cn } from "@/lib/utils"
import type { MenuItem } from "@/types/sidebar"

interface SidebarMenuItemProps {
  item: MenuItem
  isExpanded: boolean
  isActive: boolean
  onToggleExpanded: (title: string) => void
}

export function SidebarMenuItem({
  item,
  isExpanded,
  isActive,
  onToggleExpanded,
}: SidebarMenuItemProps) {
  return (
    <SidebarMenuItemPrimitive>
      {item.subItems ? (
        <>
          <SidebarMenuButton
            onClick={() => onToggleExpanded(item.title)}
            isActive={isActive}
            className={cn(
              "group relative transition-all duration-200",
              isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
          >
            <item.icon
              className={cn(
                "transition-all duration-200",
                isActive && "text-blue-600 dark:text-blue-400"
              )}
            />
            <span className="font-medium">{item.title}</span>
            {item.badge && <SidebarBadge badge={item.badge} />}
            <ChevronRight
              className={cn(
                "ml-auto h-4 w-4 transition-transform duration-200",
                isExpanded && "rotate-90"
              )}
            />
          </SidebarMenuButton>
          {isExpanded && (
            <SidebarMenuSub>
              {item.subItems.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={isActive}
                    className={cn(
                      "transition-all duration-200",
                      isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                    )}
                  >
                    <Link href={subItem.href}>
                      <subItem.icon className="h-4 w-4" />
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          )}
        </>
      ) : (
        <SidebarMenuButton
          asChild
          isActive={isActive}
          className={cn(
            "group relative transition-all duration-200",
            isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
          )}
        >
          <Link href={item.href}>
            <item.icon
              className={cn(
                "transition-all duration-200",
                isActive && "text-blue-600 dark:text-blue-400"
              )}
            />
            <span className="font-medium">{item.title}</span>
            {item.badge && <SidebarBadge badge={item.badge} />}
          </Link>
        </SidebarMenuButton>
      )}
    </SidebarMenuItemPrimitive>
  )
}
