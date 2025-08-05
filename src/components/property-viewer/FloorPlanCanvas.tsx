
"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { PolygonEditor } from "./PolygonEditor";
import type { Property } from '@/types/property-viewer';

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
  selectedProperty: string | null;
  hoveredProperty: string | null;
  selectedPolygon: string | null;
  showGrid: boolean;
  showLabels: boolean;
  activeTool: 'create' | 'edit_nodes' | 'measure' | null;
  onPolygonHover: (propertyId: string | null) => void;
  onPolygonSelect: (propertyId: string | null) => void;
  onPolygonCreated: (newProperty: Omit<Property, 'id'>) => void;
  onPolygonUpdated: (polygonId: string, vertices: Array<{ x: number; y: number }>) => void;
  snapToGrid: boolean;
  gridSize: number;
  showMeasurements: boolean;
  scale: number;
}

const statusColors = {
  'for-sale': '#10b981',    // Green
  'for-rent': '#3b82f6',    // Blue
  'sold': '#ef4444',        // Red
  'rented': '#f97316',      // Orange
  'reserved': '#eab308',    // Yellow
};

// Grid component
function GridOverlay({ showGrid, width, height, gridSize }: { showGrid: boolean; width: number; height: number; gridSize: number }) {
  if (!showGrid) return null;

  const lines = [];

  // Vertical lines
  for (let x = 0; x <= width; x += gridSize) {
    lines.push(
      <line
        key={`v-${x}`}
        x1={x}
        y1={0}
        x2={x}
        y2={height}
        stroke="#e5e7eb"
        strokeWidth={0.5}
        opacity={0.5}
      />
    );
  }

  // Horizontal lines
  for (let y = 0; y <= height; y += gridSize) {
    lines.push(
      <line
        key={`h-${y}`}
        x1={0}
        y1={y}
        x2={width}
        y2={y}
        stroke="#e5e7eb"
        strokeWidth={0.5}
        opacity={0.5}
      />
    );
  }

  return <g className="grid-overlay">{lines}</g>;
}

