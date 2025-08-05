'use server';

import {
  analyzeGreetingSentiment,
  type AnalyzeGreetingSentimentOutput,
} from '@/ai/flows/analyze-greeting-sentiment';

type ServerActionResult = AnalyzeGreetingSentimentOutput | { error: string };

export async function getSentimentAnalysis(
  greeting: string
): Promise<ServerActionResult> {
  if (!greeting || typeof greeting !== 'string' || !greeting.trim()) {
    return { error: 'Invalid greeting provided. Please enter some text.' };
  }

  try {
    const result = await analyzeGreetingSentiment({ greeting });
    return result;
  } catch (error) {
    console.error('Sentiment analysis failed:', error);
    return {
      error: 'An unexpected error occurred while analyzing the greeting.',
    };
  }
}
