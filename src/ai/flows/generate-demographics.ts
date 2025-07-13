'use server';
/**
 * @fileOverview Generates demographic data for visualization.
 *
 * - generateDemographics - A function that generates demographic data.
 * - GenerateDemographicsInput - The input type for the function.
 * - GenerateDemographicsOutput - The output for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { GenerateDemographicsInputSchema, GenerateDemographicsOutputSchema } from '@/ai/schemas/demographics-schema';

export type GenerateDemographicsInput = z.infer<typeof GenerateDemographicsInputSchema>;
export type GenerateDemographicsOutput = z.infer<typeof GenerateDemographicsOutputSchema>;

export async function generateDemographics(input: GenerateDemographicsInput): Promise<GenerateDemographicsOutput> {
  return generateDemographicsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDemographicsPrompt',
  input: { schema: GenerateDemographicsInputSchema },
  output: { schema: GenerateDemographicsOutputSchema },
  prompt: `You are a market research expert. A user wants to understand the customer demographics for their brand '{{{brandName}}}' which operates in the '{{{industry}}}' industry.

  Instructions:
  1.  **Perform Web Searches:** Use your search capabilities to find current market research data, surveys, and reports about the typical consumer demographics in the '{{{industry}}}' industry.
  2.  **Synthesize and Estimate:** Based on your research, generate estimated distributions for the following demographic categories. The percentages in each category should sum to 100.
      -   **ageDistribution:** Provide a breakdown of age groups (e.g., 18-24, 25-34, etc.). Create 5-6 distinct groups.
      -   **genderDistribution:** Provide a male/female/other breakdown.
      -   **incomeDistribution:** Provide a breakdown of annual household income levels (e.g., <$30k, $30k-$60k, etc.). Create 4-5 distinct levels.
      -   **locationDistribution:** List the top 4-5 countries or major regions where consumers for this industry are located.

  Return the result in the required JSON format. Ensure percentages for each category add up to 100.
  `,
});

const generateDemographicsFlow = ai.defineFlow(
  {
    name: 'generateDemographicsFlow',
    inputSchema: GenerateDemographicsInputSchema,
    outputSchema: GenerateDemographicsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
