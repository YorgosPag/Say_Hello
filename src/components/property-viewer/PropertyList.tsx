"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface Property {
  id: string;
  name: string;
  type?: string;
}

interface PropertyListProps {
  properties: Property[];
  selectedPropertyId: string | null;
  onSelectProperty: (id: string) => void;
  isLoading: boolean;
}

export function PropertyList({
  properties,
  selectedPropertyId,
  onSelectProperty,
  isLoading,
}: PropertyListProps) {
  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-2 space-y-1">
        {properties.map((property) => (
          <button
            key={property.id}
            onClick={() => onSelectProperty(property.id)}
            className={cn(
              "w-full text-left p-2 rounded-md text-sm transition-colors",
              selectedPropertyId === property.id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <div className="font-medium">{property.name}</div>
            {property.type && (
              <div className="text-xs opacity-80">{property.type}</div>
            )}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
