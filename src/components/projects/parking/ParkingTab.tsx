'use client';

import React, { useState } from 'react';
import { ParkingSpotTable } from './ParkingSpotTable';
import { parkingSpots as initialParkingSpots } from './data';
import type { ParkingSpot } from '@/types/parking';

export function ParkingTab() {
    const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>(initialParkingSpots);
    const [selectedSpots, setSelectedSpots] = useState<string[]>([]);

    return (
        <div className="space-y-4">
            <ParkingSpotTable 
                parkingSpots={parkingSpots}
                selectedSpots={selectedSpots}
                setSelectedSpots={setSelectedSpots}
            />
        </div>
    );
}
