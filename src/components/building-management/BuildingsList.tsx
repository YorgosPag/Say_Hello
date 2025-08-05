
'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from '@/components/ui/scroll-area';
import { BuildingToolbar } from './BuildingToolbar';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  TrendingUp,
  Users,
  Home,
  Eye,
  Edit,
  MoreVertical,
  Star,
  DollarSign
} from "lucide-react";
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Building } from './BuildingsPageContent';
import { getStatusColor, getStatusLabel, getCategoryIcon, getCategoryLabel, formatDate, formatCurrency } from './BuildingCard/BuildingCardUtils';


interface BuildingsListProps {
  buildings: Building[];
  selectedBuilding: Building;
  onSelectBuilding?: (building: Building) => void;
}

export function BuildingsList({ 
  buildings, 
  selectedBuilding, 
  onSelectBuilding,
}: BuildingsListProps) {
  const [favorites, setFavorites] = useState<number[]>([1]);
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'value' | 'area'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const toggleFavorite = (buildingId: number) => {
    setFavorites(prev => 
      prev.includes(buildingId) 
        ? prev.filter(id => id !== buildingId)
        : [...prev, buildingId]
    );
  };

  const sortedBuildings = [...buildings].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'progress':
        aValue = a.progress;
        bValue = b.progress;
        break;
      case 'value':
        aValue = a.totalValue;
        bValue = b.totalValue;
        break;
      case 'area':
        aValue = a.totalArea;
        bValue = b.totalArea;
        break;
      default:
        return 0;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      return sortOrder === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    }
  });

  return (
    <div className="w-[420px] bg-card border-r flex flex-col shrink-0 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-sm">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Κτίρια</h3>
            <p className="text-xs text-muted-foreground">
              {buildings.length} κτίρια συνολικά
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 border">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-xs text-muted-foreground">Ενεργά</p>
                <p className="text-sm font-semibold">
                  {buildings.filter(b => b.status === 'active' || b.status === 'construction').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 border">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground">Αξία</p>
                <p className="text-sm font-semibold">
                  €{(buildings.reduce((sum, b) => sum + b.totalValue, 0) / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs px-2 py-1 rounded border bg-background"
          >
            <option value="name">Όνομα</option>
            <option value="progress">Πρόοδος</option>
            <option value="value">Αξία</option>
            <option value="area">Επιφάνεια</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="text-xs h-7"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <BuildingToolbar />

      {/* Buildings List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {sortedBuildings.map((building) => {
            const CategoryIcon = getCategoryIcon(building.category);
            return (
              <div
                key={building.id}
                className={cn(
                  "relative p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md group",
                  selectedBuilding?.id === building.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-sm"
                    : "border-border hover:border-blue-300 bg-card hover:bg-accent/50"
                )}
                onClick={() => onSelectBuilding?.(building)}
              >
                {/* Favorite Star */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(building.id);
                  }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Star
                    className={cn(
                      "w-4 h-4 transition-colors",
                      favorites.includes(building.id)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-400 hover:text-yellow-500"
                    )}
                  />
                </button>

                {/* Building Header */}
                <div className="mb-3">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <CategoryIcon className="w-4 h-4" />
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

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Πρόοδος</span>
                    <span className="font-medium">{building.progress}%</span>
                  </div>
                  <Progress value={building.progress} className="h-2" />
                </div>

                {/* Building Stats */}
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

                {/* Completion Date */}
                {building.completionDate && (
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>Παράδοση: {formatDate(building.completionDate)}</span>
                    </div>
                  </div>
                )}

                {/* Action Menu */}
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
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toggleFavorite(building.id); }}>
                        <Star className="w-4 h-4 mr-2" />
                        {favorites.includes(building.id) ? 'Αφαίρεση από αγαπημένα' : 'Προσθήκη στα αγαπημένα'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Selected Indicator */}
                {selectedBuilding?.id === building.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full" />
                )}
              </div>
          )})}
        </div>
      </ScrollArea>
    </div>
  );
}

    
