
'use client';

import React, { useState } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BuildingsList } from './BuildingsList';
import { BuildingDetails } from './BuildingDetails';
import { BuildingsHeader } from './BuildingsPage/BuildingsHeader';
import { BuildingsDashboard } from './BuildingsPage/BuildingsDashboard';
import { BuildingsGroupedView } from './BuildingsPage/BuildingsGroupedView';

// Enhanced building type with comprehensive data
export type Building = {
  id: number;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  totalArea: number;
  builtArea: number;
  floors: number;
  units: number;
  status: 'active' | 'construction' | 'planned' | 'completed';
  startDate?: string;
  completionDate?: string;
  progress: number;
  totalValue: number;
  image?: string;
  company: string;
  project: string;
  category: 'residential' | 'commercial' | 'mixed' | 'industrial';
  features?: string[];
};

// Enhanced mock data
const buildings: Building[] = [
  { 
    id: 1, 
    name: "ΚΤΙΡΙΟ Α (Μανδηλαρά - Πεζόδρομος & Πεζόδρομος)",
    description: "Πολυώροφο κτίριο μικτής χρήσης με βρεφονηπιακό σταθμό και κέντρο νεότητας",
    address: "Μανδηλαρά & Πεζόδρομος",
    city: "Αθήνα",
    totalArea: 2109.24,
    builtArea: 1850.50,
    floors: 7,
    units: 12,
    status: 'active',
    startDate: '2006-05-02',
    completionDate: '2009-02-28',
    progress: 85,
    totalValue: 1475000,
    company: "Ν.Χ.Γ. ΠΑΓΩΝΗΣ & ΣΙΑ Ο.Ε.",
    project: "Παλαιολόγου",
    category: 'mixed',
    features: ['Βρεφονηπιακός Σταθμός', 'Κέντρο Νεότητας', 'Γκαρσονιέρες', 'Διαμερίσματα 2Δ']
  },
  { 
    id: 2, 
    name: "ΚΤΙΡΙΟ Β (Μανδηλαρά & Πεζόδρομος)",
    description: "Κατοικίες υψηλών προδιαγραφών με θέα στην πόλη",
    address: "Μανδηλαρά & Πεζόδρομος",
    city: "Αθήνα",
    totalArea: 1850.75,
    builtArea: 1650.25,
    floors: 6,
    units: 8,
    status: 'construction',
    startDate: '2023-03-15',
    completionDate: '2025-01-20',
    progress: 45,
    totalValue: 1200000,
    company: "Ν.Χ.Γ. ΠΑΓΩΝΗΣ & ΣΙΑ Ο.Ε.",
    project: "Παλαιολόγου",
    category: 'residential',
    features: ['Πάρκινγκ', 'Αποθήκες', 'Μπαλκόνια']
  },
  { 
    id: 3, 
    name: "ΚΤΙΡΙΟ Γ (Μανδηλαρά - Παλαιολόγου & Πεζόδρομος)",
    description: "Εμπορικό κέντρο με καταστήματα και γραφεία",
    address: "Μανδηλαρά - Παλαιολόγου & Πεζόδρομος",
    city: "Αθήνα", 
    totalArea: 2500.00,
    builtArea: 2200.00,
    floors: 4,
    units: 15,
    status: 'planned',
    startDate: '2025-06-01',
    completionDate: '2027-12-15',
    progress: 5,
    totalValue: 2100000,
    company: "Ν.Χ.Γ. ΠΑΓΩΝΗΣ & ΣΙΑ Ο.Ε.",
    project: "Παλαιολόγου",
    category: 'commercial',
    features: ['Καταστήματα', 'Γραφεία', 'Εστιατόρια', 'Πάρκινγκ']
  }
];

const companies = [
  { id: 'pagonis', name: 'Ν.Χ.Γ. ΠΑΓΩΝΗΣ & ΣΙΑ Ο.Ε.' },
  { id: 'devconstruct', name: 'DevConstruct AE' },
];

const projects = [
  { id: 'palaiologou', name: 'Παλαιολόγου' },
  { id: 'kolonaki', name: 'Κολωνάκι' },
];

export function BuildingsPageContent() {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(buildings[0]);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'byType' | 'byStatus'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompany, setFilterCompany] = useState('all');
  const [filterProject, setFilterProject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDashboard, setShowDashboard] = useState(true);

  // Filter buildings based on search and filters
  const filteredBuildings = buildings.filter(building => {
    const matchesSearch = building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         building.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         building.address?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCompany = filterCompany === 'all' || building.company === filterCompany;
    const matchesProject = filterProject === 'all' || building.project === filterProject;
    const matchesStatus = filterStatus === 'all' || building.status === filterStatus;
    
    return matchesSearch && matchesCompany && matchesProject && matchesStatus;
  });

  // Calculate dashboard statistics
  const stats = {
    totalBuildings: buildings.length,
    activeProjects: buildings.filter(b => b.status === 'active' || b.status === 'construction').length,
    totalValue: buildings.reduce((sum, b) => sum + b.totalValue, 0),
    totalArea: buildings.reduce((sum, b) => sum + b.totalArea, 0),
    averageProgress: buildings.length > 0 ? Math.round(buildings.reduce((sum, b) => sum + b.progress, 0) / buildings.length) : 0,
    totalUnits: buildings.reduce((sum, b) => sum + b.units, 0)
  };
  
  return (
    <TooltipProvider>
      <div className="h-full flex flex-col bg-background">
        <BuildingsHeader
          viewMode={viewMode}
          setViewMode={setViewMode}
          showDashboard={showDashboard}
          setShowDashboard={setShowDashboard}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterCompany={filterCompany}
          setFilterCompany={setFilterCompany}
          companies={companies}
          filterProject={filterProject}
          setFilterProject={setFilterProject}
          projects={projects}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />

        {showDashboard && <BuildingsDashboard stats={stats} />}

        <div className="flex-1 flex overflow-hidden">
          {viewMode === 'list' ? (
            <>
              <BuildingsList
                buildings={filteredBuildings}
                selectedBuilding={selectedBuilding!}
                onSelectBuilding={setSelectedBuilding}
              />
              <BuildingDetails building={selectedBuilding!} />
            </>
          ) : (
            <BuildingsGroupedView
              viewMode={viewMode}
              filteredBuildings={filteredBuildings}
              selectedBuilding={selectedBuilding}
              setSelectedBuilding={setSelectedBuilding}
            />
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
