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
  Lightbulb,
  Car
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
import { StorageCardHeader } from './StorageCard/StorageCardHeader';
import { StorageCardContent } from './StorageCard/StorageCardContent';
import { StorageCardOverlay } from './StorageCard/StorageCardOverlay';

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
      <StorageCardHeader 
        unit={unit}
        isSelected={isSelected}
        isFavorite={isFavorite}
        onSelect={onSelect}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleFavorite={() => setIsFavorite(!isFavorite)}
        getStatusColor={getStatusColor}
        getStatusLabel={getStatusLabel}
        getTypeLabel={getTypeLabel}
      />

      <StorageCardContent 
        unit={unit}
        getTypeIcon={getTypeIcon}
      />
      
      <StorageCardOverlay isHovered={isHovered} />
    </Card>
  );
}
