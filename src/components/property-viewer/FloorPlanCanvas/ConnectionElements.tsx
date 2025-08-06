
'use client';

import type { Property } from '@/types/property-viewer';
import type { ConnectionType, PropertyGroup } from '@/types/connections';

// Helper to calculate the center of a polygon
export const getCentroid = (vertices: Array<{ x: number; y: number }>): { x: number; y: number } => {
  if (!vertices || vertices.length === 0) return { x: 0, y: 0 };
  return vertices.reduce(
    (acc, vertex) => ({
      x: acc.x + vertex.x / vertices.length,
      y: acc.y + vertex.y / vertices.length,
    }),
    { x: 0, y: 0 }
  );
};

// --- Connection Line Component ---
interface ConnectionLineProps {
  prop1: Property;
  prop2: Property;
  type: ConnectionType;
}

const connectionColors: Record<ConnectionType, string> = {
  sameBuilding: '#3B82F6', // blue
  sameFloor: '#10B981',    // green
  related: '#8B5CF6',      // purple
  parking: '#F59E0B',      // amber
};

export function ConnectionLine({ prop1, prop2, type }: ConnectionLineProps) {
  const start = getCentroid(prop1.vertices);
  const end = getCentroid(prop2.vertices);
  const color = connectionColors[type] || '#6B7280';
  const isDashed = type === 'parking';

  return (
    <line
      x1={start.x}
      y1={start.y}
      x2={end.x}
      y2={end.y}
      stroke={color}
      strokeWidth="2"
      strokeDasharray={isDashed ? "5 5" : "none"}
      opacity={0.8}
      className="pointer-events-none"
    />
  );
}

// --- Group Frame Component ---
interface GroupFrameProps {
  group: PropertyGroup;
  properties: Property[];
}

export function GroupFrame({ group, properties }: GroupFrameProps) {
  const groupProperties = properties.filter(p => group.propertyIds.includes(p.id));

  if (groupProperties.length < 1) {
    return null;
  }

  // Calculate bounding box
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;

  groupProperties.forEach(prop => {
    prop.vertices.forEach(vertex => {
      minX = Math.min(minX, vertex.x);
      minY = Math.min(minY, vertex.y);
      maxX = Math.max(maxX, vertex.x);
      maxY = Math.max(maxY, vertex.y);
    });
  });

  const padding = 20;
  minX -= padding;
  minY -= padding;
  maxX += padding;
  maxY += padding;

  return (
    <g className="group-frame pointer-events-none">
      <rect
        x={minX}
        y={minY}
        width={maxX - minX}
        height={maxY - minY}
        fill="transparent"
        stroke={group.color}
        strokeWidth="2"
        strokeDasharray="10 5"
        rx="10"
        ry="10"
        opacity={0.7}
      />
      <text
        x={minX + 10}
        y={minY - 10}
        fontSize="14"
        fontWeight="bold"
        fill={group.color}
        style={{ paintOrder: 'stroke', stroke: 'white', strokeWidth: '4px', strokeLinejoin: 'round' }}
      >
        {group.name}
      </text>
    </g>
  );
}
