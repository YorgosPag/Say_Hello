export interface StorageUnitStub {
    id: string;
    code: string;
    type: 'storage' | 'parking';
    floor: string;
    area: number;
    price: number;
    status: 'sold' | 'available' | 'reserved' | 'owner';
    linkedPropertyId?: string;
    buyer?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Property {
  id: string;
  code: string;
  type: 'apartment' | 'maisonette' | 'store';
  building: string;
  floor: string;
  orientation: 'north' | 'south' | 'east' | 'west';
  rooms: number;
  bathrooms: number;
  area: number;
  balconyArea: number;
  price: number;
  status: 'sold' | 'available' | 'reserved' | 'owner';
  buyer?: string;
  saleDate?: string;
  salePrice?: number;
  projectId: number;
  buildingId: string;
  floorNumber: number;
  description: string;
  features: string[];
  storageUnits: StorageUnitStub[];
  parkingSpots: string[]; // IDs of parking spots
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilters {
  searchTerm: string;
  type: string;
  status: string;
  floor: string;
  building: string;
  minArea: number | null;
  maxArea: number | null;
  minPrice: number | null;
  maxPrice: number | null;
}

export interface PropertyStats {
  totalProperties: number;
  available: number;
  sold: number;
  reserved: number;
  totalValue: number;
  uniqueBuildings: number;
}
