
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';

// Mock version data
const mockVersions = [
    {
        id: 'v_1722956400000',
        buildingId: 'building-1',
        timestamp: { toDate: () => new Date(1722956400000) },
        author: { name: 'Γιώργος Παπαδόπουλος' },
        message: 'Αρχική διάταξη ορόφου',
        type: 'milestone',
        size: 15320,
        stats: { polygons: 5, objects: 12 },
        thumbnail: 'https://placehold.co/128x128.png'
    },
    {
        id: 'v_1722960000000',
        buildingId: 'building-1',
        timestamp: { toDate: () => new Date(1722960000000) },
        author: { name: 'Μαρία Ιωάννου' },
        message: 'Αυτόματη αποθήκευση',
        type: 'auto',
        size: 15450,
        stats: { polygons: 5, objects: 12 },
        thumbnail: 'https://placehold.co/128x128.png',
        diff: { added: [], removed: [], modified: ['prop-2'], changes: 1 }
    },
    {
        id: 'v_1722963600000',
        buildingId: 'building-1',
        timestamp: { toDate: () => new Date(1722963600000) },
        author: { name: 'Γιώργος Παπαδόπουλος' },
        message: 'Προσθήκη νέας αποθήκης',
        type: 'manual',
        size: 16100,
        stats: { polygons: 6, objects: 14 },
        thumbnail: 'https://placehold.co/128x128.png',
        diff: { added: ['prop-7'], removed: [], modified: [], changes: 1 }
    }
];

export function VersionHistoryPanel({ buildingId, isOpen, onClose }: { buildingId: string; isOpen: boolean; onClose: () => void; }) {
    const { toast } = useToast();
    const [versions, setVersions] = useState<any[]>([]);
    const [selectedVersion, setSelectedVersion] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            // Simulate fetching data
            setTimeout(() => {
                setVersions(mockVersions.sort((a,b) => b.timestamp.toDate().getTime() - a.timestamp.toDate().getTime()));
                setLoading(false);
            }, 500);
        }
    }, [isOpen, buildingId]);

    const handleRestore = async (versionId: string) => {
        if (!confirm('Είστε σίγουροι ότι θέλετε να επαναφέρετε αυτή την έκδοση; Η τρέχουσα κατάσταση θα αποθηκευτεί ως νέα έκδοση.')) return;
        toast({ title: "Επαναφορά...", description: `Η έκδοση ${versionId} επαναφέρεται.`});
        // In a real app, you would call the versioning system here.
        setTimeout(() => {
             toast({ variant: 'success', title: 'Επιτυχία', description: 'Η έκδοση επαναφέρθηκε.' });
             onClose();
        }, 1000);
    };

    const handleCreateMilestone = async () => {
        const name = prompt('Όνομα οροσήμου:');
        if (!name) return;
        toast({ title: "Δημιουργία Οροσήμου...", description: `Το ορόσημο "${name}" δημιουργείται.`});
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString('el-GR');
    };

    const formatSize = (bytes: number) => {
        if (!bytes) return '0 B';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[80vh] flex flex-col">
                <div className="p-6 border-b flex items-center justify-between shrink-0">
                    <h2 className="text-2xl font-bold">Ιστορικό Εκδόσεων</h2>
                    <div className="flex items-center gap-4">
                        <Button onClick={handleCreateMilestone}>Δημιουργία Οροσήμου</Button>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
                
                <div className="flex-1 flex overflow-hidden">
                    <ScrollArea className="w-2/3 border-r">
                        {loading ? (
                            <div className="p-4 space-y-2">
                                {Array.from({length: 5}).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
                            </div>
                        ) : (
                            <div className="p-4 space-y-2">
                                {versions.map((version) => (
                                    <div
                                        key={version.id}
                                        onClick={() => setSelectedVersion(version)}
                                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                            selectedVersion?.id === version.id
                                                ? 'border-primary bg-primary/10'
                                                : 'border-border hover:bg-muted/50'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-medium">{version.message}</h4>
                                                    {version.type === 'milestone' && <Badge variant="outline" className="border-yellow-400 bg-yellow-50 text-yellow-700">Ορόσημο</Badge>}
                                                    {version.type === 'auto' && <Badge variant="secondary">Auto</Badge>}
                                                </div>
                                                <div className="text-sm text-muted-foreground mt-1">{version.author?.name} • {formatDate(version.timestamp)}</div>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    {version.stats.polygons} polygons • {version.stats.objects} objects • {formatSize(version.size)}
                                                </div>
                                            </div>
                                            {version.thumbnail && <img src={version.thumbnail} alt="Thumbnail" className="w-16 h-16 object-cover rounded ml-4 border" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                    
                    <ScrollArea className="w-1/3">
                         <div className="p-6">
                            {selectedVersion ? (
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg">Λεπτομέρειες Έκδοσης</h3>
                                    <div className="space-y-2 text-sm">
                                        <div><span className="text-muted-foreground">ID:</span><span className="ml-2 font-mono text-xs">{selectedVersion.id}</span></div>
                                        <div><span className="text-muted-foreground">Δημιουργός:</span><span className="ml-2">{selectedVersion.author?.name}</span></div>
                                        <div><span className="text-muted-foreground">Ημερομηνία:</span><span className="ml-2">{formatDate(selectedVersion.timestamp)}</span></div>
                                        <div><span className="text-muted-foreground">Μέγεθος:</span><span className="ml-2">{formatSize(selectedVersion.size)}</span></div>
                                    </div>
                                    
                                    {selectedVersion.diff && (
                                        <div className="bg-muted/50 p-3 rounded-lg border">
                                            <h4 className="font-medium mb-2 text-sm">Αλλαγές:</h4>
                                            <div className="text-sm space-y-1">
                                                <div className="text-green-600">+ {selectedVersion.diff.added.length} προσθήκες</div>
                                                <div className="text-blue-600">~ {selectedVersion.diff.modified.length} τροποποιήσεις</div>
                                                <div className="text-red-600">- {selectedVersion.diff.removed.length} διαγραφές</div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {selectedVersion.thumbnail && (
                                        <div>
                                            <h4 className="font-medium mb-2 text-sm">Προεπισκόπηση:</h4>
                                            <img src={selectedVersion.thumbnail} alt="Version preview" className="w-full rounded border" />
                                        </div>
                                    )}
                                    
                                    <div className="flex gap-2 pt-4">
                                        <Button onClick={() => handleRestore(selectedVersion.id)} className="flex-1">Επαναφορά</Button>
                                        <Button variant="outline" className="flex-1">Σύγκριση</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-muted-foreground pt-20">
                                    <p>Επιλέξτε μια έκδοση για να δείτε τις λεπτομέρειες.</p>
                                </div>
                            )}
                         </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}

