'use client';

import React, { useState, useMemo } from 'react';
import { usePropertyViewer } from '@/hooks/use-property-viewer';
import type { Property } from '@/types/property-viewer';
import type { Suggestion } from '@/types/suggestions';
import type { Connection, PropertyGroup } from '@/types/connections';
import { PropertyDetailsPanel } from '@/components/property-viewer/PropertyDetailsPanel';
import { PropertyHoverInfo } from '@/components/property-viewer/PropertyHoverInfo';
import { FloorPlanViewer } from '@/components/property-viewer/FloorPlanViewer';
import { PropertyViewerFilters, type FilterState } from '@/components/property-viewer/PropertyViewerFilters';
import { ViewerTools } from '@/components/property-viewer/ViewerTools';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, List, BarChart3, FolderOpen, CheckSquare, Eye, Home } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { PropertyGridView } from '@/components/property-viewer/PropertyGridView';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Filter, Briefcase, FileText, Camera, Video, Users, Building, File } from 'lucide-react';
import { VersionHistoryPanel } from '@/components/property-viewer/VersionHistoryPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyDashboard } from '@/components/property-management/PropertyDashboard';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getStatusColor as getBuildingStatusColor, getStatusLabel as getBuildingStatusLabel } from '@/components/building-management/BuildingCard/BuildingCardUtils';
import { UnitsList } from '@/components/units/UnitsList';
import type { UnitSortKey } from '@/types/unit';


