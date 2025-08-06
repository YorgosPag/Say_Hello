'use client';

import type { ProjectStatus } from '@/types/project';

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('el-GR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

export const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('el-GR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

export const getProgressColor = (progress: number) => {
    if (progress < 25) return 'text-red-500';
    if (progress < 50) return 'text-yellow-500';
    if (progress < 75) return 'text-blue-500';
    return 'text-green-500';
};

export const getDaysUntilCompletion = (completionDate?: string) => {
    if (!completionDate) return null;
    const today = new Date();
    const completion = new Date(completionDate);
    const diffTime = completion.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

export const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
        case 'in_progress': return 'bg-blue-500';
        case 'planning': return 'bg-yellow-500';
        case 'completed': return 'bg-green-500';
        case 'on_hold': return 'bg-gray-500';
        case 'cancelled': return 'bg-red-500';
        default: return 'bg-gray-400';
    }
};

export const getStatusLabel = (status: ProjectStatus) => {
    const labels: Record<ProjectStatus, string> = {
        planning: 'Σχεδιασμός',
        in_progress: 'Σε εξέλιξη',
        completed: 'Ολοκληρωμένο',
        on_hold: 'Σε αναμονή',
        cancelled: 'Ακυρωμένο'
    };
    return labels[status] || status;
};
