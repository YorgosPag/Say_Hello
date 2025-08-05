
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layers, Palette } from "lucide-react";
import { LayerManager } from "./LayerManager";
import { PropertyEditPanel } from "./PropertyEditPanel";
import type { Property } from '@/types/property-viewer';

interface FloorData {
    id: string;
    name: string;
    level: number;
    buildingId: string;
    floorPlanUrl?: string;
    properties: Property[];
}

interface SidebarPanelProps {
  floorData: FloorData;
  selectedPolygonIds: string[];
  onPolygonSelect: (polygonId: string, isShiftClick: boolean) => void;
  onDuplicate: (propertyId: string) => void;
  onDelete: (propertyId: string) => void;
}

export function SidebarPanel({ 
    floorData, 
    selectedPolygonIds, 
    onPolygonSelect,
    onDuplicate,
    onDelete
}: SidebarPanelProps) {
  return (
    <div className="w-80 border-l bg-background">
      <Tabs defaultValue="layers" className="h-full flex flex-col">
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
        
        <TabsContent value="layers" className="mt-0 flex-1 overflow-hidden">
          <LayerManager
            floorData={floorData}
            selectedPolygonIds={selectedPolygonIds}
            onPolygonSelect={onPolygonSelect}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
          />
        </TabsContent>
        
        <TabsContent value="properties" className="mt-0 flex-1 p-4">
            <PropertyEditPanel selectedPolygonId={selectedPolygonIds[selectedPolygonIds.length - 1]} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
