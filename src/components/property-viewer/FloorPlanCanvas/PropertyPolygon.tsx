
'use client';

import { cn } from "@/lib/utils";
import type { Property } from '@/types/property-viewer';
import { PolygonMeasurementInfo } from './PolygonMeasurementInfo';

interface PropertyPolygonProps {
  property: Property;
  isSelected: boolean;
  isHovered: boolean;
  isNodeEditMode: boolean;
  onHover: (propertyId: string | null) => void;
  onSelect: (propertyId: string, isShiftClick: boolean) => void;
  showMeasurements: boolean;
  scale: number;
  visible: boolean;
  opacity: number;
  isConnecting: boolean;
  isFirstConnectionPoint: boolean;
}

const statusColors = {
  'for-sale': '#10b981',    // Green
  'for-rent': '#3b82f6',    // Blue
  'sold': '#ef4444',        // Red
  'rented': '#f97316',      // Orange
  'reserved': '#eab308',    // Yellow
};

export function PropertyPolygon({
  property,
  isSelected,
  isHovered,
  isNodeEditMode,
  onHover,
  onSelect,
  showMeasurements,
  scale,
  visible,
  opacity,
  isConnecting,
  isFirstConnectionPoint
}: PropertyPolygonProps) {
  if (!visible) return null;

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

  const fillColor = statusColors[property.status as keyof typeof statusColors] || '#cccccc';
  
  // Combine base opacity with interaction-based adjustments
  let fillOpacity = opacity;
  let strokeWidth = 1;
  let strokeColor = fillColor;
  let strokeDasharray: string | undefined;

  // Visual states
  if (isSelected) {
    fillOpacity = Math.min(1, opacity + 0.2); // Increase opacity on selection
    strokeWidth = 3;
    strokeColor = isNodeEditMode ? '#7c3aed' : '#1f2937';
  } else if (isHovered) {
    fillOpacity = Math.min(1, opacity + 0.15); // Increase opacity on hover
    strokeWidth = 2;
  }
  
  if(isConnecting) {
      strokeWidth = isFirstConnectionPoint ? 4 : (isHovered ? 4 : 2);
      strokeColor = isFirstConnectionPoint ? '#3B82F6' : (isHovered ? '#8B5CF6' : strokeColor);
      strokeDasharray = isFirstConnectionPoint ? "none" : (isHovered ? "4 4" : "none");
  } else {
      strokeDasharray = isNodeEditMode && isSelected ? "5,5" : "none";
  }

  return (
    <g className="property-polygon">
      <path
        d={pathData}
        fill={fillColor}
        fillOpacity={fillOpacity}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        className={cn("cursor-pointer transition-all duration-200", { "cursor-crosshair": isConnecting })}
        onMouseEnter={() => onHover(property.id)}
        onMouseLeave={() => onHover(null)}
        onClick={(e) => onSelect(property.id, e.shiftKey)}
      />

      {isSelected && isNodeEditMode && (
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

      <g className="property-label">
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

      {isHovered && !isNodeEditMode && (
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

      {showMeasurements && (
        <PolygonMeasurementInfo polygon={property} scale={scale} />
      )}
    </g>
  );
}
