"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { PolygonEditor } from "./PolygonEditor";
import type { Property } from '@/types/property-viewer';
import type { LayerState } from './SidebarPanel';
import type { Suggestion } from '@/types/suggestions';
import type { Connection, PropertyGroup } from '@/types/connections';


import { GridOverlay } from './FloorPlanCanvas/GridOverlay';
import { PropertyPolygon } from './FloorPlanCanvas/PropertyPolygon';
import { CreationOverlay } from './FloorPlanCanvas/CreationOverlay';
import { MeasurementOverlay } from './FloorPlanCanvas/MeasurementOverlay';
import { StatusLegend } from './FloorPlanCanvas/StatusLegend';
import { PropertyCountOverlay } from './FloorPlanCanvas/PropertyCountOverlay';
import { ConnectionLine, GroupFrame, getCentroid } from './FloorPlanCanvas/ConnectionElements';


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
  activeTool: 'create' | 'edit_nodes' | 'measure' | 'polyline' | null;
  layerStates: Record<string, LayerState>;
  onPolygonHover: (propertyId: string | null) => void;
  onPolygonSelect: (propertyId: string, isShiftClick: boolean) => void;
  onPolygonCreated: (newProperty: Omit<Property, 'id'>) => void;
  onPolygonUpdated: (polygonId: string, vertices: Array<{ x: number; y: number }>) => void;
  onNavigateLevels: (property: Property) => void;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  showMeasurements: boolean;
  showLabels: boolean;
  scale: number;
  suggestionToDisplay: Suggestion | null;
  connections: Connection[];
  groups: PropertyGroup[];
  isConnecting: boolean;
  firstConnectionPoint: Property | null;
  pan: { x: number; y: number };
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
  onNavigateLevels,
  showGrid,
  snapToGrid,
  gridSize,
  showMeasurements,
  showLabels,
  scale,
  suggestionToDisplay,
  connections,
  groups,
  isConnecting,
  firstConnectionPoint,
  pan,
}: FloorPlanCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [creatingVertices, setCreatingVertices] = useState<Point[]>([]);
  const [mousePosition, setMousePosition] = useState<Point | null>(null);
  
  // Polyline state
  const [polylinePoints, setPolylinePoints] = useState<Point[]>([]);
  const [currentPolylines, setCurrentPolylines] = useState<Point[][]>([]);
  
  // Measurement tool state
  const [measurementStart, setMeasurementStart] = useState<Point | null>(null);

  const isCreatingPolygon = activeTool === 'create';
  const isNodeEditMode = activeTool === 'edit_nodes';
  const isMeasuring = activeTool === 'measure';
  const isDrawingPolyline = activeTool === 'polyline';


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
    if (event.target !== event.currentTarget && !isCreatingPolygon && !isDrawingPolyline) {
        // Clicks on polygons are handled by the polygons themselves
        return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const zoom = parseFloat(event.currentTarget.closest('[data-zoom]')?.getAttribute('data-zoom') || '1');
    let currentPoint = {
      x: (event.clientX - rect.left - pan.x) / zoom,
      y: (event.clientY - rect.top - pan.y) / zoom
    };
    currentPoint = snapPoint(currentPoint);
    
    // Polyline drawing
    if(isDrawingPolyline) {
        setPolylinePoints(prev => [...prev, currentPoint]);
    }
    // Polygon Creation
    else if (isCreatingPolygon) {
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
      if (event.target === event.currentTarget) {
          if (isNodeEditMode) {
              onPolygonSelect('', false);
          }
      }
    }
  }, [isCreatingPolygon, isDrawingPolyline, isMeasuring, onPolygonSelect, creatingVertices, onPolygonCreated, snapPoint, measurementStart, pan, isNodeEditMode]);

  const handleCanvasDoubleClick = useCallback(() => {
    if (isCreatingPolygon && creatingVertices.length >= 3) {
      onPolygonCreated({vertices: creatingVertices} as any);
      setCreatingVertices([]);
    } else if(isDrawingPolyline && polylinePoints.length > 1) {
        setCurrentPolylines(prev => [...prev, polylinePoints]);
        setPolylinePoints([]);
    }
  }, [isCreatingPolygon, isDrawingPolyline, creatingVertices, onPolygonCreated, polylinePoints]);


  const handleCanvasMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (event.target === event.currentTarget) {
      onPolygonHover(null);
    }
    
    if (isCreatingPolygon || isMeasuring || isConnecting || isDrawingPolyline) {
        const rect = event.currentTarget.getBoundingClientRect();
        const zoom = parseFloat(event.currentTarget.closest('[data-zoom]')?.getAttribute('data-zoom') || '1');
        const currentPos = {
           x: (event.clientX - rect.left - pan.x) / zoom,
           y: (event.clientY - rect.top - pan.y) / zoom
        };
        setMousePosition(snapPoint(currentPos));
    } else {
        setMousePosition(null);
    }
  }, [onPolygonHover, isCreatingPolygon, isMeasuring, isConnecting, isDrawingPolyline, snapPoint, pan]);

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
      if(isDrawingPolyline && polylinePoints.length > 0) {
        event.preventDefault();
        setCurrentPolylines(prev => [...prev, polylinePoints]);
        setPolylinePoints([]);
      }
  }

  return (
    <div 
      ref={containerRef} 
      className={cn("w-full h-full relative overflow-hidden", {
        "cursor-crosshair": isCreatingPolygon || isMeasuring || isConnecting || isDrawingPolyline,
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
        className="absolute inset-0"
        onClick={handleCanvasClick}
        onDoubleClick={handleCanvasDoubleClick}
        onMouseMove={handleCanvasMouseMove}
        onContextMenu={handleRightClick}
      >
        <g>

        <GridOverlay 
          showGrid={showGrid}
          width={dimensions.width*4}
          height={dimensions.height*4}
          gridSize={gridSize}
        />
        
        {/* Render groups first so they are in the back */}
        {groups.map((group) => (
            <GroupFrame key={group.id} group={group} properties={floorData.properties} />
        ))}
        
        {/* Render connections */}
        {connections.map((connection) => {
            const prop1 = floorData.properties.find(p => p.id === connection.from);
            const prop2 = floorData.properties.find(p => p.id === connection.to);
            if (!prop1 || !prop2) return null;
            return <ConnectionLine key={connection.id} prop1={prop1} prop2={prop2} type={connection.type} />
        })}
        
        {/* Render temporary connection line */}
        {isConnecting && firstConnectionPoint && mousePosition && (
            <ConnectionLine prop1={firstConnectionPoint} prop2={{...firstConnectionPoint, vertices: [mousePosition]}} type="related" />
        )}

        {floorData.properties.map((property) => {
            const layerState = layerStates[property.id] || { visible: true, opacity: 0.3, locked: false };
            return (
                <PropertyPolygon
                    key={property.id}
                    property={property}
                    isSelected={selectedPropertyIds.includes(property.id)}
                    isHovered={hoveredProperty === property.id}
                    isNodeEditMode={isNodeEditMode && selectedPropertyIds.includes(property.id)}
                    onHover={onPolygonHover}
                    onSelect={onPolygonSelect}
                    onNavigateLevels={onNavigateLevels}
                    showMeasurements={showMeasurements}
                    showLabels={showLabels}
                    scale={scale}
                    visible={layerState.visible}
                    opacity={layerState.opacity ?? 0.3}
                    isConnecting={isConnecting}
                    isFirstConnectionPoint={firstConnectionPoint?.id === property.id}
                />
            );
        })}

        {/* Render completed polylines */}
        {currentPolylines.map((points, index) => (
            <polyline
                key={`p-${index}`}
                points={points.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="blue"
                strokeWidth="2"
            />
        ))}

        {/* Render current polyline being drawn */}
        {isDrawingPolyline && polylinePoints.length > 0 && mousePosition && (
            <polyline
                points={[
                    ...polylinePoints.map(p => `${p.x},${p.y}`),
                    `${mousePosition.x},${mousePosition.y}`
                ].join(' ')}
                fill="none"
                stroke="blue"
                strokeWidth="2"
                strokeDasharray="4 4"
            />
        )}


        {suggestionToDisplay && suggestionToDisplay.recommendations.map((rec, index) => {
            if (rec.suggestedArea) {
                return (
                    <rect
                        key={index}
                        x={rec.suggestedArea.x}
                        y={rec.suggestedArea.y}
                        width={rec.suggestedArea.width || 100}
                        height={rec.suggestedArea.height || 100}
                        fill="rgba(59, 130, 246, 0.2)"
                        stroke="#3B82F6"
                        strokeWidth="2"
                        strokeDasharray="5 5"
                        className="pointer-events-none animate-pulse"
                    />
                );
            }
            return null;
        })}

        {isNodeEditMode && (
          <PolygonEditor
            floorData={floorData}
            selectedPolygonId={primarySelectedPolygon}
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
        </g>
      </svg>

      <div className="absolute top-4 left-4 z-10">
        <StatusLegend />
      </div>
      <div className="absolute top-4 right-4 z-10">
        <PropertyCountOverlay count={floorData.properties.length} />
      </div>
    </div>
  );
}
