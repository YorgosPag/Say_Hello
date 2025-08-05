
'use client';

import React from 'react';
import type { Building } from './BuildingsPageContent';

interface BuildingsListProps {
  buildings: Building[];
  selectedBuilding: Building;
  onSelectBuilding: (building: Building) => void;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export function BuildingsList({ buildings, selectedBuilding, onSelectBuilding, getStatusColor, getStatusLabel }: BuildingsListProps) {
  return (
    <div className="w-1/3 border-r overflow-y-auto">
      <div className="p-2 space-y-2">
        {buildings.map((building) => (
          <div
            key={building.id}
            className={`p-3 rounded-lg cursor-pointer ${selectedBuilding.id === building.id ? 'bg-muted' : 'hover:bg-muted/50'}`}
            onClick={() => onSelectBuilding(building)}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-semibold">{building.name}</h3>
              <span className={`px-2 py-1 text-xs rounded-full text-white ${getStatusColor(building.status)}`}>
                {getStatusLabel(building.status)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{building.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
