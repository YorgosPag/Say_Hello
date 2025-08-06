'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import { ParkingTableHeader } from './ParkingTableHeader';
import type { ParkingSpot, ParkingFilters, ParkingStatus, ParkingSpotType } from '@/types/parking';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PARKING_STATUS_LABELS, PARKING_TYPE_LABELS, PARKING_STATUS_COLORS } from '@/types/parking';

interface ParkingSpotTableProps {
    spots: ParkingSpot[];
    filters: ParkingFilters;
    selectedSpots: string[];
    onSelectionChange: (ids: string[]) => void;
    onEdit: (spot: ParkingSpot) => void;
    onView: (spot: ParkingSpot) => void;
    onViewFloorPlan: (spot: ParkingSpot) => void;
}

export function ParkingSpotTable({
  spots,
  filters,
  selectedSpots,
  onSelectionChange,
  onEdit,
  onView,
  onViewFloorPlan
}: ParkingSpotTableProps) {

    const filteredSpots = useMemo(() => {
        return spots.filter(spot => {
            const searchTermLower = filters.searchTerm.toLowerCase();
            const matchesSearch =
                spot.code.toLowerCase().includes(searchTermLower) ||
                spot.owner.toLowerCase().includes(searchTermLower) ||
                spot.propertyCode?.toLowerCase().includes(searchTermLower);

            const matchesType = filters.type === 'all' || spot.type === filters.type;
            const matchesStatus = filters.status === 'all' || spot.status === filters.status;
            const matchesLevel = filters.level === 'all' || spot.level === filters.level;

            return matchesSearch && matchesType && matchesStatus && matchesLevel;
        });
    }, [spots, filters]);

    const handleSelectAll = (checked: boolean | 'indeterminate') => {
        if (checked === true) {
            onSelectionChange(filteredSpots.map(spot => spot.id));
        } else {
            onSelectionChange([]);
        }
    };

    const handleSelectRow = (id: string) => {
        const newSelection = selectedSpots.includes(id)
            ? selectedSpots.filter(spotId => spotId !== id)
            : [...selectedSpots, id];
        onSelectionChange(newSelection);
    };
    
    const allSelected = selectedSpots.length === filteredSpots.length && filteredSpots.length > 0;
    const isIndeterminate = selectedSpots.length > 0 && !allSelected;

    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">
                            <Checkbox
                                checked={allSelected}
                                onCheckedChange={handleSelectAll}
                                aria-label="Επιλογή όλων"
                            />
                        </TableHead>
                        <TableHead>Κωδικός</TableHead>
                        <TableHead>Επίπεδο</TableHead>
                        <TableHead>Εμβαδόν (m²)</TableHead>
                        <TableHead>Τιμή (€)</TableHead>
                        <TableHead>Κατάσταση</TableHead>
                        <TableHead>Συνδεδεμένο Ακίνητο</TableHead>
                        <TableHead>Ιδιοκτήτης</TableHead>
                        <TableHead className="text-right">Ενέργειες</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredSpots.map((spot) => (
                        <TableRow key={spot.id} data-state={selectedSpots.includes(spot.id) ? 'selected' : ''}>
                            <TableCell>
                                <Checkbox
                                    checked={selectedSpots.includes(spot.id)}
                                    onCheckedChange={() => handleSelectRow(spot.id)}
                                />
                            </TableCell>
                            <TableCell className="font-medium">{spot.code}</TableCell>
                            <TableCell>{spot.level}</TableCell>
                            <TableCell>{spot.area.toFixed(2)}</TableCell>
                            <TableCell>{spot.price.toLocaleString('el-GR')}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className={PARKING_STATUS_COLORS[spot.status]}>
                                    {PARKING_STATUS_LABELS[spot.status]}
                                </Badge>
                            </TableCell>
                            <TableCell>{spot.propertyCode || '-'}</TableCell>
                             <TableCell className="max-w-[150px] truncate">{spot.owner}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onView(spot)}>
                                            <Eye className="mr-2 h-4 w-4" /> Προβολή
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onEdit(spot)}>
                                            <Pencil className="mr-2 h-4 w-4" /> Επεξεργασία
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onViewFloorPlan(spot)}>
                                            <Eye className="mr-2 h-4 w-4" /> Κάτοψη
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600">
                                            <Trash2 className="mr-2 h-4 w-4" /> Διαγραφή
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
