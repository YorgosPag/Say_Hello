
'use client';

const statusColors = {
  'for-sale': '#10b981',    // Green
  'for-rent': '#3b82f6',    // Blue
  'sold': '#ef4444',        // Red
  'rented': '#f97316',      // Orange
  'reserved': '#eab308',    // Yellow
};

export function StatusLegend() {
  return (
    <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm border rounded-lg p-3 shadow-sm">
      <h4 className="text-xs font-medium mb-2">Κατάσταση Ακινήτων</h4>
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: statusColors['for-sale'] }}></div>
          <span>Προς Πώληση</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: statusColors['for-rent'] }}></div>
          <span>Προς Ενοικίαση</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: statusColors['sold'] }}></div>
          <span>Πουλημένο</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: statusColors['rented'] }}></div>
          <span>Ενοικιασμένο</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: statusColors['reserved'] }}></div>
          <span>Δεσμευμένο</span>
        </div>
      </div>
    </div>
  );
}
