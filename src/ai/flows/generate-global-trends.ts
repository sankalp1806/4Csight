
'use server';
/**
 * @fileOverview Generates a global trends analysis.
 *
 * - generateGlobalTrends - A function that generates the analysis.
 * - GenerateGlobalTrendsInput - The input type for the function.
 * - GenerateGlobalTrendsOutput - The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { GenerateGlobalTrendsInputSchema, GenerateGlobalTrendsOutputSchema } from '@/ai/schemas/global-trends-schema';

export type GenerateGlobalTrendsInput = z.infer<typeof GenerateGlobalTrendsInputSchema>;
export type GenerateGlobalTrendsOutput = z.infer<typeof GenerateGlobalTrendsOutputSchema>;

export async function generateGlobalTrends(input: GenerateGlobalTrendsInput): Promise<GenerateGlobalTrendsOutput> {
  return generateGlobalTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGlobalTrendsPrompt',
  input: { schema: GenerateGlobalTrendsInputSchema },
  output: { schema: GenerateGlobalTrendsOutputSchema },
  prompt: `You are a global market and cultural analyst. A user is analyzing their brand '{{{brandName}}}' in the '{{{industry}}}' industry. Provide a detailed analysis of 3 major global cultural trends that could impact their business.

  Instructions:
  1.  **Perform Web Searches:** Use your search capabilities to identify three current, significant global cultural trends relevant to the '{{{industry}}}' industry.
  2.  **Detail Each Trend:** For each trend, provide the following:
      -   **name:** A concise name for the trend.
      -   **description:** A detailed explanation of the trend, what it is, and why it's happening.
      -   **impactOnIndustry:** A specific analysis of how this trend is affecting or could affect the '{{{industry}}}' industry.
      -   **regionalVariations:** A list of 3-4 key global regions (e.g., North America, Europe, Asia Pacific, Latin America) and a brief description of how the trend manifests differently in each.
      -   **opportunityScore:** A score from 1-10 indicating the level of opportunity this trend presents for the user's brand.

  Return the result in the required JSON format.
  `,
});

const generateGlobalTrendsFlow = ai.defineFlow(
  {
    name: 'generateGlobalTrendsFlow',
    inputSchema: GenerateGlobalTrendsInputSchema,
    outputSchema: GenerateGlobalTrendsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
