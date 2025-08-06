'use client';

import React, { useState, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProjectToolbar } from './ProjectToolbar';
import { ProjectListHeader } from './list/ProjectListHeader';
import { ProjectListItem } from './list/ProjectListItem';
import type { Project, ProjectStatus, ProjectSortKey } from '@/types/project';

const mockProjects: Project[] = [
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


interface ProjectsListProps {
    selectedProject: Project;
    onSelectProject?: (project: Project) => void;
}

export function ProjectsList({ selectedProject, onSelectProject }: ProjectsListProps) {
    const [projects, setProjects] = useState<Project[]>(mockProjects);
    const [sortBy, setSortBy] = useState<ProjectSortKey>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [filterStatus, setFilterStatus] = useState<ProjectStatus | 'all'>('all');
    const [favorites, setFavorites] = useState<number[]>([1]);
    
    const filteredProjects = useMemo(() => {
        return projects.filter(p => filterStatus === 'all' || p.status === filterStatus);
    }, [projects, filterStatus]);
    
    const sortedProjects = useMemo(() => {
        return [...filteredProjects].sort((a, b) => {
            const aVal = a[sortBy];
            const bVal = b[sortBy];
            
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
            }
            return 0;
        });
    }, [filteredProjects, sortBy, sortOrder]);

    const toggleFavorite = (projectId: number) => {
        setFavorites(prev =>
          prev.includes(projectId)
            ? prev.filter(id => id !== projectId)
            : [...prev, projectId]
        );
      };


    return (
        <div className="w-[400px] bg-card border rounded-lg flex flex-col shrink-0">
            <ProjectListHeader 
                projectCount={projects.length}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
            />
            <ProjectToolbar />
            <ScrollArea className="flex-1">
                <div className="p-2 space-y-2">
                    {sortedProjects.map((project) => (
                        <ProjectListItem
                            key={project.id}
                            project={project}
                            isSelected={selectedProject?.id === project.id}
                            onSelect={() => onSelectProject?.(project)}
                            isFavorite={favorites.includes(project.id)}
                            onToggleFavorite={() => toggleFavorite(project.id)}
                        />
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
