"use client";

import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface PropertyDetailsPanelProps {
  propertyId: string | null;
}

// Mock data, in a real app this would be fetched
const propertiesData = {
  '1': { name: 'Διαμέρισμα Α1', type: '2-bedrooms', building: 'Κτίριο Alpha', floor: 1, area: 85, price: 250000, status: 'For Sale' },
  '2': { name: 'Κατάστημα Γ1', type: 'shop', building: 'Κτίριο Alpha', floor: 0, area: 120, price: 450000, status: 'For Sale' },
  '3': { name: 'Studio Β2', type: 'studio', building: 'Κτίριο Beta', floor: 2, area: 45, price: 150000, status: 'Sold' },
  '4': { name: 'Μεζονέτα Δ5', type: 'maisonette', building: 'Κτίριο Gamma', floor: 5, area: 150, price: 550000, status: 'Reserved' },
  '5': { name: 'Γραφείο Ε3', type: 'office', building: 'Κτίριο Delta', floor: 3, area: 60, price: 180000, status: 'For Rent' },
};

export function PropertyDetailsPanel({ propertyId }: PropertyDetailsPanelProps) {
  const property = useMemo(() => {
    if (!propertyId) return null;
    return (propertiesData as any)[propertyId];
  }, [propertyId]);

  if (!propertyId) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        Select a property to see its details.
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 text-sm">
      <div>
        <h4 className="font-semibold text-base mb-1">{property.name}</h4>
        <p className="text-muted-foreground">{property.building}</p>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Status:</span>
          <span className="font-medium">{property.status}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Type:</span>
          <span className="font-medium">{property.type}</span>
        </div>
         <div className="flex justify-between">
          <span className="text-muted-foreground">Floor:</span>
          <span className="font-medium">{property.floor}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Area:</span>
          <span className="font-medium">{property.area} m²</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Price:</span>
          <span className="font-medium text-green-600">€{property.price.toLocaleString('el-GR')}</span>
        </div>
      </div>
    </div>
  );
}
