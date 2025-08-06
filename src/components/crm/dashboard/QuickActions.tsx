
'use client';

import React from 'react';
import { Mail, PhoneCall, Calendar, Plus } from 'lucide-react';

export function QuickActions() {
  const actions = [
    { label: 'Νέο Email', icon: Mail },
    { label: 'Καταγραφή Κλήσης', icon: PhoneCall },
    { label: 'Νέο Ραντεβού', icon: Calendar },
    { label: 'Νέα Εργασία', icon: Plus },
  ];
  return (
    <div className="bg-white dark:bg-card rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Γρήγορες Ενέργειες</h2>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, idx) => (
          <button key={idx} className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors">
            <action.icon className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-800">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
