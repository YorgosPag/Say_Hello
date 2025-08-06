'use client';

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Briefcase, Building, MapPin, Calendar, Check, Clock, Play, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Project, ProjectStatus } from '@/types/project';
import { PROJECT_STATUS_LABELS } from '@/types/project';

interface ProjectListItemProps {
    project: Project;
    isSelected: boolean;
    onSelect: () => void;
    isFavorite: boolean;
    onToggleFavorite: () => void;
}

const statusConfig: Record<ProjectStatus, { icon: React.ElementType, color: string }> = {
    'planning': { icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
    'in_progress': { icon: Play, color: 'bg-blue-100 text-blue-800' },
    'completed': { icon: Check, color: 'bg-green-100 text-green-800' },
    'on_hold': { icon: Clock, color: 'bg-gray-100 text-gray-800' },
    'cancelled': { icon: Check, color: 'bg-red-100 text-red-800' },
};

export function ProjectListItem({ 
    project, 
    isSelected, 
    onSelect,
    isFavorite,
    onToggleFavorite,
}: ProjectListItemProps) {
    const { icon: StatusIcon, color: statusColor } = statusConfig[project.status];
    
    return (
        <Card
            className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md border-2 relative group",
                isSelected
                    ? "border-primary shadow-lg ring-2 ring-primary/20"
                    : "border-transparent hover:border-primary/50"
            )}
            onClick={onSelect}
        >
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite();
                }}
                className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
                <Star className={cn("w-4 h-4 text-gray-300", isFavorite && "text-yellow-400 fill-yellow-400")} />
            </button>
            <CardContent className="p-3 space-y-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Briefcase className="w-5 h-5 text-primary shrink-0" />
                        <h4 className="font-semibold text-sm leading-tight pr-6">{project.name}</h4>
                    </div>
                    <Badge variant="secondary" className={cn("text-xs", statusColor)}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {PROJECT_STATUS_LABELS[project.status]}
                    </Badge>
                </div>

                <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Building className="w-3 h-3" />
                        <span>{project.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        <span>{project.city}</span>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-muted-foreground">Πρόοδος</span>
                        <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                </div>
                
                <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t">
                    <div className="flex items-center gap-1">
                         <Calendar className="w-3 h-3" />
                         <span>Ενημ: {new Date(project.lastUpdate).toLocaleDateString('el-GR')}</span>
                    </div>
                    <span className="font-medium text-green-600">
                        {project.totalValue.toLocaleString('el-GR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
