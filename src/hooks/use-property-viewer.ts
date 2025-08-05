
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type { Property } from '@/types/property-viewer';

interface Floor {
  id: string;
  name: string;
  level: number;
  buildingId: string;
  properties: string[];
}

interface Building {
  id: string;
  name: string;
  projectId: string;
  floors: string[];
}

interface Project {
  id: string;
  name: string;
  buildings: string[];
}

// Mock data - θα αντικατασταθεί με πραγματικά δεδομένα
const mockProjects: Project[] = [
  {
    id: "project-1",
    name: "Έργο Κέντρο",
    buildings: ["building-1", "building-2"]
  },
  {
    id: "project-2",
    name: "Έργο Νότος",
    buildings: ["building-3"]
  }
];

const mockBuildings: Building[] = [
  {
    id: "building-1",
    name: "Κτίριο Alpha",
    projectId: "project-1",
    floors: ["floor-1", "floor-2", "floor-3"]
  },
  {
    id: "building-2",
    name: "Κτίριο Beta", 
    projectId: "project-1",
    floors: ["floor-4", "floor-5"]
  },
  {
    id: "building-3",
    name: "Κτίριο Gamma",
    projectId: "project-2",
    floors: ["floor-6", "floor-7"]
  }
];

const mockFloors: Floor[] = [
  {
    id: "floor-1",
    name: "Υπόγειο",
    level: -1,
    buildingId: "building-1",
    properties: ["prop-1"]
  },
  {
    id: "floor-2",
    name: "Ισόγειο",
    level: 0,
    buildingId: "building-1",
    properties: ["prop-4"]
  },
  {
    id: "floor-3",
    name: "1ος Όροφος",
    level: 1,
    buildingId: "building-1",
    properties: ["prop-2"]
  },
  {
    id: "floor-4",
    name: "2ος Όροφος",
    level: 2,
    buildingId: "building-2",
    properties: ["prop-3"]
  },
  {
    id: "floor-5",
    name: "3ος Όροφος",
    level: 3,
    buildingId: "building-2",
    properties: ["prop-5"]
  },
  {
    id: "floor-6",
    name: "Ισόγειο",
    level: 0,
    buildingId: "building-3",
    properties: []
  },
  {
    id: "floor-7",
    name: "1ος Όροφος",
    level: 1,
    buildingId: "building-3",
    properties: []
  }
];

const mockProperties: Property[] = [
  {
    id: "prop-1",
    name: "Αποθήκη A1",
    type: "Αποθήκη",
    building: "Κτίριο Alpha",
    floor: -1,
    project: "Έργο Κέντρο",
    status: "for-sale",
    price: 25000,
    area: 15,
    description: "Ευρύχωρη αποθήκη με εύκολη πρόσβαση",
    buildingId: "building-1",
    floorId: "floor-1",
    vertices: [{x: 50, y: 50}, {x: 150, y: 50}, {x: 150, y: 120}, {x: 50, y: 120}],
  },
  {
    id: "prop-2",
    name: "Στούντιο B1",
    type: "Στούντιο",
    building: "Κτίριο Alpha",
    floor: 1,
    project: "Έργο Κέντρο",
    status: "sold",
    price: 85000,
    area: 35,
    description: "Μοντέρνο στούντιο με θέα",
    buildingId: "building-1",
    floorId: "floor-3",
    vertices: [{x: 180, y: 50}, {x: 300, y: 50}, {x: 300, y: 150}, {x: 180, y: 150}],
  },
  {
    id: "prop-3",
    name: "Διαμέρισμα 2Δ C1",
    type: "Διαμέρισμα 2Δ",
    building: "Κτίριο Beta",
    floor: 2,
    project: "Έργο Κέντρο",
    status: "for-rent",
    price: 750,
    area: 65,
    description: "Ηλιόλουστο διαμέρισμα",
    buildingId: "building-2",
    floorId: "floor-4",
    vertices: [{x: 50, y: 180}, {x: 250, y: 180}, {x: 250, y: 300}, {x: 50, y: 300}],
  },
  {
    id: "prop-4",
    name: "Κατάστημα D1",
    type: "Κατάστημα",
    building: "Κτίριο Alpha",
    floor: 0,
    project: "Έργο Κέντρο",
    status: "rented",
    price: 1200,
    area: 45,
    description: "Κατάστημα σε εμπορικό δρόμο",
    buildingId: "building-1",
    floorId: "floor-2",
    vertices: [{x: 320, y: 50}, {x: 450, y: 50}, {x: 450, y: 200}, {x: 320, y: 200}],
  },
  {
    id: "prop-5",
    name: "Μεζονέτα E1",
    type: "Μεζονέτα",
    building: "Κτίριο Beta",
    floor: 3,
    project: "Έργο Κέντρο",
    status: "reserved",
    price: 145000,
    area: 85,
    description: "Πολυτελής μεζονέτα",
    buildingId: "building-2",
    floorId: "floor-5",
    vertices: [{x: 280, y: 220}, {x: 480, y: 220}, {x: 480, y: 350}, {x: 280, y: 350}],
  }
];

