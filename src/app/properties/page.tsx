"use client";

import { useState, useMemo, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Settings, Eye, Edit3, Plus, Save, Square, MousePointer } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { PropertyViewerFilters } from "@/components/property-viewer/PropertyViewerFilters";
import { PropertyList } from "@/components/property-viewer/PropertyList";
import { FloorPlanViewer } from "@/components/property-viewer/FloorPlanViewer";
import { PropertyDetailsPanel } from "@/components/property-viewer/PropertyDetailsPanel";
import { PropertyHoverInfo } from "@/components/property-viewer/PropertyHoverInfo";
import { usePropertyViewer } from "@/hooks/use-property-viewer";
import { cn } from "@/lib/utils";

const EditToolbar = ({ activeTool, onToolChange }: { activeTool: string | null, onToolChange: (tool: 'create' | 'edit_nodes' | null) => void }) => {
    
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
                
                <div className="text-sm text-muted-foreground">
                    {activeTool === 'create' && "Click για κόμβους, διπλό click ή click στο πρώτο σημείο για κλείσιμο"}
                    {activeTool === 'edit_nodes' && "Click σε polygon για επεξεργασία • Shift+Click για διαγραφή • Right Click σε ακμή για νέο κόμβο"}
                </div>
            </CardContent>
        </Card>
    );
};


export default function PropertyViewerPage() {
  const { isEditor } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isEditMode, setIsEditMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTool, setActiveTool] = useState<'create' | 'edit_nodes' | null>(null);

  const {
    properties,
    selectedProperty,
    hoveredProperty,
    selectedFloor,
    isLoading,
    setSelectedProperty,
    setHoveredProperty,
    setSelectedFloor,
  } = usePropertyViewer();

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
      setSelectedProperty(filteredProperties.length > 0 ? filteredProperties[0].id : null);
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
  
  const handlePolygonCreated = (vertices: Array<{ x: number; y: number }>) => {
    console.log("New polygon created with vertices:", vertices);
    setActiveTool(null); // Exit creation mode after finishing
  };

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
              variant={isEditMode ? "default" : "outline"}
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
           {isEditMode && <EditToolbar activeTool={activeTool} onToolChange={setActiveTool} />}
          <Card className="flex-1 h-full">
            <CardContent className="p-0 h-full">
              <FloorPlanViewer
                selectedPropertyId={selectedProperty}
                selectedFloorId={selectedFloor}
                onSelectFloor={setSelectedFloor}
                onHoverProperty={setHoveredProperty}
                hoveredPropertyId={hoveredProperty}
                isNodeEditMode={activeTool === 'edit_nodes'}
                onSelectProperty={setSelectedProperty}
                isCreatingPolygon={activeTool === 'create'}
                onPolygonCreated={handlePolygonCreated}
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
