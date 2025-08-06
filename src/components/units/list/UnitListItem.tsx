
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
  Home,
  Building
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Property } from '@/types/property-viewer';
import { getStatusColor, getStatusLabel, formatCurrency, formatDate, formatFloorLabel } from '@/components/building-management/BuildingCard/BuildingCardUtils';


interface UnitListItemProps {
  unit: Property;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
}

const propertyTypeIcons: { [key: string]: React.ElementType } = {
  'Στούντιο': Home,
  'Γκαρσονιέρα': Home,
  'Διαμέρισμα 2Δ': Home,
  'Διαμέρισμα 3Δ': Home,
  'Μεζονέτα': Building,
  'Κατάστημα': Building,
  'Αποθήκη': Building,
};

export function UnitListItem({
    unit,
    isSelected,
    isFavorite,
    onSelect,
    onToggleFavorite
}: UnitListItemProps) {

    const IconComponent = propertyTypeIcons[unit.type] || Home;

    return (
        <TooltipProvider>
            <div
                className={cn(
                    "relative p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md group",
                    isSelected
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-sm"
                    : "border-border hover:border-blue-300 bg-card hover:bg-accent/50"
                )}
                onClick={onSelect}
            >
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleFavorite();
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 p-1"
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
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{isFavorite ? 'Αφαίρεση από αγαπημένα' : 'Προσθήκη στα αγαπημένα'}</p>
                    </TooltipContent>
                </Tooltip>

                <div className="mb-3">
                    <div className="flex items-start gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <IconComponent className="w-4 h-4 text-muted-foreground" />
                            <h4 className="font-medium text-sm text-foreground leading-tight line-clamp-2">
                            {unit.name}
                            </h4>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                    <Badge 
                        variant="secondary" 
                        className={cn("text-xs text-white", getStatusColor(unit.status))}
                    >
                        {getStatusLabel(unit.status)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                        {unit.type}
                    </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                        <p className="text-muted-foreground">Επιφάνεια</p>
                        <p className="font-medium">{unit.area?.toLocaleString('el-GR')} m²</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Όροφος</p>
                        <p className="font-medium">{formatFloorLabel(unit.floor)}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Αξία</p>
                        <p className="font-medium">{formatCurrency(unit.price || 0)}</p>
                    </div>
                </div>

                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onMouseDown={(e) => e.stopPropagation()}>
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
        </TooltipProvider>
    );
}
