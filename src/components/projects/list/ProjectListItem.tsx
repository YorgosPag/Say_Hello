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
  Euro,
  Heart,
  Briefcase
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
import { PROJECT_STATUS_LABELS, type Project, type ProjectStatus } from '@/types/project';


interface ProjectListItemProps {
  project: Project;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
}

const getStatusColor = (status: ProjectStatus): string => {
    const colors: Record<ProjectStatus, string> = {
      planning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      on_hold: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status];
};


export function ProjectListItem({
    project,
    isSelected,
    isFavorite,
    onSelect,
    onToggleFavorite
}: ProjectListItemProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('el-GR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };
    
    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('el-GR');
    };

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
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                        <h4 className="font-medium text-sm text-foreground leading-tight line-clamp-2">
                        {project.name}
                        </h4>
                    </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                    <Badge 
                        variant="secondary" 
                        className={cn("text-xs", getStatusColor(project.status))}
                    >
                        {PROJECT_STATUS_LABELS[project.status]}
                    </Badge>
                     <Badge variant="outline" className="text-xs">
                        {project.company}
                    </Badge>
                    </div>

                    {project.address && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{project.address}, {project.city}</span>
                    </div>
                    )}
                </div>

                <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Πρόοδος</span>
                    <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                    <p className="text-muted-foreground">Επιφάνεια</p>
                    <p className="font-medium">{project.totalArea.toLocaleString('el-GR')} m²</p>
                    </div>
                    <div>
                    <p className="text-muted-foreground">Αξία</p>
                    <p className="font-medium text-green-600">{formatCurrency(project.totalValue)}</p>
                    </div>
                </div>

                {project.completionDate && (
                    <div className="mt-3 pt-3 border-t border-border/50">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>Παράδοση: {formatDate(project.completionDate)}</span>
                    </div>
                    </div>
                )}

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
