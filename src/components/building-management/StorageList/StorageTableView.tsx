'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Eye, 
  Edit, 
  Trash2, 
  MoreVertical,
  Link,
  Ruler,
  Euro,
  Building,
} from 'lucide-react';
import type { StorageUnit, StorageType, StorageStatus } from '@/types/storage';
import { formatPrice, formatArea } from '../StorageCard/StorageCardUtils';
import { cn } from '@/lib/utils';

interface StorageTableViewProps {
  units: StorageUnit[];
  selectedUnits: string[];
  onSelectUnit: (unitId: string) => void;
  onSelectAll: (checked: boolean | 'indeterminate') => void;
  onEdit: (unit: StorageUnit) => void;
  onDelete: (unitId: string) => void;
  getStatusColor: (status: StorageStatus) => string;
  getStatusLabel: (status: StorageStatus) => string;
  getTypeIcon: (type: StorageType) => React.ReactNode;
  getTypeLabel: (type: StorageType) => string;
}

export function StorageTableView({
  units,
  selectedUnits,
  onSelectUnit,
  onSelectAll,
  onEdit,
  onDelete,
  getStatusColor,
  getStatusLabel,
  getTypeIcon,
  getTypeLabel
}: StorageTableViewProps) {
  const allSelected = selectedUnits.length === units.length && units.length > 0;
  const isIndeterminate = selectedUnits.length > 0 && !allSelected;

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={onSelectAll}
                    aria-label="Select all rows"
                    data-state={isIndeterminate ? 'indeterminate' : (allSelected ? 'checked' : 'unchecked')}
                  />
                </TableHead>
                <TableHead>Κωδικός</TableHead>
                <TableHead>Τύπος</TableHead>
                <TableHead>Όροφος</TableHead>
                <TableHead>Επιφάνεια</TableHead>
                <TableHead>Τιμή</TableHead>
                <TableHead>Κατάσταση</TableHead>
                <TableHead>Συνδεδεμένο</TableHead>
                <TableHead className="text-right">Ενέργειες</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.map((unit) => (
                <TableRow 
                  key={unit.id} 
                  data-state={selectedUnits.includes(unit.id) ? "selected" : ""}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedUnits.includes(unit.id)}
                      onCheckedChange={() => onSelectUnit(unit.id)}
                      aria-label={`Select row ${unit.code}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-foreground">{unit.code}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {unit.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(unit.type)}
                      <span className="text-sm">{getTypeLabel(unit.type)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Building className="w-3 h-3 text-muted-foreground" />
                      {unit.floor}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Ruler className="w-3 h-3 text-muted-foreground" />
                      {formatArea(unit.area)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Euro className="w-3 h-3 text-muted-foreground" />
                      {formatPrice(unit.price)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={cn(
                        "text-xs text-white",
                        getStatusColor(unit.status)
                      )}
                    >
                      {getStatusLabel(unit.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {unit.linkedProperty ? (
                      <div className="flex items-center gap-1 text-sm text-primary">
                        <Link className="w-3 h-3" />
                        {unit.linkedProperty}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(unit)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Προβολή
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(unit)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Επεξεργασία
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => onDelete(unit.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Διαγραφή
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
