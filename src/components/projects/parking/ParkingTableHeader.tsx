'use client';

import React, { useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface ParkingTableHeaderProps {
  columns: { key: string; label: string; }[];
  columnWidths: number[];
  onColumnResize: (newWidths: number[]) => void;
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  onSort: (columnKey: string) => void;
  onSelectAll: () => void;
  allSelected: boolean;
  isIndeterminate: boolean;
}

const ResizableHeaderCell = ({ width, onResize, children, ...props }: { width: number; onResize: (newWidth: number) => void; children: React.ReactNode }) => {
    const handleRef = useRef<HTMLDivElement>(null);
    
    const onMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const startX = e.clientX;
        const startWidth = width;

        const onMouseMove = (moveEvent: MouseEvent) => {
            const newWidth = startWidth + (moveEvent.clientX - startX);
            onResize(newWidth > 50 ? newWidth : 50);
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }, [width, onResize]);

    return (
        <div className="flex items-center group relative h-full" style={{ flex: `0 0 ${width}px` }} {...props}>
            <div className="flex-grow px-2 truncate h-full flex items-center">{children}</div>
            <div
                ref={handleRef}
                className="w-1.5 h-full cursor-col-resize flex items-center justify-center absolute -right-0.5 top-0"
                onMouseDown={onMouseDown}
            >
                <div className="w-px h-1/2 bg-transparent group-hover:bg-border transition-colors"></div>
            </div>
        </div>
    );
}

export function ParkingTableHeader({ columns, columnWidths, onColumnResize, sortConfig, onSort, onSelectAll, allSelected, isIndeterminate }: ParkingTableHeaderProps) {
  
  const handleResize = (index: number, newWidth: number) => {
    const newWidths = [...columnWidths];
    newWidths[index] = newWidth;
    onColumnResize(newWidths);
  };
  
  return (
    <div className="sticky top-0 bg-muted/50 z-10 border-b shrink-0">
        <div className="flex items-center font-semibold px-2 h-10">
            <div style={{ flex: `0 0 ${columnWidths[0]}px` }} className="flex items-center justify-center">
                 <Checkbox 
                   checked={allSelected} 
                   onCheckedChange={onSelectAll}
                   data-state={isIndeterminate ? 'indeterminate' : (allSelected ? 'checked' : 'unchecked')}
                 />
            </div>
            {columns.map((col, index) => (
                <ResizableHeaderCell key={col.key} width={columnWidths[index+1]} onResize={(newWidth: number) => handleResize(index+1, newWidth)}>
                     <button className="flex items-center gap-1 w-full" onClick={() => onSort(col.key)}>
                        <span>{col.label}</span>
                        {sortConfig?.key === col.key && (
                            sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                        )}
                    </button>
                </ResizableHeaderCell>
            ))}
        </div>
    </div>
  );
}
