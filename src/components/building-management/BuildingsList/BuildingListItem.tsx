
'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, 
  Calendar, 
  Eye,
  Edit,
  MoreVertical,
  Star,
} from "lucide-react";
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Building } from '../BuildingsPageContent';
import { getStatusColor, getStatusLabel, getCategoryIcon, getCategoryLabel, formatDate, formatCurrency } from '../BuildingCard/BuildingCardUtils';


interface BuildingListItemProps {
  building: Building;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
}

export function BuildingListItem({
    building,
    isSelected,
    isFavorite,
    onSelect,
    onToggleFavorite
}: BuildingListItemProps) {

    const CategoryIcon = getCategoryIcon(building.category);

    return (
        <div
            className={cn(
                "relative p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md group",
                isSelected
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-sm"
                : "border-border hover:border-blue-300 bg-card hover:bg-accent/50"
            )}
            onClick={onSelect}
        >
            <button
                onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
                }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
                <Star
                className={cn(
                    "w-4 h-4 transition-colors",
                    isFavorite
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-400 hover:text-yellow-500"
                )}
                />
            </button>

            <div className="mb-3">
                <div className="flex items-start gap-2 mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <CategoryIcon className="w-4 h-4 text-muted-foreground" />
                    <h4 className="font-medium text-sm text-foreground leading-tight line-clamp-2">
                    {building.name}
                    </h4>
                </div>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                <Badge 
                    variant="secondary" 
                    className={cn("text-xs", getStatusColor(building.status).replace('bg-', 'bg-') + ' text-white')}
                >
                    {getStatusLabel(building.status)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                    {getCategoryLabel(building.category)}
                </Badge>
                </div>

                {building.address && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{building.address}</span>
                </div>
                )}
            </div>

            <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Πρόοδος</span>
                <span className="font-medium">{building.progress}%</span>
                </div>
                <Progress value={building.progress} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                <p className="text-muted-foreground">Επιφάνεια</p>
                <p className="font-medium">{building.totalArea.toLocaleString('el-GR')} m²</p>
                </div>
                <div>
                <p className="text-muted-foreground">Όροφοι</p>
                <p className="font-medium">{building.floors}</p>
                </div>
                <div>
                <p className="text-muted-foreground">Μονάδες</p>
                <p className="font-medium">{building.units}</p>
                </div>
                <div>
                <p className="text-muted-foreground">Αξία</p>
                <p className="font-medium">{formatCurrency(building.totalValue)}</p>
                </div>
            </div>

            {building.completionDate && (
                <div className="mt-3 pt-3 border-t border-border/50">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>Παράδοση: {formatDate(building.completionDate)}</span>
                </div>
                </div>
            )}

            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreVertical className="w-3 h-3" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                    <Eye className="w-4 h-4 mr-2" />
                    Προβολή
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                    <Edit className="w-4 h-4 mr-2" />
                    Επεξεργασία
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}>
                    <Star className="w-4 h-4 mr-2" />
                    {isFavorite ? 'Αφαίρεση από αγαπημένα' : 'Προσθήκη στα αγαπημένα'}
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {isSelected && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full" />
            )}
        </div>
    );
}

