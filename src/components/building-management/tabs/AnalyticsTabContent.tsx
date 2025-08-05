'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, DollarSign, TrendingUp, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Building } from '../BuildingsPageContent';

interface AnalyticsTabContentProps {
  building: Building;
}

const AnalyticsTabContent = ({ building }: AnalyticsTabContentProps) => {
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

export default AnalyticsTabContent;
