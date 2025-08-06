'use client';

import React, { useState } from 'react';
import { ProjectsList } from './projects-list';
import { ProjectDetails } from './project-details';
import { PageLayout } from '@/components/app/page-layout';
import type { Project, ProjectStatus } from '@/types/project';
import { PROJECT_STATUS_LABELS } from '@/types/project';

const projects: Project[] = [
    {
      id: 1,
      name: "3. ΕΥΤΕΡΠΗΣ",
      status: 'completed',
      company: 'ΠΑΓΩΝΗΣ ΝΕΣΤ. ΓΕΩΡΓΙΟΣ',
      city: 'Εύοσμος',
      progress: 100,
      totalValue: 3922222,
      lastUpdate: '2023-05-15',
      totalArea: 2178.90,
    },
    {
      id: 2,
      name: "Καληαρού & Κομνηνών",
      status: 'in_progress',
      company: 'ΠΑΓΩΝΗΣ ΝΕΣΤ. ΓΕΩΡΓΙΟΣ',
      city: 'Θεσσαλονίκη',
      progress: 65,
      totalValue: 2100000,
      lastUpdate: '2024-07-20',
      totalArea: 1500,
    },
    {
        id: 3,
        name: "Κτίριο Γραφείων Αμπελόκηποι",
        status: 'planning',
        company: 'DevConstruct AE',
        city: 'Αθήνα',
        progress: 10,
        totalValue: 5500000,
        lastUpdate: '2024-06-10',
        totalArea: 3500,
    }
];

const statusConfig: Record<ProjectStatus, { color: string }> = {
    'planning': { color: 'bg-yellow-100 text-yellow-800' },
    'in_progress': { color: 'bg-blue-100 text-blue-800' },
    'completed': { color: 'bg-green-100 text-green-800' },
    'on_hold': { color: 'bg-gray-100 text-gray-800' },
    'cancelled': { color: 'bg-red-100 text-red-800' },
};

export function ProjectsPageContent() {
  const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);

  const getStatusColor = (status: ProjectStatus) => {
    return statusConfig[status]?.color || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: ProjectStatus) => {
    return PROJECT_STATUS_LABELS[status] || status;
  };

  return (
    <PageLayout>
        <ProjectsList
            projects={projects}
            selectedProject={selectedProject}
            onSelectProject={setSelectedProject}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
        />
        <ProjectDetails project={selectedProject} />
    </PageLayout>
  )
}
