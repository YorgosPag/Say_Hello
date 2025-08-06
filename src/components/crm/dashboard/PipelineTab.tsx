
'use client';

import { Filter } from 'lucide-react';
import { OpportunityCard } from './OpportunityCard';

export function PipelineTab() {
  const stages = [
    { id: 'initial', label: 'Αρχική Επαφή', count: 12, value: '€120,000' },
    { id: 'qualification', label: 'Αξιολόγηση', count: 8, value: '€450,000' },
    { id: 'viewing', label: 'Ξενάγηση', count: 6, value: '€380,000' },
    { id: 'proposal', label: 'Πρόταση', count: 4, value: '€320,000' },
    { id: 'negotiation', label: 'Διαπραγμάτευση', count: 3, value: '€280,000' },
    { id: 'contract', label: 'Συμβόλαιο', count: 2, value: '€200,000' }
  ];

  return (
    <div className="bg-white dark:bg-card rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Sales Pipeline</h2>
          <div className="flex items-center gap-3">
            <button className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4 inline mr-1" />
              Φίλτρα
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map(stage => (
            <div key={stage.id} className="flex-1 min-w-[200px]">
              <div className="bg-gray-50 dark:bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900 dark:text-foreground">{stage.label}</h3>
                  <span className="text-sm text-gray-500">{stage.count}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-muted-foreground mb-4">{stage.value}</p>
                
                <div className="space-y-2">
                  {[1, 2].map(i => (
                    <OpportunityCard key={i} stage={stage.id} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
