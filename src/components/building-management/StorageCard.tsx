'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Eye, 
  Edit, 
  Trash2, 
  MoreVertical,
  Link,
  Ruler,
  Euro
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { StorageUnit, StorageType, StorageStatus } from '@/types/storage';
import { cn } from '@/lib/utils';

interface StorageCardProps {
  unit: StorageUnit;
  isSelected: boolean;
  onSelect: (unitId: string) => void;
  onEdit: (unit: StorageUnit) => void;
  onDelete: (unitId: string) => void;
  getStatusColor: (status: StorageStatus) => string;
  getStatusLabel: (status: StorageStatus) => string;
  getTypeIcon: (type: StorageType) => React.ReactNode;
  getTypeLabel: (type: StorageType) => string;
}

export function StorageCard({ 
  unit, 
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  getStatusColor,
  getStatusLabel,
  getTypeIcon,
  getTypeLabel,
}: StorageCardProps) {

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatArea = (area: number) => {
    return `${area.toFixed(2)} m²`;
  };

  return (
    <Card 
      className={cn(
        "relative group transition-all duration-200 hover:shadow-lg",
        isSelected ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800" : "border-border"
      )}
    >
      <div className="absolute top-2 left-2 z-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(unit.id)}
          className="bg-white/80"
        />
      </div>
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/80">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(unit)}>
              <Eye className="w-4 h-4 mr-2" />
              Προβολή
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(unit)}>
              <Edit className="w-4 h-4 mr-2" />
              Επεξεργασία
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(unit.id)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Διαγραφή
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getTypeIcon(unit.type)}
            <span className="text-base font-bold">{unit.code}</span>
          </div>
          <Badge className={cn("text-xs text-white", getStatusColor(unit.status))}>
            {getStatusLabel(unit.status)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground truncate h-5">{unit.description}</p>
        
        <div className="grid grid-cols-2 gap-3 text-sm pt-2 border-t">
          <div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Ruler className="w-3 h-3" />
              <span>Επιφάνεια</span>
            </div>
            <p className="font-medium">{formatArea(unit.area)}</p>
          </div>
          <div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Euro className="w-3 h-3" />
              <span>Τιμή</span>
            </div>
            <p className="font-medium">{formatPrice(unit.price)}</p>
          </div>
        </div>

        {unit.linkedProperty && (
          <div className="flex items-center gap-2 text-sm text-blue-600 pt-2 border-t">
            <Link className="w-4 h-4" />
            <span>Συνδεδεμένο με: {unit.linkedProperty}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
