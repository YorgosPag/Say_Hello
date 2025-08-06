'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, ArrowUp, ArrowDown, FileText } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import type { Project, ProjectSortKey } from '@/types/project';

interface ProjectListHeaderProps {
  projects: Project[];
  sortBy: ProjectSortKey;
  setSortBy: (sort: ProjectSortKey) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
}

export function ProjectListHeader({
  projects,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder
}: ProjectListHeaderProps) {
  const handleSort = (newSortBy: ProjectSortKey) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: ProjectSortKey) => {
    if (sortBy !== field) return <ArrowUpDown className="w-4 h-4" />;
    return sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  const getSortLabel = (field: ProjectSortKey) => {
    switch (field) {
      case 'name': return 'Όνομα';
      case 'progress': return 'Πρόοδος';
      case 'totalValue': return 'Αξία';
      case 'status': return 'Κατάσταση';
      default: return field;
    }
  };

  return (
    <div className="p-3 border-b bg-muted/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-semibold">Λίστα Έργων</h3>
          <Badge variant="secondary" className="text-xs">
            {projects.length} {projects.length === 1 ? 'έργο' : 'έργα'}
          </Badge>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              {getSortIcon(sortBy)}
              <span className="text-xs">Ταξινόμηση: {getSortLabel(sortBy)}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => handleSort('name')}>
              <div className="flex items-center justify-between w-full">
                <span>Όνομα</span>
                {sortBy === 'name' && getSortIcon('name')}
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort('progress')}>
              <div className="flex items-center justify-between w-full">
                <span>Πρόοδος</span>
                {sortBy === 'progress' && getSortIcon('progress')}
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort('totalValue')}>
              <div className="flex items-center justify-between w-full">
                <span>Αξία</span>
                {sortBy === 'totalValue' && getSortIcon('totalValue')}
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort('status')}>
              <div className="flex items-center justify-between w-full">
                <span>Κατάσταση</span>
                {sortBy === 'status' && getSortIcon('status')}
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
