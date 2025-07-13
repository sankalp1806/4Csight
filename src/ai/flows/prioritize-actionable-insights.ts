// PrioritizeActionableInsights story implementation
'use server';
/**
 * @fileOverview This file defines a Genkit flow for prioritizing actionable insights derived from a 4Cs analysis.
 *
 * - prioritizeActionableInsights - A function that takes 4Cs analysis data and returns prioritized actions.
 * - PrioritizeActionableInsightsInput - The input type for the prioritizeActionableInsights function.
 * - PrioritizeActionableInsightsOutput - The return type for the prioritizeActionableInsights function, outlining high, medium, and low priority actions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrioritizeActionableInsightsInputSchema = z.object({
  competitionAnalysis: z.string().describe('The analysis of the competitive landscape.'),
  cultureAnalysis: z.string().describe('The analysis of cultural trends and alignment.'),
  consumerAnalysis: z.string().describe('The analysis of the target consumer segments.'),
  categoryAnalysis: z.string().describe('The analysis of the product or service category.'),
});
export type PrioritizeActionableInsightsInput = z.infer<typeof PrioritizeActionableInsightsInputSchema>;

const PrioritizeActionableInsightsOutputSchema = z.object({
  highPriorityActions: z.string().describe('Critical initiatives requiring immediate attention and resources.'),
  mediumPriorityActions: z.string().describe('Important initiatives for medium-term growth and strategic investments.'),
  lowPriorityActions: z.string().describe('Long-term strategic initiatives and improvements with uncertain returns.'),
});
export type PrioritizeActionableInsightsOutput = z.infer<typeof PrioritizeActionableInsightsOutputSchema>;

export async function prioritizeActionableInsights(input: PrioritizeActionableInsightsInput): Promise<PrioritizeActionableInsightsOutput> {
  return prioritizeActionableInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'prioritizeActionableInsightsPrompt',
  input: {schema: PrioritizeActionableInsightsInputSchema},
  output: {schema: PrioritizeActionableInsightsOutputSchema},
  prompt: `You are a strategic business consultant tasked with analyzing a 4Cs analysis (Competition, Culture, Consumer, Category) and providing actionable insights, and splitting them into High, Medium, and Low priority actions.

  Competition Analysis: {{{competitionAnalysis}}}
  Culture Analysis: {{{cultureAnalysis}}}
  Consumer Analysis: {{{consumerAnalysis}}}
  Category Analysis: {{{categoryAnalysis}}}

  Based on the above analysis, provide a prioritized list of actions in terms of high, medium and low priority.
`,
});

const prioritizeActionableInsightsFlow = ai.defineFlow(
  {
    name: 'prioritizeActionableInsightsFlow',
    inputSchema: PrioritizeActionableInsightsInputSchema,
    outputSchema: PrioritizeActionableInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
