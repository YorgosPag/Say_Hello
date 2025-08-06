
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { suggestionSystem } from './suggestion-system';
import type { Property } from '@/types/property-viewer';
import type { Suggestion } from '@/types/suggestions';

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
    <div className="bg-background rounded-lg shadow-sm border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <span>🤖</span>
          Έξυπνες Προτάσεις
        </h4>
        <Button
          onClick={analyzePlacement}
          size="sm"
          variant="outline"
        >
          Ανάλυση
        </Button>
      </div>

      {suggestions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-xs">Πατήστε "Ανάλυση" για προτάσεις τοποθέτησης</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {suggestions.map(suggestion => (
            <div
              key={suggestion.propertyId}
              className={`border rounded p-3 cursor-pointer transition-all ${
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
                    {suggestion.recommendations.slice(0, 2).map((rec, idx) => (
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
                      className="h-6 px-2 text-xs"
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
      )}

      {selectedSuggestion && (
        <Button
          onClick={clearSuggestions}
          className="w-full"
          variant="ghost"
          size="sm"
        >
          Καθαρισμός Προτάσεων
        </Button>
      )}
    </div>
  );
}
