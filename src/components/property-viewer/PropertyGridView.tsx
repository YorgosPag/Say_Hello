
'use client';

import React from 'react';
import type { Property } from '@/types/property-viewer';
import { PropertyGrid } from './PropertyGrid';
import { formatFloorLabel } from '../building-management/BuildingCard/BuildingCardUtils';
import { Badge } from '../ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const statusConfig = {
    'for-sale': 'Προς Πώληση',
    'for-rent': 'Προς Ενοικίαση',
    'sold': 'Πουλημένο',
    'rented': 'Ενοικιασμένο',
    'reserved': 'Δεσμευμένο',
};

interface PropertyGridViewProps {
  viewMode: 'grid' | 'byType' | 'byStatus';
  filteredProperties: Property[];
  selectedPropertyIds: string[];
  onSelectProperty: (id: string, shift: boolean) => void;
}

export function PropertyGridView({
  viewMode,
  filteredProperties,
  selectedPropertyIds,
  onSelectProperty,
}: PropertyGridViewProps) {

  const getStatusLabel = (status: keyof typeof statusConfig) => statusConfig[status] || 'Άγνωστο';

  const groupedByType = filteredProperties.reduce((acc, property) => {
    const type = property.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(property);
    return acc;
  }, {} as Record<string, Property[]>);

  const groupedByStatus = filteredProperties.reduce((acc, property) => {
    const status = property.status;
    if (!acc[status]) acc[status] = [];
    acc[status].push(property);
    return acc;
  }, {} as Record<string, Property[]>);

  if (viewMode === 'grid') {
    return (
      <div className="flex-1 p-4 overflow-auto">
        <PropertyGrid
          properties={filteredProperties}
          selectedPropertyIds={selectedPropertyIds}
          onSelect={onSelectProperty}
        />
      </div>
    );
  }

  if (viewMode === 'byType') {
    return (
      <div className="flex-1 p-4 overflow-auto space-y-8">
        {Object.entries(groupedByType).map(([type, propertiesOfType]) => (
          <div key={type}>
            <h2 className="text-xl font-bold mb-4 capitalize border-b pb-2">{type} ({propertiesOfType.length})</h2>
            <PropertyGrid
              properties={propertiesOfType}
              selectedPropertyIds={selectedPropertyIds}
              onSelect={onSelectProperty}
            />
          </div>
        ))}
      </div>
    );
  }

  if (viewMode === 'byStatus') {
    return (
      <div className="flex-1 p-4 overflow-auto space-y-8">
        {Object.entries(groupedByStatus).map(([status, propertiesOfStatus]) => (
          <div key={status}>
            <h2 className="text-xl font-bold mb-4 capitalize border-b pb-2">{getStatusLabel(status as keyof typeof statusConfig)} ({propertiesOfStatus.length})</h2>
             <PropertyGrid
              properties={propertiesOfStatus}
              selectedPropertyIds={selectedPropertyIds}
              onSelect={onSelectProperty}
            />
          </div>
        ))}
      </div>
    );
  }

  return null;
}
