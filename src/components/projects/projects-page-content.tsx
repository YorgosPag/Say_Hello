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
      title: "Τρεις πενταώροφες οικοδομές με καταστήματα πιλοτή & υπόγειο",
      status: 'completed',
      company: 'ΠΑΓΩΝΗΣ ΝΕΣΤ. ΓΕΩΡΓΙΟΣ',
      address: 'Ευτέρπης 32 - 34',
      city: 'Εύοσμος',
      progress: 100,
      totalValue: 3922222,
      startDate: '2001-10-24',
      completionDate: '2004-05-15',
      lastUpdate: '2023-05-15',
      totalArea: 2178.90,
    },
    {
      id: 2,
      name: "Καληαρού & Κομνηνών",
      title: "Διώροφη οικοδομή με υπόγειο",
      status: 'in_progress',
      company: 'ΠΑΓΩΝΗΣ ΝΕΣΤ. ΓΕΩΡΓΙΟΣ',
      address: 'Καληαρού 12 & Κομνηνών',
      city: 'Θεσσαλονίκη',
      progress: 65,
      totalValue: 2100000,
      startDate: '2022-01-20',
      completionDate: '2025-08-30',
      lastUpdate: '2024-07-20',
      totalArea: 1500,
    },
    {
        id: 3,
        name: "Κτίριο Γραφείων Αμπελόκηποι",
        title: "Ανέγερση κτιρίου γραφείων",
        status: 'planning',
        company: 'DevConstruct AE',
        address: 'Λεωφόρος Κηφισίας 123',
        city: 'Αθήνα',
        progress: 10,
        totalValue: 5500000,
        startDate: '2025-02-01',
        completionDate: '2027-06-01',
        lastUpdate: '2024-06-10',
        totalArea: 3500,
    }
];

export function ProjectsPageContent() {
  const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);

  return (
    <PageLayout>
        <ProjectsList
            projects={projects}
            selectedProject={selectedProject}
            onSelectProject={setSelectedProject}
        />
        <ProjectDetails project={selectedProject} />
    </PageLayout>
  )
}
