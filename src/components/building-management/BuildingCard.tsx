
'use client';

import React from 'react';
import type { Building } from './BuildingsPageContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface BuildingCardProps {
  building: Building;
  isSelected: boolean;
  onClick: () => void;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export function BuildingCard({ building, isSelected, onClick, getStatusColor, getStatusLabel }: BuildingCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="text-base truncate">{building.name}</CardTitle>
        <div className={`px-2 py-1 text-xs rounded-full text-white ${getStatusColor(building.status)} w-fit`}>
          {getStatusLabel(building.status)}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground h-10 overflow-hidden">{building.description}</p>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{building.progress}%</span>
          </div>
          <Progress value={building.progress} className="h-2 mt-1" />
        </div>
      </CardContent>
    </Card>
  );
}
