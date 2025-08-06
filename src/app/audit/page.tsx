'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ClipboardCheck } from 'lucide-react';

export default function AuditPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <ClipboardCheck className="w-16 h-16 text-muted-foreground mb-4" />
      <h1 className="text-2xl font-bold text-foreground mb-2">Έλεγχos</h1>
      <p className="text-lg text-muted-foreground mb-4">
        Αυτή η ενότητα βρίσκεται υπό κατασκευή.
      </p>
      <p className="max-w-md text-sm text-muted-foreground mb-6">
        Το περιεχόμενο και οι λειτουργίες για τη σελίδα ελέγχου θα είναι διαθέσιμα σύντομα. Εκτιμούμε την κατανόησή σας.
      </p>
      <Button onClick={() => window.history.back()}>
        Επιστροφή
      </Button>
    </div>
  );
}
