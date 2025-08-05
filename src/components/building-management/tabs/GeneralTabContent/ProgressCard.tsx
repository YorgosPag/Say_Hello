'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressCardProps {
    progress: number;
}

export function ProgressCard({ progress }: ProgressCardProps) {
  return (
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
              {progress}% Ολοκληρωμένο
            </Badge>
          </div>
          <Progress value={progress} className="h-3" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
            <div className={cn("p-2 rounded text-center", progress >= 25 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600")}>
              <div className="font-medium">Θεμέλια</div>
              <div>0-25%</div>
            </div>
            <div className={cn("p-2 rounded text-center", progress >= 50 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600")}>
              <div className="font-medium">Κατασκευή</div>
              <div>25-50%</div>
            </div>
            <div className={cn("p-2 rounded text-center", progress >= 75 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600")}>
              <div className="font-medium">Ολοκληρώσεις</div>
              <div>50-75%</div>
            </div>
            <div className={cn("p-2 rounded text-center", progress >= 100 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600")}>
              <div className="font-medium">Παράδοση</div>
              <div>75-100%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// We need to define Label here if it's not imported globally
const Label = (props: React.LabelHTMLAttributes<HTMLLabelElement>) => <label {...props} />;
