
"use client";

import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Upload, 
  Save, 
  Layers,
  Grid,
  Eye,
  EyeOff,
  Palette,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FloorPlanCanvas } from "./FloorPlanCanvas";
import { PolygonEditor } from "./PolygonEditor";
import { LayerManager } from "./LayerManager";
import type { Property } from '@/types/property-viewer';

interface FloorPlanViewerProps {
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
}

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
        floor: -1,
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
}: FloorPlanViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [showLabels, setShowLabels] = useState(true);
  const [floors, setFloors] = useState<FloorData[]>(mockFloors);
  const canvasRef = useRef<HTMLDivElement>(null);

  const currentFloor = floors.find(f => f.id === selectedFloorId) || floors[0];

  const primarySelectedPolygon = activeTool === 'edit_nodes' ? selectedPropertyIds[selectedPropertyIds.length - 1] : null;

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.2, 5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.2, 0.2));
  }, []);

  const handleResetView = useCallback(() => {
    setZoom(1);
  }, []);

  const handlePolygonHover = useCallback((propertyId: string | null) => {
    onHoverProperty(propertyId);
  }, [onHoverProperty]);


  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload logic here
      console.log("Uploading floor plan:", file.name);
    }
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Select 
              value={currentFloor.id} 
              onValueChange={onSelectFloor}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {floors.map((floor) => (
                  <SelectItem key={floor.id} value={floor.id}>
                    {floor.name} ({floor.level >= 0 ? '+' : ''}{floor.level})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Badge variant="outline" className="text-xs">
              {currentFloor.properties.length} ακίνητα
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {/* View Controls */}
            <div className="flex items-center gap-1 border rounded-md p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                className="h-8 w-8 p-0"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-xs px-2 min-w-[3rem] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                className="h-8 w-8 p-0"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetView}
                className="h-8 w-8 p-0"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            {/* Display Options */}
            <div className="flex items-center gap-1 border rounded-md p-1">
              <Button
                variant={showLabels ? "default" : "ghost"}
                size="sm"
                onClick={() => setShowLabels(!showLabels)}
                className="h-8 w-8 p-0"
              >
                {showLabels ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>

            {/* File Operations */}
            <div className="flex items-center gap-1">
              <input
                type="file"
                accept=".pdf,.dwg,.dxf"
                onChange={handleFileUpload}
                className="hidden"
                id="floor-plan-upload"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('floor-plan-upload')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Φόρτωση
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Main Content */}
      <CardContent className="flex-1 p-0 overflow-hidden">
        <div className="h-full flex">
          {/* Canvas Area */}
          <div className="flex-1 relative overflow-hidden bg-gray-50 dark:bg-muted">
            <div
              ref={canvasRef}
              className="w-full h-full relative"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
            >
              <FloorPlanCanvas
                floorData={currentFloor}
                selectedPropertyIds={selectedPropertyIds}
                hoveredProperty={hoveredPropertyId}
                activeTool={activeTool}
                onPolygonHover={handlePolygonHover}
                onPolygonSelect={onSelectProperty}
                onPolygonCreated={onPolygonCreated}
                onPolygonUpdated={onPolygonUpdated}
                showGrid={showGrid}
                snapToGrid={snapToGrid}
                gridSize={gridSize}
                showMeasurements={showMeasurements}
                scale={scale}
              />
            </div>
          </div>

          {/* Side Panel for Edit Mode */}
          {activeTool === 'edit_nodes' && (
            <div className="w-80 border-l bg-background">
              <Tabs defaultValue="layers" className="h-full">
                <TabsList className="grid grid-cols-2 m-2">
                  <TabsTrigger value="layers">
                    <Layers className="h-4 w-4 mr-2" />
                    Layers
                  </TabsTrigger>
                  <TabsTrigger value="properties">
                    <Palette className="h-4 w-4 mr-2" />
                    Ιδιότητες
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="layers" className="mt-0 h-[calc(100%-3rem)]">
                  <LayerManager
                    floorData={currentFloor}
                    selectedPolygonIds={selectedPropertyIds}
                    onPolygonSelect={onSelectProperty}
                    onDuplicate={onDuplicate}
                    onDelete={onDelete}
                  />
                </TabsContent>
                
                <TabsContent value="properties" className="mt-0 h-[calc(100%-3rem)] p-4">
                  <div className="space-y-4">
                    <h4 className="font-medium">Ιδιότητες Polygon</h4>
                    {primarySelectedPolygon ? (
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Επιλεγμένο: {primarySelectedPolygon}
                        </p>
                        {/* Property editing controls will go here */}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Επιλέξτε ένα polygon για επεξεργασία
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </CardContent>
    </div>
  );
}
