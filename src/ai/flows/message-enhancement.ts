'use server';

/**
 * @fileOverview A message enhancement AI agent.
 *
 * - enhanceMessage - A function that enhances a message using AI.
 * - EnhanceMessageInput - The input type for the enhanceMessage function.
 * - EnhanceMessageOutput - The return type for the enhanceMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const EnhanceMessageInputSchema = z.object({
  message: z.string().describe('The message to be enhanced.'),
});
export type EnhanceMessageInput = z.infer<typeof EnhanceMessageInputSchema>;

const EnhanceMessageOutputSchema = z.object({
  enhancedMessage: z.string().describe('The enhanced message.'),
});
export type EnhanceMessageOutput = z.infer<typeof EnhanceMessageOutputSchema>;

export async function enhanceMessage(input: EnhanceMessageInput): Promise<EnhanceMessageOutput> {
  return enhanceMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhanceMessagePrompt',
  input: {schema: EnhanceMessageInputSchema},
  output: {schema: EnhanceMessageOutputSchema},
  prompt: `You are an AI assistant helping Arhitektas Giorgis enhance his message for clarity and effectiveness.

Original Message: {{{message}}}

Enhanced Message:`, // Removed line breaks for conciseness
});

const enhanceMessageFlow = ai.defineFlow(
  {
    name: 'enhanceMessageFlow',
    inputSchema: EnhanceMessageInputSchema,
    outputSchema: EnhanceMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
