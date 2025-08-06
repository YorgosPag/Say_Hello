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
    return {
      totalProperties: properties.length,
      available: properties.filter(p => p.status === 'available').length,
      sold: properties.filter(p => p.status === 'sold').length,
      reserved: properties.filter(p => p.status === 'reserved').length,
      totalValue: properties.reduce((sum, p) => sum + p.price, 0),
      uniqueBuildings: [...new Set(properties.map(p => p.building))].length,
    };
  }, [properties]);

  return { filteredProperties, stats };
}
