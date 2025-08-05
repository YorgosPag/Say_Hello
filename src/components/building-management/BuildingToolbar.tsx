'use client';

import React, { useState } from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelpCircle, Zap } from "lucide-react";
import { QuickSearch } from '@/components/ui/QuickSearch';
import { ToolbarButton } from '@/components/ui/ToolbarButton';
import { ToolbarFiltersMenu } from './BuildingToolbar/ToolbarFiltersMenu';
import { ToolbarExportMenu } from './BuildingToolbar/ToolbarExportMenu';
import { ToolbarAdvancedSection } from './BuildingToolbar/ToolbarAdvancedSection';
import { ToolbarFiltersDisplay } from './BuildingToolbar/ToolbarFiltersDisplay';
import { ToolbarMainActions } from './BuildingToolbar/ToolbarMainActions';

export function BuildingToolbar() {
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    console.log('Searching for:', term);
  };

  const handleRefresh = () => {
    console.log('Refreshing data...');
  };

  const handleExport = () => {
    console.log('Exporting data...');
  };

  const toggleSort = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const toggleAdvancedMode = () => {
    setIsAdvancedMode(!isAdvancedMode);
  };

  return (
    <TooltipProvider>
      <div className="border-b bg-muted/30 backdrop-blur-sm">
        {/* Main Toolbar */}
        <div className="p-2 flex items-center gap-1">
          <ToolbarMainActions selectedItemsCount={selectedItems.length} />

          <div className="w-px h-6 bg-border mx-1" />

          {/* Search */}
          <QuickSearch searchTerm={searchTerm} onSearchChange={handleSearch} placeholder="Γρήγορη αναζήτηση..." />

          <div className="w-px h-6 bg-border mx-1" />

          {/* View and Sort Actions */}
          <ToolbarFiltersMenu 
            sortDirection={sortDirection}
            onToggleSort={toggleSort}
            activeFilters={activeFilters}
            onActiveFiltersChange={setActiveFilters}
          />

          <div className="w-px h-6 bg-border mx-1" />

          {/* Data Actions */}
          <ToolbarExportMenu onExport={handleExport} />

          <div className="flex-1" />

          {/* Advanced Tools */}
          <div className="flex items-center gap-1">
            <ToolbarButton 
              tooltip="Προχωρημένα Εργαλεία"
              onClick={toggleAdvancedMode}
              variant={isAdvancedMode ? "default" : "ghost"}
              className={isAdvancedMode ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" : ""}
            >
              <Zap className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarButton 
              tooltip="Βοήθεια και Οδηγίες (F1)"
            >
              <HelpCircle className="w-4 h-4" />
            </ToolbarButton>
          </div>
        </div>

        {/* Advanced Toolbar - Shows when advanced mode is enabled */}
        {isAdvancedMode && (
          <ToolbarAdvancedSection 
            selectedItems={selectedItems}
            activeFilters={activeFilters}
          />
        )}

        {/* Active Filters Display */}
        {activeFilters.length > 0 && (
          <ToolbarFiltersDisplay 
            activeFilters={activeFilters}
            onActiveFiltersChange={setActiveFilters}
          />
        )}
      </div>
    </TooltipProvider>
  );
}
