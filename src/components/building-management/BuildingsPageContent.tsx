
'use client';

import React, { useState, useEffect } from 'react';
import { BuildingsList } from './BuildingsList';
import { BuildingDetails } from './BuildingDetails';
import { BuildingCard } from './BuildingCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Plus,
  BarChart3,
  MapPin,
  Calendar,
  Users,
  TrendingUp,
  Home,
  Building2,
  FolderOpen,
  CheckSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getStatusColor, getStatusLabel, getCategoryLabel } from './BuildingCard/BuildingCardUtils';


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

    const groupedByType = filteredBuildings.reduce((acc, building) => {
        const type = building.category;
        if (!acc[type]) acc[type] = [];
        acc[type].push(building);
        return acc;
    }, {} as Record<string, Building[]>);

    const groupedByStatus = filteredBuildings.reduce((acc, building) => {
        const status = building.status;
        if (!acc[status]) acc[status] = [];
        acc[status].push(building);
        return acc;
    }, {} as Record<string, Building[]>);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
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

          {/* Search and Filters */}
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

      {/* Dashboard Stats */}
      {showDashboard && (
        <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Σύνολο Κτιρίων</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.totalBuildings}</p>
                  </div>
                  <Building className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-green-600 dark:text-green-400">Ενεργά Έργα</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.activeProjects}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-purple-600 dark:text-purple-400">Συνολική Αξία</p>
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                      €{(stats.totalValue / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-orange-600 dark:text-orange-400">Συνολική Επιφάνεια</p>
                    <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                      {(stats.totalArea / 1000).toFixed(1)}K m²
                    </p>
                  </div>
                  <MapPin className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-cyan-200 bg-cyan-50/50 dark:bg-cyan-950/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-cyan-600 dark:text-cyan-400">Μέση Πρόοδος</p>
                    <p className="text-2xl font-bold text-cyan-700 dark:text-cyan-300">{stats.averageProgress}%</p>
                  </div>
                  <Calendar className="h-8 w-8 text-cyan-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-pink-200 bg-pink-50/50 dark:bg-pink-950/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-pink-600 dark:text-pink-400">Σύνολο Μονάδων</p>
                    <p className="text-2xl font-bold text-pink-700 dark:text-pink-300">{stats.totalUnits}</p>
                  </div>
                  <Home className="h-8 w-8 text-pink-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
            {viewMode === 'list' ? (
                <>
                    <BuildingsList
                        buildings={filteredBuildings}
                        selectedBuilding={selectedBuilding!}
                        onSelectBuilding={setSelectedBuilding}
                        getStatusColor={getStatusColor}
                        getStatusLabel={getStatusLabel}
                    />
                    <BuildingDetails
                        building={selectedBuilding!}
                        getStatusColor={getStatusColor}
                        getStatusLabel={getStatusLabel}
                    />
                </>
            ) : viewMode === 'grid' ? (
                <div className="flex-1 p-4 overflow-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredBuildings.map((building) => (
                            <BuildingCard
                                key={building.id}
                                building={building}
                                isSelected={selectedBuilding?.id === building.id}
                                onClick={() => setSelectedBuilding(building)}
                            />
                        ))}
                    </div>
                </div>
            ) : viewMode === 'byType' ? (
                <div className="flex-1 p-4 overflow-auto">
                    {Object.entries(groupedByType).map(([type, buildingsOfType]) => (
                        <div key={type} className="mb-8">
                            <h2 className="text-xl font-bold mb-4 capitalize border-b pb-2">{getCategoryLabel(type)} ({buildingsOfType.length})</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {buildingsOfType.map((building) => (
                                    <BuildingCard
                                        key={building.id}
                                        building={building}
                                        isSelected={selectedBuilding?.id === building.id}
                                        onClick={() => setSelectedBuilding(building)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : ( // byStatus
                <div className="flex-1 p-4 overflow-auto">
                    {Object.entries(groupedByStatus).map(([status, buildingsOfStatus]) => (
                        <div key={status} className="mb-8">
                            <h2 className="text-xl font-bold mb-4 capitalize border-b pb-2">{getStatusLabel(status)} ({buildingsOfStatus.length})</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {buildingsOfStatus.map((building) => (
                                    <BuildingCard
                                        key={building.id}
                                        building={building}
                                        isSelected={selectedBuilding?.id === building.id}
                                        onClick={() => setSelectedBuilding(building)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
}
