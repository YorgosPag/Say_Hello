'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Home, 
  Clock, 
  MapPin, 
  TrendingUp, 
  Archive,
  FileText,
  Settings,
  Camera,
  Video
} from 'lucide-react';
import type { Building } from '../BuildingsPageContent';
import { StorageTab } from '../StorageTab';
import { GeneralTabContent } from '../tabs/GeneralTabContent';
import TimelineTabContent from '../tabs/TimelineTabContent';
import MapTabContent from '../tabs/MapTabContent';
import AnalyticsTabContent from '../tabs/AnalyticsTabContent';
import PhotosTabContent from '../tabs/PhotosTabContent';
import VideosTabContent from '../tabs/VideosTabContent';
import PlaceholderTab from '../tabs/PlaceholderTab';

interface BuildingTabsProps {
    building: Building;
}

export function BuildingTabs({ building }: BuildingTabsProps) {
    return (
        <Tabs defaultValue="general" className="h-full">
            <TabsList className="grid w-full grid-cols-9 mb-6">
                <TabsTrigger value="general" className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Γενικά
                </TabsTrigger>
                <TabsTrigger value="timeline" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Timeline
                </TabsTrigger>
                <TabsTrigger value="map" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Χάρτης
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Analytics
                </TabsTrigger>
                <TabsTrigger value="storage" className="flex items-center gap-2">
                    <Archive className="w-4 h-4" />
                    Αποθήκες & Parking
                </TabsTrigger>
                <TabsTrigger value="contracts" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Συμβόλαια
                </TabsTrigger>
                <TabsTrigger value="protocols" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Πρωτόκολλα
                </TabsTrigger>
                <TabsTrigger value="photos" className="flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Φωτογραφίες
                </TabsTrigger>
                <TabsTrigger value="videos" className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Videos
                </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-0">
                <GeneralTabContent building={building} />
            </TabsContent>

            <TabsContent value="timeline" className="mt-0">
                <TimelineTabContent building={building} />
            </TabsContent>

            <TabsContent value="map" className="mt-0">
                <MapTabContent building={building} />
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-0">
                <AnalyticsTabContent building={building} />
            </TabsContent>

            <TabsContent value="storage" className="mt-0">
                <StorageTab building={building} />
            </TabsContent>

            <TabsContent value="contracts" className="mt-0">
                <PlaceholderTab title="Συμβόλαια Πελατών" icon={FileText} />
            </TabsContent>

            <TabsContent value="protocols" className="mt-0">
                <PlaceholderTab title="Υ.Δ.Τοιχοποιίας & Πρωτόκολλα" icon={Settings} />
            </TabsContent>

            <TabsContent value="photos" className="mt-0">
                <PhotosTabContent />
            </TabsContent>

            <TabsContent value="videos" className="mt-0">
                <VideosTabContent />
            </TabsContent>
        </Tabs>
    );
}
