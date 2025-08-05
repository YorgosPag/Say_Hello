

"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { PolygonEditor } from "./PolygonEditor";
import type { Property } from '@/types/property-viewer';
import type { LayerState } from './SidebarPanel';

import { GridOverlay } from './FloorPlanCanvas/GridOverlay';
import { PropertyPolygon } from './FloorPlanCanvas/PropertyPolygon';
import { CreationOverlay } from './FloorPlanCanvas/CreationOverlay';
import { MeasurementOverlay } from './FloorPlanCanvas/MeasurementOverlay';
import { StatusLegend } from './FloorPlanCanvas/StatusLegend';
import { PropertyCountOverlay } from './FloorPlanCanvas/PropertyCountOverlay';

interface FloorData {
  id: string;
  name: string;
  level: number;
  buildingId: string;
  floorPlanUrl?: string;
  properties: Property[];
}

interface Point {
    x: number;
    y: number;
}

interface FloorPlanCanvasProps {
  floorData: FloorData;
  selectedPropertyIds: string[];
  hoveredProperty: string | null;
  activeTool: 'create' | 'edit_nodes' | 'measure' | null;
  layerStates: Record<string, LayerState>;
  onPolygonHover: (propertyId: string | null) => void;
  onPolygonSelect: (propertyId: string, isShiftClick: boolean) => void;
  onPolygonCreated: (newProperty: Omit<Property, 'id'>) => void;
  onPolygonUpdated: (polygonId: string, vertices: Array<{ x: number; y: number }>) => void;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  showMeasurements: boolean;
  scale: number;
}


