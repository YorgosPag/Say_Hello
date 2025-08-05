
'use client';

import { useState, useMemo, useEffect, useTransition, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  Filter,
  Settings,
  Eye,
  Edit3,
  Plus,
  Save,
  Square,
  MousePointer,
  Undo,
  Redo,
  Upload,
  Download,
  Ruler,
  EyeOff,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { PropertyViewerFilters } from '@/components/property-viewer/PropertyViewerFilters';
import { PropertyList } from '@/components/property-viewer/PropertyList';
import { FloorPlanViewer } from '@/components/property-viewer/FloorPlanViewer';
import { PropertyDetailsPanel } from '@/components/property-viewer/PropertyDetailsPanel';
import { PropertyHoverInfo } from '@/components/property-viewer/PropertyHoverInfo';
import { usePropertyViewer } from '@/hooks/use-property-viewer';
import { cn } from '@/lib/utils';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { useToast } from '@/hooks/use-toast';
import type { Property } from '@/types/property-viewer';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';


const EditToolbar = ({
  activeTool,
  onToolChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onExport,
  onImport,
  showGrid,
  onToggleGrid,
  snapToGrid,
  onToggleSnap,
  gridSize,
  onGridSizeChange,
  showMeasurements,
  onToggleMeasurements,
  scale,
  onScaleChange,
}: {
  activeTool: string | null;
  onToolChange: (tool: 'create' | 'edit_nodes' | 'measure' | null) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  snapToGrid: boolean;
  onToggleSnap: () => void;
  gridSize: number;
  onGridSizeChange: (size: number) => void;
  showMeasurements: boolean;
  onToggleMeasurements: () => void;
  scale: number;
  onScaleChange: (scale: number) => void;
}) => {
  const handleToolClick = (tool: 'create' | 'edit_nodes' | 'measure') => {
    if (activeTool === tool) {
      onToolChange(null); // Deselect if clicking the same tool
    } else {
      onToolChange(tool);
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-3 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          {/* Main tools */}
          <Button
            onClick={() => handleToolClick('create')}
            variant={activeTool === 'create' ? 'default' : 'outline'}
            size="sm"
          >
            <Square className="mr-2 h-4 w-4" />
            Σχεδίαση Polygon
          </Button>
          <Button
            onClick={() => handleToolClick('edit_nodes')}
            variant={activeTool === 'edit_nodes' ? 'default' : 'outline'}
            size="sm"
          >
            <MousePointer className="mr-2 h-4 w-4" />
            Επεξεργασία Κόμβων
          </Button>
           <Button
            onClick={() => handleToolClick('measure')}
            variant={activeTool === 'measure' ? 'default' : 'outline'}
            size="sm"
          >
            <Ruler className="mr-2 h-4 w-4" />
            Μέτρηση
          </Button>
        </div>

        <div className="flex items-center gap-4">
           {/* Grid, Snap and Measurements controls */}
           <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Checkbox id="show-grid" checked={showGrid} onCheckedChange={onToggleGrid} />
              <Label htmlFor="show-grid">Grid</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="snap-to-grid" checked={snapToGrid} onCheckedChange={onToggleSnap} />
              <Label htmlFor="snap-to-grid">Snap</Label>
            </div>
             <div className="flex items-center gap-2">
              <Checkbox id="show-measurements" checked={showMeasurements} onCheckedChange={onToggleMeasurements} />
              <Label htmlFor="show-measurements">Εμβαδά</Label>
            </div>
            <div className="flex items-center gap-2 w-32">
                <Slider
                    value={[gridSize]}
                    onValueChange={(value) => onGridSizeChange(value[0])}
                    min={10}
                    max={50}
                    step={5}
                />
                <span className="text-xs">{gridSize}px</span>
            </div>
             <div className="flex items-center gap-2">
                <Label htmlFor="scale-input" className="text-xs">Κλίμακα:</Label>
                <Input
                    id="scale-input"
                    type="number"
                    value={scale}
                    onChange={(e) => onScaleChange(parseFloat(e.target.value))}
                    step="0.01"
                    className="w-20 h-7 text-xs"
                />
                <span className="text-xs">m/px</span>
            </div>
          </div>
          
          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Undo/Redo */}
          <Button
            onClick={onUndo}
            disabled={!canUndo}
            variant="outline"
            size="sm"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="mr-2 h-4 w-4" />
            Undo
          </Button>
          <Button
            onClick={onRedo}
            disabled={!canRedo}
            variant="outline"
            size="sm"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo className="mr-2 h-4 w-4" />
            Redo
          </Button>

          <Separator orientation="vertical" className="h-6 mx-2" />
          
          {/* Import/Export */}
          <input
            type="file"
            accept=".json"
            onChange={onImport}
            className="hidden"
            id="import-json-input"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('import-json-input')?.click()}
            title="Import JSON"
          >
             <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            title="Export JSON"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function PropertyViewerPage() {
  const { isEditor } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isEditMode, setIsEditMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTool, setActiveTool] = useState<'create' | 'edit_nodes' | 'measure' | null>(
    null
  );
  const { toast } = useToast();
  
  // Grid and Snap states
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [scale, setScale] = useState(0.1);

  const {
    properties,
    setProperties,
    selectedProperty,
    hoveredProperty,
    selectedFloor,
    isLoading,
    setSelectedProperty,
    setHoveredProperty,
    setSelectedFloor,
    undo,
    redo,
    canUndo,
    canRedo,
    saveHistory,
  } = usePropertyViewer();

  const [clipboard, setClipboard] = useState<Property | null>(null);

  // Keyboard shortcuts for Undo/Redo
  useKeyboardShortcut('z', undo, { metaKey: true, ctrlKey: true, shiftKey: false });
  useKeyboardShortcut('Z', redo, { metaKey: true, ctrlKey: true, shiftKey: true }); // Captures Shift+Z
  useKeyboardShortcut('y', redo, { metaKey: true, ctrlKey: true });


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    startTransition(() => {
      setSearchQuery(value);
    });
  };

  const filteredProperties = useMemo(() => {
    if (!properties) return [];
    return properties.filter((property) => {
      const query = searchQuery.toLowerCase();
      return (
        (property.name && property.name.toLowerCase().includes(query)) ||
        (property.type && property.type.toLowerCase().includes(query)) ||
        (property.building && property.building.toLowerCase().includes(query)) ||
        (property.floor && property.floor.toString().includes(query))
      );
    });
  }, [properties, searchQuery]);

  useEffect(() => {
    if (filteredProperties.length > 0 && !selectedProperty) {
      setSelectedProperty(filteredProperties[0].id);
    } else if (
      selectedProperty &&
      !filteredProperties.find((p) => p.id === selectedProperty)
    ) {
      setSelectedProperty(
        filteredProperties.length > 0 ? filteredProperties[0].id : null
      );
    } else if (filteredProperties.length === 0) {
      setSelectedProperty(null);
    }
  }, [filteredProperties, selectedProperty, setSelectedProperty]);

  const toggleEditMode = () => {
    if (!isEditor) return;
    setIsEditMode(!isEditMode);
    if (isEditMode) {
      setActiveTool(null); // Reset tool when exiting edit mode
    }
  };

  const handlePolygonCreated = useCallback((newProperty: Omit<Property, 'id'>) => {
    const propertyToAdd: Property = {
        ...newProperty,
        id: `prop-${Date.now()}`,
    };
      
    const newProperties = [...properties, propertyToAdd];
    setProperties(newProperties, 'Δημιουργία Polygon');
    toast.success('Το Polygon δημιουργήθηκε');
    setActiveTool(null);
    setSelectedProperty(propertyToAdd.id);
    }, [properties, setProperties, toast, setSelectedProperty]
  );
  
  const handlePolygonUpdated = useCallback((polygonId: string, vertices: Array<{ x: number; y: number }>) => {
    const newProperties = properties.map(p => 
        p.id === polygonId ? { ...p, vertices } : p
    );
    setProperties(newProperties, 'Επεξεργασία Polygon');
  }, [properties, setProperties]);

  const handleCopy = useCallback(() => {
    if (!selectedProperty) return;
    const propertyToCopy = properties.find(p => p.id === selectedProperty);
    if (propertyToCopy) {
      setClipboard(propertyToCopy);
      toast.success(`Το ακίνητο "${propertyToCopy.name}" αντιγράφηκε.`);
    }
  }, [selectedProperty, properties, toast]);

  const handlePaste = useCallback(() => {
    if (!clipboard) return;
    if (!selectedFloor) {
      toast.warning("Επιλέξτε έναν όροφο για επικόλληση.");
      return;
    }

    const newId = `prop-${Date.now()}`;
    const newProperty: Property = {
      ...clipboard,
      id: newId,
      name: `${clipboard.name} (Αντίγραφο)`,
      floorId: selectedFloor,
      vertices: clipboard.vertices.map(v => ({ x: v.x + 20, y: v.y + 20 })),
    };

    const newProperties = [...properties, newProperty];
    setProperties(newProperties, `Επικόλληση ${newProperty.name}`);
    setSelectedProperty(newId);
    toast.success(`Το ακίνητο "${newProperty.name}" επικολλήθηκε.`);
  }, [clipboard, properties, setProperties, selectedFloor, toast, setSelectedProperty]);
  
  const handleDuplicate = useCallback((propertyId: string) => {
     const propertyToDuplicate = properties.find(p => p.id === propertyId);
    if (!propertyToDuplicate) return;

    const newId = `prop-${Date.now()}`;
    const newProperty: Property = {
        ...propertyToDuplicate,
        id: newId,
        name: `${propertyToDuplicate.name} (Αντίγραφο)`,
        vertices: propertyToDuplicate.vertices.map(v => ({ x: v.x + 20, y: v.y + 20 })),
    };

    const newProperties = [...properties, newProperty];
    setProperties(newProperties, `Διπλασιασμός ${propertyToDuplicate.name}`);
    setSelectedProperty(newId);
    toast.success(`Ο διπλασιασμός του "${propertyToDuplicate.name}" έγινε με επιτυχία.`);
  }, [properties, setProperties, toast, setSelectedProperty]);

  const handleDelete = useCallback((propertyId: string) => {
    const propertyToDelete = properties.find(p => p.id === propertyId);
    if (!propertyToDelete) return;
    
    const newProperties = properties.filter(p => p.id !== propertyId);
    setProperties(newProperties, `Διαγραφή ${propertyToDelete.name}`);

    if(selectedProperty === propertyId) {
        setSelectedProperty(null);
    }
    toast.error(`Το ακίνητο "${propertyToDelete.name}" διαγράφηκε.`);
  }, [properties, setProperties, toast, selectedProperty, setSelectedProperty]);


  useKeyboardShortcut('c', handleCopy, { metaKey: true, ctrlKey: true });
  useKeyboardShortcut('v', handlePaste, { metaKey: true, ctrlKey: true });
  useKeyboardShortcut('d', () => selectedProperty && handleDuplicate(selectedProperty), { metaKey: true, ctrlKey: true });
  useKeyboardShortcut('Delete', () => selectedProperty && handleDelete(selectedProperty), { metaKey: false, ctrlKey: false });
  useKeyboardShortcut('Backspace', () => selectedProperty && handleDelete(selectedProperty), { metaKey: false, ctrlKey: false });
  
  const handleExport = useCallback(() => {
    if (!properties || properties.length === 0) {
      toast.warning('Δεν υπάρχουν δεδομένα για εξαγωγή.');
      return;
    }

    const dataToExport = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      properties: properties,
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataToExport, null, 2)
    )}`;
    
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `properties_export_${Date.now()}.json`;
    link.click();
    
    toast.success('Τα δεδομένα εξήχθησαν με επιτυχία.');
  }, [properties, toast]);
  
  const handleImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error('Could not read file content.');
        }
        const data = JSON.parse(text);

        // Basic validation
        if (!data.properties || !Array.isArray(data.properties)) {
          throw new Error('Invalid JSON format: "properties" array not found.');
        }
        
        // TODO: Add more robust validation with Zod or similar
        const importedProperties = data.properties as Property[];
        
        setProperties(importedProperties, 'Εισαγωγή από JSON');
        toast.success(`${importedProperties.length} ακίνητα εισήχθησαν με επιτυχία.`);

      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Σφάλμα εισαγωγής: ${error.message}`);
        } else {
          toast.error('Προέκυψε ένα άγνωστο σφάλμα κατά την εισαγωγή.');
        }
      } finally {
         // Reset file input to allow importing the same file again
        if(event.target) {
            event.target.value = '';
        }
      }
    };
    reader.readAsText(file);
  }, [setProperties, toast]);


  return (
    <div className="flex flex-col gap-4 h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Προβολή Ακινήτων
        </h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            size="sm"
          >
            <Filter className="mr-2 h-4 w-4" />
            Φίλτρα
          </Button>
          {isEditor && (
            <Button
              onClick={toggleEditMode}
              variant={isEditMode ? 'default' : 'outline'}
              size="sm"
            >
              {isEditMode ? (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Προβολή
                </>
              ) : (
                <>
                  <Edit3 className="mr-2 h-4 w-4" />
                  Επεξεργασία
                </>
              )}
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Ρυθμίσεις
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="px-6">
          <PropertyViewerFilters />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-12 gap-4 px-6 pb-6 overflow-hidden">
        {/* Properties List - 2/12 */}
        <div className="col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Αναζήτηση..."
                  className="pl-9 h-9"
                  value={inputValue}
                  onChange={handleSearchChange}
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <PropertyList
                properties={filteredProperties}
                selectedPropertyId={selectedProperty}
                onSelectProperty={setSelectedProperty}
                isLoading={isLoading || isPending}
              />
            </CardContent>
          </Card>
        </div>

        {/* Floor Plan Viewer - 8/12 */}
        <div className="col-span-8 flex flex-col gap-2">
          {isEditMode && (
            <EditToolbar
              activeTool={activeTool}
              onToolChange={setActiveTool}
              onUndo={undo}
              onRedo={redo}
              canUndo={canUndo}
              canRedo={canRedo}
              onExport={handleExport}
              onImport={handleImport}
              showGrid={showGrid}
              onToggleGrid={() => setShowGrid(!showGrid)}
              snapToGrid={snapToGrid}
              onToggleSnap={() => setSnapToGrid(!snapToGrid)}
              gridSize={gridSize}
              onGridSizeChange={setGridSize}
              showMeasurements={showMeasurements}
              onToggleMeasurements={() => setShowMeasurements(!showMeasurements)}
              scale={scale}
              onScaleChange={setScale}
            />
          )}
          <Card className="flex-1 h-full">
            <CardContent className="p-0 h-full">
              <FloorPlanViewer
                selectedPropertyId={selectedProperty}
                selectedFloorId={selectedFloor}
                onSelectFloor={setSelectedFloor}
                onHoverProperty={setHoveredProperty}
                activeTool={activeTool}
                onSelectProperty={setSelectedProperty}
                onPolygonCreated={handlePolygonCreated}
                onPolygonUpdated={handlePolygonUpdated}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                showGrid={showGrid}
                snapToGrid={snapToGrid}
                gridSize={gridSize}
                showMeasurements={showMeasurements}
                scale={scale}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - 2/12 split in half */}
        <div className="col-span-2 flex flex-col gap-4">
          {/* Selected Property Details - Top Half */}
          <div className="flex-1">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <h3 className="text-sm font-semibold">Επιλεγμένο Ακίνητο</h3>
              </CardHeader>
              <CardContent className="flex-1">
                <PropertyDetailsPanel propertyId={selectedProperty} />
              </CardContent>
            </Card>
          </div>

          {/* Hovered Property Info - Bottom Half */}
          <div className="flex-1">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <h3 className="text-sm font-semibold">Στοιχεία Hover</h3>
              </CardHeader>
              <CardContent className="flex-1">
                <PropertyHoverInfo propertyId={hoveredProperty} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
