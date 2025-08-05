'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Building } from '../../BuildingsPageContent';

export default function AnalyticsProgress({ building }: { building: Building }) {
    return (
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
    );
}
