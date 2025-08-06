'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ParkingTableToolbar } from './ParkingTableToolbar';
import { ParkingSpotTable } from './ParkingSpotTable';
import type { ParkingSpot, ParkingFilters, ParkingStats } from '@/types/parking';
import { parkingSpots as mockParkingSpots } from './data';

interface ParkingTabProps {
  parkingSpots?: ParkingSpot[];
}

export function ParkingTab({ parkingSpots: initialSpots = mockParkingSpots }: ParkingTabProps) {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>(initialSpots);
  const [selectedSpots, setSelectedSpots] = useState<string[]>([]);
  const [filters, setFilters] = useState<ParkingFilters>({
    searchTerm: '',
    type: 'all',
    status: 'all',
    level: 'all',
    owner: '',
    minArea: null,
    maxArea: null,
    minPrice: null,
    maxPrice: null
  });

  const stats: ParkingStats = useMemo(() => {
    const totalSpots = parkingSpots.length;
    const soldSpots = parkingSpots.filter(spot => spot.status === 'sold').length;
    const ownerSpots = parkingSpots.filter(spot => spot.status === 'owner').length;
    const availableSpots = parkingSpots.filter(spot => spot.status === 'available').length;
    const reservedSpots = parkingSpots.filter(spot => spot.status === 'reserved').length;
    
    const totalValue = parkingSpots.reduce((sum, spot) => sum + spot.value, 0);
    const totalArea = parkingSpots.reduce((sum, spot) => sum + spot.area, 0);
    const averagePrice = totalSpots > 0 ? parkingSpots.reduce((sum, spot) => sum + spot.price, 0) / totalSpots : 0;

    const spotsByType = parkingSpots.reduce((acc, spot) => {
      acc[spot.type] = (acc[spot.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const spotsByLevel = parkingSpots.reduce((acc, spot) => {
      acc[spot.level] = (acc[spot.level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const spotsByStatus = parkingSpots.reduce((acc, spot) => {
      acc[spot.status] = (acc[spot.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalSpots,
      soldSpots,
      ownerSpots,
      availableSpots,
      reservedSpots,
      totalValue,
      totalArea,
      averagePrice,
      spotsByType,
      spotsByLevel,
      spotsByStatus
    };
  }, [parkingSpots]);

  const handleFiltersChange = (newFilters: Partial<ParkingFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleExport = () => {
    console.log('Εξαγωγή δεδομένων θέσεων στάθμευσης');
  };

  const handleImport = () => {
    console.log('Εισαγωγή δεδομένων θέσεων στάθμευσης');
  };

  const handleAdd = () => {
    console.log('Προσθήκη νέας θέσης στάθμευσης');
  };

  const handleDelete = () => {
    console.log('Διαγραφή επιλεγμένων θέσεων:', selectedSpots);
  };

  const handleSave = () => {
    console.log('Αποθήκευση αλλαγών');
  };

  const handleRefresh = () => {
    console.log('Ανανέωση δεδομένων');
  };

  const handleEdit = (spot: ParkingSpot) => {
    console.log('Επεξεργασία θέσης:', spot);
  };

  const handleView = (spot: ParkingSpot) => {
    console.log('Προβολή θέσης:', spot);
  };

  const handleViewFloorPlan = (spot: ParkingSpot) => {
    console.log('Προβολή κάτοψης για θέση:', spot);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Διαχείριση Θέσεων Στάθμευσης</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ParkingTableToolbar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            stats={stats}
            selectedCount={selectedSpots.length}
            onExport={handleExport}
            onImport={handleImport}
            onAdd={handleAdd}
            onDelete={handleDelete}
            onSave={handleSave}
            onRefresh={handleRefresh}
          />
          
          <ParkingSpotTable
            spots={parkingSpots}
            filters={filters}
            selectedSpots={selectedSpots}
            onSelectionChange={setSelectedSpots}
            onEdit={handleEdit}
            onView={handleView}
            onViewFloorPlan={handleViewFloorPlan}
          />
        </CardContent>
      </Card>
    </div>
  );
}