
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Home, 
  Building, 
  MapPin, 
  Euro, 
  Ruler, 
  Calendar,
  User,
  Phone,
  Mail,
  FileText,
  Eye,
  Edit3,
  ExternalLink,
  Layers,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatFloorLabel } from "../building-management/BuildingCard/BuildingCardUtils";
import type { Property } from '@/types/property-viewer';
import type { ExtendedPropertyDetails } from '@/types/property-viewer';

interface PropertyDetailsPanelProps {
  propertyIds: string[];
  onSelectFloor: (floorId: string | null) => void;
  properties: Property[];
  onUpdateProperty: (propertyId: string, updates: Partial<Property>) => void;
}

const statusConfig = {
  'for-sale': {
    label: 'Προς Πώληση',
    color: 'bg-green-100 text-green-900 border-green-200',
  },
  'for-rent': {
    label: 'Προς Ενοικίαση',
    color: 'bg-blue-100 text-blue-900 border-blue-200',
  },
  'sold': {
    label: 'Πουλημένο',
    color: 'bg-red-100 text-red-900 border-red-200',
  },
  'rented': {
    label: 'Ενοικιασμένο',
    color: 'bg-orange-100 text-orange-900 border-orange-200',
  },
  'reserved': {
    label: 'Δεσμευμένο',
    color: 'bg-yellow-100 text-yellow-900 border-yellow-200',
  },
   'Άγνωστο': {
    label: 'Άγνωστο',
    color: 'bg-gray-100 text-gray-900 border-gray-200',
  },
};

function MultiLevelNavigation({ property, onSelectFloor, currentFloorId }: { property: Property; onSelectFloor: (floorId: string | null) => void; currentFloorId: string | null; }) {
  if (!property.levels) return null;

  return (
    <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 space-y-2">
      <h4 className="text-xs font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
        <ChevronsUpDown className="h-4 w-4" />
        Επίπεδα Ακινήτου
      </h4>
      {property.levels.map((level) => (
        <div 
          key={level.floorId}
          className={cn(
            "p-2 rounded-md flex items-center justify-between transition-colors",
            currentFloorId === level.floorId ? "bg-blue-100 dark:bg-blue-900" : "bg-white/50 dark:bg-black/20"
          )}
        >
          <span className="text-sm font-medium">{level.name}</span>
          <Button size="sm" className="h-7 text-xs" onClick={() => onSelectFloor(level.floorId)}>
            Μετάβαση
          </Button>
        </div>
      ))}
    </div>
  )
}

