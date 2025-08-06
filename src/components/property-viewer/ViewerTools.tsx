
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  MousePointer,
  PenSquare,
  Maximize,
  Ruler,
  Grid,
  Magnet,
  Undo2,
  Redo2,
  Spline,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ViewerToolsProps {
  activeTool: string | null;
  setActiveTool: (tool: 'create' | 'edit_nodes' | 'measure' | 'polyline' | null) => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  snapToGrid: boolean;
  setSnapToGrid: (snap: boolean) => void;
  showMeasurements: boolean;
  setShowMeasurements: (show: boolean) => void;
  scale: number;
  setScale: (scale: number) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onShowHistory: () => void;
}

const tools = [
  { id: null, icon: MousePointer, label: "Επιλογή" },
  { id: 'create', icon: PenSquare, label: "Δημιουργία" },
  { id: 'edit_nodes', icon: Maximize, label: "Κόμβοι" },
  { id: 'measure', icon: Ruler, label: "Μέτρηση" },
  { id: 'polyline', icon: Spline, label: 'Γραμμή' },
];

export function ViewerTools({
  activeTool,
  setActiveTool,
  showGrid,
  setShowGrid,
  snapToGrid,
  setSnapToGrid,
  showMeasurements,
  setShowMeasurements,
  scale,
  setScale,
  undo,
  redo,
  canUndo,
  canRedo,
  onShowHistory,
}: ViewerToolsProps) {
  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-muted p-1 rounded-md">
                {tools.map((tool) => (
                    <Button
                    key={tool.label}
                    variant={activeTool === tool.id ? "default" : "ghost"}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setActiveTool(tool.id as any)}
                    >
                    <tool.icon className="h-4 w-4" />
                    </Button>
                ))}
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            <div className="flex items-center gap-1 bg-muted p-1 rounded-md">
                <Button variant="ghost" size="sm" onClick={undo} disabled={!canUndo} className="h-8 w-8 p-0">
                    <Undo2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={redo} disabled={!canRedo} className="h-8 w-8 p-0">
                    <Redo2 className="h-4 w-4" />
                </Button>
            </div>
            
            <Separator orientation="vertical" className="h-6" />

            <div className="flex items-center gap-1 bg-muted p-1 rounded-md">
                <Button variant="ghost" size="sm" onClick={onShowHistory} className="h-8 w-8 p-0">
                    <History className="h-4 w-4" />
                </Button>
            </div>
        </div>

        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <Grid className="h-4 w-4 text-muted-foreground" />
                <Switch
                    id="show-grid"
                    checked={showGrid}
                    onCheckedChange={setShowGrid}
                />
            </div>
            <div className="flex items-center gap-2">
                <Magnet className="h-4 w-4 text-muted-foreground" />
                <Switch
                    id="snap-to-grid"
                    checked={snapToGrid}
                    onCheckedChange={setSnapToGrid}
                />
            </div>
            <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-muted-foreground" />
                <Switch
                    id="show-measurements"
                    checked={showMeasurements}
                    onCheckedChange={setShowMeasurements}
                />
                 {activeTool === 'measure' && (
                    <div className="flex items-center gap-1 text-xs">
                        <Label htmlFor="scale-input" className="text-xs text-muted-foreground">Κλίμακα:</Label>
                        <Input
                            id="scale-input"
                            type="number"
                            value={scale}
                            onChange={(e) => setScale(parseFloat(e.target.value) || 0)}
                            className="h-7 w-20 text-xs"
                            step="0.01"
                        />
                        <span className="text-muted-foreground">m/px</span>
                    </div>
                )}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
