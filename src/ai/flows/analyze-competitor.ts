
'use server';
/**
 * @fileOverview Analyzes a single competitor based on user input.
 *
 * - analyzeCompetitor - A function that analyzes a single competitor.
 * - AnalyzeCompetitorInput - The input type for the analyzeCompetitor function.
 * - AnalyzeCompetitorOutput - The return type for the analyzeCompetitor function (which is a Competitor object).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { CompetitorSchema, type Competitor } from '@/ai/schemas/4cs-analysis-schema';

const AnalyzeCompetitorInputSchema = z.object({
  brandNameToAnalyze: z.string().describe('The name of the user\'s brand for context.'),
  competitorName: z.string().describe('The name of the competitor to analyze.'),
  competitorType: z.enum(['Direct', 'Indirect', 'Substitute']).describe('The type of competitor.'),
  competitorDescription: z.string().optional().describe('An optional description of the competitor.'),
});

export type AnalyzeCompetitorInput = z.infer<typeof AnalyzeCompetitorInputSchema>;
export type AnalyzeCompetitorOutput = Competitor;

export async function analyzeCompetitor(input: AnalyzeCompetitorInput): Promise<AnalyzeCompetitorOutput> {
  return analyzeCompetitorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCompetitorPrompt',
  input: { schema: AnalyzeCompetitorInputSchema },
  output: { schema: CompetitorSchema },
  prompt: `You are a strategic marketing expert. A user is conducting a competitive analysis for their brand, '{{{brandNameToAnalyze}}}'.
  
  They have manually added a competitor and need you to research and provide a detailed analysis for it.

  Competitor to Analyze: {{{competitorName}}}
  Type: {{{competitorType}}}
  {{#if competitorDescription}}
  User Provided Description: {{{competitorDescription}}}
  {{/if}}

  Instructions:
  1.  **Perform Web Searches:** Use your search capabilities to find up-to-date information about the competitor '{{{competitorName}}}'.
  2.  **Synthesize Information:** Based on your research, generate a detailed analysis of this competitor.
  3.  **Populate the analysis:** Provide the following details:
      -   **name:** The official name of the competitor.
      -   **type:** The competitor type provided by the user ('{{{competitorType}}}').
      -   **marketShare:** Estimate the competitor's market share as a percentage. If a precise number is not available, provide a reasonable estimate based on public data, news, and company size accroding to the location specifically provided by the user, but if location is not provided by the user then provide the global data.
      -   **rating:** Provide a competitive rating from 1 to 5, where 5 is a very strong competitor.
      -   **strengths:** List at least 3-4 key strengths of the competitor.
      -   **weaknesses:** List at least 3-4 key weaknesses of the competitor.

  Return the result in the required JSON format.
  `,
});

const analyzeCompetitorFlow = ai.defineFlow(
  {
    name: 'analyzeCompetitorFlow',
    inputSchema: AnalyzeCompetitorInputSchema,
    outputSchema: CompetitorSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    // Ensure the type from the input is preserved in the output, as the LLM might hallucinate it.
    return { ...output!, type: input.competitorType };
  }
);
