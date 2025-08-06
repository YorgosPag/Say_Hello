
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface FloorCanvasWrapperProps {
  zoom: number;
  pan: { x: number, y: number };
  onPan: (pan: { x: number, y: number }) => void;
  isPanningAllowed: boolean;
  children: React.ReactNode;
}

export function FloorCanvasWrapper({ zoom, pan, onPan, isPanningAllowed, children }: FloorCanvasWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseUp = () => setIsPanning(false);

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanning) return;
      onPan({
        x: pan.x + (e.clientX - startPan.x),
        y: pan.y + (e.clientY - startPan.y),
      });
      setStartPan({ x: e.clientX, y: e.clientY });
    };

    if (isPanning) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPanning, onPan, pan, startPan]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanningAllowed || e.button !== 0) return;
    // Prevent panning when clicking on interactive elements inside the canvas
    const target = e.target as HTMLElement;
    if (target.closest('path, circle, rect:not(.group-frame rect)')) {
      return;
    }
    
    e.preventDefault();
    setIsPanning(true);
    setStartPan({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex-1 relative overflow-hidden bg-gray-50 dark:bg-muted",
        { "cursor-grab": isPanningAllowed && !isPanning },
        { "cursor-grabbing": isPanningAllowed && isPanning }
      )}
      onMouseDown={handleMouseDown}
    >
      <div
        className="w-full h-full relative"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
        data-zoom={zoom}
      >
        {children}
      </div>
    </div>
  );
}
