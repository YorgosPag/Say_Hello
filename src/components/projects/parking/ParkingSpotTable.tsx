'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { ParkingTableHeader } from './ParkingTableHeader';
import type { ParkingSpot, ParkingStatus } from '@/types/parking';

const statusConfig: Record<ParkingStatus, { label: string; className: string }> = {
    available: { label: 'Διαθέσιμο', className: 'bg-green-100 text-green-800' },
    sold: { label: 'Πωλημένο', className: 'bg-red-100 text-red-800' },
    reserved: { label: 'Κρατημένο', className: 'bg-yellow-100 text-yellow-800' },
};

interface ParkingSpotTableProps {
    parkingSpots: ParkingSpot[];
    selectedSpots: string[];
    setSelectedSpots: (ids: string[]) => void;
}

export function ParkingSpotTable({ parkingSpots, selectedSpots, setSelectedSpots }: ParkingSpotTableProps) {
    const handleSelectAll = (checked: boolean | 'indeterminate') => {
        if (checked === true) {
            setSelectedSpots(parkingSpots.map(spot => spot.id));
        } else {
            setSelectedSpots([]);
        }
    };

    const handleSelectRow = (id: string) => {
        const newSelection = selectedSpots.includes(id)
            ? selectedSpots.filter(spotId => spotId !== id)
            : [...selectedSpots, id];
        setSelectedSpots(newSelection);
    };
    
    const allSelected = selectedSpots.length === parkingSpots.length && parkingSpots.length > 0;
    const isIndeterminate = selectedSpots.length > 0 && !allSelected;

    return (
        <Card>
            <CardHeader>
                <ParkingTableHeader />
            </CardHeader>
            <CardContent>
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">
                                    <Checkbox
                                        checked={allSelected}
                                        onCheckedChange={handleSelectAll}
                                        data-state={isIndeterminate ? 'indeterminate' : (allSelected ? 'checked' : 'unchecked')}

                                    />
                                </TableHead>
                                <TableHead>Κωδικός</TableHead>
                                <TableHead>Όροφος</TableHead>
                                <TableHead>Εμβαδόν (m²)</TableHead>
                                <TableHead>Τιμή (€)</TableHead>
                                <TableHead>Κατάσταση</TableHead>
                                <TableHead>Συνδεδεμένο Ακίνητο</TableHead>
                                <TableHead className="text-right">Ενέργειες</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {parkingSpots.map((spot) => (
                                <TableRow key={spot.id} data-state={selectedSpots.includes(spot.id) ? 'selected' : ''}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedSpots.includes(spot.id)}
                                            onCheckedChange={() => handleSelectRow(spot.id)}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{spot.code}</TableCell>
                                    <TableCell>{spot.floor}</TableCell>
                                    <TableCell>{spot.area.toFixed(2)}</TableCell>
                                    <TableCell>{spot.price.toLocaleString('el-GR')}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={statusConfig[spot.status].className}>
                                            {statusConfig[spot.status].label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{spot.linkedProperty || '-'}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
