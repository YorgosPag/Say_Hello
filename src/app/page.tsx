'use client';

import { useState } from 'react';
import { Download, Loader2, MessageSquareHeart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getSentimentAnalysis } from '@/app/actions';
import { SentimentDisplay } from '@/components/sentiment-display';
import type { AnalyzeGreetingSentimentOutput } from '@/ai/flows/analyze-greeting-sentiment';

export default function Home() {
  const [greeting, setGreeting] = useState('');
  const [lastAnalyzedGreeting, setLastAnalyzedGreeting] = useState('');
  const [sentiment, setSentiment] =
    useState<AnalyzeGreetingSentimentOutput['sentiment'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!greeting.trim()) {
      toast({
        title: 'Input Required',
        description: 'Please enter a greeting to analyze.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setSentiment(null);
    try {
      const result = await getSentimentAnalysis(greeting);
      if ('error' in result) {
        toast({
          title: 'Analysis Error',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        setSentiment(result.sentiment);
        setLastAnalyzedGreeting(greeting);
      }
    } catch (error) {
      toast({
        title: 'Unexpected Error',
        description: 'An error occurred while analyzing the sentiment.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!lastAnalyzedGreeting.trim()) {
      toast({
        title: 'No Greeting',
        description: 'Analyze a greeting first before downloading.',
        variant: 'destructive',
      });
      return;
    }
    const blob = new Blob([lastAnalyzedGreeting], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'greeting.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 font-body">
      <Card className="w-full max-w-lg shadow-2xl bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <MessageSquareHeart className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Say Hello</CardTitle>
          <CardDescription>
            Enter a greeting and let our AI analyze its sentiment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid w-full gap-2">
              <Textarea
                placeholder="e.g., 'Hello, world!' or 'What a wonderful day!'"
                value={greeting}
                onChange={(e) => setGreeting(e.target.value)}
                className="min-h-[100px] text-base"
                disabled={isLoading}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Sentiment'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleDownload}
                disabled={!lastAnalyzedGreeting.trim() || isLoading}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </form>

          {sentiment && <SentimentDisplay sentiment={sentiment} />}
        </CardContent>
      </Card>
      <footer className="py-4 mt-4">
        <p className="text-center text-sm text-muted-foreground">
          Powered by GenAI
        </p>
      </footer>
    </main>
  );
}
