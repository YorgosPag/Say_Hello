'use client';

import { Smile, Frown, Meh } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AnalyzeGreetingSentimentOutput } from '@/ai/flows/analyze-greeting-sentiment';

type Sentiment = AnalyzeGreetingSentimentOutput['sentiment'];

interface SentimentDisplayProps {
  sentiment: Sentiment | null;
}

const sentimentConfig = {
  positive: {
    icon: Smile,
    text: 'Positive',
    className: 'bg-primary/10 text-primary',
  },
  negative: {
    icon: Frown,
    text: 'Negative',
    className: 'bg-destructive/10 text-destructive',
  },
  neutral: {
    icon: Meh,
    text: 'Neutral',
    className: 'bg-muted text-muted-foreground',
  },
};

export function SentimentDisplay({ sentiment }: SentimentDisplayProps) {
  if (!sentiment) {
    return null;
  }

  const config = sentimentConfig[sentiment];
  if (!config) {
    return null;
  }

  const Icon = config.icon;

  return (
    <div className="mt-6 w-full animate-in fade-in zoom-in-95 duration-500">
      <div
        className={cn(
          'flex flex-col items-center justify-center space-y-2 rounded-lg p-6 text-center',
          config.className
        )}
      >
        <Icon className="h-12 w-12" />
        <p className="text-xl font-semibold font-headline">{config.text}</p>
        <p className="text-sm opacity-80">Sentiment Analysis Result</p>
      </div>
    </div>
  );
}
