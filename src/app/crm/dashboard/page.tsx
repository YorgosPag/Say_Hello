'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart } from 'lucide-react';

export default function CrmDashboardPage() {
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="w-6 h-6" />
            CRM Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Το dashboard του CRM θα υλοποιηθεί εδώ.</p>
        </CardContent>
      </Card>
    </div>
  );
}
