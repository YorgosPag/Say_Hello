'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, List, LayoutGrid, BarChart3, Plus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface PropertyPageHeaderProps {
  viewMode: 'list' | 'grid';
  setViewMode: (mode: 'list' | 'grid') => void;
  showDashboard: boolean;
  setShowDashboard: (show: boolean) => void;
}

export function PropertyPageHeader({
  viewMode,
  setViewMode,
  showDashboard,
  setShowDashboard,
}: PropertyPageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
          <Home className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Διαχείριση Ακινήτων</h1>
          <p className="text-sm text-muted-foreground">Επισκόπηση και διαχείριση ιδιοκτησιών</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={showDashboard ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowDashboard(!showDashboard)}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </TooltipTrigger>
          <TooltipContent>Εμφάνιση/Απόκρυψη Dashboard</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Προβολή Λίστας</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Προβολή Πλέγματος</TooltipContent>
        </Tooltip>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Νέο Ακίνητο
        </Button>
      </div>
    </div>
  );
}
