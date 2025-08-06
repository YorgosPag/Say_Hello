'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Home, Users, Ruler, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock nearby projects data
const nearbyProjects = [
    {
        id: 1,
        name: "Εμπορικό Κέντρο Κολωνάκι",
        distance: "200m",
        status: "active",
        type: "commercial",
        progress: 65
    },
    {
        id: 2,
        name: "Κατοικίες Μαρασλή",
        distance: "350m",
        status: "completed",
        type: "residential",
        progress: 100
    },
    {
        id: 3,
        name: "Γραφεία Σκουφά",
        distance: "120m",
        status: "planning",
        type: "office",
        progress: 15
    }
];

interface InteractiveMapProps {
    building: { name: string };
    coordinates: { lat: number; lng: number };
    mapView: 'satellite' | 'street' | 'hybrid';
    showNearbyProjects: boolean;
    setShowNearbyProjects: (show: boolean) => void;
    selectedLayer: 'all' | 'active' | 'completed';
    setSelectedLayer: (layer: 'all' | 'active' | 'completed') => void;
}

export function InteractiveMap({
    building,
    mapView,
    showNearbyProjects,
    setShowNearbyProjects,
    selectedLayer,
    setSelectedLayer,
}: InteractiveMapProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Διαδραστικός Χάρτης</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Map Container - Simulated */}
                <div className="relative h-96 bg-gradient-to-br from-green-100 via-blue-50 to-green-100 rounded-lg border-2 border-dashed border-border overflow-hidden">
                    {/* Simulated Map Background */}
                    <div className="absolute inset-0">
                        <div className="w-full h-full relative">
                            {/* Grid pattern to simulate map */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
                                    {Array.from({ length: 96 }).map((_, i) => (
                                        <div key={i} className="border border-border/50"></div>
                                    ))}
                                </div>
                            </div>

                            {/* Main Building Marker */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                                <div className="relative group">
                                    <div className="animate-bounce">
                                        <div className="bg-red-500 p-3 rounded-full shadow-lg border-4 border-white">
                                            <Building2 className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <div className="absolute top-14 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                        {building.name}
                                    </div>
                                </div>
                            </div>

                            {/* Nearby Projects */}
                            {showNearbyProjects && nearbyProjects.map((project, index) => (
                                <div
                                    key={project.id}
                                    className={`absolute z-10 transform -translate-x-1/2 -translate-y-1/2`}
                                    style={{
                                        top: `${40 + (index * 15)}%`,
                                        left: `${35 + (index * 20)}%`
                                    }}
                                >
                                    <div className="group relative">
                                        <div className={cn(
                                            "p-2 rounded-full shadow-md border-2 border-white cursor-pointer transition-transform hover:scale-110",
                                            project.status === 'active' ? 'bg-blue-500' :
                                                project.status === 'completed' ? 'bg-green-500' :
                                                    'bg-yellow-500'
                                        )}>
                                            <div className="w-4 h-4 text-white flex items-center justify-center">
                                                {project.type === 'commercial' ? <Home className="w-3 h-3" /> :
                                                    project.type === 'residential' ? <Building2 className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                                            </div>
                                        </div>

                                        {/* Hover tooltip */}
                                        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white px-3 py-2 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="font-medium">{project.name}</div>
                                            <div className="text-gray-300">{project.distance} • {project.progress}%</div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Distance circles */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="w-32 h-32 border-2 border-blue-300 border-dashed rounded-full opacity-30"></div>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-blue-200 border-dashed rounded-full opacity-20"></div>
                            </div>

                            {/* Scale indicator */}
                            <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-3 py-2 rounded text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-16 h-1 bg-black"></div>
                                    <span>100m</span>
                                </div>
                            </div>

                            {/* Map type indicator */}
                            <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-2 rounded text-sm font-medium">
                                {mapView === 'street' ? 'Χάρτης δρόμων' :
                                    mapView === 'satellite' ? 'Δορυφορική όψη' :
                                        'Υβριδική όψη'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map Controls */}
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="nearby-projects"
                                checked={!!showNearbyProjects}
                                onCheckedChange={(checked) => setShowNearbyProjects(!!checked)}
                            />
                            <Label htmlFor="nearby-projects" className="text-sm">
                                Εμφάνιση γειτονικών έργων
                            </Label>
                        </div>

                        <div className="flex items-center gap-2">
                            <Label className="text-sm">Φίλτρο:</Label>
                            <Select value={selectedLayer} onValueChange={(value) => setSelectedLayer(value as any)}>
                                <SelectTrigger className="w-[180px] h-9 text-sm">
                                    <SelectValue placeholder="Επιλογή φίλτρου" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Όλα τα έργα</SelectItem>
                                    <SelectItem value="active">Ενεργά μόνο</SelectItem>
                                    <SelectItem value="completed">Ολοκληρωμένα μόνο</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                            <ZoomIn className="w-4 h-4 mr-2" /> Zoom In
                        </Button>
                        <Button variant="outline" size="sm">
                            <ZoomOut className="w-4 h-4 mr-2" /> Zoom Out
                        </Button>
                        <Button variant="outline" size="sm">
                            <Ruler className="w-4 h-4 mr-2" /> Μέτρηση απόστασης
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
