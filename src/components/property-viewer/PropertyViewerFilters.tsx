

'use client';

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, RotateCcw, Search, Filter } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";


export interface FilterState {
  searchTerm: string;
  project: string[];
  building: string[];
  floor: string[];
  propertyType: string[];
  status: string[];
  priceRange: { min: number | null; max: number | null };
  areaRange: { min: number | null; max: number | null };
  features: string[];
}

interface PropertyViewerFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const featureOptions = [
    { id: 'parking', label: 'Parking' },
    { id: 'storage', label: 'Αποθήκη' },
    { id: 'fireplace', label: 'Τζάκι' },
    { id: 'view', label: 'Θέα' },
    { id: 'pool', label: 'Πισίνα' },
]


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
  
  const handleFeatureChange = (featureId: string, checked: boolean | 'indeterminate') => {
    const currentFeatures = filters.features || [];
    const newFeatures = checked
      ? [...currentFeatures, featureId]
      : currentFeatures.filter(id => id !== featureId);
    handleFilterChange('features', newFeatures);
  }


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
      features: [],
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
    filters.areaRange.max !== null ||
    filters.features.length > 0;

  return (
    <Card className="w-full bg-card/50 border-none shadow-none">
      <CardContent className="space-y-4 p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {/* Search */}
             <div className="flex items-center gap-2">
                <Label htmlFor="search" className="text-xs font-medium shrink-0">Αναζήτηση</Label>
                <div className="relative w-full">
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
            <div className="flex items-center gap-2">
                <Label className="text-xs font-medium shrink-0">Εύρος Τιμής (€)</Label>
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

            {/* Area Range */}
             <div className="flex items-center gap-2">
                <Label className="text-xs font-medium shrink-0">Εύρος Εμβαδού (m²)</Label>
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
            
             <div className="flex items-center gap-2">
                <Label className="text-xs font-medium shrink-0">Κατάσταση</Label>
                 <Select
                  onValueChange={(value) => handleFilterChange('status', value === 'all' ? [] : [value])}
                  value={filters.status.length === 1 ? filters.status[0] : 'all'}
                 >
                    <SelectTrigger className="h-9 w-full">
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
        
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              {/* Project Filter */}
              <div className="flex items-center gap-2">
                <Label className="text-xs font-medium shrink-0">Έργο</Label>
                <Select>
                    <SelectTrigger className="h-9 w-full"><SelectValue placeholder="Επιλογή Έργου" /></SelectTrigger>
                    <SelectContent><SelectItem value="all">Όλα τα έργα</SelectItem></SelectContent>
                </Select>
              </div>
              {/* Building Filter */}
              <div className="flex items-center gap-2">
                <Label className="text-xs font-medium shrink-0">Κτίριο</Label>
                <Select>
                    <SelectTrigger className="h-9 w-full"><SelectValue placeholder="Επιλογή Κτιρίου" /></SelectTrigger>
                    <SelectContent><SelectItem value="all">Όλα τα κτίρια</SelectItem></SelectContent>
                </Select>
              </div>
              {/* Floor Filter */}
              <div className="flex items-center gap-2">
                <Label className="text-xs font-medium shrink-0">Όροφος</Label>
                <Select>
                    <SelectTrigger className="h-9 w-full"><SelectValue placeholder="Επιλογή Ορόφου" /></SelectTrigger>
                    <SelectContent><SelectItem value="all">Όλοι οι όροφοι</SelectItem></SelectContent>
                </Select>
              </div>
              {/* Property Type Filter */}
              <div className="flex items-center gap-2">
                <Label className="text-xs font-medium shrink-0">Τύπος Ακινήτου</Label>
                <Select>
                    <SelectTrigger className="h-9 w-full"><SelectValue placeholder="Επιλογή Τύπου" /></SelectTrigger>
                    <SelectContent><SelectItem value="all">Όλοι οι τύποι</SelectItem></SelectContent>
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
            <CollapsibleContent className="mt-4 p-4 border rounded-lg bg-background animate-in fade-in-0 zoom-in-95">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                 {featureOptions.map(feature => (
                    <div key={feature.id} className="flex items-center space-x-2">
                        <Checkbox 
                            id={`feature-${feature.id}`}
                            checked={filters.features.includes(feature.id)}
                            onCheckedChange={(checked) => handleFeatureChange(feature.id, checked)}
                        />
                        <Label htmlFor={`feature-${feature.id}`} className="text-sm font-normal">
                            {feature.label}
                        </Label>
                    </div>
                 ))}
              </div>
            </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
