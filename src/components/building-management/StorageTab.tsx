'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StorageList } from './StorageList';
import { StorageForm } from './StorageForm';
import { 
  Building2, 
  Search, 
  Filter, 
  Plus,
  BarChart3,
  Archive,
  MapPin,
  Car,
  Package
} from 'lucide-react';
import { StorageUnit, StorageType, StorageStatus } from '@/types/storage';

// Mock data based on the hierarchy you described
const mockStorageUnits: StorageUnit[] = [
  {
    id: 'A_A2_1',
    code: 'A_A2_1',
    type: 'storage',
    floor: 'Υπόγειο',
    area: 4.08,
    price: 1590.00,
    status: 'available',
    description: 'ΜΑΥΡΑΚΗ ΑΙΚΑΤΕΡΙΝΗ',
    building: 'ΚΤΙΡΙΟ Α',
    project: 'Παλαιολόγου',
    company: 'Ν.Χ.Γ. ΠΑΓΩΝΗΣ & ΣΙΑ Ο.Ε.',
    linkedProperty: null,
    coordinates: { x: 10, y: 15 },
    features: ['Ηλεκτρικό ρεύμα', 'Αεροθαλάμος']
  },
  {
    id: 'A_A2_2',
    code: 'A_A2_2', 
    type: 'storage',
    floor: 'Υπόγειο',
    area: 4.09,
    price: 1590.00,
    status: 'sold',
    description: 'ΜΑΥΡΑΚΗ ΑΙΚΑΤΕΡΙΝΗ',
    building: 'ΚΤΙΡΙΟ Α',
    project: 'Παλαιολόγου',
    company: 'Ν.Χ.Γ. ΠΑΓΩΝΗΣ & ΣΙΑ Ο.Ε.',
    linkedProperty: 'Δ2.1',
    coordinates: { x: 20, y: 15 },
    features: ['Ηλεκτρικό ρεύμα']
  },
  {
    id: 'A_A4_7',
    code: 'A_A4_7',
    type: 'storage',
    floor: 'Υπόγειο',
    area: 3.76,
    price: 1490.00,
    status: 'available',
    description: 'ΑΣΛΑΝΙΔΗΣ ΑΝΑΣΤΑΣΙΟΣ',
    building: 'ΚΤΙΡΙΟ Α',
    project: 'Παλαιολόγου',
    company: 'Ν.Χ.Γ. ΠΑΓΩΝΗΣ & ΣΙΑ Ο.Ε.',
    linkedProperty: null,
    coordinates: { x: 30, y: 10 },
    features: ['Φυσικός φωτισμός']
  }
];

interface StorageTabProps {
  building: {
    id: number;
    name: string;
    project: string;
    company: string;
  };
}

