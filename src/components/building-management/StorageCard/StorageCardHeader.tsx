'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Eye, 
  Edit, 
  Trash2, 
  MoreVertical,
  Star,
  Package,
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
import { getTypeColor } from './StorageCardUtils';

interface StorageCardHeaderProps {
    unit: StorageUnit;
    isSelected: boolean;
    isFavorite: boolean;
    onSelect: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onToggleFavorite: () => void;
    getStatusColor: (status: StorageStatus) => string;
    getStatusLabel: (status: StorageStatus) => string;
    getTypeLabel: (type: StorageType) => string;
}

export function StorageCardHeader({
    unit,
    isSelected,
    isFavorite,
    onSelect,
    onEdit,
    onDelete,
    onToggleFavorite,
    getStatusColor,
    getStatusLabel,
    getTypeLabel
}: StorageCardHeaderProps) {
    return (
        <>
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
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}>
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
        </>
    );
}
