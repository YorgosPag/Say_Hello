

'use client';

import React from 'react';
import { CardHeader } from "@/components/ui/card";
import { FloorSelector } from './ViewerToolbar/FloorSelector';
import { ZoomControls } from './ViewerToolbar/ZoomControls';
import { DisplayToggle } from './ViewerToolbar/DisplayToggle';
import { FileUploader } from './ViewerToolbar/FileUploader';
import type { Property } from '@/types/property-viewer';

interface FloorData {
    id: string;
    name: string;
    level: number;
    buildingId: string;
    floorPlanUrl?: string;
    properties: Property[];
}
  
interface ViewerToolbarProps {
    currentFloor: FloorData;
    floors: FloorData[];
    zoom: number;
    setZoom: (zoom: number | ((prevZoom: number) => number)) => void;
    showLabels: boolean;
    setShowLabels: (show: boolean) => void;
    onSelectFloor: (floorId: string | null) => void;
    onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ViewerToolbar({
    currentFloor,
    floors,
    zoom,
    setZoom,
    showLabels,
    setShowLabels,
    onSelectFloor,
    onFileUpload
}: ViewerToolbarProps) {

    const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 5));
    const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.2));
    const handleResetView = () => setZoom(1);

    return (
        <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <FloorSelector 
                        currentFloor={currentFloor}
                        floors={floors}
                        onSelectFloor={onSelectFloor}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <ZoomControls 
                        zoom={zoom}
                        onZoomIn={handleZoomIn}
                        onZoomOut={handleZoomOut}
                        onReset={handleResetView}
                    />
                    
                    <DisplayToggle 
                        showLabels={showLabels}
                        onToggleLabels={() => setShowLabels(!showLabels)}
                    />

                    <FileUploader onFileUpload={onFileUpload} />
                </div>
            </div>
      </CardHeader>
    );
}