export function StorageTab({ building }: StorageTabProps) {
  const [storageUnits, setStorageUnits] = useState<StorageUnit[]>(mockStorageUnits.filter(u => u.type === 'storage'));
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<StorageStatus | 'all'>('all');
  const [filterFloor, setFilterFloor] = useState<string>('all');
  const [selectedUnit, setSelectedUnit] = useState<StorageUnit | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Filter storage units
  const filteredUnits = storageUnits.filter(unit => {
    const matchesSearch = unit.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         unit.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || unit.status === filterStatus;
    const matchesFloor = filterFloor === 'all' || unit.floor === filterFloor;
    
    return matchesSearch && matchesStatus && matchesFloor;
  });

  // Calculate statistics
  const stats = {
    total: storageUnits.length,
    available: storageUnits.filter(u => u.status === 'available').length,
    sold: storageUnits.filter(u => u.status === 'sold').length,
    reserved: storageUnits.filter(u => u.status === 'reserved').length,
    totalValue: storageUnits.reduce((sum, u) => sum + u.price, 0),
    totalArea: storageUnits.reduce((sum, u) => sum + u.area, 0)
  };

  const getStatusColor = (status: StorageStatus) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'sold': return 'bg-blue-500';
      case 'reserved': return 'bg-yellow-500';
      case 'maintenance': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: StorageStatus) => {
    switch (status) {
      case 'available': return 'Διαθέσιμο';
      case 'sold': return 'Πωλήθηκε';
      case 'reserved': return 'Κρατημένο';
      case 'maintenance': return 'Συντήρηση';
      default: return status;
    }
  };

  const getTypeIcon = (type: StorageType) => {
    return <Package className="w-4 h-4" />;
  };

  const getTypeLabel = (type: StorageType) => {
    return 'Αποθήκη';
  };

  const handleAddNew = () => {
    setSelectedUnit(null);
    setShowForm(true);
  };

  const handleEdit = (unit: StorageUnit) => {
    setSelectedUnit(unit);
    setShowForm(true);
  };

  const handleSave = (unit: StorageUnit) => {
    if (selectedUnit) {
      setStorageUnits(units => units.map(u => u.id === unit.id ? unit : u));
    } else {
      setStorageUnits(units => [...units, { ...unit, id: `new_${Date.now()}` }]);
    }
    setShowForm(false);
    setSelectedUnit(null);
  };

  const handleDelete = (unitId: string) => {
    setStorageUnits(units => units.filter(u => u.id !== unitId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Archive className="w-5 h-5" />
            Αποθήκες
          </h3>
          <p className="text-sm text-muted-foreground">
            Διαχείριση αποθηκών κτιρίου {building.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <Package className="w-4 h-4 mr-2" /> Λίστα
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('map')}
          >
            <MapPin className="w-4 h-4 mr-2" /> Χάρτης
          </Button>
          <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Νέα Αποθήκη
          </Button>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Σύνολο</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
            <div className="text-xs text-muted-foreground">Διαθέσιμες</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.sold}</div>
            <div className="text-xs text-muted-foreground">Πωλημένες</div>
          </CardContent>
        </Card>
         <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.reserved}</div>
            <div className="text-xs text-muted-foreground">Κρατημένες</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
              €{(stats.totalValue / 1000).toFixed(0)}K
            </div>
            <div className="text-xs text-muted-foreground">Συνολική Αξία</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {stats.totalArea.toFixed(0)}m²
            </div>
            <div className="text-xs text-muted-foreground">Συνολική Επιφάνεια</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Αναζήτηση κωδικού ή περιγραφής..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as StorageStatus | 'all')}
              className="h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="all">Όλες οι καταστάσεις</option>
              <option value="available">Διαθέσιμες</option>
              <option value="sold">Πωλημένες</option>
              <option value="reserved">Κρατημένες</option>
              <option value="maintenance">Συντήρηση</option>
            </select>

            <select
              value={filterFloor}
              onChange={(e) => setFilterFloor(e.target.value)}
              className="h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="all">Όλοι οι όροφοι</option>
              <option value="Υπόγειο">Υπόγειο</option>
              <option value="Ισόγειο">Ισόγειο</option>
              <option value="1ος">1ος Όροφος</option>
            </select>

            <Button variant="outline" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Εξαγωγή Αναφοράς
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Storage List/Map */}
      {viewMode === 'list' ? (
        <StorageList
          units={filteredUnits}
          onEdit={handleEdit}
          onDelete={handleDelete}
          getStatusColor={getStatusColor}
          getStatusLabel={getStatusLabel}
          getTypeIcon={getTypeIcon}
          getTypeLabel={getTypeLabel}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Χάρτης Αποθηκών</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Χάρτης αποθηκών</p>
                <p className="text-sm text-gray-400 mt-2">Θα αναπτυχθεί σύντομα</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Storage Form Modal */}
      {showForm && (
        <StorageForm
          unit={selectedUnit}
          building={building}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setSelectedUnit(null);
          }}
        />
      )}
    </div>
  );
}
