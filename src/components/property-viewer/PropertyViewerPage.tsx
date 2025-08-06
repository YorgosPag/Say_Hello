'use client';

import { useState, useMemo } from 'react';
import { usePropertyViewer } from '@/hooks/use-property-viewer';
import type { Property } from '@/types/property-viewer';
import type { Suggestion } from '@/types/suggestions';
import type { Connection, PropertyGroup } from '@/types/connections';
import { PropertyList } from './PropertyList';
import { PropertyDetailsPanel } from './PropertyDetailsPanel';
import { PropertyHoverInfo } from './PropertyHoverInfo';
import { FloorPlanViewer } from './FloorPlanViewer';
import { PropertyViewerFilters } from './PropertyViewerFilters';
import { ViewerTools } from './ViewerTools';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SmartSuggestionsPanel } from './SmartSuggestionsPanel';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, List } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

function PropertyViewerHeader({ viewMode, setViewMode }: { viewMode: string, setViewMode: (mode: 'list' | 'grid') => void }) {
    return (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Ευρετήριο Ακινήτων</h1>
              <p className="text-sm text-muted-foreground">
                Οπτική διαχείριση και ανάλυση ακινήτων σε κάτοψη.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
    )
}


export function PropertyViewerPage() {
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
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(10);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [scale, setScale] = useState(0.05); // 1 pixel = 0.05 meters

  const [suggestionToDisplay, setSuggestionToDisplay] = useState<Suggestion | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [groups, setGroups] = useState<PropertyGroup[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [firstConnectionPoint, setFirstConnectionPoint] = useState<Property | null>(null);


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
      setProperties([...properties, newProperty], description);
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

  const currentFloor = useMemo(() => {
    return floors.find(f => f.id === selectedFloorId) || null;
  }, [selectedFloorId, floors]);

  return (
    <div className="h-full flex flex-col p-4 gap-4 bg-muted/30">
        <div className="shrink-0 space-y-4">
            <PropertyViewerHeader viewMode={viewMode} setViewMode={setViewMode} />
            <PropertyViewerFilters />
        </div>
        <div className="flex-1 flex gap-4 min-h-0">
            <div className="w-[320px] shrink-0 flex flex-col gap-4">
                <Card className="flex-1 flex flex-col">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base">Λίστα Ακινήτων</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 overflow-hidden">
                        <ScrollArea className="h-full">
                            <PropertyList
                                properties={properties}
                                selectedPropertyIds={selectedPropertyIds}
                                onSelectProperty={handlePolygonSelect}
                                isLoading={isLoading}
                            />
                        </ScrollArea>
                    </CardContent>
                </Card>
                <Card className="h-[280px] shrink-0">
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-sm">Γρήγορες Πληροφορίες</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 h-[calc(100%-48px)]">
                        <PropertyHoverInfo propertyId={hoveredPropertyId} properties={properties} />
                    </CardContent>
                </Card>
            </div>

            <div className="flex-1 flex flex-col gap-4 min-w-0">
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
                    properties={properties}
                />
            </div>
            
            <div className="w-[320px] shrink-0 flex flex-col gap-4">
                 <ViewerTools 
                    activeTool={activeTool}
                    setActiveTool={setActiveTool}
                    showGrid={showGrid}
                    setShowGrid={setShowGrid}
                    snapToGrid={snapToGrid}
                    setSnapToGrid={setSnapToGrid}
                    showMeasurements={showMeasurements}
                    setShowMeasurements={setShowMeasurements}
                    undo={undo}
                    redo={redo}
                    canUndo={canUndo}
                    canRedo={canRedo}
                 />
                 <SmartSuggestionsPanel 
                    properties={properties}
                    onShowSuggestion={setSuggestionToDisplay}
                    onAcceptSuggestion={(suggestion) => console.log("Accepting", suggestion)}
                 />
                <Card className="flex-1">
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-sm">Λεπτομέρειες Ακινήτου</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 h-[calc(100%-48px)]">
                         <PropertyDetailsPanel 
                            propertyIds={selectedPropertyIds} 
                            onSelectFloor={onSelectFloor}
                            properties={properties}
                            onUpdateProperty={handleUpdateProperty}
                         />
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
