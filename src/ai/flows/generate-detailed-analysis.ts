
'use server';
/**
 * @fileOverview Generates a detailed analysis for a single competitor.
 *
 * - generateDetailedAnalysis - A function that generates a detailed analysis.
 * - GenerateDetailedAnalysisInput - The input type for the generateDetailedAnalysis function.
 * - GenerateDetailedAnalysisOutput - The return type for the generateDetailedAnalysis function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { DetailedAnalysisSchema, GenerateDetailedAnalysisInputSchema } from '@/ai/schemas/detailed-analysis-schema';

export type GenerateDetailedAnalysisInput = z.infer<typeof GenerateDetailedAnalysisInputSchema>;
export type GenerateDetailedAnalysisOutput = z.infer<typeof DetailedAnalysisSchema>;

export async function generateDetailedAnalysis(input: GenerateDetailedAnalysisInput): Promise<GenerateDetailedAnalysisOutput> {
  return generateDetailedAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDetailedAnalysisPrompt',
  input: { schema: GenerateDetailedAnalysisInputSchema },
  output: { schema: DetailedAnalysisSchema },
  prompt: `You are a strategic marketing expert. A user is conducting a competitive analysis for their brand, '{{{brandNameToAnalyze}}}'.
  
  They have requested a detailed analysis of a specific competitor.

  Competitor to Analyze: {{{competitorName}}}

  Instructions:
  1.  **Perform Web Searches:** Use your search capabilities to find comprehensive, up-to-date information about '{{{competitorName}}}'.
  2.  **Synthesize Information:** Based on your research, generate a detailed report covering the following areas:
      -   **companyBackground:** A brief history and overview of the company.
      -   **productsAndServices:** A description of their main products, services, and value proposition.
      -   **targetAudience:** An analysis of who their primary customers are.
      -   **marketingStrategy:** An overview of their marketing channels, messaging, and tactics.
      -   **keyDifferentiators:** What makes them unique in the marketplace compared to others, including '{{{brandNameToAnalyze}}}'.
      -   **recentNews:** Any recent, relevant news or developments.

  Return the result in the required JSON format.
  `,
});

const generateDetailedAnalysisFlow = ai.defineFlow(
  {
    name: 'generateDetailedAnalysisFlow',
    inputSchema: GenerateDetailedAnalysisInputSchema,
    outputSchema: DetailedAnalysisSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
