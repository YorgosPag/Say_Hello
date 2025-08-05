'use client';

import { Home, Building2, Users } from 'lucide-react';

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

export const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'residential': return Home;
        case 'commercial': return Building2;
        case 'mixed': return Users;
        case 'industrial': return Building2;
        default: return Building2;
    }
};

export const getCategoryLabel = (category: string) => {
    switch (category) {
        case 'residential': return 'Κατοικίες';
        case 'commercial': return 'Εμπορικό';
        case 'mixed': return 'Μικτή Χρήση';
        case 'industrial': return 'Βιομηχανικό';
        default: return category;
    }
};

export const getDaysUntilCompletion = (completionDate?: string) => {
    if (!completionDate) return null;
    const today = new Date();
    const completion = new Date(completionDate);
    const diffTime = completion.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

export const getStatusColor = (status: string) => {
    switch (status) {
        case 'active': return 'bg-green-500';
        case 'construction': return 'bg-blue-500';
        case 'planned': return 'bg-yellow-500';
        case 'completed': return 'bg-gray-500';
        default: return 'bg-gray-400';
    }
};

export const getStatusLabel = (status: string) => {
    switch (status) {
        case 'active': return 'Ενεργό';
        case 'construction': return 'Υπό Κατασκευή';
        case 'planned': return 'Σχεδιασμένο';
        case 'completed': return 'Ολοκληρωμένο';
        default: return status;
    }
};
