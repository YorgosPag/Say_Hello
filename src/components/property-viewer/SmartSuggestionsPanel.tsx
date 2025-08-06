
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { suggestionSystem } from './suggestion-system';
import type { Property } from '@/types/property-viewer';
import type { Suggestion } from '@/types/suggestions';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';

interface SmartSuggestionsPanelProps {
  properties: Property[];
  onShowSuggestion: (suggestion: Suggestion | null) => void;
  onAcceptSuggestion: (suggestion: Suggestion) => void;
}

export function SmartSuggestionsPanel({ properties, onShowSuggestion, onAcceptSuggestion }: SmartSuggestionsPanelProps) {
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  const analyzePlacement = () => {
    const newSuggestions = suggestionSystem.analyzeFloorPlan(properties);
    setSuggestions(newSuggestions.sort((a, b) => b.score - a.score));
    toast({ title: "Ανάλυση Ολοκληρώθηκε", description: `Βρέθηκαν ${newSuggestions.length} προτάσεις τοποθέτησης.` });
  };

  const handleShowSuggestion = (suggestion: Suggestion) => {
    if (selectedSuggestion === suggestion.propertyId) {
        setSelectedSuggestion(null);
        onShowSuggestion(null);
    } else {
        setSelectedSuggestion(suggestion.propertyId);
        onShowSuggestion(suggestion);
    }
  };

  const handleAcceptSuggestion = (suggestion: Suggestion) => {
    onAcceptSuggestion(suggestion);
    clearSuggestions();
  };

  const clearSuggestions = () => {
    onShowSuggestion(null);
    setSelectedSuggestion(null);
  };

  return (
    <Card className="flex-1">
      <CardHeader className="py-3 px-4">
        <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
                <span>🤖</span>
                Έξυπνες Προτάσεις
            </CardTitle>
            <Button
                onClick={analyzePlacement}
                size="sm"
                variant="outline"
                className="h-7 text-xs"
            >
                Ανάλυση
            </Button>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        {suggestions.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
            <p className="text-xs">Πατήστε "Ανάλυση" για προτάσεις.</p>
            </div>
        ) : (
            <ScrollArea className="h-48">
            <div className="space-y-2 pr-2">
                {suggestions.map(suggestion => (
                <div
                    key={suggestion.propertyId}
                    className={`border rounded p-2 cursor-pointer transition-all ${
                    selectedSuggestion === suggestion.propertyId
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-border-hover'
                    }`}
                    onClick={() => handleShowSuggestion(suggestion)}
                >
                    <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h5 className="font-medium text-xs">{suggestion.propertyName}</h5>
                        <div className="mt-1 space-y-1">
                        {suggestion.recommendations.slice(0, 1).map((rec, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                                rec.priority === 'high' ? 'bg-red-400' :
                                rec.priority === 'medium' ? 'bg-yellow-400' :
                                'bg-green-400'
                            }`} />
                            <span>{rec.message}</span>
                            </div>
                        ))}
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 ml-2">
                        <div className="text-xs font-medium text-muted-foreground">
                        Score: {suggestion.score}
                        </div>
                        {selectedSuggestion === suggestion.propertyId && (
                        <Button
                            size="sm"
                            className="h-5 px-1.5 text-xs"
                            onClick={(e) => {
                            e.stopPropagation();
                            handleAcceptSuggestion(suggestion);
                            }}
                        >
                            Αποδοχή
                        </Button>
                        )}
                    </div>
                    </div>
                </div>
                ))}
            </div>
            </ScrollArea>
        )}

        {selectedSuggestion && (
            <Button
            onClick={clearSuggestions}
            className="w-full mt-2"
            variant="ghost"
            size="sm"
            >
            Καθαρισμός Προτάσεων
            </Button>
        )}
      </CardContent>
    </Card>
  );
}
