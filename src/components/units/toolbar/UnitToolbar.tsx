
'use client';

import React, { useState } from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelpCircle, Zap } from "lucide-react";
import { QuickSearch } from '@/components/ui/QuickSearch';
import { ToolbarButton } from '@/components/ui/ToolbarButton';
import { ToolbarExportMenu } from './ToolbarExportMenu';
import { ToolbarMainActions } from './ToolbarMainActions';
import { SortToggleButton } from './SortToggleButton';

export function UnitToolbar() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    console.log('Searching for:', term);
  };

  const handleExport = () => {
    console.log('Exporting data...');
  };

  const toggleSort = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <TooltipProvider>
      <div className="border-b bg-muted/30 backdrop-blur-sm p-2 flex items-center gap-1">
        <ToolbarMainActions selectedItemsCount={selectedItems.length} />
        <div className="w-px h-6 bg-border mx-1" />
        <QuickSearch searchTerm={searchTerm} onSearchChange={handleSearch} placeholder="Γρήγορη αναζήτηση..." />
        <div className="w-px h-6 bg-border mx-1" />
        <SortToggleButton sortDirection={sortDirection} onToggleSort={toggleSort} />
        <div className="w-px h-6 bg-border mx-1" />
        <ToolbarExportMenu onExport={handleExport} />
        <div className="flex-1" />
        <div className="flex items-center gap-1">
          <ToolbarButton tooltip="Βοήθεια και Οδηγίες (F1)">
            <HelpCircle className="w-4 h-4" />
          </ToolbarButton>
        </div>
      </div>
    </TooltipProvider>
  );
}
