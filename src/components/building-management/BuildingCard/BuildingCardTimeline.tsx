'use client';

import React from 'react';
import { Calendar } from "lucide-react";
import { cn } from '@/lib/utils';
import type { Building } from '../BuildingsPageContent';
import { formatDate, getDaysUntilCompletion } from './BuildingCardUtils';


interface BuildingCardTimelineProps {
  building: Building;
}

export function BuildingCardTimeline({ building }: BuildingCardTimelineProps) {
  const daysUntilCompletion = getDaysUntilCompletion(building.completionDate);

  if (!building.completionDate) return null;

  return (
    <div className="px-6 pb-6 pt-2 border-t border-border/50">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>Παράδοση:</span>
        </div>
        <div className="text-right">
          <p className="font-medium">{formatDate(building.completionDate)}</p>
          {daysUntilCompletion !== null && (
            <p className={cn(
              "text-xs",
              daysUntilCompletion < 0 ? "text-red-500" : 
              daysUntilCompletion < 30 ? "text-yellow-600" : "text-green-600"
            )}>
              {daysUntilCompletion < 0 
                ? `${Math.abs(daysUntilCompletion)} ημέρες καθυστέρηση`
                : daysUntilCompletion === 0 
                ? "Παράδοση σήμερα!"
                : `${daysUntilCompletion} ημέρες απομένουν`
              }
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
