'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Phone } from 'lucide-react';

export default function CrmCommunicationsPage() {
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-6 h-6" />
            Επικοινωνίες
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Η σελίδα επικοινωνιών θα υλοποιηθεί εδώ.</p>
        </CardContent>
      </Card>
    </div>
  );
}
