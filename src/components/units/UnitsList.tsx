
'use client';

import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UnitsListHeader } from './list/UnitsListHeader';
import { UnitListItem } from './list/UnitListItem';
import { UnitToolbar } from './toolbar/UnitToolbar';
import type { Property } from '@/types/property-viewer';
import type { UnitSortKey } from '@/types/unit';


interface UnitsListProps {
  units: Property[];
  selectedUnit: Property | null;
  onSelectUnit?: (unit: Property) => void;
}

export function UnitsList({ 
  units, 
  selectedUnit, 
  onSelectUnit,
}: UnitsListProps) {
  const [favorites, setFavorites] = useState<string[]>(['prop-1']);
  const [sortBy, setSortBy] = useState<UnitSortKey>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const toggleFavorite = (unitId: string) => {
    setFavorites(prev => 
      prev.includes(unitId) 
        ? prev.filter(id => id !== unitId)
        : [...prev, unitId]
    );
  };

  const sortedUnits = [...units].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'price':
        aValue = a.price || 0;
        bValue = b.price || 0;
        break;
      case 'area':
        aValue = a.area || 0;
        bValue = b.area || 0;
        break;
      default:
        return 0;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      return sortOrder === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    }
  });

  return (
    <div className="min-w-[300px] max-w-[420px] w-full bg-card border rounded-lg flex flex-col shrink-0 shadow-sm max-h-full overflow-hidden">
      <UnitsListHeader 
        unitCount={units.length}
        availableCount={units.filter(b => b.status === 'for-sale' || b.status === 'for-rent').length}
        totalValue={units.reduce((sum, b) => sum + (b.price || 0), 0)}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      <UnitToolbar />

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {sortedUnits.map((unit) => (
            <UnitListItem
              key={unit.id}
              unit={unit}
              isSelected={selectedUnit?.id === unit.id}
              isFavorite={favorites.includes(unit.id)}
              onSelect={() => onSelectUnit?.(unit)}
              onToggleFavorite={() => toggleFavorite(unit.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
