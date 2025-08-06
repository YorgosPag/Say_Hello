
'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  MousePointer,
  PenSquare,
  Maximize,
  Ruler,
  Grid,
  Magnet,
  Camera,
  Undo2,
  Redo2,
  Layers,
  Link,
  BrainCircuit,
  Settings,
  Spline
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
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const tools = [
  { id: null, icon: MousePointer, label: "Επιλογή" },
  { id: 'create', icon: PenSquare, label: "Δημιουργία" },
  { id: 'edit_nodes', icon: Maximize, label: "Επεξεργασία Κόμβων" },
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
  undo,
  redo,
  canUndo,
  canRedo
}: ViewerToolsProps) {
  return (
    <Card>
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-sm">Εργαλεία & Ρυθμίσεις</CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-4">
        <div className="grid grid-cols-5 gap-1">
          {tools.map((tool) => (
            <Button
              key={tool.label}
              variant={activeTool === tool.id ? "default" : "outline"}
              size="sm"
              className="flex-col h-14"
              onClick={() => setActiveTool(tool.id as any)}
            >
              <tool.icon className="h-4 w-4 mb-1" />
              <span className="text-xs">{tool.label}</span>
            </Button>
          ))}
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-grid" className="text-xs flex items-center gap-2">
              <Grid className="h-3 w-3" />
              Εμφάνιση Πλέγματος
            </Label>
            <Switch
              id="show-grid"
              checked={showGrid}
              onCheckedChange={setShowGrid}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="snap-to-grid" className="text-xs flex items-center gap-2">
              <Magnet className="h-3 w-3" />
              Snap στο Πλέγμα
            </Label>
            <Switch
              id="snap-to-grid"
              checked={snapToGrid}
              onCheckedChange={setSnapToGrid}
            />
          </div>
           <div className="flex items-center justify-between">
            <Label htmlFor="show-measurements" className="text-xs flex items-center gap-2">
              <Ruler className="h-3 w-3" />
              Εμφάνιση Μετρήσεων
            </Label>
            <Switch
              id="show-measurements"
              checked={showMeasurements}
              onCheckedChange={setShowMeasurements}
            />
          </div>
        </div>

        <Separator />
        
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={undo} disabled={!canUndo}>
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={redo} disabled={!canRedo}>
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>

        <Separator />
        
        <div className="space-y-2">
           <Button variant="outline" size="sm" className="w-full justify-start text-xs">
              <BrainCircuit className="h-4 w-4 mr-2" />
              Ανάλυση AI
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start text-xs">
              <Settings className="h-4 w-4 mr-2" />
              Ρυθμίσεις Προβολής
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
