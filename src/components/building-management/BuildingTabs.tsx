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
import type { Building } from './BuildingsPageContent';
import { StorageTab } from './StorageTab';
import { GeneralTabContent } from './tabs/GeneralTabContent';
import TimelineTabContent from './tabs/TimelineTabContent';
import AnalyticsTabContent from './tabs/AnalyticsTabContent';
import PhotosTabContent from './tabs/PhotosTabContent';
import VideosTabContent from './tabs/VideosTabContent';
import PlaceholderTab from './tabs/PlaceholderTab';

interface BuildingTabsProps {
    building: Building;
}

const tabConfig = [
    { value: 'general', label: 'Γενικά', icon: Home, component: GeneralTabContent },
    { value: 'timeline', label: 'Timeline', icon: Clock, component: TimelineTabContent },
    { value: 'analytics', label: 'Analytics', icon: TrendingUp, component: AnalyticsTabContent },
    { value: 'storage', label: 'Αποθήκες & Parking', icon: Archive, component: StorageTab },
    { value: 'contracts', label: 'Συμβόλαια', icon: FileText, component: (props: any) => <PlaceholderTab title="Συμβόλαια Πελατών" icon={FileText} {...props} /> },
    { value: 'protocols', label: 'Πρωτόκολλα', icon: Settings, component: (props: any) => <PlaceholderTab title="Υ.Δ.Τοιχοποιίας & Πρωτόκολλα" icon={Settings} {...props} /> },
    { value: 'photos', label: 'Φωτογραφίες', icon: Camera, component: PhotosTabContent },
    { value: 'videos', label: 'Videos', icon: Video, component: VideosTabContent },
];

export function BuildingTabs({ building }: BuildingTabsProps) {
    return (
        <Tabs defaultValue="general" className="h-full">
            <TabsList className={`grid w-full grid-cols-${tabConfig.length} mb-6`}>
                {tabConfig.map(tab => (
                    <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>

            {tabConfig.map(tab => (
                <TabsContent key={tab.value} value={tab.value} className="mt-0">
                    <tab.component building={building} />
                </TabsContent>
            ))}
        </Tabs>
    );
}
