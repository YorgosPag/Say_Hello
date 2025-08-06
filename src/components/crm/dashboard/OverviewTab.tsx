
'use client';

import { Users, Target, Calendar, Clock } from 'lucide-react';
import { RecentActivities } from './RecentActivities';
import { QuickActions } from './QuickActions';
import { TeamPerformance } from './TeamPerformance';

export function OverviewTab() {
  const stats = [
    { label: 'Νέα Leads', value: '23', change: '+12%', icon: Users, color: 'blue' },
    { label: 'Ενεργές Ευκαιρίες', value: '45', change: '+5%', icon: Target, color: 'green' },
    { label: 'Προγραμματισμένες Ξεναγήσεις', value: '8', change: '0%', icon: Calendar, color: 'purple' },
    { label: 'Εκκρεμείς Εργασίες', value: '17', change: '-3%', icon: Clock, color: 'orange' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-card rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <p className={`text-sm mt-1 ${
                  stat.change.startsWith('+') ? 'text-green-600' : 
                  stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {stat.change} από προηγούμενη εβδομάδα
                </p>
              </div>
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivities />
        <QuickActions />
      </div>

      {/* Team Performance */}
      <TeamPerformance />
    </div>
  );
}
