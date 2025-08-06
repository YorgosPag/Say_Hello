'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface PropertyPageFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterFloor: string;
  setFilterFloor: (floor: string) => void;
  filterBuilding: string;
  setFilterBuilding: (building: string) => void;
}

export function PropertyPageFilters({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  filterFloor,
  setFilterFloor,
  filterBuilding,
  setFilterBuilding
}: PropertyPageFiltersProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Αναζήτηση κωδικού, ιδιοκτήτη..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={filterBuilding} onValueChange={setFilterBuilding}>
            <SelectTrigger>
              <SelectValue placeholder="Κτίριο" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Όλα τα Κτίρια</SelectItem>
              <SelectItem value="A">Κτίριο A</SelectItem>
              <SelectItem value="B">Κτίριο B</SelectItem>
              <SelectItem value="C">Κτίριο C</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterFloor} onValueChange={setFilterFloor}>
            <SelectTrigger>
              <SelectValue placeholder="Όροφος" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Όλοι οι Όροφοι</SelectItem>
              <SelectItem value="Υπόγειο">Υπόγειο</SelectItem>
              <SelectItem value="Ισόγειο">Ισόγειο</SelectItem>
              <SelectItem value="1ος">1ος Όροφος</SelectItem>
              <SelectItem value="2ος">2ος Όροφος</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Κατάσταση" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Όλες οι Καταστάσεις</SelectItem>
              <SelectItem value="available">Διαθέσιμο</SelectItem>
              <SelectItem value="sold">Πουλημένο</SelectItem>
              <SelectItem value="owner">Οικοπεδούχου</SelectItem>
              <SelectItem value="reserved">Κρατημένο</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
