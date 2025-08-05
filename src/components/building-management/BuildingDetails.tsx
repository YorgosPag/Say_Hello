
'use client';

import React from 'react';
import type { Building } from './BuildingsPageContent';

interface BuildingDetailsProps {
  building: Building;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export function BuildingDetails({ building, getStatusColor, getStatusLabel }: BuildingDetailsProps) {
  if (!building) {
    return <div className="flex-1 p-6">Select a building to see details.</div>;
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-2">{building.name}</h2>
      <p className="text-muted-foreground mb-4">{building.description}</p>
      
      <div className="space-y-4">
        <div>
          <strong>Address:</strong> {building.address}, {building.city}
        </div>
        <div>
          <strong>Status:</strong>{' '}
          <span className={`px-2 py-1 text-xs rounded-full text-white ${getStatusColor(building.status)}`}>
            {getStatusLabel(building.status)}
          </span>
        </div>
        <div>
          <strong>Total Area:</strong> {building.totalArea} m²
        </div>
        <div>
          <strong>Built Area:</strong> {building.builtArea} m²
        </div>
        <div>
          <strong>Floors:</strong> {building.floors}
        </div>
        <div>
          <strong>Units:</strong> {building.units}
        </div>
        <div>
          <strong>Progress:</strong> {building.progress}%
        </div>
        <div>
          <strong>Value:</strong> €{building.totalValue.toLocaleString('el-GR')}
        </div>
        <div>
          <strong>Company:</strong> {building.company}
        </div>
        <div>
          <strong>Project:</strong> {building.project}
        </div>
        <div>
          <strong>Category:</strong> {building.category}
        </div>
        {building.features && (
          <div>
            <strong>Features:</strong>
            <ul className="list-disc list-inside">
              {building.features.map(feature => <li key={feature}>{feature}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
