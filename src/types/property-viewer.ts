
export interface Property {
    id: string;
    name: string;
    type: string;
    building: string;
    floor: number;
    status: 'for-sale' | 'for-rent' | 'sold' | 'rented' | 'reserved';
    price?: number;
    area?: number;
    project: string;
    description?: string;
    buildingId: string;
    floorId: string;
    vertices: Array<{x: number, y: number}>;
  }
  
