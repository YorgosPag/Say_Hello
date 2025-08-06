'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { Project } from '@/types/project';
import { ProjectCardHeader } from './ProjectCard/ProjectCardHeader';
import { ProjectCardContent } from './ProjectCard/ProjectCardContent';
import { ProjectCardTimeline } from './ProjectCard/ProjectCardTimeline';

interface ProjectCardProps {
  project: Project;
  isSelected: boolean;
  onClick: () => void;
}

export function ProjectCard({ 
  project, 
  isSelected, 
  onClick,
}: ProjectCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TooltipProvider>
      <Card 
        className={cn(
          "relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl group border-2",
          isSelected 
            ? "border-blue-500 shadow-lg ring-2 ring-blue-200 dark:ring-blue-800" 
            : "border-border hover:border-blue-300 hover:shadow-lg",
          "transform hover:scale-[1.02]"
        )}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <ProjectCardHeader
          project={project}
          isFavorite={isFavorite}
          setIsFavorite={setIsFavorite}
          isHovered={isHovered}
        />
        
        <ProjectCardContent
          project={project}
        />

        <ProjectCardTimeline
          project={project}
        />

        {/* Hover overlay effect */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent pointer-events-none transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )} />

        {/* Selected indicator */}
        {isSelected && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600" />
        )}
      </Card>
    </TooltipProvider>
  );
}
