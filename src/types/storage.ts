export type StorageType = 'storage';
export type StorageStatus = 'available' | 'sold' | 'reserved' | 'maintenance';

export interface StorageUnit {
  id: string;
  code: string;
  type: StorageType;
  floor: string;
  area: number;
  price: number;
  status: StorageStatus;
  description: string;
  building: string;
  project: string;
  company: string;
  linkedProperty: string | null;
  coordinates?: { x: number; y: number };
  features?: string[];
}