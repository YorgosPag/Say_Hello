export type ParkingStatus = 'available' | 'sold' | 'reserved';

export interface ParkingSpot {
    id: string;
    code: string;
    floor: string;
    area: number;
    price: number;
    status: ParkingStatus;
    linkedProperty: string | null;
}
