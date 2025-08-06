
'use client';

import React from 'react';
import { Users, Building } from 'lucide-react';

export function OpportunityCard({ stage }: { stage: string }) {
    return (
        <div className="bg-white dark:bg-card-foreground/5 p-3 rounded-lg shadow-sm border hover:border-blue-400 cursor-grab">
            <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4" />
                <p className="text-sm font-medium">Γ. Παπαδόπουλος</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-muted-foreground">
                <Building className="w-4 h-4" />
                <span>Έργο "Κέντρο", Α3</span>
            </div>
            <p className="text-right text-xs font-bold text-green-600 mt-2">€120,000</p>
        </div>
    );
}
