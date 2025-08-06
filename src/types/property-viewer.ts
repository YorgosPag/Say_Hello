

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
    isMultiLevel?: boolean;
    levels?: { floorId: string; name: string; }[];
    parentPropertyId?: string;
  }
  

// Extended type for full details panel, can be expanded later
export interface ExtendedPropertyDetails extends Property {
    rooms?: number;
    bathrooms?: number;
    features?: string[];
    owner?: {
      name: string;
      phone?: string;
      email?: string;
    };
    agent?: {
      name: string;
      phone?: string;
      email?: string;
    };
    dates?: {
      created: string;
      updated: string;
      available?: string;
    };
    documents?: Array<{
      id: string;
      name: string;
      type: string;
      url: string;
    }>;
  }
  
