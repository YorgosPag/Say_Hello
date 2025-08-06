'use client';

import React from 'react';

export function ProjectDetails({ project }: any) {
    if (!project) return <div className="flex-1 p-4">Επιλέξτε ένα έργο</div>;
    return (
        <div className="flex-1 p-4">
            <h1 className="text-2xl font-bold">{project.name}</h1>
        </div>
    );
}
