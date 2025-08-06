'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Bell } from 'lucide-react';

export default function CrmNotificationsPage() {
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-6 h-6" />
            Ειδοποιήσεις
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Η σελίδα ειδοποιήσεων του CRM θα υλοποιηθεί εδώ.</p>
        </CardContent>
      </Card>
    </div>
  );
}
