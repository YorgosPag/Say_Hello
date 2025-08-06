'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Eye, Pencil, Trash2, MoreVertical, Map } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ParkingTableHeader } from './ParkingTableHeader';
import type { ParkingSpot, ParkingFilters } from '@/types/parking';
import { PARKING_TYPE_LABELS, PARKING_STATUS_LABELS, PARKING_STATUS_COLORS } from '@/types/parking';

interface ParkingSpotTableProps {
  spots: ParkingSpot[];
  filters: ParkingFilters;
  selectedSpots: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onEdit: (spot: ParkingSpot) => void;
  onView: (spot: ParkingSpot) => void;
  onViewFloorPlan: (spot: ParkingSpot) => void;
}

export function ParkingSpotTable({
  spots,
  filters,
  selectedSpots,
  onSelectionChange,
  onEdit,
  onView,
  onViewFloorPlan,
}: ParkingSpotTableProps) {
  const [columnWidths, setColumnWidths] = useState<number[]>([40, 120, 100, 120, 100, 80, 100, 120, 180, 100, 150, 150, 150, 80]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const formatNumber = (value: any) => {
    const num = Number(value);
    if (isNaN(num) || num === 0) return '';
    return num.toLocaleString('el-GR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  
  const columns = useMemo(() => [
    { key: 'code', label: 'Κωδικός' },
    { key: 'type', label: 'Τύπος', format: (value: any) => PARKING_TYPE_LABELS[value as keyof typeof PARKING_TYPE_LABELS] },
    { key: 'propertyCode', label: 'Ακίνητο' },
    { key: 'level', label: 'Επίπεδο' },
    { key: 'area', label: 'τ.μ.', format: formatNumber },
    { key: 'price', label: 'Τιμή', format: formatNumber },
    { key: 'value', label: 'Αντ. Αξία', format: formatNumber },
    { key: 'valueWithSyndicate', label: 'Αντ. Αξία Με Συνιδιοκτησία', format: formatNumber },
    { key: 'status', label: 'Κατάσταση', format: (value: any) => PARKING_STATUS_LABELS[value as keyof typeof PARKING_STATUS_LABELS] },
    { key: 'owner', label: 'Ιδιοκτήτης' },
    { key: 'floorPlan', label: 'Κάτοψη' },
    { key: 'constructedBy', label: 'Καταχωρήθηκε Από' },
    { key: 'actions', label: 'Ενέργειες' }
  ], []);

  const handleSelect = (spotId: string) => {
    const newSelection = selectedSpots.includes(spotId)
      ? selectedSpots.filter(id => id !== spotId)
      : [...selectedSpots, spotId];
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedSpots.length === filteredSpots.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(filteredSpots.map(s => s.id));
    }
  };

  const handleSort = (columnKey: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };
  
  const filteredSpots = useMemo(() => {
    let filtered = [...spots];
    const searchLower = filters.searchTerm.toLowerCase();
    
    if (searchLower) {
        filtered = filtered.filter(spot =>
            spot.code.toLowerCase().includes(searchLower) ||
            spot.owner.toLowerCase().includes(searchLower) ||
            spot.propertyCode?.toLowerCase().includes(searchLower)
        );
    }
    if (filters.type !== 'all') {
        filtered = filtered.filter(spot => spot.type === filters.type);
    }
    if (filters.status !== 'all') {
        filtered = filtered.filter(spot => spot.status === filters.status);
    }
    if (filters.level !== 'all') {
        filtered = filtered.filter(spot => spot.level === filters.level);
    }

    return filtered;
  }, [spots, filters]);

  const sortedSpots = useMemo(() => {
    if (!sortConfig) return filteredSpots;
    return [...filteredSpots].sort((a, b) => {
      const aValue = (a as any)[sortConfig.key];
      const bValue = (b as any)[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredSpots, sortConfig]);

  const handleColumnResize = useCallback((newWidths: number[]) => {
    setColumnWidths(newWidths);
  }, []);

  const allSelected = selectedSpots.length === sortedSpots.length && sortedSpots.length > 0;
  const isIndeterminate = selectedSpots.length > 0 && !allSelected;

  return (
    <div className="border rounded-md flex flex-col h-[600px] text-sm overflow-hidden">
      <ParkingTableHeader 
        columns={columns}
        columnWidths={columnWidths}
        onColumnResize={handleColumnResize}
        sortConfig={sortConfig}
        onSort={handleSort}
        onSelectAll={handleSelectAll}
        allSelected={allSelected}
        isIndeterminate={isIndeterminate}
      />
      <ScrollArea className="flex-grow">
        <div className="relative">
          {sortedSpots.map((spot, rowIndex) => (
            <div
              key={spot.id}
              className={cn(
                "flex items-center border-b px-2 py-1.5 transition-colors cursor-pointer",
                selectedSpots.includes(spot.id) ? "bg-blue-100 dark:bg-blue-900/20" : "hover:bg-muted/50"
              )}
              onClick={() => handleSelect(spot.id)}
            >
                <div style={{ flex: `0 0 ${columnWidths[0]}px`}} className="flex items-center justify-center">
                    <Checkbox
                        checked={selectedSpots.includes(spot.id)}
                        onCheckedChange={() => handleSelect(spot.id)}
                    />
                </div>

              {columns.map((col, colIndex) => {
                if(col.key === 'actions') return null;

                const cellValue = (spot as any)[col.key];
                return (
                  <div key={col.key} style={{ flex: `0 0 ${columnWidths[colIndex+1]}px`}} className="px-2 truncate">
                    {col.format ? col.format(cellValue) : cellValue}
                  </div>
                );
              })}

               <div style={{ flex: `0 0 ${columnWidths[columns.length]}px`}} className="flex justify-end items-center px-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreVertical className="w-3.5 h-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(spot)}><Eye className="w-4 h-4 mr-2" />Προβολή</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(spot)}><Pencil className="w-4 h-4 mr-2" />Επεξεργασία</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onViewFloorPlan(spot)}><Map className="w-4 h-4 mr-2" />Κάτοψη</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" />Διαγραφή</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
               </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-3 border-t bg-muted/30 flex justify-between items-center shrink-0">
          <div>
            <Badge variant="secondary">{filteredSpots.length} / {spots.length} εγγραφές</Badge>
          </div>
          <div>
            {/* Totals could be added here */}
          </div>
      </div>
    </div>
  );
}
