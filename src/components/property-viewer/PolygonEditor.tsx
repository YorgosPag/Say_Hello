

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { Property } from '@/types/property-viewer';
import type { LayerState } from './SidebarPanel';

interface FloorData {
  id: string;
  name: string;
  level: number;
  buildingId: string;
  floorPlanUrl?: string;
  properties: Property[];
}

interface PolygonEditorProps {
  floorData: FloorData;
  selectedPolygonId: string | null;
  onPolygonUpdate: (polygonId: string, vertices: Array<{ x: number; y: number }>) => void;
  snapToGrid: boolean;
  gridSize: number;
  layerStates: Record<string, LayerState>;
}

interface DragState {
  isDragging: boolean;
  dragType: 'vertex' | 'polygon' | 'edge' | null;
  polygonId: string | null;
  dragIndex?: number;
  startPos: { x: number; y: number };
  offset: { x: number; y: number };
}

// Vertex handle component
function VertexHandle({
  vertex,
  index,
  onMouseDown
}: {
  vertex: { x: number; y: number };
  index: number;
  onMouseDown: (index: number, event: React.MouseEvent) => void;
}) {
  const [isShiftDown, setIsShiftDown] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => e.key === 'Shift' && setIsShiftDown(true);
    const handleKeyUp = (e: KeyboardEvent) => e.key === 'Shift' && setIsShiftDown(false);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <circle
      cx={vertex.x}
      cy={vertex.y}
      r={5}
      fill={isShiftDown ? "#ef4444" : "#7c3aed"}
      stroke="#ffffff"
      strokeWidth={2}
      className={cn(
        "transition-colors",
        isShiftDown ? "cursor-crosshair" : "cursor-move hover:fill-violet-500"
      )}
      onMouseDown={(e) => onMouseDown(index, e)}
    />
  );
}

// Edge midpoint component for adding new vertices
function EdgeMidpoint({
  start,
  end,
  index,
  onMouseDown
}: {
  start: { x: number; y: number };
  end: { x: number; y: number };
  index: number;
  onMouseDown: (index: number, event: React.MouseEvent) => void;
}) {
  const midpoint = {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2
  };

  return (
    <circle
      cx={midpoint.x}
      cy={midpoint.y}
      r={4}
      fill="#10b981"
      stroke="#ffffff"
      strokeWidth={1}
      className="cursor-pointer opacity-70 hover:opacity-100 hover:r-5 transition-all"
      onMouseDown={(e) => onMouseDown(index, e)}
    />
  );
}


export function PolygonEditor({
  floorData,
  selectedPolygonId,
  onPolygonUpdate,
  snapToGrid,
  gridSize,
  layerStates,
}: PolygonEditorProps) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragType: null,
    polygonId: null,
    startPos: { x: 0, y: 0 },
    offset: { x: 0, y: 0 }
  });
  
  const svgRef = useRef<SVGGElement>(null);

  const snapPoint = useCallback((point: { x: number; y: number }) => {
    if (!snapToGrid) return point;
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize,
    };
  }, [snapToGrid, gridSize]);

  const handleVertexMouseDown = useCallback((polygonId: string, vertexIndex: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const polygon = floorData.properties.find(p => p.id === polygonId);
    if (!polygon) return;
    
    if (event.shiftKey && polygon.vertices.length > 3) {
      const newVertices = polygon.vertices.filter((_, i) => i !== vertexIndex);
      onPolygonUpdate(polygonId, newVertices);
      return;
    }

    setDragState({
      isDragging: true,
      dragType: 'vertex',
      polygonId,
      dragIndex: vertexIndex,
      startPos: { x: event.clientX, y: event.clientY },
      offset: { x: 0, y: 0 }
    });
  }, [floorData.properties, onPolygonUpdate]);
  
  const handleEdgeMouseDown = useCallback((polygonId: string, edgeIndex: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const polygon = floorData.properties.find(p => p.id === polygonId);
    if (!polygon) return;
    
    const rect = svgRef.current?.ownerSVGElement?.getBoundingClientRect();
    if (!rect) return;
    
    const zoom = parseFloat(svgRef.current?.closest('[data-zoom]')?.getAttribute('data-zoom') || '1');
    
    let newPos = {
      x: (event.clientX - rect.left) / zoom,
      y: (event.clientY - rect.top) / zoom
    };
    newPos = snapPoint(newPos);
    
    const newVertices = [...polygon.vertices];
    newVertices.splice(edgeIndex + 1, 0, newPos);
    onPolygonUpdate(polygonId, newVertices);

    // Immediately start dragging the new vertex
    setDragState({
        isDragging: true,
        dragType: 'vertex',
        polygonId,
        dragIndex: edgeIndex + 1,
        startPos: { x: event.clientX, y: event.clientY },
        offset: { x: 0, y: 0 }
    });

  }, [floorData.properties, onPolygonUpdate, snapPoint]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!dragState.isDragging || !dragState.polygonId) return;

      const polygon = floorData.properties.find(p => p.id === dragState.polygonId);
      if(!polygon || layerStates[polygon.id]?.locked) return;

      const rect = svgRef.current?.ownerSVGElement?.getBoundingClientRect();
      if (!rect) return;
      
      const zoom = parseFloat(svgRef.current?.closest('[data-zoom]')?.getAttribute('data-zoom') || '1');

      const currentPos = snapPoint({
        x: (event.clientX - rect.left) / zoom,
        y: (event.clientY - rect.top) / zoom
      });
      
      if (dragState.dragType === 'vertex' && dragState.dragIndex !== undefined) {
        const newVertices = [...polygon.vertices];
        newVertices[dragState.dragIndex] = currentPos;
        onPolygonUpdate(dragState.polygonId, newVertices);
      }
    };

    const handleMouseUp = () => {
      setDragState({
        isDragging: false,
        dragType: null,
        polygonId: null,
        startPos: { x: 0, y: 0 },
        offset: { x: 0, y: 0 }
      });
    };

    if (dragState.isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp, { once: true });
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, floorData.properties, onPolygonUpdate, snapPoint, layerStates]);


  const selectedPolygonData = floorData.properties.find(p => p.id === selectedPolygonId);

  if (!selectedPolygonId || !selectedPolygonData || layerStates[selectedPolygonId]?.locked) {
    return null; // Don't render if no polygon is selected or if it's locked
  }

  return (
    <g ref={svgRef} className="polygon-editor">
        {/* Vertex handles */}
        {selectedPolygonData.vertices.map((vertex, index) => (
          <VertexHandle
            key={`vertex-${selectedPolygonId}-${index}`}
            vertex={vertex}
            index={index}
            onMouseDown={(vertexIndex, event) => handleVertexMouseDown(selectedPolygonId, vertexIndex, event)}
          />
        ))}

        {/* Edge midpoints for adding vertices */}
        {selectedPolygonData.vertices.map((vertex, index) => {
          const nextIndex = (index + 1) % selectedPolygonData.vertices.length;
          const nextVertex = selectedPolygonData.vertices[nextIndex];
          
          return (
            <EdgeMidpoint
              key={`edge-${selectedPolygonId}-${index}`}
              start={vertex}
              end={nextVertex}
              index={index}
              onMouseDown={(edgeIndex, event) => handleEdgeMouseDown(selectedPolygonId, edgeIndex, event)}
            />
          );
        })}
    </g>
  );
}
