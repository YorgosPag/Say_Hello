'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Home, Building, MapPin, Euro, Ruler, Users, Phone, Mail, FileText, ExternalLink, Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Property } from '@/types/property';

const statusConfig = {
  available: { label: 'Διαθέσιμο', color: 'bg-green-100 text-green-800' },
  sold: { label: 'Πουλημένο', color: 'bg-red-100 text-red-800' },
  owner: { label: 'Οικοπεδούχου', color: 'bg-blue-100 text-blue-800' },
  reserved: { label: 'Κρατημένο', color: 'bg-yellow-100 text-yellow-800' },
};

interface PropertyDetailsProps {
  property: Property;
}

export function PropertyDetails({ property }: PropertyDetailsProps) {
  const statusInfo = statusConfig[property.status] || { label: property.status, color: 'bg-gray-100' };

  return (
    <Card className="flex-1 flex flex-col min-w-0">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{property.code}</CardTitle>
            <p className="text-sm text-muted-foreground">{property.description}</p>
          </div>
          <Badge className={cn("text-xs", statusInfo.color)}>{statusInfo.label}</Badge>
        </div>
      </CardHeader>
      <ScrollArea className="flex-1">
        <CardContent className="space-y-4">
          <Separator />
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-xs text-muted-foreground">Κτίριο</Label>
              <div className="flex items-center gap-2 mt-1">
                <Building className="h-4 w-4 text-muted-foreground" />
                <p>{property.building}</p>
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Όροφος</Label>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <p>{property.floor}</p>
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Τιμή</Label>
              <div className="flex items-center gap-2 mt-1">
                <Euro className="h-4 w-4 text-muted-foreground" />
                <p className="font-semibold text-green-600">{property.price.toLocaleString('el-GR')} €</p>
              </div>
            </div>
             <div>
              <Label className="text-xs text-muted-foreground">Εμβαδόν</Label>
              <div className="flex items-center gap-2 mt-1">
                <Ruler className="h-4 w-4 text-muted-foreground" />
                <p>{property.area} m²</p>
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Δωμάτια</Label>
              <div className="flex items-center gap-2 mt-1">
                <Home className="h-4 w-4 text-muted-foreground" />
                <p>{property.rooms}</p>
              </div>
            </div>
             <div>
              <Label className="text-xs text-muted-foreground">Μπαλκόνι</Label>
              <p>{property.balconyArea} m²</p>
            </div>
          </div>
          
          <Separator />

          {property.status === 'sold' && (
            <div className="space-y-3">
                <h4 className="font-semibold text-sm">Αγοραστής</h4>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{property.buyer}</span>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs h-7">Προβολή Επαφής</Button>
                </div>
                {property.saleDate && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Ημ/νία Πώλησης: {new Date(property.saleDate).toLocaleDateString('el-GR')}</span>
                  </div>
                )}
            </div>
          )}

          {property.features && property.features.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Χαρακτηριστικά</h4>
              <div className="flex flex-wrap gap-2">
                {property.features.map((feature, index) => (
                  <Badge key={index} variant="secondary">{feature}</Badge>
                ))}
              </div>
            </div>
          )}

        </CardContent>
      </ScrollArea>
    </Card>
  );
}

function Label({ className, ...props }: React.ComponentProps<'p'>) {
    return <p className={cn("text-xs text-muted-foreground", className)} {...props} />
}
