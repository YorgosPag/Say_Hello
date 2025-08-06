'use client';

import React from 'react';
import type { Project } from '@/types/project';
import { ProjectCard } from './ProjectCard';

interface ProjectsGridViewProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (project: Project | null) => void;
}

export function ProjectsGridView({
  projects,
  selectedProject,
  onSelectProject,
}: ProjectsGridViewProps) {
  return (
    <div className="flex-1 p-4 overflow-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            isSelected={selectedProject?.id === project.id}
            onClick={() => onSelectProject(project)}
          />
        ))}
      </div>
    </div>
  );
}
