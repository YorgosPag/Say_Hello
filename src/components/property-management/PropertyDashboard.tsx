'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  TrendingUp, 
  CheckCircle, 
  Euro, 
  BarChart3, 
  Building, 
  MapPin, 
  Activity,
  Package,
  Users,
  Ruler
} from 'lucide-react';
import type { PropertyStats } from '@/types/property';

interface PropertyDashboardProps {
  stats: PropertyStats;
}

export function PropertyDashboard({ stats }: PropertyDashboardProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `€${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `€${(amount / 1000).toFixed(0)}K`;
    }
    return `€${amount.toLocaleString('el-GR')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sold': return 'bg-green-500';
      case 'available': return 'bg-gray-500';
      case 'reserved': return 'bg-yellow-500';
      case 'owner': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'sold': return 'Πουλημένες';
      case 'available': return 'Διαθέσιμες';
      case 'reserved': return 'Κρατημένες';
      case 'owner': return 'Οικοπεδούχου';
      default: return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'apartment': return 'Διαμερίσματα';
      case 'studio': return 'Στούντιο';
      case 'maisonette': return 'Μεζονέτες';
      case 'shop': return 'Καταστήματα';
      case 'office': return 'Γραφεία';
      case 'storage': return 'Αποθήκες';
      default: return type;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
      <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Συνολικές Μονάδες</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.totalProperties}</p>
            </div>
            <Home className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-gray-200 bg-gray-50/50 dark:bg-gray-950/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Διαθέσιμες</p>
              <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{stats.availableProperties}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-gray-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-green-600 dark:text-green-400">Συνολική Αξία</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{formatCurrency(stats.totalValue)}</p>
            </div>
            <Euro className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-purple-600 dark:text-purple-400">Συνολικό Εμβαδόν</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{Math.round(stats.totalArea)} m²</p>
            </div>
            <Ruler className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-red-600 dark:text-red-400">Πουλημένες</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.soldProperties}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-red-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-orange-600 dark:text-orange-400">Μέση Τιμή</p>
              <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{formatCurrency(stats.averagePrice)}</p>
            </div>
            <Euro className="h-8 w-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Κατάσταση Μονάδων</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(stats.propertiesByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
                  <span className="text-xs">{getStatusLabel(status)}</span>
                </div>
                <span className="text-xs font-medium">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Τύποι Μονάδων</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.propertiesByType).map(([type, count]) => (
              <Badge key={type} variant="secondary" className="flex items-center gap-1">
                {getTypeLabel(type)} ({count})
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Κατανομή ανά Όροφο</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(stats.propertiesByFloor).slice(0, 5).map(([floor, count]) => (
              <div key={floor} className="flex items-center justify-between">
                <span className="text-xs truncate flex-1">{floor}</span>
                <Badge variant="outline" className="ml-2">{count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Αποθήκες</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
           <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xl font-bold">{stats.totalStorageUnits}</p>
                <p className="text-xs text-muted-foreground">Σύνολο</p>
              </div>
              <div>
                <p className="text-xl font-bold">{stats.availableStorageUnits}</p>
                <p className="text-xs text-muted-foreground">Διαθέσιμες</p>
              </div>
              <div>
                <p className="text-xl font-bold">{stats.soldStorageUnits}</p>
                <p className="text-xs text-muted-foreground">Πουλημένες</p>
              </div>
           </div>
        </CardContent>
      </Card>

    </div>
  );
}
