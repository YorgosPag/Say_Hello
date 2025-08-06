'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, Building, CheckCircle, Clock, Euro } from 'lucide-react';
import type { PropertyStats } from '@/types/property';

interface PropertyDashboardProps {
  stats: PropertyStats;
}

export function PropertyDashboard({ stats }: PropertyDashboardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Home className="h-6 w-6 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{stats.totalProperties}</p>
              <p className="text-xs text-muted-foreground">Σύνολο Ακινήτων</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Building className="h-6 w-6 text-purple-500" />
            <div>
              <p className="text-2xl font-bold">{stats.uniqueBuildings}</p>
              <p className="text-xs text-muted-foreground">Κτίρια</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{stats.available}</p>
              <p className="text-xs text-muted-foreground">Διαθέσιμα</p>
            </div>
          </div>
        </CardContent>
      </Card>
       <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-yellow-500" />
            <div>
              <p className="text-2xl font-bold">{stats.reserved}</p>
              <p className="text-xs text-muted-foreground">Κρατημένα</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Euro className="h-6 w-6 text-gray-500" />
            <div>
              <p className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</p>
              <p className="text-xs text-muted-foreground">Συνολική Αξία</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
