
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, RotateCcw, Search } from "lucide-react";
import type { PropertyStatus } from '@/types/property-viewer';

export interface FilterState {
  searchTerm: string;
  project: string[];
  building: string[];
  floor: string[];
  propertyType: string[];
  status: string[];
  priceRange: { min: number | null; max: number | null };
  areaRange: { min: number | null; max: number | null };
}

interface PropertyViewerFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}


export function PropertyViewerFilters({ filters, onFiltersChange }: PropertyViewerFiltersProps) {

  const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleRangeChange = (
    key: 'priceRange' | 'areaRange',
    subKey: 'min' | 'max',
    value: string
  ) => {
    const numericValue = value ? parseFloat(value) : null;
    handleFilterChange(key, { ...filters[key], [subKey]: numericValue });
  };


  const clearAllFilters = () => {
    onFiltersChange({
      searchTerm: '',
      project: [],
      building: [],
      floor: [],
      propertyType: [],
      status: [],
      priceRange: { min: null, max: null },
      areaRange: { min: null, max: null },
    });
  };

  const hasActiveFilters =
    filters.searchTerm ||
    filters.project.length > 0 ||
    filters.building.length > 0 ||
    filters.floor.length > 0 ||
    filters.propertyType.length > 0 ||
    filters.status.length > 0 ||
    filters.priceRange.min !== null ||
    filters.priceRange.max !== null ||
    filters.areaRange.min !== null ||
    filters.areaRange.max !== null;

  return (
    <Card className="w-full">
      <CardContent className="space-y-4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
             <div className="space-y-2 lg:col-span-1">
                <Label htmlFor="search" className="text-sm font-medium">Αναζήτηση</Label>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="search"
                        placeholder="Όνομα, περιγραφή..."
                        className="pl-9"
                        value={filters.searchTerm}
                        onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                    />
                </div>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">Εύρος Τιμής (€)</Label>
                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        placeholder="Από"
                        value={filters.priceRange.min ?? ''}
                        onChange={(e) => handleRangeChange('priceRange', 'min', e.target.value)}
                    />
                    <Input
                        type="number"
                        placeholder="Έως"
                        value={filters.priceRange.max ?? ''}
                        onChange={(e) => handleRangeChange('priceRange', 'max', e.target.value)}
                    />
                </div>
            </div>

            {/* Area Range */}
             <div className="space-y-2">
                <Label className="text-sm font-medium">Εύρος Εμβαδού (m²)</Label>
                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        placeholder="Από"
                        value={filters.areaRange.min ?? ''}
                        onChange={(e) => handleRangeChange('areaRange', 'min', e.target.value)}
                    />
                    <Input
                        type="number"
                        placeholder="Έως"
                         value={filters.areaRange.max ?? ''}
                        onChange={(e) => handleRangeChange('areaRange', 'max', e.target.value)}
                    />
                </div>
            </div>
            
             <div className="space-y-2">
                <Label className="text-sm font-medium">Κατάσταση</Label>
                 <Select
                  onValueChange={(value) => handleFilterChange('status', value === 'all' ? [] : [value])}
                  value={filters.status.length === 1 ? filters.status[0] : 'all'}
                 >
                    <SelectTrigger>
                        <SelectValue placeholder="Επιλογή κατάστασης..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Όλες οι καταστάσεις</SelectItem>
                        <SelectItem value="for-sale">Προς Πώληση</SelectItem>
                        <SelectItem value="for-rent">Προς Ενοικίαση</SelectItem>
                        <SelectItem value="sold">Πουλημένο</SelectItem>
                        <SelectItem value="rented">Ενοικιασμένο</SelectItem>
                        <SelectItem value="reserved">Δεσμευμένο</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        {hasActiveFilters && (
            <div className="flex items-center justify-end">
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Επαναφορά Φίλτρων
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
