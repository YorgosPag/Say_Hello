'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
    children: React.ReactNode;
    className?: string;
}

export function PageLayout({ children, className }: PageLayoutProps) {
    return (
        <div className={cn("h-full flex flex-col bg-background", className)}>
            <div className="flex-1 flex overflow-hidden">
                {children}
            </div>
        </div>
    );
}
