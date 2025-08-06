
'use client';

interface PropertyCountOverlayProps {
  count: number;
}

export function PropertyCountOverlay({ count }: PropertyCountOverlayProps) {
  return (
    <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm border rounded-lg px-3 py-1 shadow-sm">
      <span className="text-xs text-muted-foreground">
        {count} ακίνητα στον όροφο
      </span>
    </div>
  );
}
