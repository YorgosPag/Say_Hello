'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import type { ProjectStatus, ProjectSortKey } from '@/types/project';
import { PROJECT_STATUS_LABELS } from '@/types/project';

interface ProjectListHeaderProps {
    projectCount: number;
    sortBy: ProjectSortKey;
    setSortBy: (value: ProjectSortKey) => void;
    sortOrder: 'asc' | 'desc';
    setSortOrder: (value: 'asc' | 'desc') => void;
    filterStatus: ProjectStatus | 'all';
    setFilterStatus: (value: ProjectStatus | 'all') => void;
}

export function ProjectListHeader({
    projectCount,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filterStatus,
    setFilterStatus
}: ProjectListHeaderProps) {
    return (
        <div className="p-3 border-b space-y-3">
            <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="text-md font-semibold">Έργα ({projectCount})</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                    <Label htmlFor="company-filter" className="text-xs">Εταιρεία</Label>
                    <Select defaultValue="pagonis-nest">
                        <SelectTrigger id="company-filter" className="h-8 text-xs">
                            <SelectValue placeholder="Επιλογή Εταιρείας" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pagonis-nest">ΠΑΓΩΝΗΣ ΝΕΣΤ. ΓΕΩΡΓΙΟΣ</SelectItem>
                            <SelectItem value="devconstruct">DevConstruct AE</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-1">
                    <Label htmlFor="status-filter" className="text-xs">Κατάσταση</Label>
                    <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
                        <SelectTrigger id="status-filter" className="h-8 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Όλες</SelectItem>
                            {Object.entries(PROJECT_STATUS_LABELS).map(([key, label]) => (
                                <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Label className="text-xs">Ταξινόμηση:</Label>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as ProjectSortKey)}>
                    <SelectTrigger className="h-7 text-xs flex-1">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="name">Όνομα</SelectItem>
                        <SelectItem value="status">Κατάσταση</SelectItem>
                        <SelectItem value="progress">Πρόοδος</SelectItem>
                        <SelectItem value="totalValue">Αξία</SelectItem>
                        <SelectItem value="lastUpdate">Ενημέρωση</SelectItem>
                    </SelectContent>
                </Select>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="text-xs h-7 w-12"
                >
                    {sortOrder === 'asc' ? 'Αύξ.' : 'Φθίν.'}
                </Button>
            </div>
        </div>
    );
}