export function FloorPlanCanvas({
  floorData,
  selectedPropertyIds,
  hoveredProperty,
  activeTool,
  layerStates,
  onPolygonHover,
  onPolygonSelect,
  onPolygonCreated,
  onPolygonUpdated,
  showGrid,
  snapToGrid,
  gridSize,
  showMeasurements,
  scale,
}: FloorPlanCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [creatingVertices, setCreatingVertices] = useState<Point[]>([]);
  const [mousePosition, setMousePosition] = useState<Point | null>(null);
  
  // Measurement tool state
  const [measurementStart, setMeasurementStart] = useState<Point | null>(null);

  const isCreatingPolygon = activeTool === 'create';
  const isNodeEditMode = activeTool === 'edit_nodes';
  const isMeasuring = activeTool === 'measure';

  // The primary polygon for editing is the last one selected
  const primarySelectedPolygon = isNodeEditMode ? selectedPropertyIds[selectedPropertyIds.length - 1] : null;

  const snapPoint = useCallback((point: Point) => {
    if (!snapToGrid) return point;
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize,
    };
  }, [snapToGrid, gridSize]);

  // Handle container resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setDimensions({
          width: Math.max(offsetWidth, 400),
          height: Math.max(offsetHeight, 300)
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleCanvasClick = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (event.target !== event.currentTarget && !isCreatingPolygon) {
        // Clicks on polygons are handled by the polygons themselves
        return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    let currentPoint = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    currentPoint = snapPoint(currentPoint);

    // Polygon Creation
    if (isCreatingPolygon) {
      if (creatingVertices.length > 2) {
        const firstVertex = creatingVertices[0];
        const distance = Math.sqrt(
          Math.pow(currentPoint.x - firstVertex.x, 2) +
          Math.pow(currentPoint.y - firstVertex.y, 2)
        );

        if (distance < 10) {
          onPolygonCreated({vertices: creatingVertices} as any);
          setCreatingVertices([]);
          return;
        }
      }
      setCreatingVertices(prev => [...prev, currentPoint]);
    } 
    // Measurement
    else if (isMeasuring) {
        if (!measurementStart) {
            setMeasurementStart(currentPoint);
        } else {
            // Second click finalizes and resets for next measurement
            setMeasurementStart(null);
        }
    }
    // Default action (deselect)
    else {
      onPolygonSelect('', false); // Deselect all by passing empty ID
    }
  }, [isCreatingPolygon, isMeasuring, onPolygonSelect, creatingVertices, onPolygonCreated, snapPoint, measurementStart]);

  const handleCanvasDoubleClick = useCallback(() => {
    if (isCreatingPolygon && creatingVertices.length >= 3) {
      onPolygonCreated({vertices: creatingVertices} as any);
      setCreatingVertices([]);
    }
  }, [isCreatingPolygon, creatingVertices, onPolygonCreated]);


  const handleCanvasMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (event.target === event.currentTarget) {
      onPolygonHover(null);
    }
    
    if (isCreatingPolygon || isMeasuring) {
        const rect = event.currentTarget.getBoundingClientRect();
        const currentPos = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        };
        setMousePosition(snapPoint(currentPos));
    } else {
        setMousePosition(null);
    }
  }, [onPolygonHover, isCreatingPolygon, isMeasuring, snapPoint]);

  const handleRightClick = (event: React.MouseEvent<SVGSVGElement>) => {
      // Exit creation mode on right click
      if(isCreatingPolygon && creatingVertices.length > 0) {
          event.preventDefault();
          setCreatingVertices([]);
      }
      // Exit measurement mode on right click
      if(isMeasuring && measurementStart) {
          event.preventDefault();
          setMeasurementStart(null);
      }
  }


  return (
    <div 
      ref={containerRef} 
      className={cn("w-full h-full relative overflow-hidden", {
        "cursor-crosshair": isCreatingPolygon || isMeasuring,
      })}
    >
      {/* Floor plan background */}
      {floorData.floorPlanUrl && (
        <div className="absolute inset-0 opacity-30">
          {/* PDF/DWG viewer would go here */}
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
            <span className="text-sm">Floor Plan: {floorData.name}</span>
          </div>
        </div>
      )}

      {/* SVG Canvas */}
      <svg
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0 cursor-default"
        onClick={handleCanvasClick}
        onDoubleClick={handleCanvasDoubleClick}
        onMouseMove={handleCanvasMouseMove}
        onContextMenu={handleRightClick}
      >
        <GridOverlay 
          showGrid={showGrid}
          width={dimensions.width}
          height={dimensions.height}
          gridSize={gridSize}
        />

        {floorData.properties.map((property) => {
            const layerState = layerStates[property.id] || { visible: true, opacity: 0.3, locked: false };
            return (
                <PropertyPolygon
                    key={property.id}
                    property={property}
                    isSelected={selectedPropertyIds.includes(property.id)}
                    isHovered={hoveredProperty === property.id}
                    isNodeEditMode={isNodeEditMode && primarySelectedPolygon === property.id}
                    onHover={onPolygonHover}
                    onSelect={onPolygonSelect}
                    showMeasurements={showMeasurements}
                    scale={scale}
                    visible={layerState.visible}
                    opacity={layerState.opacity}
                />
            );
        })}


        {isNodeEditMode && (
          <PolygonEditor
            floorData={floorData}
            selectedPolygon={primarySelectedPolygon}
            onPolygonUpdate={onPolygonUpdated}
            snapToGrid={snapToGrid}
            gridSize={gridSize}
            layerStates={layerStates}
          />
        )}

        {isCreatingPolygon && (
           <CreationOverlay 
             vertices={creatingVertices}
             mousePosition={mousePosition}
           />
        )}
        
        {isMeasuring && (
            <MeasurementOverlay 
                startPoint={measurementStart}
                endPoint={mousePosition}
                scale={scale}
            />
        )}
        
        {(isCreatingPolygon || isMeasuring) && snapToGrid && mousePosition && (
            <circle
                cx={mousePosition.x}
                cy={mousePosition.y}
                r="4"
                fill="none"
                stroke="rgba(255, 0, 0, 0.7)"
                strokeWidth="1.5"
                strokeDasharray="2 2"
                className="pointer-events-none"
            />
        )}
      </svg>

      <StatusLegend />
      <PropertyCountOverlay count={floorData.properties.length} />
    </div>
  );
}
    
