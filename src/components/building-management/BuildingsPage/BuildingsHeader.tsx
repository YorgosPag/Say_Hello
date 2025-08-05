
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Building2,
  Search,
  Filter,
  LayoutGrid,
  List,
  Plus,
  BarChart3,
  FolderOpen,
  CheckSquare
} from 'lucide-react';

interface BuildingsHeaderProps {
  viewMode: 'list' | 'grid' | 'byType' | 'byStatus';
  setViewMode: (mode: 'list' | 'grid' | 'byType' | 'byStatus') => void;
  showDashboard: boolean;
  setShowDashboard: (show: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterCompany: string;
  setFilterCompany: (company: string) => void;
  companies: { id: string, name: string }[];
  filterProject: string;
  setFilterProject: (project: string) => void;
  projects: { id: string, name: string }[];
  filterStatus: string;
  setFilterStatus: (status: string) => void;
}

export function BuildingsHeader({
  viewMode,
  setViewMode,
  showDashboard,
  setShowDashboard,
  searchTerm,
  setSearchTerm,
  filterCompany,
  setFilterCompany,
  companies,
  filterProject,
  setFilterProject,
  projects,
  filterStatus,
  setFilterStatus,
}: BuildingsHeaderProps) {
  return (
    <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Διαχείριση Κτιρίων</h1>
              <p className="text-sm text-muted-foreground">
                Διαχείριση και παρακολούθηση κτιριακών έργων
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={showDashboard ? "default" : "outline"}
              size="sm"
              onClick={() => setShowDashboard(!showDashboard)}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={viewMode === 'list' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'byType' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('byType')}
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Ομαδοποίηση ανά Τύπο
            </Button>
            <Button
              variant={viewMode === 'byStatus' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('byStatus')}
            >
              <CheckSquare className="w-4 h-4 mr-2" />
              Ομαδοποίηση ανά Κατάσταση
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Νέο Κτίριο
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Αναζήτηση κτιρίων, διευθύνσεων, περιγραφών..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
              className="h-9 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="all">Όλες οι εταιρείες</option>
              {companies.map(company => (
                <option key={company.id} value={company.name}>{company.name}</option>
              ))}
            </select>
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="h-9 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="all">Όλα τα έργα</option>
              {projects.map(project => (
                <option key={project.id} value={project.name}>{project.name}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-9 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="all">Όλες οι καταστάσεις</option>
              <option value="active">Ενεργά</option>
              <option value="construction">Υπό Κατασκευή</option>
              <option value="planned">Σχεδιασμένα</option>
              <option value="completed">Ολοκληρωμένα</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
