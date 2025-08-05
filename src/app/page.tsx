"use client"

import { WelcomeSection } from "@/components/dashboard/welcome-section"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentActivities } from "@/components/dashboard/recent-activities"
import { ContactDistribution } from "@/components/dashboard/contact-distribution"
import { UpcomingMeetings } from "@/components/dashboard/upcoming-meetings"
import { AIAssistantCard } from "@/components/dashboard/ai-assistant-card"
import { StorageInfo } from "@/components/dashboard/storage-info"
import {
  quickStats,
  recentActivities,
  upcomingMeetings,
} from "@/lib/mock-data/dashboard"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <WelcomeSection activeToday={quickStats.activeToday} />
      <StatsCards stats={quickStats} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <QuickActions />
          <RecentActivities activities={recentActivities} />
        </div>
        <div className="space-y-6">
          <ContactDistribution />
          <UpcomingMeetings meetings={upcomingMeetings} />
          <AIAssistantCard />
          <StorageInfo />
        </div>
      </div>
    </div>
  )
}
