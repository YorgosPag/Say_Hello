
export type UnitStatus = 'for-sale' | 'for-rent' | 'sold' | 'rented' | 'reserved';
export type UnitType = 'Στούντιο' | 'Γκαρσονιέρα' | 'Διαμέρισμα 2Δ' | 'Διαμέρισμα 3Δ' | 'Μεζονέτα' | 'Κατάστημα' | 'Αποθήκη';

export interface Unit {
  id: string;
  name: string;
  type: UnitType;
  building: string;
  floor: number;
  status: UnitStatus;
  price?: number;
  area?: number;
  project: string;
  description?: string;
  buildingId: string;
  floorId: string;
}

export type UnitSortKey = 'name' | 'price' | 'area';
