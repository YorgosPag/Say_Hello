'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Property, PropertyFilters } from '@/types/property';

const statusConfig = {
  available: { label: 'Διαθέσιμο', color: 'bg-green-100 text-green-800 border-green-200' },
  sold: { label: 'Πουλημένο', color: 'bg-red-100 text-red-800 border-red-200' },
  owner: { label: 'Οικοπεδούχου', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  reserved: { label: 'Κρατημένο', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
};

interface PropertyListProps {
  properties: Property[];
  selectedProperty: Property | null;
  onSelectProperty: (property: Property) => void;
  filters: PropertyFilters;
  onFiltersChange: (newFilters: Partial<PropertyFilters>) => void;
}

function PropertyListItem({ property, isSelected, onSelect }: { property: Property, isSelected: boolean, onSelect: () => void }) {
  const statusInfo = statusConfig[property.status] || { label: property.status, color: 'bg-gray-100' };

  return (
    <div
      className={cn(
        "p-3 border-b cursor-pointer hover:bg-muted/50 transition-colors",
        isSelected && "bg-blue-50 dark:bg-blue-950/30"
      )}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-semibold text-sm">{property.code}</h4>
        <Badge variant="outline" className={cn("text-xs", statusInfo.color)}>{statusInfo.label}</Badge>
      </div>
      <p className="text-xs text-muted-foreground truncate">{property.description}</p>
      <div className="flex justify-between items-center mt-2 text-xs">
        <span className="text-muted-foreground">{property.floor}</span>
        <span className="font-medium">{property.area} m²</span>
        <span className="font-semibold text-green-600">{property.price.toLocaleString('el-GR')}€</span>
      </div>
    </div>
  );
}

export function PropertyList({ properties, selectedProperty, onSelectProperty, filters, onFiltersChange }: PropertyListProps) {
  return (
    <Card className="min-w-[300px] max-w-[420px] w-full flex flex-col shrink-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Λίστα Ακινήτων</CardTitle>
        <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Αναζήτηση κωδικού..."
                className="pl-9 h-9"
                value={filters.searchTerm}
                onChange={(e) => onFiltersChange({ searchTerm: e.target.value })}
            />
        </div>
      </CardHeader>
      <ScrollArea className="flex-1">
        <CardContent className="p-0">
          {properties.map((property) => (
            <PropertyListItem
              key={property.id}
              property={property}
              isSelected={selectedProperty?.id === property.id}
              onSelect={() => onSelectProperty(property)}
            />
          ))}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
