'use client';

import React from 'react';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { ParkingTableToolbar } from './ParkingTableToolbar';

export function ParkingTableHeader() {
    return (
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Θέσεις Στάθμευσης</CardTitle>
                <CardDescription>Διαχείριση των θέσεων στάθμευσης του έργου.</CardDescription>
            </div>
            <ParkingTableToolbar />
        </div>
    );
}
