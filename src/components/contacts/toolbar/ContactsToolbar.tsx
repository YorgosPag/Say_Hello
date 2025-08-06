'use client';

import React, { useState } from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { QuickSearch } from '@/components/ui/QuickSearch';
import { ToolbarButton } from '@/components/ui/ToolbarButton';
import { SortToggleButton } from '@/components/units/toolbar/SortToggleButton';
import { ToolbarMainActions } from './ToolbarMainActions';

export function ContactsToolbar() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSort = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <TooltipProvider>
      <div className="border-b bg-muted/30 backdrop-blur-sm p-2 flex items-center gap-1">
        <ToolbarMainActions selectedItemsCount={selectedItems.length} />
        <div className="w-px h-6 bg-border mx-1" />
        <QuickSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Γρήγορη αναζήτηση..." />
        <div className="w-px h-6 bg-border mx-1" />
        <SortToggleButton sortDirection={sortDirection} onToggleSort={toggleSort} />
        <div className="flex-1" />
        <ToolbarButton tooltip="Βοήθεια και Οδηγίες (F1)">
          <HelpCircle className="w-4 h-4" />
        </ToolbarButton>
      </div>
    </TooltipProvider>
  );
}
