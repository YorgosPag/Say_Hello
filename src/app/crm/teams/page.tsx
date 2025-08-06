'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users2 } from 'lucide-react';

export default function CrmTeamsPage() {
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users2 className="w-6 h-6" />
            Ομάδες & Ρόλοι
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Η σελίδα ομάδων και ρόλων θα υλοποιηθεί εδώ.</p>
        </CardContent>
      </Card>
    </div>
  );
}
