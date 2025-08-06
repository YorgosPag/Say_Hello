
'use client';

import React, { useState } from 'react';
import { Mail, PhoneCall, Send, Video, MessageSquare } from 'lucide-react';

export function CommunicationsTab() {
  const channels = [
    { id: 'email', label: 'Email', icon: Mail, count: 45 },
    { id: 'phone', label: 'Τηλέφωνα', icon: PhoneCall, count: 23 },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, count: 12 },
    { id: 'telegram', label: 'Telegram', icon: Send, count: 8 },
    { id: 'meetings', label: 'Συναντήσεις', icon: Video, count: 5 }
  ];
  
  const [activeChannel, setActiveChannel] = useState('email');

  return (
    <div className="bg-white dark:bg-card rounded-lg shadow">
       <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">Αρχείο Επικοινωνίας</h2>
      </div>

      <div className="flex">
        {/* Sidebar with channels */}
        <div className="w-64 border-r p-4">
          <h3 className="font-medium mb-4">Κανάλια</h3>
          <div className="space-y-1">
            {channels.map(channel => (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                  activeChannel === channel.id 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <channel.icon className="w-4 h-4" />
                  <span>{channel.label}</span>
                </div>
                <span className="text-xs bg-gray-200 rounded-full px-2">{channel.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Communications List */}
        <div className="flex-1 p-6">
          <h3 className="text-lg font-semibold mb-4 capitalize">{activeChannel}</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Γιώργος Παπαδόπουλος</p>
                  <p className="text-sm text-gray-500">2 ώρες πριν</p>
                </div>
                <p className="text-sm text-gray-700 mt-1">Θέμα: Ερώτηση για διαμέρισμα A3</p>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  Καλησπέρα, θα ήθελα να ρωτήσω για τη διαθεσιμότητα του διαμερίσματος Α3 στο έργο της Θεσσαλονίκης. Ευχαριστώ.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