function UnitDetailsHeader({ unit }: { unit: Property | null }) {
    if (!unit) {
        return (
            <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-t-lg h-[81px] flex items-center">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-sm">
                    <Home className="w-5 h-5 text-white" />
                    </div>
                    <div>
                    <h3 className="text-lg font-semibold text-foreground line-clamp-1">
                        Επιλέξτε μια μονάδα
                    </h3>
                    <p className="text-sm text-muted-foreground">Δεν έχει επιλεγεί μονάδα</p>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-t-lg">
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-sm">
                <Home className="w-5 h-5 text-white" />
                </div>
                <div>
                <h3 className="text-lg font-semibold text-foreground line-clamp-1">
                    {unit.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                    <Badge className={cn("text-xs", getBuildingStatusColor(unit.status as any).replace('bg-','bg-') + ' text-white')}>
                      {getBuildingStatusLabel(unit.status as any)}
                    </Badge>
                </div>
                </div>
            </div>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Eye className="w-4 h-4 mr-2" />
                Επίδειξη Μονάδας
            </Button>
            </div>
      </div>
    );
}

function PropertyViewerHeader({
  viewMode,
  setViewMode,
  showDashboard,
  setShowDashboard,
}: {
  viewMode: 'list' | 'grid' | 'byType' | 'byStatus';
  setViewMode: (mode: 'list' | 'grid' | 'byType' | 'byStatus') => void;
  showDashboard: boolean;
  setShowDashboard: (show: boolean) => void;
}) {
    return (
        <div className="border-b bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Διαχείριση Μονάδων</h1>
                <p className="text-sm text-muted-foreground">
                    Οπτική διαχείριση και ανάλυση ακινήτων σε κάτοψη.
                </p>
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
                   <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={viewMode === 'byType' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setViewMode('byType')}
                        >
                          <FolderOpen className="w-4 h-4 mr-2" />
                          Ομαδοποίηση ανά Τύπο
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Ομαδοποίηση των κτιρίων ανά τύπο (π.χ. Κατοικίες, Εμπορικό).</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={viewMode === 'byStatus' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setViewMode('byStatus')}
                        >
                          <CheckSquare className="w-4 h-4 mr-2" />
                          Ομαδοποίηση ανά Κατάσταση
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Ομαδοποίηση των κτιρίων ανά κατάσταση (π.χ. Ενεργό, Υπό Κατασκευή).</TooltipContent>
                    </Tooltip>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Νέα Μονάδα
                  </Button>
              </div>
            </div>
        </div>
    );
}


export default function UnitsPage() {
  const {
    properties,
    setProperties,
    projects,
    buildings,
    floors,
    isLoading,
    selectedProperties: selectedPropertyIds,
    hoveredProperty: hoveredPropertyId,
    selectedFloor: selectedFloorId,
    setHoveredProperty: onHoverProperty,
    setSelectedFloor: onSelectFloor,
    undo,
    redo,
    canUndo,
    canRedo,
    setSelectedProperties,
  } = usePropertyViewer();
  
  const [activeTool, setActiveTool] = useState<'create' | 'edit_nodes' | 'measure' | 'polyline' | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'byType' | 'byStatus'>('list');
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(10);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [scale, setScale] = useState(0.05); // 1 pixel = 0.05 meters
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);


  const [suggestionToDisplay, setSuggestionToDisplay] = useState<Suggestion | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [groups, setGroups] = useState<PropertyGroup[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [firstConnectionPoint, setFirstConnectionPoint] = useState<Property | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    project: [],
    building: [],
    floor: [],
    propertyType: [],
    status: [],
    priceRange: { min: null, max: null },
    areaRange: { min: null, max: null },
    features: [],
  });

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      const { searchTerm, project, building, floor, propertyType, status, priceRange, areaRange } = filters;
      if (searchTerm && !property.name.toLowerCase().includes(searchTerm.toLowerCase()) && !(property.description || '').toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (project.length > 0 && !project.includes(property.project)) return false;
      if (building.length > 0 && !building.includes(property.building)) return false;
      if (floor.length > 0 && !floor.includes(String(property.floor))) return false;
      if (propertyType.length > 0 && !propertyType.includes(property.type)) return false;
      if (status.length > 0 && !status.includes(property.status)) return false;
      if (priceRange.min !== null && (property.price ?? 0) < priceRange.min) return false;
      if (priceRange.max !== null && (property.price ?? 0) > priceRange.max) return false;
      if (areaRange.min !== null && (property.area ?? 0) < areaRange.min) return false;
      if (areaRange.max !== null && (property.area ?? 0) > areaRange.max) return false;
      return true;
    });
  }, [properties, filters]);

  const selectedUnit = useMemo(() => {
    if (selectedPropertyIds.length === 1) {
      return properties.find(p => p.id === selectedPropertyIds[0]);
    }
    return null;
  }, [selectedPropertyIds, properties]);


  const handlePolygonSelect = (propertyId: string, isShiftClick: boolean) => {
    setSelectedProperties(prev => {
        if (!propertyId) return []; // Deselect all

        if (isShiftClick) {
            return prev.includes(propertyId)
                ? prev.filter(id => id !== propertyId)
                : [...prev, propertyId];
        } else {
            return prev.length === 1 && prev[0] === propertyId ? [] : [propertyId];
        }
    });

    if (isConnecting && !isShiftClick) {
        const property = properties.find(p => p.id === propertyId);
        if (!property) return;

        if (!firstConnectionPoint) {
            setFirstConnectionPoint(property);
        } else {
            if (firstConnectionPoint.id === property.id) return;
            const newConnection: Connection = {
                id: `conn_${firstConnectionPoint.id}_${property.id}`,
                from: firstConnectionPoint.id,
                to: property.id,
                type: 'related'
            };
            setConnections(prev => [...prev, newConnection]);
            setFirstConnectionPoint(null);
            setIsConnecting(false);
        }
    }
  };

  const handlePolygonCreated = (newPropertyData: Omit<Property, 'id' | 'name' | 'type' | 'status' | 'building' | 'floor' | 'project' | 'buildingId' | 'floorId'>) => {
      const newProperty: Property = {
          id: `prop_${Date.now()}`,
          name: `Νέο Ακίνητο ${properties.length + 1}`,
          type: 'Διαμέρισμα 2Δ',
          status: 'for-sale',
          building: 'Κτίριο Alpha',
          floor: 1,
          project: 'Έργο Κέντρο',
          buildingId: 'building-1',
          floorId: selectedFloorId || 'floor-1',
          ...newPropertyData,
      };
      const description = `Created property ${newProperty.name}`;
      setProperties([...properties, newProperty], description);
  };
  
  const handlePolygonUpdated = (polygonId: string, vertices: Array<{ x: number; y: number }>) => {
      const description = `Updated vertices for property ${polygonId}`;
      setProperties(
        properties.map(p => p.id === polygonId ? { ...p, vertices } : p),
        description
      );
  };

  const handleDuplicate = (propertyId: string) => {
      const propertyToDuplicate = properties.find(p => p.id === propertyId);
      if (!propertyToDuplicate) return;

      const newProperty: Property = {
          ...propertyToDuplicate,
          id: `prop_${Date.now()}`,
          name: `${propertyToDuplicate.name} (Αντίγραφο)`,
          vertices: propertyToDuplicate.vertices.map(v => ({ x: v.x + 20, y: v.y + 20 })),
      };
      
      const description = `Duplicated property ${propertyToDuplicate.name}`;
      setProperties([...properties, newProperty], newProperty.name);
  };

  const handleDelete = (propertyId: string) => {
      const description = `Deleted property ${propertyId}`;
      setProperties(
        properties.filter(p => p.id !== propertyId),
        description
      );
  };
  
  const handleUpdateProperty = (propertyId: string, updates: Partial<Property>) => {
      const description = `Updated details for property ${propertyId}`;
      setProperties(
          properties.map(p => p.id === propertyId ? { ...p, ...updates } : p),
          description
      );
  };

  const dashboardStats = useMemo(() => ({
    totalProperties: properties.length,
    availableProperties: properties.filter(p => p.status === 'for-sale' || p.status === 'for-rent').length,
    soldProperties: properties.filter(p => p.status === 'sold' || p.status === 'rented').length,
    totalValue: properties.reduce((sum, p) => sum + (p.price || 0), 0),
    totalArea: properties.reduce((sum, p) => sum + (p.area || 0), 0),
    averagePrice: properties.length > 0 ? properties.reduce((sum, p) => sum + (p.price || 0), 0) / properties.length : 0,
    propertiesByStatus: properties.reduce((acc, p) => { acc[p.status] = (acc[p.status] || 0) + 1; return acc; }, {} as Record<string, number>),
    propertiesByType: properties.reduce((acc, p) => { acc[p.type] = (acc[p.type] || 0) + 1; return acc; }, {} as Record<string, number>),
    propertiesByFloor: properties.reduce((acc, p) => { const floorLabel = `Όροφος ${p.floor}`; acc[floorLabel] = (acc[floorLabel] || 0) + 1; return acc; }, {} as Record<string, number>),
    totalStorageUnits: 0,
    availableStorageUnits: 0,
    soldStorageUnits: 0,
    uniqueBuildings: [...new Set(properties.map(p => p.building))].length,
    reserved: properties.filter(p => p.status === 'reserved').length,
  }), [properties]);

  return (
    <div className="h-full flex flex-col bg-muted/30">
        <PropertyViewerHeader 
            viewMode={viewMode} 
            setViewMode={setViewMode}
            showDashboard={showDashboard}
            setShowDashboard={setShowDashboard}
        />
        
        <div className="px-4 py-4 shrink-0">
            <Collapsible className="border bg-card rounded-lg">
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start p-4 text-sm font-semibold">
                    <Filter className="w-4 h-4 mr-2"/>
                    Φίλτρα Αναζήτησης
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <PropertyViewerFilters filters={filters} onFiltersChange={setFilters} />
                </CollapsibleContent>
            </Collapsible>
        </div>

        {showDashboard && (
            <div className="px-4 pb-4 shrink-0">
                <PropertyDashboard stats={dashboardStats} />
            </div>
        )}
        
        <main className="flex-1 flex overflow-hidden px-4 pb-4 gap-4 h-full">
            {viewMode === 'list' ? (
                 <div className="flex-1 flex gap-4 min-h-0">
                    <UnitsList
                        units={filteredProperties}
                        selectedUnit={selectedUnit}
                        onSelectUnit={(unit) => setSelectedProperties([unit.id])}
                    />

                    <div className="flex-1 flex flex-col gap-4 min-h-0 bg-card border rounded-lg shadow-sm">
                        <UnitDetailsHeader unit={selectedUnit} />
                        <Tabs defaultValue="general" className="flex-1 flex flex-col min-h-0">
                             <div className="shrink-0 border-b px-4 mt-2">
                                <TabsList>
                                    <TabsTrigger value="general">Γενικά</TabsTrigger>
                                    <TabsTrigger value="documents">Έγγραφα</TabsTrigger>
                                    <TabsTrigger value="photos">Φωτογραφίες</TabsTrigger>
                                    <TabsTrigger value="videos">Videos</TabsTrigger>
                                </TabsList>
                            </div>
                            <TabsContent value="general" className="flex-1 flex flex-col gap-2 min-h-0 mt-2 h-full p-4">
                                <ViewerTools 
                                    activeTool={activeTool}
                                    setActiveTool={setActiveTool}
                                    showGrid={showGrid}
                                    setShowGrid={setShowGrid}
                                    snapToGrid={snapToGrid}
                                    setSnapToGrid={setSnapToGrid}
                                    showMeasurements={showMeasurements}
                                    setShowMeasurements={setShowMeasurements}
                                    scale={scale}
                                    setScale={setScale}
                                    undo={undo}
                                    redo={redo}
                                    canUndo={canUndo}
                                    canRedo={canRedo}
                                    onShowHistory={() => setShowHistoryPanel(true)}
                                />
                                <div className="flex-1 flex flex-col h-full pt-2">
                                  <FloorPlanViewer
                                          properties={filteredProperties}
                                          selectedPropertyIds={selectedPropertyIds}
                                          selectedFloorId={selectedFloorId}
                                          onSelectFloor={onSelectFloor}
                                          hoveredPropertyId={hoveredPropertyId}
                                          onHoverProperty={onHoverProperty}
                                          activeTool={activeTool}
                                          onSelectProperty={handlePolygonSelect}
                                          onPolygonCreated={handlePolygonCreated}
                                          onPolygonUpdated={handlePolygonUpdated}
                                          onDuplicate={handleDuplicate}
                                          onDelete={handleDelete}
                                          showGrid={showGrid}
                                          snapToGrid={snapToGrid}
                                          gridSize={gridSize}
                                          showMeasurements={showMeasurements}
                                          scale={scale}
                                          suggestionToDisplay={suggestionToDisplay}
                                          connections={connections}
                                          setConnections={setConnections}
                                          groups={groups}
                                          setGroups={setGroups}
                                          isConnecting={isConnecting}
                                          setIsConnecting={setIsConnecting}
                                          firstConnectionPoint={firstConnectionPoint}
                                          setFirstConnectionPoint={setFirstConnectionPoint}
                                      />
                                </div>
                            </TabsContent>
                            <TabsContent value="documents" className="p-4">Έγγραφα</TabsContent>
                            <TabsContent value="photos" className="p-4">Φωτογραφίες</TabsContent>
                            <TabsContent value="videos" className="p-4">Videos</TabsContent>
                        </Tabs>
                    </div>
                 </div>
             ) : (
                <PropertyGridView
                    viewMode={viewMode}
                    filteredProperties={filteredProperties}
                    selectedPropertyIds={selectedPropertyIds}
                    onSelectProperty={handlePolygonSelect}
                />
             )}
        </main>
      
      {showHistoryPanel && (
          <VersionHistoryPanel 
              buildingId={selectedFloorId || 'building-1'}
              isOpen={showHistoryPanel}
              onClose={() => setShowHistoryPanel(false)}
          />
      )}
    </div>
  );
}
