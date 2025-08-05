'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  Euro,
  Building,
  Star,
  Package,
  Zap,
  Shield,
  Lightbulb
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
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
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
  getTypeLabel
}: StorageCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  const getPricePerSqm = () => {
    if (unit.area === 0) return 0;
    return Math.round(unit.price / unit.area);
  };

  const getFeatureIcon = (feature: string) => {
    if (feature.toLowerCase().includes('ηλεκτρικό') || feature.toLowerCase().includes('ρεύμα')) return <Zap className="w-3 h-3" />;
    if (feature.toLowerCase().includes('φωτισμός')) return <Lightbulb className="w-3 h-3" />;
    if (feature.toLowerCase().includes('ασφάλεια') || feature.toLowerCase().includes('προστασία')) return <Shield className="w-3 h-3" />;
    if (feature.toLowerCase().includes('πρίζα') || feature.toLowerCase().includes('φόρτιση')) return <Zap className="w-3 h-3" />;
    return <Package className="w-3 h-3" />;
  };

  const getTypeColor = (type: StorageType) => {
    return type === 'storage' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300' : 'bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300';
  };

  return (
    <Card 
      className={cn(
        "relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg group border",
        isSelected ? "ring-2 ring-primary shadow-lg border-primary" : "hover:border-primary/50",
        "transform hover:scale-[1.02]"
      )}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-3 left-3 z-20">
         <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
          className="bg-white/80 backdrop-blur-sm"
        />
      </div>

      <div className={cn(
        "h-24 relative overflow-hidden",
        unit.type === 'storage' 
          ? "bg-gradient-to-br from-purple-100 via-blue-50 to-purple-50 dark:from-purple-950/50 dark:via-blue-950/20 dark:to-purple-950/50" 
          : "bg-gradient-to-br from-orange-100 via-yellow-50 to-orange-50 dark:from-orange-950/50 dark:via-yellow-950/20 dark:to-orange-950/50"
      )}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 left-2 w-6 h-6 bg-white/30 rounded-full"></div>
          <div className="absolute top-4 right-4 w-4 h-4 bg-white/20 rounded-full"></div>
          <div className="absolute bottom-2 left-6 w-3 h-3 bg-white/40 rounded-full"></div>
          <div className="absolute bottom-3 right-2 w-8 h-8 bg-white/20 rounded-full"></div>
        </div>

        <div className="absolute top-3 right-3 z-10 transition-opacity duration-200 opacity-0 group-hover:opacity-100">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                <Eye className="w-4 h-4 mr-2" />
                Προβολή / Επεξεργασία
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setIsFavorite(!isFavorite); }}>
                <Star className={cn("w-4 h-4 mr-2", isFavorite && "text-yellow-500 fill-yellow-500")} />
                {isFavorite ? 'Αφαίρεση από αγαπημένα' : 'Προσθήκη στα αγαπημένα'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Διαγραφή
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="absolute bottom-3 left-3 right-3 z-10 flex justify-between items-end">
          <div className='flex items-center gap-2'>
            <Badge 
              className={cn(
                "text-xs text-white shadow-sm pointer-events-none",
                getStatusColor(unit.status)
              )}
            >
              {getStatusLabel(unit.status)}
            </Badge>
             <Badge variant="outline" className={cn("text-xs pointer-events-none", getTypeColor(unit.type))}>
              {getTypeLabel(unit.type)}
            </Badge>
          </div>
          {isFavorite && (
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 filter drop-shadow-sm" />
          )}
        </div>
        
        {isSelected && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-purple-500" />
        )}
      </div>

      <CardContent className="p-4 space-y-4">
        <div>
          <h4 className="font-semibold text-foreground truncate group-hover:text-primary">
            {unit.code}
          </h4>
          <p className="text-sm text-muted-foreground h-10 line-clamp-2">
            {unit.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Building className="w-4 h-4" />
              <span>Όροφος</span>
            </div>
            <div className="font-medium text-foreground">{unit.floor}</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Ruler className="w-4 h-4" />
              <span>Επιφάνεια</span>
            </div>
            <div className="font-medium text-foreground">{formatArea(unit.area)}</div>
          </div>
        </div>

        <div className="pt-3 border-t">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Τιμή</div>
              <div className="font-bold text-green-600 dark:text-green-400 text-lg">{formatPrice(unit.price)}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">€/m²</div>
              <div className="font-medium text-muted-foreground">{getPricePerSqm().toLocaleString('el-GR')}€</div>
            </div>
          </div>
        </div>

        {unit.linkedProperty && (
          <div className="pt-3 border-t">
            <div className="flex items-center gap-1.5 text-sm">
              <Link className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Συνδεδεμένο:</span>
              <span className="font-medium text-primary">{unit.linkedProperty}</span>
            </div>
          </div>
        )}

        {unit.features && unit.features.length > 0 && (
          <div className="pt-3 border-t">
            <div className="flex flex-wrap gap-2">
              {unit.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant='outline' className="font-normal">
                  {getFeatureIcon(feature)}
                  {feature}
                </Badge>
              ))}
              {unit.features.length > 3 && (
                <Badge variant='outline' className="font-normal">
                  +{unit.features.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none transition-opacity duration-300",
        isHovered ? "opacity-100" : "opacity-0"
      )} />
    </Card>
  );
}