// Property polygon component
function PropertyPolygon({
  property,
  isSelected,
  isHovered,
  isPolygonSelected,
  showLabels,
  isEditMode,
  onHover,
  onSelect
}: {
  property: Property;
  isSelected: boolean;
  isHovered: boolean;
  isPolygonSelected: boolean;
  showLabels: boolean;
  isEditMode: boolean;
  onHover: (propertyId: string | null) => void;
  onSelect: (propertyId: string | null) => void;
}) {
  const pathData = property.vertices
    .map((vertex, index) => `${index === 0 ? 'M' : 'L'} ${vertex.x} ${vertex.y}`)
    .join(' ') + ' Z';

  const centroid = property.vertices.reduce(
    (acc, vertex) => ({
      x: acc.x + vertex.x / property.vertices.length,
      y: acc.y + vertex.y / property.vertices.length
    }),
    { x: 0, y: 0 }
  );

  const fillColor = statusColors[property.status];
  let fillOpacity = 0.3;
  let strokeWidth = 1;
  let strokeColor = fillColor;

  // Visual states
  if (isSelected) {
    fillOpacity = 0.5;
    strokeWidth = 3;
    strokeColor = '#1f2937';
  } else if (isHovered) {
    fillOpacity = 0.4;
    strokeWidth = 2;
  } else if (isPolygonSelected && isEditMode) { // Only show selection in edit mode
    fillOpacity = 0.6;
    strokeWidth = 2;
    strokeColor = '#7c3aed';
  }

  return (
    <g className="property-polygon">
      {/* Main polygon */}
      <path
        d={pathData}
        fill={fillColor}
        fillOpacity={fillOpacity}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={isEditMode ? "5,5" : "none"}
        className="cursor-pointer transition-all duration-200"
        onMouseEnter={() => onHover(property.id)}
        onMouseLeave={() => onHover(null)}
        onClick={() => onSelect(property.id)}
      />

      {/* Selection highlight for edit mode */}
      {isPolygonSelected && isEditMode && (
        <path
          d={pathData}
          fill="none"
          stroke={'#7c3aed'}
          strokeWidth={3}
          strokeDasharray="3,3"
          opacity={0.8}
          className="pointer-events-none animate-pulse"
        />
      )}

      {/* Label */}
      {showLabels && (
        <g className="property-label">
          {/* Label background */}
          <rect
            x={centroid.x - 30}
            y={centroid.y - 10}
            width={60}
            height={20}
            fill="white"
            fillOpacity={0.9}
            stroke="#e5e7eb"
            strokeWidth={0.5}
            rx={2}
            className="pointer-events-none"
          />
          {/* Label text */}
          <text
            x={centroid.x}
            y={centroid.y + 3}
            textAnchor="middle"
            fontSize="10"
            fill="#374151"
            className="pointer-events-none select-none font-medium"
          >
            {property.name}
          </text>
          {/* Type text */}
          <text
            x={centroid.x}
            y={centroid.y + 15}
            textAnchor="middle"
            fontSize="8"
            fill="#6b7280"
            className="pointer-events-none select-none"
          >
            {property.type}
          </text>
        </g>
      )}

      {/* Hover tooltip */}
      {isHovered && !isEditMode && (
        <g className="hover-tooltip">
          <rect
            x={centroid.x + 40}
            y={centroid.y - 25}
            width={120}
            height={50}
            fill="white"
            fillOpacity={0.95}
            stroke="#d1d5db"
            strokeWidth={1}
            rx={4}
            className="pointer-events-none drop-shadow-md"
          />
          <text
            x={centroid.x + 50}
            y={centroid.y - 15}
            fontSize="10"
            fill="#111827"
            className="pointer-events-none select-none font-semibold"
          >
            {property.name}
          </text>
          <text
            x={centroid.x + 50}
            y={centroid.y - 5}
            fontSize="9"
            fill="#6b7280"
            className="pointer-events-none select-none"
          >
            {property.type}
          </text>
          {property.price && (
            <text
              x={centroid.x + 50}
              y={centroid.y + 5}
              fontSize="9"
              fill="#059669"
              className="pointer-events-none select-none font-medium"
            >
              {property.price.toLocaleString('el-GR')}€
            </text>
          )}
          {property.area && (
            <text
              x={centroid.x + 50}
              y={centroid.y + 15}
              fontSize="8"
              fill="#6b7280"
              className="pointer-events-none select-none"
            >
              {property.area}τμ
            </text>
          )}
        </g>
      )}
    </g>
  );
}

// Measurement Info component
function PolygonMeasurementInfo({ polygon, scale }: { polygon: Property; scale: number }) {
  const vertices = polygon.vertices;
  
  // Calculate Area (Shoelace formula)
  let area = 0;
  for (let i = 0; i < vertices.length; i++) {
    const j = (i + 1) % vertices.length;
    area += vertices[i].x * vertices[j].y;
    area -= vertices[j].x * vertices[i].y;
  }
  const realArea = Math.abs(area / 2) * scale * scale;

  // Calculate Perimeter
  let perimeter = 0;
  for (let i = 0; i < vertices.length; i++) {
    const j = (i + 1) % vertices.length;
    perimeter += Math.sqrt(
      Math.pow(vertices[j].x - vertices[i].x, 2) +
      Math.pow(vertices[j].y - vertices[i].y, 2)
    );
  }
  const realPerimeter = perimeter * scale;

  const centroid = vertices.reduce(
    (acc, vertex) => ({
      x: acc.x + vertex.x / vertices.length,
      y: acc.y + vertex.y / vertices.length,
    }),
    { x: 0, y: 0 }
  );

  return (
    <g className="measurement-info pointer-events-none">
      <text
        x={centroid.x}
        y={centroid.y + 25}
        textAnchor="middle"
        fontSize="10"
        fill="#1f2937"
        className="font-mono"
        style={{ paintOrder: 'stroke', stroke: 'white', strokeWidth: '3px', strokeLinejoin: 'round' }}
      >
        {realArea.toFixed(2)}m² / {realPerimeter.toFixed(2)}m
      </text>
    </g>
  );
}


