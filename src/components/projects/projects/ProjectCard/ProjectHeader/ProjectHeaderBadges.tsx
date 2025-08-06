'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ProjectStatus } from '@/types/project';

interface ProjectHeaderBadgesProps {
  status: ProjectStatus;
  getStatusColor: (status: ProjectStatus) => string;
  getStatusLabel: (status: ProjectStatus) => string;
}

export function ProjectHeaderBadges({
  status,
  getStatusColor,
  getStatusLabel,
}: ProjectHeaderBadgesProps) {
  return (
    <div className="flex items-center gap-2">
      <Badge className={cn("text-xs shadow-sm", getStatusColor(status), 'text-white')}>
        {getStatusLabel(status)}
      </Badge>
    </div>
  );
}