type HistoryState = {
  properties: Property[];
  description: string;
};

// Custom hook for managing state with undo/redo
function useUndoableState<T>(initialState: T) {
  const [history, setHistory] = useState<HistoryState[]>([
    { properties: initialState as any, description: "Initial State" },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const setState = useCallback((newState: Property[], description: string) => {
    // If we are in the middle of history, discard future states
    const newHistory = history.slice(0, currentIndex + 1);
    
    setHistory([...newHistory, { properties: newState, description }]);
    setCurrentIndex(newHistory.length);
  }, [history, currentIndex]);
  
  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, history.length]);

  return {
    state: history[currentIndex].properties,
    setState,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
  };
}


interface UsePropertyViewerReturn {
  // Data
  properties: Property[];
  setProperties: (newState: Property[], description: string) => void;
  projects: Project[];
  buildings: Building[];
  floors: Floor[];
  
  // Loading states
  isLoading: boolean;
  
  // Selected states
  selectedProperty: string | null;
  hoveredProperty: string | null;
  selectedFloor: string | null;
  selectedBuilding: string | null;
  selectedProject: string | null;
  
  // Setters
  setSelectedProperty: (propertyId: string | null) => void;
  setHoveredProperty: (propertyId: string | null) => void;
  setSelectedFloor: (floorId: string | null) => void;
  setSelectedBuilding: (buildingId: string | null) => void;
  setSelectedProject: (projectId: string | null) => void;
  
  // Computed values
  currentFloor: Floor | null;
  currentBuilding: Building | null;
  currentProject: Project | null;
  floorProperties: Property[];
  
  // Actions
  refreshData: () => Promise<void>;

  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  saveHistory: (description: string) => void;
}

export function usePropertyViewer(): UsePropertyViewerReturn {
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    state: properties, 
    setState: setProperties, 
    undo, 
    redo, 
    canUndo, 
    canRedo 
  } = useUndoableState<Property[]>(mockProperties);

  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<string | null>("floor-1");
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>("building-1");
  const [selectedProject, setSelectedProject] = useState<string | null>("project-1");

  // Simulate loading state on initial mount
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const saveHistory = (description: string) => {
    setProperties(properties, description);
  };


  // Computed values
  const currentProject = useMemo(() => {
    return mockProjects.find(p => p.id === selectedProject) || null;
  }, [selectedProject]);

  const currentBuilding = useMemo(() => {
    return mockBuildings.find(b => b.id === selectedBuilding) || null;
  }, [selectedBuilding]);

  const currentFloor = useMemo(() => {
    return mockFloors.find(f => f.id === selectedFloor) || null;
  }, [selectedFloor]);

  const floorProperties = useMemo(() => {
    if (!currentFloor) return [];
    return properties.filter(p => p.floorId === currentFloor.id);
  }, [currentFloor, properties]);

  // Auto-select first property when floor changes
  useEffect(() => {
    if (floorProperties.length > 0 && !selectedProperty) {
      setSelectedProperty(floorProperties[0].id);
    } else if (selectedProperty && !floorProperties.find(p => p.id === selectedProperty)) {
      setSelectedProperty(floorProperties.length > 0 ? floorProperties[0].id : null);
    } else if (floorProperties.length === 0) {
      setSelectedProperty(null);
    }
  }, [floorProperties, selectedProperty]);

  // Auto-update building when floor changes
  useEffect(() => {
    if (currentFloor && currentFloor.buildingId !== selectedBuilding) {
      setSelectedBuilding(currentFloor.buildingId);
    }
  }, [currentFloor, selectedBuilding]);

  // Auto-update project when building changes
  useEffect(() => {
    if (currentBuilding && currentBuilding.projectId !== selectedProject) {
      setSelectedProject(currentBuilding.projectId);
    }
  }, [currentBuilding, selectedProject]);

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return {
    // Data
    properties,
    setProperties,
    projects: mockProjects,
    buildings: mockBuildings,
    floors: mockFloors,
    
    // Loading states
    isLoading,
    
    // Selected states
    selectedProperty,
    hoveredProperty,
    selectedFloor,
    selectedBuilding,
    selectedProject,
    
    // Setters
    setSelectedProperty,
    setHoveredProperty,
    setSelectedFloor,
    setSelectedBuilding,
    setSelectedProject,
    
    // Computed values
    currentFloor,
    currentBuilding,
    currentProject,
    floorProperties,
    
    // Actions
    refreshData,

    // Undo/Redo
    undo,
    redo,
    canUndo,
    canRedo,
    saveHistory,
  };
}
