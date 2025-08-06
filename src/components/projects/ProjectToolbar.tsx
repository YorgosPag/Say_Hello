'use client';

import React from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelpCircle, Minus, Plus, Save, FileText, Search, Settings } from "lucide-react";
import { ToolbarButton } from '@/components/ui/ToolbarButton';
import { QuickSearch } from '@/components/ui/QuickSearch';
import { Input } from '@/components/ui/input';

export function ProjectToolbar() {
    return (
        <TooltipProvider>
            <div className="p-1.5 border-b flex items-center gap-1 bg-muted/30">
                <ToolbarButton tooltip="Νέα Εγγραφή" className="text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400">
                    <Plus className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton tooltip="Διαγραφή" className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400">
                    <Minus className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton tooltip="Αποθήκευση">
                    <Save className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-6 bg-border mx-1" />
                
                <QuickSearch searchTerm="" onSearchChange={() => {}} placeholder="Αναζήτηση έργου..." />
                
                <div className="flex-1" />

                <ToolbarButton tooltip="Βοήθεια">
                    <HelpCircle className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton tooltip="Ρυθμίσεις Προβολής">
                    <Settings className="w-4 h-4" />
                </ToolbarButton>
            </div>
        </TooltipProvider>
    );
}