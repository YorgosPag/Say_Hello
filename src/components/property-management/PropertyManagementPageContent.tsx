'use client';

import React, { useState } from 'react';
import { PropertyList } from './PropertyList';
import { PropertyDetails } from './PropertyDetails';
import { PropertyPageHeader } from './page/PropertyPageHeader';
import { PropertyPageFilters } from './page/PropertyPageFilters';
import { PropertyDashboard } from './PropertyDashboard';
import { usePropertyFilters } from '@/hooks/usePropertyFilters';
import type { Property, PropertyFilters } from '@/types/property';

// Mock data - This would typically come from a hook or props
const propertiesData: Property[] = [
  {
    id: '1',
    code: 'B_D1.1',
    type: 'apartment',
    building: 'B',
    floor: 'Ισόγειο',
    orientation: 'south',
    rooms: 2,
    bathrooms: 1,
    area: 57.75,
    balconyArea: 9.83,
    price: 100000,
    status: 'sold',
    buyer: 'ΚΕΛΕΣΙΔΗ ΠΕΛΛΕΝΑ',
    saleDate: '2008-01-25',
    salePrice: 104490,
    projectId: 1,
    buildingId: 'B',
    floorNumber: 0,
    description: 'Διαμέρισμα δύο δωματίων στο ισόγειο',
    features: ['Μπαλκόνι', 'Αποθήκη', 'Θέση Στάθμευσης'],
    storageUnits: [
      {
        id: 's1',
        code: 'B_A1.7',
        type: 'storage',
        floor: 'Υπόγειο',
        area: 11.16,
        price: 4490,
        status: 'sold',
        linkedPropertyId: '1',
        buyer: 'ΚΕΛΕΣΙΔΗ ΠΕΛΛΕΝΑ',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15'
      }
    ],
    parkingSpots: ['B_S1.7'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    code: 'B_D1.2',
    type: 'apartment',
    building: 'B',
    floor: 'Ισόγειο',
    orientation: 'north',
    rooms: 2,
    bathrooms: 1,
    area: 62.20,
    balconyArea: 8.50,
    price: 105000,
    status: 'sold',
    buyer: 'ΠΑΠΑΔΟΠΟΥΛΟΣ ΓΕΩΡΓΙΟΣ',
    saleDate: '2008-03-15',
    salePrice: 110000,
    projectId: 1,
    buildingId: 'B',
    floorNumber: 0,
    description: 'Διαμέρισμα δύο δωματίων στο ισόγειο',
    features: ['Μπαλκόνι', 'Αποθήκη'],
    storageUnits: [
      {
        id: 's2',
        code: 'B_A1.2',
        type: 'storage',
        floor: 'Υπόγειο',
        area: 10.35,
        price: 4200,
        status: 'sold',
        linkedPropertyId: '2',
        buyer: 'ΠΑΠΑΔΟΠΟΥΛΟΣ ΓΕΩΡΓΙΟΣ',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15'
      }
    ],
    parkingSpots: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '3',
    code: 'B_D1.3',
    type: 'apartment',
    building: 'B',
    floor: 'Ισόγειο',
    orientation: 'east',
    rooms: 1,
    bathrooms: 1,
    area: 45.30,
    balconyArea: 6.20,
    price: 85000,
    status: 'available',
    projectId: 1,
    buildingId: 'B',
    floorNumber: 0,
    description: 'Διαμέρισμα ενός δωματίου στο ισόγειο',
    features: ['Μπαλκόνι'],
    storageUnits: [],
    parkingSpots: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '4',
    code: 'B_D1.7',
    type: 'apartment',
    building: 'B',
    floor: 'Ισόγειο',
    orientation: 'west',
    rooms: 3,
    bathrooms: 2,
    area: 78.45,
    balconyArea: 12.30,
    price: 125000,
    status: 'owner',
    projectId: 1,
    buildingId: 'B',
    floorNumber: 0,
    description: 'Διαμέρισμα τριών δωματίων στο ισόγειο',
    features: ['Μεγάλο Μπαλκόνι', 'Αποθήκη', 'Θέση Στάθμευσης'],
    storageUnits: [
      {
        id: 's4',
        code: 'B_A1.7',
        type: 'storage',
        floor: 'Υπόγειο',
        area: 15.20,
        price: 0,
        status: 'owner',
        linkedPropertyId: '4',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15'
      }
    ],
    parkingSpots: ['B_S1.7'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  }
];

export function PropertyManagementPageContent() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(propertiesData.length > 0 ? propertiesData[0] : null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showDashboard, setShowDashboard] = useState(true);

  // State for filters
  const [filters, setFilters] = useState<PropertyFilters>({
    searchTerm: '',
    type: 'all',
    status: 'all',
    floor: 'all',
    building: 'all',
    minArea: null,
    maxArea: null,
    minPrice: null,
    maxPrice: null
  });
  
  const { filteredProperties, stats } = usePropertyFilters(
    propertiesData, 
    filters.searchTerm, 
    filters.type, 
    filters.status, 
    filters.floor,
    filters.building
  );

  const handleFiltersChange = (newFilters: Partial<PropertyFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
  };

  return (
    <div className="h-full flex flex-col bg-background p-4 gap-4">
      <div className="shrink-0">
        <PropertyPageHeader 
          showDashboard={showDashboard}
          setShowDashboard={setShowDashboard}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        <div className="mt-4">
          <PropertyPageFilters
            searchTerm={filters.searchTerm}
            setSearchTerm={(term) => handleFiltersChange({ searchTerm: term })}
            filterType={filters.type}
            setFilterType={(type) => handleFiltersChange({ type })}
            filterStatus={filters.status}
            setFilterStatus={(status) => handleFiltersChange({ status })}
            filterFloor={filters.floor}
            setFilterFloor={(floor) => handleFiltersChange({ floor })}
            filterBuilding={filters.building}
            setFilterBuilding={(building) => handleFiltersChange({ building })}
          />
        </div>
      </div>
      
      {showDashboard && <div className="shrink-0"><PropertyDashboard stats={stats} /></div>}

      <div className="flex-1 flex overflow-hidden gap-4">
        {viewMode === 'list' ? (
          <>
            <PropertyList
              properties={filteredProperties}
              selectedProperty={selectedProperty}
              onSelectProperty={handleSelectProperty}
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
            {selectedProperty && (
              <PropertyDetails property={selectedProperty} />
            )}
          </>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProperties.map((property) => (
                <div
                  key={property.id}
                  className="p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedProperty(property)}
                >
                  <h3 className="font-semibold">{property.code}</h3>
                  <p className="text-sm text-muted-foreground">{property.description}</p>
                  <p className="text-sm">Εμβαδόν: {property.area} m²</p>
                  <p className="text-sm">Τιμή: €{property.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
