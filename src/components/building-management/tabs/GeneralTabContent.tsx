'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
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
import type { Building } from '../BuildingsPageContent';

export function GeneralTabContent({ building }: { building: Building }) {
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
}
