'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Filter, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function ParkingTableToolbar() {
    return (
        <div className="flex items-center gap-2">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Αναζήτηση..." className="pl-8 w-40" />
            </div>
            <Select>
                <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Φίλτρο κατάστασης" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Όλες οι καταστάσεις</SelectItem>
                    <SelectItem value="available">Διαθέσιμες</SelectItem>
                    <SelectItem value="sold">Πωλημένες</SelectItem>
                    <SelectItem value="reserved">Κρατημένες</SelectItem>
                </SelectContent>
            </Select>
            <Button variant="outline">
                <Trash2 className="h-4 w-4 mr-2" />
                Διαγραφή
            </Button>
            <Button>
                <Plus className="h-4 w-4 mr-2" />
                Νέα Θέση
            </Button>
        </div>
    );
}
