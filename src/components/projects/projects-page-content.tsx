'use client';

import React, { useState } from 'react';
import { ProjectsList } from './projects-list';
import { ProjectDetails } from './project-details';
import { PageLayout } from '@/components/app/page-layout';
import type { Project, ProjectStatus } from '@/types/project';
import { ProjectsHeader } from './ProjectsHeader';
import { ProjectsDashboard } from './ProjectsDashboard';
import { ProjectsGridView } from './projects/ProjectsGridView';
import { TooltipProvider } from '@/components/ui/tooltip';

const projectsData: Project[] = [
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

const companies = [
  { id: 'pagonis', name: 'ΠΑΓΩΝΗΣ ΝΕΣΤ. ΓΕΩΡΓΙΟΣ' },
  { id: 'devconstruct', name: 'DevConstruct AE' },
];

export function ProjectsPageContent() {
  const [projects, setProjects] = useState<Project[]>(projectsData);
  const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompany, setFilterCompany] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDashboard, setShowDashboard] = useState(true);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = filterCompany === 'all' || project.company === filterCompany;
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    
    return matchesSearch && matchesCompany && matchesStatus;
  });

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'in_progress').length,
    totalValue: projects.reduce((sum, p) => sum + p.totalValue, 0),
    totalArea: projects.reduce((sum, p) => sum + p.totalArea, 0),
    averageProgress: projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) : 0,
  };
  
  return (
    <TooltipProvider>
      <div className="h-full flex flex-col bg-background">
        <ProjectsHeader 
            viewMode={viewMode}
            setViewMode={setViewMode}
            showDashboard={showDashboard}
            setShowDashboard={setShowDashboard}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterCompany={filterCompany}
            setFilterCompany={setFilterCompany}
            companies={companies}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
        />
        
        {showDashboard && <ProjectsDashboard stats={stats} />}

        <div className="flex-1 flex overflow-hidden p-4 gap-4">
          {viewMode === 'list' ? (
             <>
               <ProjectsList
                  projects={filteredProjects}
                  selectedProject={selectedProject}
                  onSelectProject={setSelectedProject}
              />
              <ProjectDetails project={selectedProject} />
            </>
          ) : (
            <ProjectsGridView
              projects={filteredProjects}
              selectedProject={selectedProject}
              onSelectProject={setSelectedProject}
            />
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
