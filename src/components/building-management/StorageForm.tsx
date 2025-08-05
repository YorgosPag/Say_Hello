'use client';

import React from 'react';
import { StorageUnit } from '@/types/storage';

interface StorageFormProps {
    unit: StorageUnit | null;
    building: any;
    onSave: (unit: StorageUnit) => void;
    onCancel: () => void;
}

export function StorageForm({ unit, onSave, onCancel }: StorageFormProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">{unit ? 'Επεξεργασία' : 'Νέα'} Αποθήκη</h2>
        <p>Φόρμα αποθήκης...</p>
        <div className="flex justify-end gap-2 mt-4">
            <button onClick={onCancel}>Ακύρωση</button>
            <button>Αποθήκευση</button>
        </div>
      </div>
    </div>
  );
}