export function FloorPlanCanvas({
  floorData,
  selectedProperty,
  hoveredProperty,
  selectedPolygon,
  showGrid,
  showLabels,
  activeTool,
  onPolygonHover,
  onPolygonSelect,
  onPolygonCreated,
  onPolygonUpdated,
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
      onPolygonSelect(null);
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

  // Calculate measurement display
  let measurementDisplay = null;
  if(isMeasuring && measurementStart && mousePosition) {
    const dist = Math.sqrt(
      Math.pow(mousePosition.x - measurementStart.x, 2) +
      Math.pow(mousePosition.y - measurementStart.y, 2)
    );
    const realDist = (dist * scale).toFixed(2);
    const midPoint = {
        x: (measurementStart.x + mousePosition.x) / 2,
        y: (measurementStart.y + mousePosition.y) / 2
    };

    measurementDisplay = (
      <g className="measurement-tool pointer-events-none">
        <line
          x1={measurementStart.x}
          y1={measurementStart.y}
          x2={mousePosition.x}
          y2={mousePosition.y}
          stroke="#ef4444"
          strokeWidth="2"
          strokeDasharray="5 5"
        />
        <text
          x={midPoint.x}
          y={midPoint.y - 10}
          textAnchor="middle"
          fontSize="12"
          fill="#ef4444"
          style={{ paintOrder: 'stroke', stroke: 'white', strokeWidth: '3px', strokeLinejoin: 'round' }}
        >
          {realDist}m
        </text>
      </g>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={cn("w-full h-full relative overflow-hidden bg-white", {
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
        {/* Grid */}
        <GridOverlay 
          showGrid={showGrid}
          width={dimensions.width}
          height={dimensions.height}
          gridSize={gridSize}
        />

        {/* Existing Properties */}
        {floorData.properties.map((property) => (
          <g key={property.id}>
            <PropertyPolygon
              property={property}
              isSelected={selectedProperty === property.id}
              isHovered={hoveredProperty === property.id}
              isPolygonSelected={selectedPolygon === property.id}
              showLabels={showLabels}
              isEditMode={isNodeEditMode}
              onHover={onPolygonHover}
              onSelect={onPolygonSelect}
            />
            {showMeasurements && (
                <PolygonMeasurementInfo polygon={property} scale={scale} />
            )}
          </g>
        ))}

        {isNodeEditMode && (
          <PolygonEditor
            floorData={floorData}
            selectedPolygon={selectedPolygon}
            onPolygonUpdate={onPolygonUpdated}
            snapToGrid={snapToGrid}
            gridSize={gridSize}
          />
        )}

        {/* Polygon being created */}
        {isCreatingPolygon && creatingVertices.length > 0 && mousePosition && (
          <g className="creation-tool pointer-events-none">
            <polyline
              points={[
                ...creatingVertices.map(v => `${v.x},${v.y}`),
                `${mousePosition.x},${mousePosition.y}`
              ].join(' ')}
              fill="none"
              stroke="#7c3aed"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            {creatingVertices.map((vertex, index) => (
              <circle
                key={index}
                cx={vertex.x}
                cy={vertex.y}
                r="4"
                fill="#7c3aed"
              />
            ))}
            {creatingVertices.length > 2 && (
               <circle
                cx={creatingVertices[0].x}
                cy={creatingVertices[0].y}
                r="6"
                fill="rgba(124, 58, 237, 0.5)"
                stroke="#7c3aed"
                strokeWidth={2}
                className="cursor-pointer animate-pulse"
               />
            )}
          </g>
        )}
        
        {/* Measurement line and text */}
        {measurementDisplay}
        
        {/* Snap indicator */}
        {(isCreatingPolygon || (isMeasuring && measurementStart)) && mousePosition && snapToGrid && (
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

      {/* Status legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm border rounded-lg p-3 shadow-sm">
        <h4 className="text-xs font-medium mb-2">Κατάσταση Ακινήτων</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: statusColors['for-sale'] }}></div>
            <span>Προς Πώληση</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: statusColors['for-rent'] }}></div>
            <span>Προς Ενοικίαση</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: statusColors['sold'] }}></div>
            <span>Πουλημένο</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: statusColors['rented'] }}></div>
            <span>Ενοικιασμένο</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: statusColors['reserved'] }}></div>
            <span>Δεσμευμένο</span>
          </div>
        </div>
      </div>

      {/* Property count */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm border rounded-lg px-3 py-1 shadow-sm">
        <span className="text-xs text-muted-foreground">
          {floorData.properties.length} ακίνητα στον όροφο
        </span>
      </div>
    </div>
  );
}
