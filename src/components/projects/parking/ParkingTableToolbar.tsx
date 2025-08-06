'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Filter, Search, Upload, Download, Save, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ParkingFilters, ParkingStats, ParkingSpotType, ParkingSpotStatus } from '@/types/parking';
import { PARKING_TYPE_LABELS, PARKING_STATUS_LABELS } from '@/types/parking';


interface ParkingTableToolbarProps {
  filters: ParkingFilters;
  onFiltersChange: (newFilters: Partial<ParkingFilters>) => void;
  stats: ParkingStats;
  selectedCount: number;
  onExport: () => void;
  onImport: () => void;
  onAdd: () => void;
  onDelete: () => void;
  onSave: () => void;
  onRefresh: () => void;
}

export function ParkingTableToolbar({
  filters,
  onFiltersChange,
  stats,
  selectedCount,
  onExport,
  onImport,
  onAdd,
  onDelete,
  onSave,
  onRefresh
}: ParkingTableToolbarProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Top row with main actions and search */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Button onClick={onAdd} size="sm"><Plus className="mr-2 h-4 w-4" />Νέα Θέση</Button>
          <Button onClick={onDelete} size="sm" variant="outline" disabled={selectedCount === 0}><Trash2 className="mr-2 h-4 w-4" />Διαγραφή ({selectedCount})</Button>
          <Button onClick={onSave} size="sm" variant="outline"><Save className="mr-2 h-4 w-4" />Αποθήκευση</Button>
        </div>
        <div className="flex items-center gap-2">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Αναζήτηση..." 
                  className="pl-8 h-9" 
                  value={filters.searchTerm}
                  onChange={(e) => onFiltersChange({ searchTerm: e.target.value })}
                />
            </div>
             <Button onClick={onRefresh} size="icon" variant="outline"><RefreshCw className="h-4 w-4" /></Button>
        </div>
      </div>
      
      {/* Second row with filters and data actions */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filters.status} onValueChange={(value) => onFiltersChange({ status: value })}>
              <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="Φίλτρο κατάστασης" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="all">Όλες οι καταστάσεις</SelectItem>
                  {Object.keys(PARKING_STATUS_LABELS).map(key => (
                    <SelectItem key={key} value={key}>{PARKING_STATUS_LABELS[key as ParkingSpotStatus]}</SelectItem>
                  ))}
              </SelectContent>
          </Select>

          <Select value={filters.type} onValueChange={(value) => onFiltersChange({ type: value })}>
              <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="Φίλτρο τύπου" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="all">Όλοι οι τύποι</SelectItem>
                  {Object.keys(PARKING_TYPE_LABELS).map(key => (
                    <SelectItem key={key} value={key}>{PARKING_TYPE_LABELS[key as ParkingSpotType]}</SelectItem>
                  ))}
              </SelectContent>
          </Select>

          <Select value={filters.level} onValueChange={(value) => onFiltersChange({ level: value })}>
              <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="Φίλτρο επιπέδου" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="all">Όλα τα επίπεδα</SelectItem>
                  {/* This should be populated dynamically */}
                  <SelectItem value="Ισόγειο">Ισόγειο</SelectItem>
                  <SelectItem value="Υπόγειο 1">Υπόγειο 1</SelectItem>
              </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={onImport} size="sm" variant="outline"><Upload className="mr-2 h-4 w-4" />Εισαγωγή</Button>
          <Button onClick={onExport} size="sm" variant="outline"><Download className="mr-2 h-4 w-4" />Εξαγωγή</Button>
        </div>
      </div>
    </div>
  );
}