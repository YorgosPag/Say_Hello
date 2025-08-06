'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Filter, X } from 'lucide-react';
import { ToolbarButton } from '@/components/ui/ToolbarButton';

interface Props {
  activeFilters: string[];
  onActiveFiltersChange: (filters: string[]) => void;
}

export function ProjectFiltersMenu({ activeFilters, onActiveFiltersChange }: Props) {
  const handleFilterChange = (filter: string, checked: boolean) => {
    onActiveFiltersChange(
      checked 
        ? [...activeFilters, filter]
        : activeFilters.filter(f => f !== filter)
    );
  };

  return (
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
        <DropdownMenuLabel>Φίλτρα Έργων</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {[
          { value: 'in_progress', label: 'Σε εξέλιξη' },
          { value: 'planning', label: 'Σχεδιασμένα' },
          { value: 'completed', label: 'Ολοκληρωμένα' },
          { value: 'on_hold', label: 'Σε αναμονή' },
        ].map(({ value, label }) => (
          <DropdownMenuCheckboxItem
            key={value}
            checked={activeFilters.includes(value)}
            onCheckedChange={(checked) => handleFilterChange(value, !!checked)}
          >
            {label}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onActiveFiltersChange([])}>
          <X className="w-4 h-4 mr-2" />
          Καθαρισμός Φίλτρων
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
