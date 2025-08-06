import type { ParkingSpot } from '@/types/parking';

export const parkingSpots: ParkingSpot[] = [
    { id: 'p1', code: 'P-01', floor: 'Υπόγειο 1', area: 12.5, price: 15000, status: 'available', linkedProperty: 'A-101' },
    { id: 'p2', code: 'P-02', floor: 'Υπόγειο 1', area: 12.5, price: 15000, status: 'sold', linkedProperty: 'A-102' },
    { id: 'p3', code: 'P-03', floor: 'Υπόγειο 1', area: 13.0, price: 16000, status: 'reserved', linkedProperty: 'A-103' },
    { id: 'p4', code: 'P-04', floor: 'Υπόγειο 2', area: 12.0, price: 14000, status: 'available', linkedProperty: null },
    { id: 'p5', code: 'P-05', floor: 'Υπόγειο 2', area: 12.0, price: 14000, status: 'available', linkedProperty: null },
];
