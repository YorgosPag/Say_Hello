'use client';

import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MapPin } from "lucide-react";
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Building } from '../BuildingsPageContent';
import { formatCurrency, getProgressColor } from './BuildingCardUtils';


interface BuildingCardContentProps {
  building: Building;
}

export function BuildingCardContent({ building }: BuildingCardContentProps) {
  return (
    <CardContent className="p-6 space-y-4">
      {/* Title and Description */}
      <div>
        <h3 className="font-semibold text-lg leading-tight line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
          {building.name}
        </h3>
        {building.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {building.description}
          </p>
        )}
      </div>

      {/* Location */}
      {building.address && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="truncate">{building.address}, {building.city}</span>
        </div>
      )}

      {/* Progress Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Πρόοδος Έργου</span>
          <span className={cn("font-semibold", getProgressColor(building.progress))}>
            {building.progress}%
          </span>
        </div>
        <Progress value={building.progress} className="h-2" />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Επιφάνεια</p>
          <p className="text-sm font-semibold">{building.totalArea.toLocaleString('el-GR')} m²</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Όροφοι</p>
          <p className="text-sm font-semibold">{building.floors}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Μονάδες</p>
          <p className="text-sm font-semibold">{building.units}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Αξία</p>
          <Tooltip>
            <TooltipTrigger>
              <p className="text-sm font-semibold text-green-600">
                {formatCurrency(building.totalValue)}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>Συνολική αξία έργου</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Features Tags */}
      {building.features && building.features.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-2">
          {building.features.slice(0, 3).map((feature, index) => (
            <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
              {feature}
            </Badge>
          ))}
          {building.features.length > 3 && (
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              +{building.features.length - 3}
            </Badge>
          )}
        </div>
      )}
    </CardContent>
  );
}
