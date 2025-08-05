
'use client';

import React from 'react';
import { CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Upload, 
  Eye,
  EyeOff
} from "lucide-react";
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
    setZoom: (zoom: number) => void;
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

    const handleZoomIn = () => setZoom(Math.min(zoom * 1.2, 5));
    const handleZoomOut = () => setZoom(Math.max(zoom / 1.2, 0.2));
    const handleResetView = () => setZoom(1);

    return (
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
                        onChange={onFileUpload}
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
    );
}
