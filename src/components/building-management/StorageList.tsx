'use client';

import React from 'react';
import { StorageUnit } from '@/types/storage';

interface StorageListProps {
    units: StorageUnit[];
    onEdit: (unit: StorageUnit) => void;
    onDelete: (id: string) => void;
    getStatusColor: (status: any) => string;
    getStatusLabel: (status: any) => string;
    getTypeIcon: (type: any) => React.ReactNode;
    getTypeLabel: (type: any) => string;
}

export function StorageList({ units }: StorageListProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Λίστα Αποθηκών</h2>
      {units.map((unit) => (
        <div key={unit.id} className="p-4 border rounded-lg mb-2">
          <p>Κωδικός: {unit.code}</p>
          <p>Περιγραφή: {unit.description}</p>
        </div>
      ))}
    </div>
  );
}