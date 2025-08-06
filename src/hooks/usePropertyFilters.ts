'use client';

import { useMemo } from 'react';
import type { Property, PropertyStats } from '@/types/property';

export function usePropertyFilters(
  properties: Property[],
  searchTerm: string,
  filterType: string,
  filterStatus: string,
  filterFloor: string,
  filterBuilding: string
) {
  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      const searchMatch = searchTerm.trim() === '' ||
        property.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.buyer?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const typeMatch = filterType === 'all' || property.type === filterType;
      const statusMatch = filterStatus === 'all' || property.status === filterStatus;
      const floorMatch = filterFloor === 'all' || property.floor === filterFloor;
      const buildingMatch = filterBuilding === 'all' || property.building === filterBuilding;

      return searchMatch && typeMatch && statusMatch && floorMatch && buildingMatch;
    });
  }, [properties, searchTerm, filterType, filterStatus, filterFloor, filterBuilding]);

  const stats: PropertyStats = useMemo(() => {
    const totalProperties = properties.length;
    const availableProperties = properties.filter(p => p.status === 'available').length;
    const soldProperties = properties.filter(p => p.status === 'sold').length;
    const totalValue = properties.reduce((sum, p) => sum + p.price, 0);
    const totalArea = properties.reduce((sum, p) => sum + p.area, 0);
    const averagePrice = totalProperties > 0 ? totalValue / totalProperties : 0;
    
    const propertiesByStatus = properties.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const propertiesByType = properties.reduce((acc, p) => {
      acc[p.type] = (acc[p.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const propertiesByFloor = properties.reduce((acc, p) => {
      acc[p.floor] = (acc[p.floor] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const allStorageUnits = properties.flatMap(p => p.storageUnits);
    const totalStorageUnits = allStorageUnits.length;
    const availableStorageUnits = allStorageUnits.filter(s => s.status === 'available').length;
    const soldStorageUnits = allStorageUnits.filter(s => s.status === 'sold').length;


    return {
      totalProperties,
      availableProperties,
      soldProperties,
      totalValue,
      totalArea,
      averagePrice,
      propertiesByStatus,
      propertiesByType,
      propertiesByFloor,
      totalStorageUnits,
      availableStorageUnits,
      soldStorageUnits,
      uniqueBuildings: [...new Set(properties.map(p => p.building))].length,
      reserved: properties.filter(p => p.status === 'reserved').length,
    };
  }, [properties]);

  return { filteredProperties, stats };
}
