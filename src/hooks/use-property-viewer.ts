"use client";

import { useState } from 'react';

// Mock data and hook for property viewer
export const usePropertyViewer = () => {
    const [properties, setProperties] = useState([
        { id: '1', name: 'Διαμέρισμα Α1', type: '2-bedrooms', building: 'Κτίριο Alpha', floor: 1, status: 'for-sale', project: 'Project Alpha' },
        { id: '2', name: 'Κατάστημα Γ1', type: 'shop', building: 'Κτίριο Alpha', floor: 0, status: 'for-rent', project: 'Project Alpha' },
        { id: '3', name: 'Studio Β2', type: 'studio', building: 'Κτίριο Beta', floor: 2, status: 'sold', project: 'Project Beta' },
        { id: '4', name: 'Μεζονέτα Δ5', type: 'maisonette', building: 'Κτίριο Gamma', floor: 5, status: 'reserved', project: 'Project Gamma' },
        { id: '5', name: 'Γραφείο Ε3', type: 'office', building: 'Κτίριο Delta', floor: 3, status: 'rented', project: 'Project Delta' },
    ]);
    const [selectedProperty, setSelectedProperty] = useState<string | null>('1');
    const [hoveredProperty, setHoveredProperty] = useState<string | null>(null);
    const [selectedFloor, setSelectedFloor] = useState<string | null>('1');
    const [isLoading, setIsLoading] = useState(false);

    // In a real app, you would fetch this data from a service
    // For now, we use mock data.

    return {
        properties,
        selectedProperty,
        hoveredProperty,
        selectedFloor,
        isLoading,
        setSelectedProperty,
        setHoveredProperty,
        setSelectedFloor,
    };
};
