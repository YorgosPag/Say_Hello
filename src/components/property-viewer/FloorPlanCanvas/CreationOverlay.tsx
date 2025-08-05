
'use client';

interface Point {
  x: number;
  y: number;
}

interface CreationOverlayProps {
  vertices: Point[];
  mousePosition: Point | null;
}

export function CreationOverlay({ vertices, mousePosition }: CreationOverlayProps) {
  if (vertices.length === 0 || !mousePosition) {
    return null;
  }

  return (
    <g className="creation-tool pointer-events-none">
      <polyline
        points={[
          ...vertices.map(v => `${v.x},${v.y}`),
          `${mousePosition.x},${mousePosition.y}`
        ].join(' ')}
        fill="none"
        stroke="#7c3aed"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      {vertices.map((vertex, index) => (
        <circle
          key={index}
          cx={vertex.x}
          cy={vertex.y}
          r="4"
          fill="#7c3aed"
        />
      ))}
      {vertices.length > 2 && (
         <circle
          cx={vertices[0].x}
          cy={vertices[0].y}
          r="6"
          fill="rgba(124, 58, 237, 0.5)"
          stroke="#7c3aed"
          strokeWidth={2}
          className="cursor-pointer animate-pulse"
         />
      )}
    </g>
  );
}
