'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Briefcase,
  Search,
  Filter,
  LayoutGrid,
  List,
  Plus,
  BarChart3,
  X,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { FilterSelect } from './FilterSelect';
import { PROJECT_STATUS_LABELS } from '@/types/project';

interface ProjectsHeaderProps {
  viewMode: 'list' | 'grid';
  setViewMode: (mode: 'list' | 'grid') => void;
  showDashboard: boolean;
  setShowDashboard: (show: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterCompany: string;
  setFilterCompany: (company: string) => void;
  companies: { id: string; name: string }[];
  filterStatus: string;
  setFilterStatus: (status: string) => void;
}

export function ProjectsHeader({
  viewMode,
  setViewMode,
  showDashboard,
  setShowDashboard,
  searchTerm,
  setSearchTerm,
  filterCompany,
  setFilterCompany,
  companies,
  filterStatus,
  setFilterStatus,
}: ProjectsHeaderProps) {
  const hasActiveFilters =
    filterCompany !== 'all' ||
    filterStatus !== 'all' ||
    searchTerm !== '';

  const clearFilters = () => {
    setFilterCompany('all');
    setFilterStatus('all');
    setSearchTerm('');
  };

  return (
    <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Διαχείριση Έργων</h1>
              <p className="text-sm text-muted-foreground">
                Διαχείριση και παρακολούθηση κατασκευαστικών έργων
              </p>
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
              Νέο Έργο
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Αναζήτηση έργων, τίτλων..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <FilterSelect
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
              options={companies}
              placeholder="Όλες οι εταιρείες"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-9 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="all">Όλες οι καταστάσεις</option>
              {Object.entries(PROJECT_STATUS_LABELS).map(([key, label]) => (
                 <option key={key} value={key}>{label}</option>
              ))}
            </select>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                <X className="w-3 h-3 mr-1" />
                Καθαρισμός
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
