
'use client';

import React from 'react';
import { BuildingCard } from '../BuildingCard';
import { getCategoryLabel, getStatusLabel } from '../BuildingCard/BuildingCardUtils';
import type { Building } from '../BuildingsPageContent';

interface BuildingsGroupedViewProps {
  viewMode: 'grid' | 'byType' | 'byStatus';
  filteredBuildings: Building[];
  selectedBuilding: Building | null;
  setSelectedBuilding: (building: Building | null) => void;
}

export function BuildingsGroupedView({
  viewMode,
  filteredBuildings,
  selectedBuilding,
  setSelectedBuilding,
}: BuildingsGroupedViewProps) {
  const groupedByType = filteredBuildings.reduce((acc, building) => {
    const type = building.category;
    if (!acc[type]) acc[type] = [];
    acc[type].push(building);
    return acc;
  }, {} as Record<string, Building[]>);

  const groupedByStatus = filteredBuildings.reduce((acc, building) => {
    const status = building.status;
    if (!acc[status]) acc[status] = [];
    acc[status].push(building);
    return acc;
  }, {} as Record<string, Building[]>);

  if (viewMode === 'grid') {
    return (
      <div className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBuildings.map((building) => (
            <BuildingCard
              key={building.id}
              building={building}
              isSelected={selectedBuilding?.id === building.id}
              onClick={() => setSelectedBuilding(building)}
            />
          ))}
        </div>
      </div>
    );
  }

  if (viewMode === 'byType') {
    return (
      <div className="flex-1 p-4 overflow-auto">
        {Object.entries(groupedByType).map(([type, buildingsOfType]) => (
          <div key={type} className="mb-8">
            <h2 className="text-xl font-bold mb-4 capitalize border-b pb-2">{getCategoryLabel(type)} ({buildingsOfType.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {buildingsOfType.map((building) => (
                <BuildingCard
                  key={building.id}
                  building={building}
                  isSelected={selectedBuilding?.id === building.id}
                  onClick={() => setSelectedBuilding(building)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (viewMode === 'byStatus') {
    return (
      <div className="flex-1 p-4 overflow-auto">
        {Object.entries(groupedByStatus).map(([status, buildingsOfStatus]) => (
          <div key={status} className="mb-8">
            <h2 className="text-xl font-bold mb-4 capitalize border-b pb-2">{getStatusLabel(status)} ({buildingsOfStatus.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {buildingsOfStatus.map((building) => (
                <BuildingCard
                  key={building.id}
                  building={building}
                  isSelected={selectedBuilding?.id === building.id}
                  onClick={() => setSelectedBuilding(building)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
