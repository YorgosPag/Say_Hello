'use client';

import React, { useState } from 'react';
import { ProjectsList } from './projects-list';
import { ProjectDetails } from './project-details';
import { PageLayout } from '@/components/app/page-layout';
import type { Project } from '@/types/project';

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
    }
];

export function ProjectsPageContent() {
  const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);

  return (
    <PageLayout>
        <ProjectsList
            selectedProject={selectedProject}
            onSelectProject={setSelectedProject}
        />
        <ProjectDetails project={selectedProject} />
    </PageLayout>
  )
}
