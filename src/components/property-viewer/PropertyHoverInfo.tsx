"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Home, 
  Building, 
  MapPin, 
  Euro, 
  Ruler,
  MousePointer
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatFloorLabel, formatPricePerSqm } from "../building-management/BuildingCard/BuildingCardUtils";
import type { Property } from '@/types/property-viewer';

interface PropertyHoverInfoProps {
  propertyId: string | null;
  properties: Property[];
}


const statusConfig = {
  'for-sale': {
    label: 'Προς Πώληση',
    color: 'bg-green-100 text-green-900 border-green-200',
    priceLabel: 'Τιμή Πώλησης'
  },
  'for-rent': {
    label: 'Προς Ενοικίαση',
    color: 'bg-blue-100 text-blue-900 border-blue-200',
    priceLabel: 'Μηνιαίο Μίσθωμα'
  },
  'sold': {
    label: 'Πουλημένο',
    color: 'bg-red-100 text-red-900 border-red-200',
    priceLabel: 'Τιμή Πώλησης'
  },
  'rented': {
    label: 'Ενοικιασμένο',
    color: 'bg-orange-100 text-orange-900 border-orange-200',
    priceLabel: 'Μηνιαίο Μίσθωμα'
  },
  'reserved': {
    label: 'Δεσμευμένο',
    color: 'bg-yellow-100 text-yellow-900 border-yellow-200',
    priceLabel: 'Τιμή Πώλησης'
  },
  'Άγνωστο': {
    label: 'Άγνωστο',
    color: 'bg-gray-100 text-gray-900 border-gray-200',
    priceLabel: 'Τιμή'
  },
};

function PropertyHoverContent({ property }: { property: Property }) {
  const statusInfo = statusConfig[property.status as keyof typeof statusConfig] || statusConfig['Άγνωστο'];

  return (
    <div className="space-y-3 p-1">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-sm leading-tight">{property.name}</h4>
          <Badge 
            variant="outline" 
            className={cn("text-xs flex-shrink-0", statusInfo.color)}
          >
            {statusInfo.label}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{property.type}</p>
      </div>

      <Separator />

      {/* Location */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs">
          <Building className="h-3 w-3 text-muted-foreground" />
          <span>{property.building}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <span>{formatFloorLabel(property.floor)}</span>
        </div>
      </div>

      {/* Price & Area */}
      {(property.price || property.area) && (
        <>
          <Separator />
          <div className="space-y-2">
            {property.price && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">{statusInfo.priceLabel}:</p>
                <div className="flex items-center gap-1">
                  <Euro className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-sm text-green-600">
                    {property.price.toLocaleString('el-GR')}€
                    {(property.status === 'for-rent' || property.status === 'rented') && (
                      <span className="text-xs text-muted-foreground">/μήνα</span>
                    )}
                  </span>
                </div>
              </div>
            )}
            
            {property.area && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Εμβαδόν:</p>
                <div className="flex items-center gap-1">
                  <Ruler className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm font-medium">{property.area}τμ</span>
                </div>
              </div>
            )}

            {/* Price per square meter */}
            {property.price && property.area && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Τιμή ανά τμ:</p>
                <span className="text-xs font-medium">
                  {formatPricePerSqm(property.price, property.area)}
                  {(property.status === 'for-rent' || property.status === 'rented') && '/μήνα'}
                </span>
              </div>
            )}
          </div>
        </>
      )}

      {/* Quick Info */}
      {property.description && (
        <>
          <Separator />
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Σύντομη περιγραφή:</p>
            <p className="text-xs leading-relaxed">{property.description}</p>
          </div>
        </>
      )}

      {/* Hover Instruction */}
      <Separator />
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <MousePointer className="h-3 w-3" />
        <span>Κάντε κλικ για περισσότερες πληροφορίες</span>
      </div>
    </div>
  );
}

export function PropertyHoverInfo({ propertyId, properties }: PropertyHoverInfoProps) {
  if (!propertyId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
        <MousePointer className="h-6 w-6 mb-2" />
        <p className="text-xs text-center">Περάστε το ποντίκι</p>
        <p className="text-xs text-center">πάνω από ένα ακίνητο</p>
        <p className="text-xs text-center mt-1 text-muted-foreground/70">
          στην κάτοψη για να δείτε
        </p>
        <p className="text-xs text-center text-muted-foreground/70">
          γρήγορες πληροφορίες
        </p>
      </div>
    );
  }

  const property = properties.find(p => p.id === propertyId);
  
  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
        <Home className="h-6 w-6 mb-2" />
        <p className="text-xs text-center">Δεν βρέθηκαν στοιχεία</p>
        <p className="text-xs text-center">για αυτό το ακίνητο</p>
      </div>
    );
  }

  return <PropertyHoverContent property={property} />;
}

    