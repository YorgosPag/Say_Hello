'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCheck, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

const notifications = [
  {
    id: 1,
    type: 'new_lead',
    title: 'Νέο Lead από Website',
    description: 'Ο Γιάννης Ιωάννου έδειξε ενδιαφέρον για το έργο "Κέντρο".',
    time: '2 λεπτά πριν',
    read: false,
  },
  {
    id: 2,
    type: 'task_due',
    title: 'Επίκειται εργασία',
    description: 'Follow-up με TechCorp για την πρόταση.',
    time: '1 ώρα πριν',
    read: false,
  },
  {
    id: 3,
    type: 'meeting_reminder',
    title: 'Υπενθύμιση Ραντεβού',
    description: 'Ξενάγηση με Μαρία Παπαδάκη στο διαμέρισμα Α3, αύριο στις 10:00.',
    time: '3 ώρες πριν',
    read: true,
  },
  {
    id: 4,
    type: 'contract_signed',
    title: 'Επιτυχής Πώληση!',
    description: 'Το διαμέρισμα Β2 πωλήθηκε στον Κώστα Βασιλείου.',
    time: '1 μέρα πριν',
    read: true,
  },
];

const getTypeStyles = (type: string) => {
    switch(type) {
        case 'new_lead': return 'bg-blue-100 text-blue-800';
        case 'task_due': return 'bg-yellow-100 text-yellow-800';
        case 'meeting_reminder': return 'bg-purple-100 text-purple-800';
        case 'contract_signed': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

const getTypeLabel = (type: string) => {
     switch(type) {
        case 'new_lead': return 'Lead';
        case 'task_due': return 'Εργασία';
        case 'meeting_reminder': return 'Ραντεβού';
        case 'contract_signed': return 'Πώληση';
        default: return 'Γενικό';
    }
}

export default function CrmNotificationsPage() {
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-6 h-6" />
                Κέντρο Ειδοποιήσεων
              </CardTitle>
              <CardDescription>Όλες οι ενημερώσεις σας σε ένα μέρος.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2"/>
                    Φίλτρα
                </Button>
                 <Button>
                    <CheckCheck className="w-4 h-4 mr-2"/>
                    Όλες ως διαβασμένες
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className={cn(
                  "p-4 rounded-lg flex items-start gap-4 transition-colors",
                  notification.read ? "bg-muted/50" : "bg-card border"
              )}>
                <div className={cn(
                    "w-2 h-2 rounded-full mt-1.5 shrink-0",
                    notification.read ? 'bg-gray-300' : 'bg-blue-500 animate-pulse'
                )}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{notification.title}</h4>
                      <Badge variant="outline" className={cn("text-xs", getTypeStyles(notification.type))}>
                        {getTypeLabel(notification.type)}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}