'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Archive } from 'lucide-react';

export default function UnitsPage() {
  return (
    <div className="p-8 flex items-center justify-center h-full">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-muted rounded-full p-3 w-fit">
            <Archive className="w-8 h-8 text-muted-foreground" />
          </div>
          <CardTitle className="mt-4">Μονάδες (Units)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Αυτή η σελίδα είναι υπό κατασκευή.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
