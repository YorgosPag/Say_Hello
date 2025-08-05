

"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { Property } from '@/types/property-viewer';
import type { Suggestion } from '@/types/suggestions';

import { ViewerToolbar } from './ViewerToolbar';
import { FloorCanvasWrapper } from './FloorCanvasWrapper';
import { SidebarPanel, type LayerState } from './SidebarPanel';
import { FloorPlanCanvas } from './FloorPlanCanvas';

interface FloorData {
  id: string;
  name: string;
  level: number;
  buildingId: string;
  floorPlanUrl?: string;
  properties: Property[];
}

// Mock data - θα αντικατασταθεί με πραγματικά δεδομένα
const mockFloors: FloorData[] = [
  {
    id: "floor-1",
    name: "Υπόγειο",
    level: -1,
    buildingId: "building-1",
    floorPlanUrl: "/mock-floor-plan.pdf",
    properties: [
      {
        id: "prop-1",
        name: "Αποθήκη A1",
        type: "Αποθήκη",
        status: "for-sale",
        vertices: [
          { x: 100, y: 100 },
          { x: 200, y: 100 },
          { x: 200, y: 180 },
          { x: 100, y: 180 }
        ],
        price: 25000,
        area: 15,
        building: 'Κτίριο Alpha',
        floor: -1,
        project: 'Έργο Κέντρο',
        buildingId: 'building-1',
        floorId: 'floor-1',
      },
      {
        id: "prop-2",
        name: "Στούντιο B1",
        type: "Στούντιο",
        status: "sold",
        vertices: [
          { x: 220, y: 100 },
          { x: 350, y: 100 },
          { x: 350, y: 200 },
          { x: 220, y: 200 }
        ],
        price: 85000,
        area: 35,
        building: 'Κτίριο Alpha',
        floor: 1,
        project: 'Έργο Κέντρο',
        buildingId: 'building-1',
        floorId: 'floor-1',
      }
    ]
  },
  {
    id: "floor-2",
    name: "Ισόγειο",
    level: 0,
    buildingId: "building-1",
    properties: []
  }
];


export interface FloorPlanViewerProps {
  selectedPropertyIds: string[];
  selectedFloorId: string | null;
  onSelectFloor: (floorId: string | null) => void;
  onHoverProperty: (propertyId: string | null) => void;
  hoveredPropertyId?: string | null;
  activeTool: 'create' | 'edit_nodes' | 'measure' | null;
  onSelectProperty: (propertyId: string, isShiftClick: boolean) => void;
  onPolygonCreated: (newProperty: Omit<Property, 'id'>) => void;
  onPolygonUpdated: (polygonId: string, vertices: Array<{ x: number; y: number }>) => void;
  onDuplicate: (propertyId: string) => void;
  onDelete: (propertyId: string) => void;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  showMeasurements: boolean;
  scale: number;
  suggestionToDisplay: Suggestion | null;
}


export function FloorPlanViewer({
  selectedPropertyIds,
  selectedFloorId,
  onSelectFloor,
  onHoverProperty,
  hoveredPropertyId,
  activeTool,
  onSelectProperty,
  onPolygonCreated,
  onPolygonUpdated,
  onDuplicate,
  onDelete,
  showGrid,
  snapToGrid,
  gridSize,
  showMeasurements,
  scale,
  suggestionToDisplay
}: FloorPlanViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [showLabels, setShowLabels] = useState(true);
  const [floors, setFloors] = useState<FloorData[]>(mockFloors);
  
  // State for layer visibility and opacity, managed here
  const [layerStates, setLayerStates] = useState<Record<string, LayerState>>(() => {
    const initialStates: Record<string, LayerState> = {};
    mockFloors.flatMap(f => f.properties).forEach(property => {
      initialStates[property.id] = {
        visible: true,
        locked: false,
        opacity: 0.3
      };
    });
    return initialStates;
  });

  const currentFloor = floors.find(f => f.id === selectedFloorId) || floors[0];

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Uploading floor plan:", file.name);
    }
  }, []);

  return (
    <div className="h-full flex flex-col bg-card rounded-lg overflow-hidden">
      <ViewerToolbar 
        currentFloor={currentFloor}
        floors={floors}
        zoom={zoom}
        setZoom={setZoom}
        showLabels={showLabels}
        setShowLabels={setShowLabels}
        onSelectFloor={onSelectFloor}
        onFileUpload={handleFileUpload}
      />

      <div className="flex-1 p-0 flex overflow-hidden">
        <FloorCanvasWrapper zoom={zoom}>
            <FloorPlanCanvas
              floorData={currentFloor}
              selectedPropertyIds={selectedPropertyIds}
              hoveredProperty={hoveredPropertyId}
              activeTool={activeTool}
              layerStates={layerStates}
              onPolygonHover={onHoverProperty}
              onPolygonSelect={onSelectProperty}
              onPolygonCreated={onPolygonCreated}
              onPolygonUpdated={onPolygonUpdated}
              showGrid={showGrid}
              snapToGrid={snapToGrid}
              gridSize={gridSize}
              showMeasurements={showMeasurements}
              scale={scale}
              suggestionToDisplay={suggestionToDisplay}
            />
        </FloorCanvasWrapper>

        {activeTool === 'edit_nodes' && (
          <SidebarPanel
            floorData={currentFloor}
            selectedPolygonIds={selectedPropertyIds}
            layerStates={layerStates}
            setLayerStates={setLayerStates}
            onPolygonSelect={onSelectProperty}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
          />
        )}
      </div>
    </div>
  );
}
