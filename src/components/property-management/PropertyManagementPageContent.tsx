'use client';

import React, { useState, useMemo } from 'react';
import { PropertyList } from './PropertyList';
import { PropertyDetails } from './PropertyDetails';
import { PropertyPageHeader } from './page/PropertyPageHeader';
import { PropertyPageFilters } from './page/PropertyPageFilters';
import { PropertyDashboard } from './PropertyDashboard';
import { usePropertyFilters } from '@/hooks/usePropertyFilters';
import type { Property, PropertyFilters } from '@/types/property';
import { FloorPlanViewer } from '@/components/property-viewer/FloorPlanViewer';
import { usePropertyViewer } from '@/hooks/use-property-viewer';
import type { Suggestion } from '@/types/suggestions';
import type { Connection, PropertyGroup } from '@/types/connections';
import { ViewerTools } from '@/components/property-viewer/ViewerTools';
import { SmartSuggestionsPanel } from '@/components/property-viewer/SmartSuggestionsPanel';
import { PropertyHoverInfo } from '@/components/property-viewer/PropertyHoverInfo';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VersionHistoryPanel } from '../property-viewer/VersionHistoryPanel';


// Mock data - This would typically come from a hook or props
const propertiesData: Property[] = [
  {
    id: '1',
    code: 'B_D1.1',
    type: 'apartment',
    building: 'B',
    floor: 'Ισόγειο',
    orientation: 'south',
    rooms: 2,
    bathrooms: 1,
    area: 57.75,
    balconyArea: 9.83,
    price: 100000,
    status: 'sold',
    buyer: 'ΚΕΛΕΣΙΔΗ ΠΕΛΛΕΝΑ',
    saleDate: '2008-01-25',
    salePrice: 104490,
    projectId: 1,
    buildingId: 'B',
    floorNumber: 0,
    description: 'Διαμέρισμα δύο δωματίων στο ισόγειο',
    features: ['Μπαλκόνι', 'Αποθήκη', 'Θέση Στάθμευσης'],
    storageUnits: [
      {
        id: 's1',
        code: 'B_A1.7',
        type: 'storage',
        floor: 'Υπόγειο',
        area: 11.16,
        price: 4490,
        status: 'sold',
        linkedPropertyId: '1',
        buyer: 'ΚΕΛΕΣΙΔΗ ΠΕΛΛΕΝΑ',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15'
      }
    ],
    parkingSpots: ['B_S1.7'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    code: 'B_D1.2',
    type: 'apartment',
    building: 'B',
    floor: 'Ισόγειο',
    orientation: 'north',
    rooms: 2,
    bathrooms: 1,
    area: 62.20,
    balconyArea: 8.50,
    price: 105000,
    status: 'sold',
    buyer: 'ΠΑΠΑΔΟΠΟΥΛΟΣ ΓΕΩΡΓΙΟΣ',
    saleDate: '2008-03-15',
    salePrice: 110000,
    projectId: 1,
    buildingId: 'B',
    floorNumber: 0,
    description: 'Διαμέρισμα δύο δωματίων στο ισόγειο',
    features: ['Μπαλκόνι', 'Αποθήκη'],
    storageUnits: [
      {
        id: 's2',
        code: 'B_A1.2',
        type: 'storage',
        floor: 'Υπόγειο',
        area: 10.35,
        price: 4200,
        status: 'sold',
        linkedPropertyId: '2',
        buyer: 'ΠΑΠΑΔΟΠΟΥΛΟΣ ΓΕΩΡΓΙΟΣ',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15'
      }
    ],
    parkingSpots: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '3',
    code: 'B_D1.3',
    type: 'apartment',
    building: 'B',
    floor: 'Ισόγειο',
    orientation: 'east',
    rooms: 1,
    bathrooms: 1,
    area: 45.30,
    balconyArea: 6.20,
    price: 85000,
    status: 'available',
    projectId: 1,
    buildingId: 'B',
    floorNumber: 0,
    description: 'Διαμέρισμα ενός δωματίου στο ισόγειο',
    features: ['Μπαλκόνι'],
    storageUnits: [],
    parkingSpots: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '4',
    code: 'B_D1.7',
    type: 'apartment',
    building: 'B',
    floor: 'Ισόγειο',
    orientation: 'west',
    rooms: 3,
    bathrooms: 2,
    area: 78.45,
    balconyArea: 12.30,
    price: 125000,
    status: 'owner',
    projectId: 1,
    buildingId: 'B',
    floorNumber: 0,
    description: 'Διαμέρισμα τριών δωματίων στο ισόγειο',
    features: ['Μεγάλο Μπαλκόνι', 'Αποθήκη', 'Θέση Στάθμευσης'],
    storageUnits: [
      {
        id: 's4',
        code: 'B_A1.7',
        type: 'storage',
        floor: 'Υπόγειο',
        area: 15.20,
        price: 0,
        status: 'owner',
        linkedPropertyId: '4',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15'
      }
    ],
    parkingSpots: ['B_S1.7'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  }
];

export function PropertyManagementPageContent() {
  const {
    properties,
    setProperties,
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
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(propertiesData.length > 0 ? propertiesData[0] : null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showDashboard, setShowDashboard] = useState(true);

  const [activeTool, setActiveTool] = useState<'create' | 'edit_nodes' | 'measure' | 'polyline' | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(10);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [scale, setScale] = useState(0.05); // 1 pixel = 0.05 meters
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [suggestionToDisplay, setSuggestionToDisplay] = useState<Suggestion | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [groups, setGroups] = useState<PropertyGroup[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [firstConnectionPoint, setFirstConnectionPoint] = useState<any>(null);


  // State for filters
  const [filters, setFilters] = useState<PropertyFilters>({
    searchTerm: '',
    type: 'all',
    status: 'all',
    floor: 'all',
    building: 'all',
    minArea: null,
    maxArea: null,
    minPrice: null,
    maxPrice: null
  });
  
  const { filteredProperties, stats } = usePropertyFilters(
    propertiesData, 
    filters.searchTerm, 
    filters.type, 
    filters.status, 
    filters.floor,
    filters.building
  );

  const handleFiltersChange = (newFilters: Partial<PropertyFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
  };
  
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
      const newProperty: any = {
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

      const newProperty: any = {
          ...propertyToDuplicate,
          id: `prop_${Date.now()}`,
          name: `${propertyToDuplicate.name} (Αντίγραφο)`,
          vertices: propertyToDuplicate.vertices.map(v => ({ x: v.x + 20, y: v.y + 20 })),
      };
      
      const description = `Duplicated property ${propertyToDuplicate.name}`;
      setProperties([...properties, newProperty], description);
  };

  const handleDelete = (propertyId: string) => {
      const description = `Deleted property ${propertyId}`;
      setProperties(
        properties.filter(p => p.id !== propertyId),
        description
      );
  };

  return (
    <div className="h-full flex flex-col bg-background p-4 gap-4">
      <div className="shrink-0">
        <PropertyPageHeader 
          showDashboard={showDashboard}
          setShowDashboard={setShowDashboard}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        <div className="mt-4">
          <PropertyPageFilters
            searchTerm={filters.searchTerm}
            setSearchTerm={(term) => handleFiltersChange({ searchTerm: term })}
            filterType={filters.type}
            setFilterType={(type) => handleFiltersChange({ type })}
            filterStatus={filters.status}
            setFilterStatus={(status) => handleFiltersChange({ status })}
            filterFloor={filters.floor}
            setFilterFloor={(floor) => handleFiltersChange({ floor })}
            filterBuilding={filters.building}
            setFilterBuilding={(building) => handleFiltersChange({ building })}
          />
        </div>
      </div>
      
      {showDashboard && <div className="shrink-0"><PropertyDashboard stats={stats} /></div>}

      <div className="flex-1 flex overflow-hidden gap-4">
          <>
            <PropertyList
              properties={filteredProperties}
              selectedProperty={selectedProperty}
              onSelectProperty={handleSelectProperty}
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
            <div className="flex-1 flex flex-col gap-4 min-w-0">
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
                <FloorPlanViewer
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
                    properties={filteredProperties as any[]}
                />
                 {selectedProperty && (
                    <PropertyDetails property={selectedProperty} />
                )}
            </div>
          </>
      </div>
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
