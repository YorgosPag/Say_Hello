'use server';

/**
 * @fileOverview Sentiment analysis flow for user-provided greetings.
 *
 * - analyzeGreetingSentiment - Analyzes the sentiment of a greeting.
 * - AnalyzeGreetingSentimentInput - The input type for the analyzeGreetingSentiment function.
 * - AnalyzeGreetingSentimentOutput - The return type for the analyzeGreetingSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeGreetingSentimentInputSchema = z.object({
  greeting: z.string().describe('The greeting to analyze.'),
});
export type AnalyzeGreetingSentimentInput = z.infer<
  typeof AnalyzeGreetingSentimentInputSchema
>;

const AnalyzeGreetingSentimentOutputSchema = z.object({
  sentiment: z
    .enum(['positive', 'negative', 'neutral'])
    .describe('The sentiment of the greeting.'),
});
export type AnalyzeGreetingSentimentOutput = z.infer<
  typeof AnalyzeGreetingSentimentOutputSchema
>;

export async function analyzeGreetingSentiment(
  input: AnalyzeGreetingSentimentInput
): Promise<AnalyzeGreetingSentimentOutput> {
  return analyzeGreetingSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeGreetingSentimentPrompt',
  input: {schema: AnalyzeGreetingSentimentInputSchema},
  output: {schema: AnalyzeGreetingSentimentOutputSchema},
  prompt: `Analyze the sentiment of the following greeting and classify it as positive, negative, or neutral.\n\nGreeting: {{{greeting}}}`,
});

const analyzeGreetingSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeGreetingSentimentFlow',
    inputSchema: AnalyzeGreetingSentimentInputSchema,
    outputSchema: AnalyzeGreetingSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
