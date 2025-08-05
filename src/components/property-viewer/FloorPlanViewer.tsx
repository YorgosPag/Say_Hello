"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Layers, ZoomIn, ZoomOut, MousePointer, Hand } from "lucide-react";

interface FloorPlanViewerProps {
  selectedPropertyId: string | null;
  hoveredPropertyId: string | null;
  selectedFloorId: string | null;
  onSelectFloor: (id: string | null) => void;
  onHoverProperty: (id:string | null) => void;
  isEditMode: boolean;
}

export function FloorPlanViewer({
  selectedPropertyId,
  hoveredPropertyId,
  selectedFloorId,
  onSelectFloor,
  onHoverProperty,
  isEditMode,
}: FloorPlanViewerProps) {
  // Mock data for floors
  const floors = [
    { id: '0', name: 'Ισόγειο' },
    { id: '1', name: '1ος Όροφος' },
    { id: '2', name: '2ος Όροφος' },
    { id: '3', name: '3ος Όροφος' },
  ];

  return (
    <div className="w-full h-full bg-muted/30 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Placeholder for the floor plan image/SVG */}
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-muted-foreground text-center p-8">
          Floor plan viewer will be implemented here. <br />
          This is where the interactive PDF/DXF/SVG will be rendered.
        </p>
      </div>
      
      {/* Toolbar */}
      <div className="absolute top-2 left-2 flex gap-2">
        <Button variant="outline" size="sm" className="bg-background/80">
          <Layers className="mr-2 h-4 w-4" />
          Layers
        </Button>
      </div>

       {/* Floor Selector */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 bg-background/80 p-1 rounded-md shadow">
        {floors.map(floor => (
           <Button 
            key={floor.id}
            variant={selectedFloorId === floor.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onSelectFloor(floor.id)}
           >
             {floor.name}
           </Button>
        ))}
      </div>
      
      {/* View/Edit Controls */}
      <div className="absolute top-2 right-2 flex flex-col gap-2">
         <Button variant="outline" size="icon" className="h-8 w-8 bg-background/80">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 bg-background/80">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 bg-background/80">
            {isEditMode ? <MousePointer className="h-4 w-4" /> : <Hand className="h-4 w-4" />}
          </Button>
      </div>

    </div>
  );
}
