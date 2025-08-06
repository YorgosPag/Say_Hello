'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function CrmCustomersPage() {
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6" />
            Διαχείριση Πελατών
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Η σελίδα διαχείρισης πελατών θα υλοποιηθεί εδώ.</p>
        </CardContent>
      </Card>
    </div>
  );
}
