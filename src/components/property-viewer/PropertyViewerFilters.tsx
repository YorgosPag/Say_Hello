

"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, RotateCcw, Search, Filter } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";


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
  const [showAdvanced, setShowAdvanced] = useState(false);

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
    <Card className="w-full bg-card/50 border-none shadow-none">
      <CardContent className="space-y-4 p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
             <div className="space-y-1">
                <Label htmlFor="search" className="text-xs font-medium">Αναζήτηση</Label>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="search"
                        placeholder="Όνομα, περιγραφή..."
                        className="pl-9 h-9"
                        value={filters.searchTerm}
                        onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                    />
                </div>
            </div>

            {/* Price Range */}
            <div className="space-y-1">
                <Label className="text-xs font-medium">Εύρος Τιμής (€)</Label>
                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        placeholder="Από"
                        className="h-9"
                        value={filters.priceRange.min ?? ''}
                        onChange={(e) => handleRangeChange('priceRange', 'min', e.target.value)}
                    />
                    <Input
                        type="number"
                        placeholder="Έως"
                        className="h-9"
                        value={filters.priceRange.max ?? ''}
                        onChange={(e) => handleRangeChange('priceRange', 'max', e.target.value)}
                    />
                </div>
            </div>

            {/* Area Range */}
             <div className="space-y-1">
                <Label className="text-xs font-medium">Εύρος Εμβαδού (m²)</Label>
                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        placeholder="Από"
                        className="h-9"
                        value={filters.areaRange.min ?? ''}
                        onChange={(e) => handleRangeChange('areaRange', 'min', e.target.value)}
                    />
                    <Input
                        type="number"
                        placeholder="Έως"
                        className="h-9"
                         value={filters.areaRange.max ?? ''}
                        onChange={(e) => handleRangeChange('areaRange', 'max', e.target.value)}
                    />
                </div>
            </div>
            
             <div className="space-y-1">
                <Label className="text-xs font-medium">Κατάσταση</Label>
                 <Select
                  onValueChange={(value) => handleFilterChange('status', value === 'all' ? [] : [value])}
                  value={filters.status.length === 1 ? filters.status[0] : 'all'}
                 >
                    <SelectTrigger className="h-9">
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

        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <div className="flex items-center justify-between">
                <CollapsibleTrigger asChild>
                    <Button variant="link" size="sm">
                        <Filter className="w-4 h-4 mr-2"/>
                        {showAdvanced ? 'Απόκρυψη' : 'Περισσότερα'} Φίλτρα
                    </Button>
                </CollapsibleTrigger>
                {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Επαναφορά Φίλτρων
                    </Button>
                )}
            </div>
            <CollapsibleContent className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in-0 zoom-in-95">
              {/* Project Filter */}
              <div className="space-y-1">
                <Label className="text-xs font-medium">Έργο</Label>
                <Select>
                    <SelectTrigger className="h-9"><SelectValue placeholder="Επιλογή Έργου" /></SelectTrigger>
                    <SelectContent><SelectItem value="all">Όλα τα έργα</SelectItem></SelectContent>
                </Select>
              </div>
              {/* Building Filter */}
              <div className="space-y-1">
                <Label className="text-xs font-medium">Κτίριο</Label>
                <Select>
                    <SelectTrigger className="h-9"><SelectValue placeholder="Επιλογή Κτιρίου" /></SelectTrigger>
                    <SelectContent><SelectItem value="all">Όλα τα κτίρια</SelectItem></SelectContent>
                </Select>
              </div>
              {/* Floor Filter */}
              <div className="space-y-1">
                <Label className="text-xs font-medium">Όροφος</Label>
                <Select>
                    <SelectTrigger className="h-9"><SelectValue placeholder="Επιλογή Ορόφου" /></SelectTrigger>
                    <SelectContent><SelectItem value="all">Όλοι οι όροφοι</SelectItem></SelectContent>
                </Select>
              </div>
              {/* Property Type Filter */}
              <div className="space-y-1">
                <Label className="text-xs font-medium">Τύπος Ακινήτου</Label>
                <Select>
                    <SelectTrigger className="h-9"><SelectValue placeholder="Επιλογή Τύπου" /></SelectTrigger>
                    <SelectContent><SelectItem value="all">Όλοι οι τύποι</SelectItem></SelectContent>
                </Select>
              </div>
            </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
