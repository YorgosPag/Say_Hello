'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';

export default function CrmTasksPage() {
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="w-6 h-6" />
            Εργασίες & Ραντεβού
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Η σελίδα εργασιών και ραντεβού θα υλοποιηθεί εδώ.</p>
        </CardContent>
      </Card>
    </div>
  );
}
