'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, MapPin, Calendar, Euro } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Project } from '@/types/project';

interface ProjectListItemProps {
  project: Project;
  isSelected: boolean;
  onSelect: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function ProjectListItem({
  project,
  isSelected,
  onSelect,
  isFavorite,
  onToggleFavorite,
}: ProjectListItemProps) {

  const handleClick = () => {
    onSelect();
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite();
  };
  
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
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        isSelected ? "ring-2 ring-primary shadow-md" : "hover:ring-1 hover:ring-primary/50"
      )}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm leading-tight truncate">
              {project.name}
            </h4>
            <p className="text-xs text-muted-foreground truncate">
              {project.title}
            </p>
          </div>
          
          <div className="flex items-center gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavoriteClick}
              className="h-6 w-6 p-0"
            >
              <Heart 
                className={cn(
                  "w-4 h-4",
                  isFavorite 
                    ? "fill-red-500 text-red-500" 
                    : "text-muted-foreground hover:text-red-500"
                )}
              />
            </Button>
          </div>
        </div>

        {/* Status and Progress */}
        <div className="flex items-center justify-between mb-3">
          <Badge 
            variant="secondary" 
            className={cn("text-xs", project.status === 'completed' ? 'bg-green-100 text-green-800' : project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800')}
          >
            {PROJECT_STATUS_LABELS[project.status]}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {project.progress}% ολοκληρωμένο
          </span>
        </div>

        <Progress value={project.progress} className="h-2 mb-3" />

        {/* Location */}
        <div className="flex items-center gap-1 mb-2">
          <MapPin className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground truncate">
            {project.address}, {project.city}
          </span>
        </div>
        
        {/* Value and Dates */}
        <div className="pt-3 border-t space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Euro className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-green-600">{formatCurrency(project.totalValue)}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Έναρξη: {formatDate(project.startDate)}</span>
            <span>Λήξη: {formatDate(project.completionDate)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
