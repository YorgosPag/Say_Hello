'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Filter } from 'lucide-react';

export default function CrmPipelinePage() {
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-6 h-6" />
            Πωλήσεις Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Η σελίδα pipeline πωλήσεων θα υλοποιηθεί εδώ.</p>
        </CardContent>
      </Card>
    </div>
  );
}
