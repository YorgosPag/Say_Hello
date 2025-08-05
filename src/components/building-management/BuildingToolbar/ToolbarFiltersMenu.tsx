'use client';

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { ToolbarButton } from '@/components/ui/ToolbarButton';
import { Filter, SortAsc, SortDesc, X, RefreshCw } from 'lucide-react';

interface ToolbarFiltersMenuProps {
  sortDirection: 'asc' | 'desc';
  onToggleSort: () => void;
  activeFilters: string[];
  onActiveFiltersChange: (filters: string[]) => void;
}

export function ToolbarFiltersMenu({
  sortDirection,
  onToggleSort,
  activeFilters,
  onActiveFiltersChange
}: ToolbarFiltersMenuProps) {

  const handleFilterChange = (filter: string, checked: boolean) => {
    onActiveFiltersChange(
      checked 
        ? [...activeFilters, filter]
        : activeFilters.filter(f => f !== filter)
    );
  };
  
  return (
    <div className="flex items-center gap-1">
      <ToolbarButton 
        tooltip={`Ταξινόμηση ${sortDirection === 'asc' ? 'Αύξουσα' : 'Φθίνουσα'}`}
        onClick={onToggleSort}
      >
        {sortDirection === 'asc' ? 
          <SortAsc className="w-4 h-4" /> : 
          <SortDesc className="w-4 h-4" />
        }
      </ToolbarButton>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>
            <ToolbarButton 
              tooltip="Φίλτρα και Προβολή"
              badge={activeFilters.length > 0 ? activeFilters.length : undefined}
            >
              <Filter className="w-4 h-4" />
            </ToolbarButton>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Φίλτρα Κτιρίων</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem 
            checked={activeFilters.includes('active')}
            onCheckedChange={(checked) => handleFilterChange('active', !!checked)}
          >
            Ενεργά Κτίρια
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem 
            checked={activeFilters.includes('construction')}
            onCheckedChange={(checked) => handleFilterChange('construction', !!checked)}
          >
            Υπό Κατασκευή
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem 
            checked={activeFilters.includes('planned')}
            onCheckedChange={(checked) => handleFilterChange('planned', !!checked)}
          >
            Σχεδιασμένα
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem 
            checked={activeFilters.includes('completed')}
            onCheckedChange={(checked) => handleFilterChange('completed', !!checked)}
          >
            Ολοκληρωμένα
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem 
            checked={activeFilters.includes('residential')}
            onCheckedChange={(checked) => handleFilterChange('residential', !!checked)}
          >
            Κατοικίες
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem 
            checked={activeFilters.includes('commercial')}
            onCheckedChange={(checked) => handleFilterChange('commercial', !!checked)}
          >
            Εμπορικά
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem 
            checked={activeFilters.includes('mixed')}
            onCheckedChange={(checked) => handleFilterChange('mixed', !!checked)}
          >
            Μικτής Χρήσης
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onActiveFiltersChange([])}>
            <X className="w-4 h-4 mr-2" />
            Καθαρισμός Φίλτρων
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ToolbarButton 
        tooltip="Ανανέωση Δεδομένων (F5)"
        onClick={() => console.log('Refreshing...')}
      >
        <RefreshCw className="w-4 h-4" />
      </ToolbarButton>
    </div>
  );
}