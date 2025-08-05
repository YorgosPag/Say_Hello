"use client";

import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface PropertyHoverInfoProps {
  propertyId: string | null;
}

// Mock data, in a real app this would be fetched
const propertiesData = {
  '1': { name: 'Διαμέρισμα Α1', type: '2-bedrooms', status: 'For Sale' },
  '2': { name: 'Κατάστημα Γ1', type: 'shop', status: 'For Sale' },
  '3': { name: 'Studio Β2', type: 'studio', status: 'Sold' },
  '4': { name: 'Μεζονέτα Δ5', type: 'maisonette', status: 'Reserved' },
  '5': { name: 'Γραφείο Ε3', type: 'office', status: 'For Rent' },
};


export function PropertyHoverInfo({ propertyId }: PropertyHoverInfoProps) {
    const property = useMemo(() => {
    if (!propertyId) return null;
    return (propertiesData as any)[propertyId];
  }, [propertyId]);

  if (!propertyId) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        Hover over a property on the floor plan to see quick info.
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2 text-sm">
       <div>
        <h4 className="font-semibold">{property.name}</h4>
        <p className="text-muted-foreground">{property.type}</p>
      </div>
       <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Status:</span>
          <span className="font-medium">{property.status}</span>
        </div>
    </div>
  );
}
