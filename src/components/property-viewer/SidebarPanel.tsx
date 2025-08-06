

'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layers, Palette, Link2 } from "lucide-react";
import { LayerManager } from "./LayerManager";
import { PropertyEditPanel } from "./PropertyEditPanel";
import { SimpleConnectionPanel } from "./SimpleConnectionPanel";
import type { Property } from '@/types/property-viewer';
import type { Connection, PropertyGroup } from '@/types/connections';

export interface LayerState {
  visible: boolean;
  locked: boolean;
  opacity: number;
}

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
  layerStates: Record<string, LayerState>;
  setLayerStates: React.Dispatch<React.SetStateAction<Record<string, LayerState>>>;
  onPolygonSelect: (polygonId: string, isShiftClick: boolean) => void;
  onDuplicate: (propertyId: string) => void;
  onDelete: (propertyId: string) => void;
  connections: Connection[];
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
  groups: PropertyGroup[];
  setGroups: React.Dispatch<React.SetStateAction<PropertyGroup[]>>;
  isConnecting: boolean;
  setIsConnecting: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SidebarPanel({ 
    floorData, 
    selectedPolygonIds, 
    layerStates,
    setLayerStates,
    onPolygonSelect,
    onDuplicate,
    onDelete,
    connections,
    setConnections,
    groups,
    setGroups,
    isConnecting,
    setIsConnecting,
}: SidebarPanelProps) {
  return (
    <div className="w-80 border-l bg-background">
      <Tabs defaultValue="layers" className="h-full flex flex-col">
        <TabsList className="grid grid-cols-3 m-2">
          <TabsTrigger value="layers">
            <Layers className="h-4 w-4 mr-2" />
            Layers
          </TabsTrigger>
          <TabsTrigger value="properties">
            <Palette className="h-4 w-4 mr-2" />
            Ιδιότητες
          </TabsTrigger>
          <TabsTrigger value="connections">
            <Link2 className="h-4 w-4 mr-2" />
            Συνδέσεις
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="layers" className="mt-0 flex-1 overflow-hidden">
          <LayerManager
            floorData={floorData}
            selectedPolygonIds={selectedPolygonIds}
            layerStates={layerStates}
            setLayerStates={setLayerStates}
            onPolygonSelect={onPolygonSelect}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
          />
        </TabsContent>
        
        <TabsContent value="properties" className="mt-0 flex-1 p-4">
            <PropertyEditPanel selectedPolygonId={selectedPolygonIds[selectedPolygonIds.length - 1]} />
        </TabsContent>

        <TabsContent value="connections" className="mt-0 flex-1 p-4">
            <SimpleConnectionPanel
                properties={floorData.properties}
                selectedPropertyIds={selectedPolygonIds}
                connections={connections}
                setConnections={setConnections}
                groups={groups}
                setGroups={setGroups}
                isConnecting={isConnecting}
                setIsConnecting={setIsConnecting}
            />
        </TabsContent>
      </Tabs>
    </div>
  );
}
