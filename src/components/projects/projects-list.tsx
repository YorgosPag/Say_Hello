'use client';

import React from 'react';

export function ProjectsList({ projects, selectedProject, onSelectProject }: any) {
    return (
        <div className="w-[300px] border-r p-4">
            <h2 className="font-bold mb-4">Έργα</h2>
            <ul>
                {projects.map((project: any) => (
                    <li
                        key={project.id}
                        onClick={() => onSelectProject(project)}
                        className={`cursor-pointer p-2 rounded ${selectedProject.id === project.id ? 'bg-blue-100' : ''}`}
                    >
                        {project.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}
