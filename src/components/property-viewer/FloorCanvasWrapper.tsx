
'use client';

import React, { useRef } from 'react';

interface FloorCanvasWrapperProps {
  zoom: number;
  children: React.ReactNode;
}

export function FloorCanvasWrapper({ zoom, children }: FloorCanvasWrapperProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex-1 relative overflow-hidden bg-gray-50 dark:bg-muted">
      <div
        ref={canvasRef}
        className="w-full h-full relative"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
      >
        {children}
      </div>
    </div>
  );
}
