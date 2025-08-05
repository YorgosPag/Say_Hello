'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Save, X, CheckCircle } from 'lucide-react';

interface HeaderProps {
    building: { id: number; category: string };
    isEditing: boolean;
    autoSaving: boolean;
    lastSaved: Date | null;
    setIsEditing: (isEditing: boolean) => void;
    handleSave: () => void;
}

export function Header({ building, isEditing, autoSaving, lastSaved, setIsEditing, handleSave }: HeaderProps) {
  return (
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
  );
}
