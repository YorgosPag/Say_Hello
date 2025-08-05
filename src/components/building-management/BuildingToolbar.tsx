'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { 
  HelpCircle, 
  Plus, 
  Edit, 
  Trash2,
  Zap,
  Settings,
  Eye,
  Save,
  RefreshCw,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { QuickSearch } from '@/components/ui/QuickSearch';
import { ToolbarButton } from '@/components/ui/ToolbarButton';
import { ToolbarFiltersMenu } from './BuildingToolbar/ToolbarFiltersMenu';
import { ToolbarExportMenu } from './BuildingToolbar/ToolbarExportMenu';
import { ToolbarAdvancedSection } from './BuildingToolbar/ToolbarAdvancedSection';
import { ToolbarFiltersDisplay } from './BuildingToolbar/ToolbarFiltersDisplay';

export function BuildingToolbar() {
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleNewBuilding = () => {
    console.log('Creating new building...');
  };

  const handleEditBuilding = () => {
    console.log('Editing building...');
  };

  const handleDeleteBuilding = () => {
    console.log('Deleting building...');
  };

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
          {/* Primary Actions */}
          <div className="flex items-center gap-1 mr-3">
            <ToolbarButton 
              tooltip="Νέο Κτίριο (Ctrl+N)" 
              onClick={handleNewBuilding}
              className="text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/20"
            >
              <Plus className="w-4 h-4" />
            </ToolbarButton>
            
            <ToolbarButton 
              tooltip="Επεξεργασία Επιλεγμένου (Ctrl+E)" 
              onClick={handleEditBuilding}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20"
              disabled={selectedItems.length === 0}
            >
              <Edit className="w-4 h-4" />
            </ToolbarButton>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div>
                  <ToolbarButton 
                    tooltip="Διαγραφή Επιλεγμένου (Delete)" 
                    className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                    disabled={selectedItems.length === 0}
                  >
                    <Trash2 className="w-4 h-4" />
                  </ToolbarButton>
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Επιβεβαίωση Διαγραφής</AlertDialogTitle>
                  <AlertDialogDescription>
                    Είστε σίγουροι ότι θέλετε να διαγράψετε {selectedItems.length} κτίριο/α; 
                    Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteBuilding}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Διαγραφή
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

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