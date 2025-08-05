'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Eye, 
  Folder, 
  Edit, 
  Save, 
  Download, 
  Upload,
  Camera,
  Video,
  FileText,
  Calendar,
  MapPin,
  Building2,
  Home,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  Star,
  Share,
  Printer,
  Settings,
  AlertCircle,
  CheckCircle,
  Info,
  Plus,
  X,
  Image as ImageIcon,
  File,
  Trash2,
  FileUp,
  FileImage,
  Globe,
  Satellite,
  Map as MapIcon,
  ZoomIn,
  ZoomOut,
  Ruler,
  BarChart3,
  Scale,
  Archive
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Building } from './BuildingsPageContent';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StorageTab } from './StorageTab';
import { GeneralTabContent } from './tabs/GeneralTabContent';
import TimelineTabContent from './tabs/TimelineTabContent';
import MapTabContent from './tabs/MapTabContent';

const AnalyticsTabContent = ({ building }: { building: Building }) => {
  const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M' | '1Y'>('6M');
  const [analyticsView, setAnalyticsView] = useState<'overview' | 'financial' | 'progress' | 'comparison'>('overview');

  // Mock analytics data
  const costBreakdown = [
    { category: 'Υλικά', amount: 450000, percentage: 45, color: 'bg-blue-500' },
    { category: 'Εργατικά', amount: 300000, percentage: 30, color: 'bg-green-500' },
    { category: 'Μηχανήματα', amount: 150000, percentage: 15, color: 'bg-yellow-500' },
    { category: 'Άλλα', amount: 100000, percentage: 10, color: 'bg-purple-500' }
  ];

  const monthlyProgress = [
    { month: 'Ιαν', planned: 10, actual: 8, cost: 85000 },
    { month: 'Φεβ', planned: 20, actual: 18, cost: 92000 },
    { month: 'Μαρ', planned: 35, actual: 32, cost: 98000 },
    { month: 'Απρ', planned: 50, actual: 48, cost: 105000 },
    { month: 'Μάι', planned: 65, actual: 62, cost: 89000 },
    { month: 'Ιουν', planned: 80, actual: 75, cost: 94000 },
    { month: 'Ιουλ', planned: 90, actual: 85, cost: 87000 }
  ];

  const kpis = {
    costEfficiency: 92.5,
    timeEfficiency: 88.7,
    qualityScore: 95.2,
    riskLevel: 'Χαμηλός',
    roi: 15.8,
    profitMargin: 12.3
  };

  const getEfficiencyColor = (value: number) => {
    if (value >= 90) return 'text-green-600 bg-green-50 dark:bg-green-950/20 dark:text-green-400';
    if (value >= 75) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20 dark:text-yellow-400';
    return 'text-red-600 bg-red-50 dark:bg-red-950/20 dark:text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Advanced Analytics</h3>
          <p className="text-sm text-muted-foreground">
            Προχωρημένη ανάλυση δεδομένων και KPIs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1M">Τελευταίο μήνα</SelectItem>
              <SelectItem value="3M">Τελευταίους 3 μήνες</SelectItem>
              <SelectItem value="6M">Τελευταίους 6 μήνες</SelectItem>
              <SelectItem value="1Y">Τελευταίο έτος</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" /> Εξαγωγή Αναφοράς
          </Button>
        </div>
      </div>

      {/* Analytics Navigation */}
      <div className="flex gap-2">
        {[
          { id: 'overview', label: 'Επισκόπηση', icon: <BarChart3 className="w-4 h-4 mr-2" /> },
          { id: 'financial', label: 'Οικονομικά', icon: <DollarSign className="w-4 h-4 mr-2" /> },
          { id: 'progress', label: 'Πρόοδος', icon: <TrendingUp className="w-4 h-4 mr-2" /> },
          { id: 'comparison', label: 'Σύγκριση', icon: <Scale className="w-4 h-4 mr-2" /> }
        ].map((view) => (
          <Button
            key={view.id}
            variant={analyticsView === view.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAnalyticsView(view.id as any)}
          >
            {view.icon} {view.label}
          </Button>
        ))}
      </div>

      {/* KPI Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{kpis.costEfficiency}%</div>
              <div className="text-xs text-muted-foreground">Κοστολογική Αποδοτικότητα</div>
              <div className={cn("text-xs px-2 py-1 rounded mt-1", getEfficiencyColor(kpis.costEfficiency))}>
                {kpis.costEfficiency >= 90 ? 'Άριστα' : kpis.costEfficiency >= 75 ? 'Καλά' : 'Χρήζει βελτίωσης'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{kpis.timeEfficiency}%</div>
              <div className="text-xs text-muted-foreground">Χρονική Αποδοτικότητα</div>
              <div className={cn("text-xs px-2 py-1 rounded mt-1", getEfficiencyColor(kpis.timeEfficiency))}>
                {kpis.timeEfficiency >= 90 ? 'Άριστα' : kpis.timeEfficiency >= 75 ? 'Καλά' : 'Χρήζει βελτίωσης'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{kpis.qualityScore}%</div>
              <div className="text-xs text-muted-foreground">Δείκτης Ποιότητας</div>
              <div className={cn("text-xs px-2 py-1 rounded mt-1", getEfficiencyColor(kpis.qualityScore))}>
                Εξαιρετικό
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{kpis.roi}%</div>
              <div className="text-xs text-muted-foreground">ROI</div>
              <div className="text-xs px-2 py-1 rounded mt-1 bg-green-50 text-green-600">
                Πάνω από στόχο
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{kpis.profitMargin}%</div>
              <div className="text-xs text-muted-foreground">Περιθώριο Κέρδους</div>
              <div className="text-xs px-2 py-1 rounded mt-1 bg-green-50 text-green-600">
                Εντός στόχων
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{kpis.riskLevel}</div>
              <div className="text-xs text-muted-foreground">Επίπεδο Κινδύνου</div>
              <div className="text-xs px-2 py-1 rounded mt-1 bg-green-50 text-green-600">
                Υπό έλεγχο
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Content */}
      {analyticsView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Ανάλυση Κόστους</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {costBreakdown.map((item) => (
                  <div key={item.category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{item.category}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.amount.toLocaleString('el-GR')}€ ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className={cn("h-3 rounded-full transition-all duration-500", item.color)}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <div className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">💡 Ανάλυση</div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Το κόστος υλικών είναι 5% υψηλότερο από τον μέσο όρο της αγοράς. 
                  Συνιστάται επαναδιαπραγμάτευση με προμηθευτές.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Πρόοδος vs Προγραμματισμός</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyProgress.map((month) => (
                  <div key={month.month} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{month.month}</span>
                      <span className="text-xs text-muted-foreground">
                        Προγρ: {month.planned}% | Πραγμ: {month.actual}%
                      </span>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-muted rounded-full h-4">
                        <div 
                          className="h-4 bg-blue-200 dark:bg-blue-800 rounded-full"
                          style={{ width: `${month.planned}%` }}
                        ></div>
                        <div 
                          className="absolute top-0 h-4 bg-primary rounded-full"
                          style={{ width: `${month.actual}%` }}
                        ></div>
                        <div className="absolute right-2 top-0 text-xs font-medium text-primary-foreground">
                          {month.actual}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {analyticsView === 'financial' && (
        <div className="space-y-6">
          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-lg font-bold text-green-600">
                  {building.totalValue.toLocaleString('el-GR')}€
                </div>
                <div className="text-xs text-muted-foreground">Συνολικός Προϋπολογισμός</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-lg font-bold text-blue-600">
                  {(building.totalValue * 0.75).toLocaleString('el-GR')}€
                </div>
                <div className="text-xs text-muted-foreground">Δαπανηθέν Κόστος</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-lg font-bold text-orange-600">
                  {(building.totalValue * 0.25).toLocaleString('el-GR')}€
                </div>
                <div className="text-xs text-muted-foreground">Υπόλοιπο Budget</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-lg font-bold text-purple-600">
                  {((building.totalValue / building.totalArea)).toLocaleString('el-GR')}€/m²
                </div>
                <div className="text-xs text-muted-foreground">Κόστος ανά m²</div>
              </CardContent>
            </Card>
          </div>

          {/* Cash Flow */}
          <Card>
            <CardHeader>
              <CardTitle>Ταμειακές Ροές</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyProgress.map((month, index) => (
                  <div key={month.month} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium w-12">{month.month}</div>
                      <div className="text-sm text-muted-foreground">
                        Μηνιαία δαπάνη: {month.cost.toLocaleString('el-GR')}€
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        Σωρευτικό: {monthlyProgress.slice(0, index + 1).reduce((sum, m) => sum + m.cost, 0).toLocaleString('el-GR')}€
                      </div>
                      <div className={cn(`text-sm px-2 py-1 rounded`,
                        month.cost < 95000 ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                      )}>
                        {month.cost < 95000 ? 'Εντός budget' : 'Προσοχή'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {analyticsView === 'progress' && (
        <Card>
          <CardHeader>
            <CardTitle>Ανάλυση Προόδου</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{building.progress}%</div>
                  <div className="text-sm text-muted-foreground">Συνολική Πρόοδος</div>
                  <Progress value={building.progress} className="mt-2 h-3" />
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">88%</div>
                  <div className="text-sm text-muted-foreground">Αποδοτικότητα</div>
                   <Progress value={88} className="mt-2 h-3" />
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold text-orange-600 mb-2">12</div>
                  <div className="text-sm text-muted-foreground">Ημέρες Καθυστέρηση</div>
                  <div className="mt-2 text-xs text-orange-600">
                    Εντός αποδεκτών ορίων
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg">
                <h4 className="font-semibold text-foreground mb-4">🎯 Προβλέψεις & Συστάσεις</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-green-700 dark:text-green-400 mb-2">✅ Θετικά Σημεία:</div>
                    <ul className="space-y-1 text-green-600 dark:text-green-500">
                      <li>• Ποιότητα εργασιών πάνω από τα standards</li>
                      <li>• Κόστος υλικών εντός προϋπολογισμού</li>
                      <li>• Ομάδα εργασίας αποδοτική</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-medium text-orange-700 dark:text-orange-400 mb-2">⚠️ Προτεινόμενες Βελτιώσεις:</div>
                    <ul className="space-y-1 text-orange-600 dark:text-orange-500">
                      <li>• Επιτάχυνση ηλ/μηχ εγκαταστάσεων</li>
                      <li>• Προπαραγγελία υλικών τελικών εργασιών</li>
                      <li>• Συντονισμός με τρίτους (ανελκυστήρες)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {analyticsView === 'comparison' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Σύγκριση με Παρόμοια Έργα</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { metric: 'Κόστος/m²', current: '700€', average: '750€', status: 'better' },
                  { metric: 'Χρόνος ολοκλήρωσης', current: '36 μήνες', average: '32 μήνες', status: 'worse' },
                  { metric: 'Ποιότητα εργασιών', current: '9.5/10', average: '8.2/10', status: 'better' },
                  { metric: 'Αποδοτικότητα', current: '88%', average: '82%', status: 'better' }
                ].map((item) => (
                  <div key={item.metric} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{item.metric}</div>
                      <div className="text-sm text-muted-foreground">
                        Τρέχον: {item.current} | Μέσος όρος: {item.average}
                      </div>
                    </div>
                    <div className={cn(`px-3 py-1 rounded text-sm`,
                      item.status === 'better' 
                        ? 'bg-green-50 text-green-600' 
                        : 'bg-red-50 text-red-600'
                    )}>
                      {item.status === 'better' ? '↗️ Καλύτερα' : '↘️ Χειρότερα'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

const PhotosTabContent = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          // Here you would typically add the new photos to your state
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Φωτογραφίες Κτιρίου</h3>
        <Button asChild>
          <Label className="cursor-pointer">
            <Upload className="w-4 h-4 mr-2" />
            Ανέβασμα Φωτογραφιών
            <input 
              type="file" 
              multiple 
              accept="image/*"
              className="hidden" 
              onChange={(e) => handleFileUpload(e.target.files)}
            />
          </Label>
        </Button>
      </div>

      {/* Drag & Drop Zone */}
      <div 
        className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer bg-muted/20 hover:bg-primary/10"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFileUpload(e.dataTransfer.files);
        }}
      >
        <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-lg font-medium text-foreground mb-2">Σύρετε φωτογραφίες εδώ</p>
        <p className="text-sm text-muted-foreground">ή κάντε κλικ για επιλογή αρχείων</p>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Ανέβασμα σε εξέλιξη...</p>
                <Progress value={uploadProgress} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">{uploadProgress}% ολοκληρώθηκε</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Existing Photos */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Sample Photo */}
        <div className="relative group">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <img 
              data-ai-hint="building construction"
              src="https://placehold.co/400x400.png"
              alt="Building progress"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 flex gap-2">
              <Button size="sm" variant="secondary">
                <Eye className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="secondary">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
            Πρόοδος Φεβ 2025
          </div>
        </div>

        {/* Add more placeholder */}
        {[1, 2, 3, 4, 5].map((index) => (
          <div key={index} className="aspect-square bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer group">
            <div className="text-center">
              <ImageIcon className="w-8 h-8 text-muted-foreground group-hover:text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Προσθήκη Φωτογραφίας</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const VideosTabContent = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold">Videos Κτιρίου</h3>
      <Button>
        <Upload className="w-4 h-4 mr-2" />
        Ανέβασμα Video
      </Button>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((index) => (
        <div key={index} className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border hover:border-blue-400 transition-colors cursor-pointer group">
          <div className="text-center">
            <Video className="w-8 h-8 text-muted-foreground group-hover:text-blue-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Προσθήκη Video</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PlaceholderTab = ({ title, icon: Icon }: { title: string; icon: any }) => (
  <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-border rounded-lg bg-muted/50">
    <Icon className="w-12 h-12 text-muted-foreground mb-4" />
    <h2 className="text-xl font-semibold text-muted-foreground mb-2">{title}</h2>
    <p className="text-sm text-muted-foreground text-center max-w-md">
      Αυτή η ενότητα θα αναπτυχθεί σύντομα. Θα περιέχει όλες τις απαραίτητες λειτουργίες για τη διαχείριση {title.toLowerCase()}.
    </p>
    <Button variant="outline" className="mt-4">
      <Plus className="w-4 h-4 mr-2" />
      Προσθήκη {title}
    </Button>
  </div>
);

interface BuildingDetailsProps {
  building: Building | null;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export function BuildingDetails({ building, getStatusColor, getStatusLabel }: BuildingDetailsProps) {
    if (!building) {
        return (
          <div className="flex-1 flex flex-col items-center justify-center bg-card border rounded-lg min-w-0 shadow-sm text-center p-8">
            <Building2 className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground">Επιλέξτε ένα κτίριο</h2>
            <p className="text-muted-foreground">Επιλέξτε ένα κτίριο από τη λίστα για να δείτε τις λεπτομέρείές του.</p>
          </div>
        );
    }

  return (
    <div className="flex-1 flex flex-col bg-card border rounded-lg min-w-0 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-sm">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground line-clamp-1">
                {building.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={cn("text-xs", getStatusColor(building.status).replace('bg-', 'bg-') + ' text-white')}>
                  {getStatusLabel(building.status)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {building.progress}% ολοκληρωμένο
                </span>
              </div>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <Eye className="w-4 h-4 mr-2" />
            Επίδειξη Κτιρίου
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
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
        </div>
      </ScrollArea>
    </div>
  );
}
