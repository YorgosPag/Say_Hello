'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
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
  FileImage
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

interface BuildingDetailsProps {
  building: Building;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

const GeneralTabContent = ({ building }: { building: Building }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    name: building.name,
    description: building.description || '',
    totalArea: building.totalArea,
    builtArea: building.builtArea,
    floors: building.floors,
    units: building.units,
    totalValue: building.totalValue,
    startDate: building.startDate || '',
    completionDate: building.completionDate || '',
    address: building.address || '',
    city: building.city || ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Auto-save functionality
  React.useEffect(() => {
    if (!isEditing) return;
    
    const timeoutId = setTimeout(() => {
      setAutoSaving(true);
      // Simulate API call
      setTimeout(() => {
        setAutoSaving(false);
        setLastSaved(new Date());
        console.log('Auto-saved:', formData);
      }, 1000);
    }, 2000); // Auto-save after 2 seconds of no changes

    return () => clearTimeout(timeoutId);
  }, [formData, isEditing]);

  // Validation
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Το όνομα είναι υποχρεωτικό';
    }
    if (formData.totalArea <= 0) {
      newErrors.totalArea = 'Η επιφάνεια πρέπει να είναι μεγαλύτερη από 0';
    }
    if (formData.builtArea > formData.totalArea) {
      newErrors.builtArea = 'Η δομημένη επιφάνεια δεν μπορεί να υπερβαίνει τη συνολική';
    }
    if (formData.floors <= 0) {
      newErrors.floors = 'Οι όροφοι πρέπει να είναι τουλάχιστον 1';
    }
    if (formData.units <= 0) {
      newErrors.units = 'Οι μονάδες πρέπει να είναι τουλάχιστον 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Smart calculations
  const costPerSqm = formData.totalArea > 0 ? (formData.totalValue / formData.totalArea) : 0;
  const buildingRatio = formData.totalArea > 0 ? (formData.builtArea / formData.totalArea * 100) : 0;

  const handleSave = () => {
    if (validateForm()) {
      setIsEditing(false);
      setLastSaved(new Date());
      console.log('Manual save:', formData);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Smart calculations
    if (field === 'totalArea' && value > 0) {
      // Auto-update built area to 80% if it's 0
      if (formData.builtArea === 0) {
        setFormData(prev => ({ 
          ...prev, 
          [field]: value,
          builtArea: Math.round(value * 0.8)
        }));
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Smart Header with Auto-save Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            ID: {building.id}
          </Badge>
          <Badge variant="outline">
            {building.category === 'residential' && 'Κατοικίες'}
            {building.category === 'commercial' && 'Εμπορικό'}
            {building.category === 'mixed' && 'Μικτή Χρήση'}
            {building.category === 'industrial' && 'Βιομηχανικό'}
          </Badge>
          
          {/* Auto-save indicator */}
          {isEditing && (
            <div className="flex items-center gap-2 text-xs">
              {autoSaving ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                  <span className="text-blue-600">Αποθήκευση...</span>
                </>
              ) : lastSaved ? (
                <>
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span className="text-green-600">
                    Αποθηκεύτηκε {lastSaved.toLocaleTimeString('el-GR')}
                  </span>
                </>
              ) : null}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Επεξεργασία
            </Button>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4 mr-2" />
                Ακύρωση
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Αποθήκευση
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Smart Form Fields */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Βασικές Πληροφορίες
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Τίτλος Κτιρίου *</Label>
            <Input 
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              disabled={!isEditing}
              className={cn(
                !isEditing && "bg-muted",
                errors.name && "border-red-500"
              )}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <Label>Περιγραφή Κτιρίου</Label>
            <Textarea 
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              disabled={!isEditing}
              className={cn(!isEditing && "bg-muted")}
              rows={3}
              placeholder="Περιγράψτε το κτίριο..."
            />
            <div className="text-xs text-muted-foreground text-right">
              {formData.description.length}/500 χαρακτήρες
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Smart Technical Specs with Live Calculations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Τεχνικά Χαρακτηριστικά
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <Label>Συνολική Επιφάνεια (m²) *</Label>
              <Input 
                type="number"
                value={formData.totalArea}
                onChange={(e) => updateField('totalArea', parseFloat(e.target.value) || 0)}
                disabled={!isEditing}
                className={cn(
                  !isEditing && "bg-muted",
                  errors.totalArea && "border-red-500"
                )}
              />
              {errors.totalArea && <p className="text-sm text-red-500">{errors.totalArea}</p>}
            </div>
            
            <div className="space-y-2">
              <Label>Δομημένη Επιφάνεια (m²) *</Label>
              <Input 
                type="number"
                value={formData.builtArea}
                onChange={(e) => updateField('builtArea', parseFloat(e.target.value) || 0)}
                disabled={!isEditing}
                className={cn(
                  !isEditing && "bg-muted",
                  errors.builtArea && "border-red-500"
                )}
              />
              {errors.builtArea && <p className="text-sm text-red-500">{errors.builtArea}</p>}
              {formData.totalArea > 0 && (
                <p className="text-xs text-muted-foreground">
                  Συντελεστής δόμησης: {buildingRatio.toFixed(1)}%
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Αριθμός Ορόφων *</Label>
              <Input 
                type="number"
                value={formData.floors}
                onChange={(e) => updateField('floors', parseInt(e.target.value) || 0)}
                disabled={!isEditing}
                className={cn(
                  !isEditing && "bg-muted",
                  errors.floors && "border-red-500"
                )}
              />
              {errors.floors && <p className="text-sm text-red-500">{errors.floors}</p>}
            </div>
            
            <div className="space-y-2">
              <Label>Αριθμός Μονάδων *</Label>
              <Input 
                type="number"
                value={formData.units}
                onChange={(e) => updateField('units', parseInt(e.target.value) || 0)}
                disabled={!isEditing}
                className={cn(
                  !isEditing && "bg-muted",
                  errors.units && "border-red-500"
                )}
              />
              {errors.units && <p className="text-sm text-red-500">{errors.units}</p>}
              {formData.floors > 0 && (
                <p className="text-xs text-muted-foreground">
                  ~{(formData.units / formData.floors).toFixed(1)} μονάδες/όροφο
                </p>
              )}
            </div>
          </div>

          {/* Live Calculations Display */}
          {formData.totalArea > 0 && formData.totalValue > 0 && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                💡 Αυτόματοι Υπολογισμοί
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 dark:text-blue-300">Κόστος/m²:</span>
                  <p className="font-semibold">{costPerSqm.toLocaleString('el-GR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}€</p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300">Συντ. Δόμησης:</span>
                  <p className="font-semibold">{buildingRatio.toFixed(1)}%</p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300">m²/Μονάδα:</span>
                  <p className="font-semibold">{formData.units > 0 ? (formData.builtArea / formData.units).toFixed(1) : 0} m²</p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300">Αξία/Μονάδα:</span>
                  <p className="font-semibold">{formData.units > 0 ? (formData.totalValue / formData.units).toLocaleString('el-GR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : 0}€</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress with Smart Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Πρόοδος Έργου
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Ποσοστό Ολοκλήρωσης</Label>
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                {building.progress}% Ολοκληρωμένο
              </Badge>
            </div>
            <Progress value={building.progress} className="h-3" />
            
            {/* Smart Progress Milestones */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
              <div className={cn("p-2 rounded text-center", building.progress >= 25 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600")}>
                <div className="font-medium">Θεμέλια</div>
                <div>0-25%</div>
              </div>
              <div className={cn("p-2 rounded text-center", building.progress >= 50 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600")}>
                <div className="font-medium">Κατασκευή</div>
                <div>25-50%</div>
              </div>
              <div className={cn("p-2 rounded text-center", building.progress >= 75 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600")}>
                <div className="font-medium">Ολοκληρώσεις</div>
                <div>50-75%</div>
              </div>
              <div className={cn("p-2 rounded text-center", building.progress >= 100 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600")}>
                <div className="font-medium">Παράδοση</div>
                <div>75-100%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Enhanced Project Files */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
               Αρχεία Έργου
            </CardTitle>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="cursor-pointer">
                <Label>
                  <Upload className="w-4 h-4 mr-2" />
                  Προσθήκη Αρχείων
                  <input type="file" multiple className="hidden" onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    console.log('Επιλέχθηκαν αρχεία:', files.map(f => f.name));
                  }} />
                </Label>
              </Button>
               <Button variant="outline" size="sm">
                <Camera className="w-4 h-4 mr-2" />
                Νέα Φωτογραφία
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            {/* Drag & Drop Zone */}
            <div 
                className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer bg-muted/20 hover:bg-muted/50"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('border-primary', 'bg-accent/20');
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove('border-primary', 'bg-accent/20');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-primary', 'bg-accent/20');
                  const files = Array.from(e.dataTransfer.files);
                  console.log('Αρχεία που έπεσαν:', files.map(f => f.name));
                }}
              >
                <div className="space-y-2">
                  <div className="mx-auto h-12 w-12 text-muted-foreground flex items-center justify-center">
                    <FileUp className="w-8 h-8" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-primary hover:underline cursor-pointer">
                      Κάντε κλικ για επιλογή αρχείων
                    </span>
                    {' '}ή σύρετε και αφήστε εδώ
                  </div>
                  <p className="text-xs text-muted-foreground/80">
                    PNG, JPG, PDF, DOC, XLS μέχρι 10MB
                  </p>
                </div>
            </div>

            {/* Existing Files */}
            <div className="mt-6 space-y-3">
              <h4 className="text-sm font-medium text-foreground">Υπάρχοντα Αρχεία</h4>
              
              {/* File Item */}
              <div className="flex items-center justify-between p-3 bg-card rounded-lg border hover:bg-muted/50">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 h-10 w-10 bg-red-100 dark:bg-red-950/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      Συγγραφή Υποχρεώσεων.pdf
                    </p>
                    <p className="text-xs text-muted-foreground">
                      2.4 MB • Ανέβηκε 15/02/2025
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                   <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4 mr-1" /> Προβολή
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4 mr-1" /> Λήψη
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Another File Item */}
              <div className="flex items-center justify-between p-3 bg-card rounded-lg border hover:bg-muted/50">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-950/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      Άδεια Οικοδομής.docx
                    </p>
                    <p className="text-xs text-muted-foreground">
                      1.8 MB • Ανέβηκε 10/02/2025
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                   <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4 mr-1" /> Προβολή
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4 mr-1" /> Λήψη
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Image File */}
              <div className="flex items-center justify-between p-3 bg-card rounded-lg border hover:bg-muted/50">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 h-10 w-10 bg-green-100 dark:bg-green-950/20 rounded-lg flex items-center justify-center">
                     <FileImage className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      Πρόοδος Κατασκευής Φεβ 2025.jpg
                    </p>
                    <p className="text-xs text-muted-foreground">
                      4.2 MB • Ανέβηκε σήμερα
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                   <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4 mr-1" /> Προβολή
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4 mr-1" /> Λήψη
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Upload Progress (when uploading) */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800" style={{display: 'none'}} id="upload-progress">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                    Ανέβασμα σε εξέλιξη...
                  </p>
                  <Progress value={45} className="h-2 mt-1" />
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                    2 από 5 αρχεία ολοκληρώθηκαν
                  </p>
                </div>
              </div>
            </div>
        </CardContent>
      </Card>


      {/* Legal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Νομικά Στοιχεία
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Αριθμός Συμβολαίου</Label>
              <Input disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Ημερομηνία Συμβολαίου</Label>
              <Input type="date" disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Αρχείο Συμβολαίου</Label>
              <Input disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Συμβολαιογράφος</Label>
              <Input disabled className="bg-muted" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Ρυθμίσεις
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox id="show-on-web" />
            <Label htmlFor="show-on-web">Προβολή στο διαδίκτυο</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const TimelineTabContent = ({ building }: { building: Building }) => {
  const [milestones] = useState([
    {
      id: 1,
      title: "Έναρξη Έργου",
      description: "Υπογραφή συμβολαίου και έναρξη εργασιών",
      date: "2006-05-02",
      status: "completed",
      progress: 100,
      type: "start"
    },
    {
      id: 2,
      title: "Θεμέλια & Υπόγειο",
      description: "Ολοκλήρωση εκσκαφών και κατασκευή θεμελίων",
      date: "2006-08-15",
      status: "completed",
      progress: 100,
      type: "construction"
    },
    {
      id: 3,
      title: "Κατασκευή Φέροντα Οργανισμού",
      description: "Σκελετός κτιρίου - όροφοι 1-7",
      date: "2007-12-20",
      status: "completed", 
      progress: 100,
      type: "construction"
    },
    {
      id: 4,
      title: "Τοιχοποιίες & Στεγανοποίηση",
      description: "Κλείσιμο κτιρίου και στεγανότητα",
      date: "2008-06-30",
      status: "completed",
      progress: 100,
      type: "construction"
    },
    {
      id: 5,
      title: "Ηλ/Μηχ Εγκαταστάσεις",
      description: "Ηλεκτρολογικές και μηχανολογικές εγκαταστάσεις",
      date: "2008-11-15",
      status: "in-progress",
      progress: 85,
      type: "systems"
    },
    {
      id: 6,
      title: "Τελικές Εργασίες",
      description: "Χρωματισμοί, δάπεδα, διακοσμητικά στοιχεία",
      date: "2009-01-30",
      status: "pending",
      progress: 45,
      type: "finishing"
    },
    {
      id: 7,
      title: "Παράδοση Έργου",
      description: "Τελικός έλεγχος και παράδοση στον πελάτη",
      date: "2009-02-28",
      status: "pending",
      progress: 0,
      type: "delivery"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 border-green-500';
      case 'in-progress': return 'bg-blue-500 border-blue-500';
      case 'pending': return 'bg-gray-300 border-gray-300';
      case 'delayed': return 'bg-red-500 border-red-500';
      default: return 'bg-gray-300 border-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Ολοκληρώθηκε';
      case 'in-progress': return 'Σε εξέλιξη';
      case 'pending': return 'Εκκρεμεί';
      case 'delayed': return 'Καθυστέρηση';
      default: return 'Άγνωστο';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'start': return '🚀';
      case 'construction': return '🏗️';
      case 'systems': return '⚡';
      case 'finishing': return '🎨';
      case 'delivery': return '🎯';
      default: return '📋';
    }
  };

  return (
    <div className="space-y-6">
      {/* Timeline Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Χρονοδιάγραμμα Έργου</h3>
          <p className="text-sm text-muted-foreground">
            Παρακολούθηση προόδου και milestones
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {milestones.filter(m => m.status === 'completed').length} / {milestones.length} ολοκληρώθηκαν
          </Badge>
        </div>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Συνολική Πρόοδος</span>
            <span className="text-2xl font-bold text-blue-600">{building.progress}%</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={building.progress} className="h-4 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">4</div>
              <div className="text-muted-foreground">Ολοκληρωμένα</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">1</div>
              <div className="text-muted-foreground">Σε εξέλιξη</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">2</div>
              <div className="text-muted-foreground">Εκκρεμεί</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {milestones.find(m => m.status === 'in-progress')?.date ? 
                  Math.ceil((new Date(milestones.find(m => m.status === 'in-progress')!.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) 
                  : 0
                }
              </div>
              <div className="text-muted-foreground">Ημέρες απομένουν</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Λεπτομερή Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="relative flex items-start gap-4">
                  {/* Timeline dot */}
                  <div className={cn(
                    "relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 shadow-sm",
                    getStatusColor(milestone.status),
                    milestone.status === 'completed' ? 'text-white' : 'text-gray-600'
                  )}>
                    <span className="text-lg">{getTypeIcon(milestone.type)}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {milestone.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs",
                            milestone.status === 'completed' ? 'bg-green-50 text-green-700 border-green-300' :
                            milestone.status === 'in-progress' ? 'bg-blue-50 text-blue-700 border-blue-300' :
                            'bg-gray-50 text-gray-700 border-gray-300'
                          )}
                        >
                          {getStatusText(milestone.status)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(milestone.date).toLocaleDateString('el-GR')}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-3">
                      {milestone.description}
                    </p>

                    {/* Progress bar for this milestone */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Πρόοδος milestone</span>
                        <span className="font-medium">{milestone.progress}%</span>
                      </div>
                      <Progress value={milestone.progress} className="h-2" />
                    </div>

                    {/* Milestone details */}
                    {milestone.status === 'in-progress' && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 text-sm text-blue-800">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">Επόμενα βήματα:</span>
                        </div>
                        <ul className="mt-2 text-sm text-blue-700 space-y-1">
                          <li>• Ολοκλήρωση κεντρικού θερμικού συστήματος</li>
                          <li>• Εγκατάσταση ανελκυστήρων</li>
                          <li>• Τελικός έλεγχος ηλεκτρολογικών</li>
                        </ul>
                      </div>
                    )}

                    {milestone.status === 'completed' && (
                      <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>Ολοκληρώθηκε στις {new Date(milestone.date).toLocaleDateString('el-GR')}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Path & Delays */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Κρίσιμα Σημεία
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium text-orange-900">Ηλ/Μηχ Εγκαταστάσεις</p>
                  <p className="text-sm text-orange-700">Επηρεάζει την παράδοση</p>
                </div>
                <Badge variant="outline" className="bg-orange-100 text-orange-700">
                  5 ημέρες καθυστέρηση
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-yellow-900">Τελικές Εργασίες</p>
                  <p className="text-sm text-yellow-700">Εξαρτάται από προηγούμενο</p>
                </div>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
                  Αναμονή
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Πρόβλεψη Ολοκλήρωσης
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Αρχικό χρονοδιάγραμμα</span>
                  <span className="font-medium">28/02/2009</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Τρέχουσα πρόβλεψη</span>
                  <span className="font-medium text-orange-600">05/03/2009</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Καθυστέρηση</span>
                  <Badge variant="outline" className="bg-orange-100 text-orange-700">
                    +5 ημέρες
                  </Badge>
                </div>
              </div>
              
              <Separator />
              
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">💡 <strong>Συμβουλή:</strong></p>
                <p>Επιτάχυνση ηλ/μηχ εργασιών μπορεί να μειώσει την καθυστέρηση στις 2-3 ημέρες.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
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
          <Label>
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
            <TabsList className="grid w-full grid-cols-7 mb-6">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Γενικά
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="storage" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Αποθήκες
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

            <TabsContent value="storage" className="mt-0">
              <PlaceholderTab title="Αποθήκες" icon={Building2} />
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