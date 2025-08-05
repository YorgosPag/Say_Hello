"use client"

import * as React from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell } from "lucide-react"
import { defaultNotifications } from "@/constants/header"
import { NotificationItem } from "@/components/header/notification-item"

export function NotificationsPopover() {
  const [notifications] = React.useState(defaultNotifications)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {notifications.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {notifications.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold">Ειδοποιήσεις</h4>
          <Button variant="ghost" size="sm">
            Διαγραφή όλων
          </Button>
        </div>
        <div className="space-y-2">
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
