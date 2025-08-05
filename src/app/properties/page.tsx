
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

const EditToolbar = ({
  activeTool,
  onToolChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onExport,
  onImport,
}: {
  activeTool: string | null;
  onToolChange: (tool: 'create' | 'edit_nodes' | null) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const handleToolClick = (tool: 'create' | 'edit_nodes') => {
    if (activeTool === tool) {
      onToolChange(null); // Deselect if clicking the same tool
    } else {
      onToolChange(tool);
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
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
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground mr-4">
            {activeTool === 'create' &&
              'Click για κόμβους, διπλό click ή click στο πρώτο σημείο για κλείσιμο'}
            {activeTool === 'edit_nodes' &&
              'Click σε polygon για επεξεργασία • Shift+Click για διαγραφή • Right Click σε ακμή για νέο κόμβο'}
          </div>
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
  const [activeTool, setActiveTool] = useState<'create' | 'edit_nodes' | null>(
    null
  );
  const { toast } = useToast();

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

  // Keyboard shortcuts for Undo/Redo
  useKeyboardShortcut('z', undo, { metaKey: true, ctrlKey: true });
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

  const handlePolygonCreated = useCallback((vertices: Array<{ x: number; y: number }>) => {
      saveHistory('Δημιουργία Polygon');
      toast.success('Το Polygon δημιουργήθηκε');
      setActiveTool(null);
    }, [saveHistory, toast]
  );
  
  const handlePolygonUpdated = useCallback((polygonId: string, vertices: Array<{ x: number; y: number }>) => {
    saveHistory('Επεξεργασία Polygon');
  }, [saveHistory]);
  
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
            />
          )}
          <Card className="flex-1 h-full">
            <CardContent className="p-0 h-full">
              <FloorPlanViewer
                selectedPropertyId={selectedProperty}
                selectedFloorId={selectedFloor}
                onSelectFloor={setSelectedFloor}
                onHoverProperty={setHoveredProperty}
                isNodeEditMode={activeTool === 'edit_nodes'}
                onSelectProperty={setSelectedProperty}
                isCreatingPolygon={activeTool === 'create'}
                onPolygonCreated={handlePolygonCreated}
                onPolygonUpdated={handlePolygonUpdated}
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