function PropertyDetailsContent({ property, onSelectFloor, onUpdateProperty, currentFloorId }: { property: ExtendedPropertyDetails; onSelectFloor: (floorId: string | null) => void; onUpdateProperty: (propertyId: string, updates: Partial<Property>) => void; currentFloorId: string | null }) {
  const statusInfo = statusConfig[property.status as keyof typeof statusConfig] || {
    label: property.status,
    color: 'bg-gray-100 text-gray-900 border-gray-200',
  };
  
  const isMultiLevel = property.isMultiLevel || property.type === "Μεζονέτα";

  const handleEditClick = () => {
    const newName = prompt("Εισάγετε νέο όνομα για το ακίνητο:", property.name);
    if (newName && newName !== property.name) {
      onUpdateProperty(property.id, { name: newName });
    }
  };


  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-1">

        {isMultiLevel && <MultiLevelNavigation property={property} onSelectFloor={onSelectFloor} currentFloorId={currentFloorId} />}

        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm leading-tight">{property.name}</h3>
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
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <Building className="h-3 w-3 text-muted-foreground" />
            <span>{property.building}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span>{formatFloorLabel(property.floor)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{property.project}</span>
          </div>
        </div>

        <Separator />

        {/* Price & Specs */}
        <div className="space-y-2">
          {property.price && (
            <div className="flex items-center gap-2 text-sm">
              <Euro className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-green-600">
                {property.price.toLocaleString('el-GR')}€
              </span>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            {property.area && (
              <div className="flex items-center gap-1">
                <Ruler className="h-3 w-3 text-muted-foreground" />
                <span>{property.area}τμ</span>
              </div>
            )}
            {property.rooms && (
              <div className="flex items-center gap-1">
                <Home className="h-3 w-3 text-muted-foreground" />
                <span>{property.rooms} δωμ.</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {property.description && (
          <>
            <Separator />
            <div className="space-y-1">
              <h4 className="text-xs font-medium">Περιγραφή</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {property.description}
              </p>
            </div>
          </>
        )}

        {/* Features */}
        {property.features && property.features.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-xs font-medium">Χαρακτηριστικά</h4>
              <div className="flex flex-wrap gap-1">
                {property.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Contact Info */}
        {(property.owner || property.agent) && (
          <>
            <Separator />
            <div className="space-y-3">
              {property.owner && (
                <div className="space-y-1">
                  <h4 className="text-xs font-medium flex items-center gap-1">
                    <User className="h-3 w-3" />
                    Ιδιοκτήτης
                  </h4>
                  <div className="space-y-1 pl-4">
                    <p className="text-xs">{property.owner.name}</p>
                    {property.owner.phone && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{property.owner.phone}</span>
                      </div>
                    )}
                    {property.owner.email && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span>{property.owner.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {property.agent && (
                <div className="space-y-1">
                  <h4 className="text-xs font-medium flex items-center gap-1">
                    <User className="h-3 w-3" />
                    Μεσίτης
                  </h4>
                  <div className="space-y-1 pl-4">
                    <p className="text-xs">{property.agent.name}</p>
                    {property.agent.phone && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{property.agent.phone}</span>
                      </div>
                    )}
                    {property.agent.email && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span>{property.agent.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Documents */}
        {property.documents && property.documents.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-xs font-medium flex items-center gap-1">
                <FileText className="h-3 w-3" />
                Έγγραφα
              </h4>
              <div className="space-y-1">
                {property.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between text-xs">
                    <span className="truncate">{doc.name}</span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Dates */}
        {property.dates && (
            <>
                <Separator />
                <div className="space-y-1">
                <h4 className="text-xs font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Ημερομηνίες
                </h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                    {property.dates.created && <div>Δημιουργία: {new Date(property.dates.created).toLocaleDateString('el-GR')}</div>}
                    {property.dates.updated && <div>Ενημέρωση: {new Date(property.dates.updated).toLocaleDateString('el-GR')}</div>}
                    {property.dates.available && (
                    <div>Διαθεσιμότητα: {new Date(property.dates.available).toLocaleDateString('el-GR')}</div>
                    )}
                </div>
                </div>
            </>
        )}


        {/* Actions */}
        <Separator />
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="h-3 w-3 mr-1" />
            Προβολή
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={handleEditClick}>
            <Edit3 className="h-3 w-3 mr-1" />
            Επεξ.
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}

export function PropertyDetailsPanel({ propertyIds, onSelectFloor, properties, onUpdateProperty }: PropertyDetailsPanelProps) {
  if (propertyIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
        <Home className="h-8 w-8 mb-2" />
        <p className="text-sm text-center">Επιλέξτε ένα ακίνητο</p>
        <p className="text-xs text-center">για να δείτε τα στοιχεία του</p>
      </div>
    );
  }

  if (propertyIds.length > 1) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
        <Layers className="h-8 w-8 mb-2" />
        <p className="text-sm font-medium text-center">{propertyIds.length} ακίνητα επιλέχθηκαν</p>
        <p className="text-xs text-center mt-2">Επιλέξτε ένα μόνο ακίνητο για να δείτε τις λεπτομέρειες.</p>
      </div>
    );
  }

  const propertyId = propertyIds[0];
  const property = properties.find(p => p.id === propertyId);
  
  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
        <Home className="h-8 w-8 mb-2" />
        <p className="text-sm text-center">Δεν βρέθηκαν στοιχεία</p>
        <p className="text-xs text-center">για το επιλεγμένο ακίνητο</p>
      </div>
    );
  }

  return <PropertyDetailsContent property={property as ExtendedPropertyDetails} onSelectFloor={onSelectFloor} onUpdateProperty={onUpdateProperty} currentFloorId={property.floorId} />;
}

    