'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { FileText, Upload, Camera, FileUp, FileImage, Eye, Download, Trash2 } from 'lucide-react';

export function FilesCard() {
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    console.log('Επιλέχθηκαν αρχεία:', Array.from(files).map(f => f.name));
  };

  return (
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
                <input type="file" multiple className="hidden" onChange={(e) => handleFileUpload(e.target.files)} />
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
        <div 
          className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer bg-muted/20 hover:bg-muted/50"
          onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-primary', 'bg-accent/20'); }}
          onDragLeave={(e) => { e.currentTarget.classList.remove('border-primary', 'bg-accent/20'); }}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove('border-primary', 'bg-accent/20');
            handleFileUpload(e.dataTransfer.files);
          }}
        >
          <div className="space-y-2">
            <div className="mx-auto h-12 w-12 text-muted-foreground flex items-center justify-center">
              <FileUp className="w-8 h-8" />
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-primary hover:underline cursor-pointer">
                Κάντε κλικ για επιλογή αρχείων
              </span>{' '}ή σύρετε και αφήστε εδώ
            </div>
            <p className="text-xs text-muted-foreground/80">
              PNG, JPG, PDF, DOC, XLS μέχρι 10MB
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-medium text-foreground">Υπάρχοντα Αρχεία</h4>
          
          <div className="flex items-center justify-between p-3 bg-card rounded-lg border hover:bg-muted/50">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 h-10 w-10 bg-red-100 dark:bg-red-950/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-red-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">Συγγραφή Υποχρεώσεων.pdf</p>
                <p className="text-xs text-muted-foreground">2.4 MB • Ανέβηκε 15/02/2025</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm"><Eye className="w-4 h-4 mr-1" /> Προβολή</Button>
              <Button variant="ghost" size="sm"><Download className="w-4 h-4 mr-1" /> Λήψη</Button>
              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-card rounded-lg border hover:bg-muted/50">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 h-10 w-10 bg-green-100 dark:bg-green-950/20 rounded-lg flex items-center justify-center">
                 <FileImage className="w-5 h-5 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">Πρόοδος Κατασκευής Φεβ 2025.jpg</p>
                <p className="text-xs text-muted-foreground">4.2 MB • Ανέβηκε σήμερα</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
               <Button variant="ghost" size="sm"><Eye className="w-4 h-4 mr-1" /> Προβολή</Button>
               <Button variant="ghost" size="sm"><Download className="w-4 h-4 mr-1" /> Λήψη</Button>
               <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800" style={{display: 'none'}} id="upload-progress">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-200">Ανέβασμα σε εξέλιξη...</p>
              <Progress value={45} className="h-2 mt-1" />
              <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">2 από 5 αρχεία ολοκληρώθηκαν</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
