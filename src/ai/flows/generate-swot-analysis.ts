
'use server';
/**
 * @fileOverview Generates a SWOT analysis for a single competitor.
 *
 * - generateSwotAnalysis - A function that generates a SWOT analysis.
 * - GenerateSwotAnalysisInput - The input type for the generateSwotAnalysis function.
 * - GenerateSwotAnalysisOutput - The return type for the generateSwotAnalysis function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { GenerateSwotAnalysisInputSchema, SwotAnalysisSchema } from '@/ai/schemas/swot-analysis-schema';

export type GenerateSwotAnalysisInput = z.infer<typeof GenerateSwotAnalysisInputSchema>;
export type GenerateSwotAnalysisOutput = z.infer<typeof SwotAnalysisSchema>;

export async function generateSwotAnalysis(input: GenerateSwotAnalysisInput): Promise<GenerateSwotAnalysisOutput> {
  return generateSwotAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSwotAnalysisPrompt',
  input: { schema: GenerateSwotAnalysisInputSchema },
  output: { schema: SwotAnalysisSchema },
  prompt: `You are a strategic marketing expert. A user is conducting a competitive analysis for their brand, '{{{brandNameToAnalyze}}}'.
  
  They have requested a SWOT (Strengths, Weaknesses, Opportunities, Threats) analysis for a specific competitor.

  Competitor to Analyze: {{{competitorName}}}

  Instructions:
  1.  **Perform Web Searches:** Use your search capabilities to find information about '{{{competitorName}}}' and its market environment.
  2.  **Analyze and Categorize:** Based on your research, identify the competitor's internal strengths and weaknesses, and external opportunities and threats.
  3.  **Populate the SWOT framework:**
      -   **strengths:** List at least 3-4 key internal advantages.
      -   **weaknesses:** List at least 3-4 key internal disadvantages.
      -   **opportunities:** List at least 3-4 key external factors the competitor could leverage.
      -   **threats:** List at least 3-4 key external factors that could harm the competitor.

  Return the result in the required JSON format.
  `,
});

const generateSwotAnalysisFlow = ai.defineFlow(
  {
    name: 'generateSwotAnalysisFlow',
    inputSchema: GenerateSwotAnalysisInputSchema,
    outputSchema: SwotAnalysisSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
