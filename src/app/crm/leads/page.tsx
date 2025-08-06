'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Target } from 'lucide-react';

export default function CrmLeadsPage() {
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-6 h-6" />
            Leads & Ευκαιρίες
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Η σελίδα leads και ευκαιριών θα υλοποιηθεί εδώ.</p>
        </CardContent>
      </Card>
    </div>
  );
}
