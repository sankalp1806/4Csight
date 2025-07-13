'use server';
/**
 * @fileOverview Generates behavioral pattern data for visualization.
 *
 * - generateBehavioralPatterns - A function that generates the data.
 * - GenerateBehavioralPatternsInput - The input type for the function.
 * - GenerateBehavioralPatternsOutput - The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { GenerateBehavioralPatternsInputSchema, GenerateBehavioralPatternsOutputSchema } from '@/ai/schemas/behavioral-patterns-schema';

export type GenerateBehavioralPatternsInput = z.infer<typeof GenerateBehavioralPatternsInputSchema>;
export type GenerateBehavioralPatternsOutput = z.infer<typeof GenerateBehavioralPatternsOutputSchema>;

export async function generateBehavioralPatterns(input: GenerateBehavioralPatternsInput): Promise<GenerateBehavioralPatternsOutput> {
  return generateBehavioralPatternsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBehavioralPatternsPrompt',
  input: { schema: GenerateBehavioralPatternsInputSchema },
  output: { schema: GenerateBehavioralPatternsOutputSchema },
  prompt: `You are a market research expert specializing in consumer behavior. A user wants to understand the behavioral patterns for their brand '{{{brandName}}}' which operates in the '{{{industry}}}' industry.

  Instructions:
  1.  **Perform Web Searches:** Use your search capabilities to find current market research data, articles, and studies about consumer behavior in the '{{{industry}}}' industry.
  2.  **Synthesize and Estimate:** Based on your research, generate estimated distributions for the following categories:
      -   **purchaseBehavior:**
          -   **frequency:** Provide a breakdown of how often consumers purchase. Create 3-4 categories (e.g., "Once a week", "2-3 times a month", "Once a month", "Less than once a month"). Percentages must sum to 100.
          -   **channels:** Provide a breakdown of where consumers make purchases. Create 3-4 categories (e.g., "Brand Website", "Retail Store", "Mobile App", "Third-party Marketplace"). Percentages must sum to 100.
      -   **brandInteractions:** Provide a list of 4-5 common ways customers interact with brands in this industry (e.g., "Follow on Social Media", "Reads Email Newsletters", "Engages with Ads", "Visits Website for Info") and estimate the percentage for each. Percentages do not need to sum to 100.
      -   **usagePatterns:** Provide a list of 4-5 usage patterns for products/services in this industry (e.g., "Daily Use", "Feature Power-User", "Occasional Use", "For Specific Events") and estimate the percentage for each. Percentages should sum to 100.

  Return the result in the required JSON format.
  `,
});

const generateBehavioralPatternsFlow = ai.defineFlow(
  {
    name: 'generateBehavioralPatternsFlow',
    inputSchema: GenerateBehavioralPatternsInputSchema,
    outputSchema: GenerateBehavioralPatternsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
