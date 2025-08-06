
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Link2, X, Trash2, Plus } from 'lucide-react';
import type { Property } from '@/types/property-viewer';
import type { Connection, ConnectionType, PropertyGroup } from '@/types/connections';
import { useToast } from '@/hooks/use-toast';

interface SimpleConnectionPanelProps {
    properties: Property[];
    selectedPropertyIds: string[];
    connections: Connection[];
    setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
    groups: PropertyGroup[];
    setGroups: React.Dispatch<React.SetStateAction<PropertyGroup[]>>;
    isConnecting: boolean;
    setIsConnecting: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SimpleConnectionPanel({
    properties,
    selectedPropertyIds,
    connections,
    setConnections,
    groups,
    setGroups,
    isConnecting,
    setIsConnecting,
}: SimpleConnectionPanelProps) {
    const { toast } = useToast();
    const [connectionType, setConnectionType] = useState<ConnectionType>('related');

    const toggleConnectionMode = () => {
        setIsConnecting(!isConnecting);
        if (!isConnecting) {
            toast({ title: "Ενεργοποίηση Σύνδεσης", description: "Επιλέξτε δύο ακίνητα για να τα συνδέσετε."});
        } else {
            toast({ title: "Απενεργοποίηση Σύνδεσης", variant: "info" });
        }
    };
    
    const createGroup = () => {
        const groupName = prompt('Εισάγετε όνομα για την ομάδα:');
        if (!groupName || selectedPropertyIds.length < 2) {
            toast({ title: "Αποτυχία Ομαδοποίησης", description: "Πρέπει να επιλέξετε τουλάχιστον 2 ακίνητα.", variant: "destructive" });
            return;
        }

        const newGroup: PropertyGroup = {
            id: `group_${Date.now()}`,
            name: groupName,
            propertyIds: selectedPropertyIds,
            color: '#3B82F6',
        };

        setGroups(prev => [...prev, newGroup]);
        toast({ title: "Επιτυχία", description: `Η ομάδα "${groupName}" δημιουργήθηκε.`});
    };

    const clearConnections = () => {
        setConnections([]);
        toast({ title: "Επιτυχία", description: "Όλες οι συνδέσεις διαγράφηκαν."});
    };
    
    const deleteGroup = (groupId: string) => {
        setGroups(prev => prev.filter(g => g.id !== groupId));
    }
    
    const connectionTypeColors: Record<ConnectionType, string> = {
      sameBuilding: 'bg-blue-500',
      sameFloor: 'bg-green-500',
      related: 'bg-purple-500',
      parking: 'bg-yellow-500'
    };


    return (
        <div className="space-y-4">
            <h4 className="font-semibold text-sm">Συνδέσεις & Ομαδοποίηση</h4>
            
            <div className="space-y-2">
                <Label htmlFor="connection-type" className="text-xs">Τύπος Σύνδεσης</Label>
                <Select value={connectionType} onValueChange={(v) => setConnectionType(v as ConnectionType)}>
                    <SelectTrigger id="connection-type">
                        <SelectValue placeholder="Επιλογή τύπου" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="related">Σχετικά</SelectItem>
                        <SelectItem value="sameBuilding">Ίδιο Κτίριο</SelectItem>
                        <SelectItem value="sameFloor">Ίδιος Όροφος</SelectItem>
                        <SelectItem value="parking">Με Parking</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            <Button onClick={toggleConnectionMode} className="w-full" variant={isConnecting ? "destructive" : "default"}>
                {isConnecting ? <X className="mr-2 h-4 w-4"/> : <Link2 className="mr-2 h-4 w-4"/>}
                {isConnecting ? 'Ακύρωση Σύνδεσης' : 'Νέα Σύνδεση'}
            </Button>
            
            <Button onClick={createGroup} className="w-full" variant="outline" disabled={selectedPropertyIds.length < 2}>
                <Plus className="mr-2 h-4 w-4"/>
                Δημιουργία Ομάδας ({selectedPropertyIds.length} επιλεγμένα)
            </Button>
            
            <Button onClick={clearConnections} className="w-full" variant="outline" disabled={connections.length === 0}>
                <Trash2 className="mr-2 h-4 w-4"/>
                Καθαρισμός Συνδέσεων
            </Button>

            {groups.length > 0 && (
                <div className="border-t pt-3 space-y-2">
                    <h5 className="text-xs font-medium">Ομάδες</h5>
                    <div className="space-y-1">
                        {groups.map(group => (
                            <div key={group.id} className="flex justify-between items-center text-xs p-2 bg-muted rounded-md">
                                <span>{group.name}</span>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-destructive" onClick={() => deleteGroup(group.id)}>
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="border-t pt-3">
                <h5 className="text-xs font-medium mb-2">Υπόμνημα</h5>
                <div className="space-y-1 text-xs text-muted-foreground">
                    {Object.entries(connectionTypeColors).map(([type, colorClass]) => (
                        <div key={type} className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-sm ${colorClass}`}></div>
                            <span>{type === 'related' ? 'Σχετικό' : type === 'sameBuilding' ? 'Ίδιο Κτίριο' : type === 'sameFloor' ? 'Ίδιος Όροφος' : 'Parking'}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

