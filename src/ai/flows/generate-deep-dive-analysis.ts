'use server';
/**
 * @fileOverview Generates an in-depth analysis for a single customer segment.
 *
 * - generateDeepDiveAnalysis - A function that generates the deep dive analysis.
 * - GenerateDeepDiveAnalysisInput - The input for the function.
 * - GenerateDeepDiveAnalysisOutput - The output for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { GenerateDeepDiveAnalysisInputSchema, DeepDiveAnalysisSchema } from '@/ai/schemas/deep-dive-analysis-schema';

export type GenerateDeepDiveAnalysisInput = z.infer<typeof GenerateDeepDiveAnalysisInputSchema>;
export type GenerateDeepDiveAnalysisOutput = z.infer<typeof DeepDiveAnalysisSchema>;

export async function generateDeepDiveAnalysis(input: GenerateDeepDiveAnalysisInput): Promise<GenerateDeepDiveAnalysisOutput> {
  return generateDeepDiveAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDeepDiveAnalysisPrompt',
  input: { schema: GenerateDeepDiveAnalysisInputSchema },
  output: { schema: DeepDiveAnalysisSchema },
  prompt: `You are a market research expert. A user is analyzing their brand '{{{brandName}}}' in the '{{{industry}}}' industry.
  They have identified a specific customer segment and need a more detailed "deep dive" analysis.

  Customer Segment to Analyze:
  - Name: {{{segment.name}}}
  - Description: {{{segment.description}}}
  - Characteristics: {{#each segment.characteristics}}- {{{this}}} {{/each}}
  - Key Needs: {{#each segment.keyNeeds}}- {{{this}}} {{/each}}
  - Purchase Drivers: {{#each segment.purchaseDrivers}}- {{{this}}} {{/each}}
  - Media Consumption: {{#each segment.mediaConsumption}}- {{{this}}} {{/each}}

  Instructions:
  1.  **Perform Web Searches:** Use your search capabilities to find additional, detailed information about the behaviors, motivations, and preferences of a segment like this within the '{{{industry}}}' industry.
  2.  **Synthesize and Elaborate:** Based on your research and the provided information, expand on each of the following areas. Provide rich, detailed descriptions.
      -   **detailedCharacteristics:** Elaborate on the segment's demographics, psychographics, lifestyle, and values. Go beyond the provided list.
      -   **inDepthKeyNeeds:** Provide a deeper analysis of the segment's core needs, pain points, and desires. What are they truly looking for?
      -   **primaryPurchaseDrivers:** Detail the most influential factors that drive their purchasing decisions. Why do they choose one brand over another?
      -   **preferredMediaConsumption:** Describe their media habits in detail. What specific social media platforms, websites, TV shows, or influencers do they engage with?

  Return the result in the required JSON format.
  `,
});

const generateDeepDiveAnalysisFlow = ai.defineFlow(
  {
    name: 'generateDeepDiveAnalysisFlow',
    inputSchema: GenerateDeepDiveAnalysisInputSchema,
    outputSchema: DeepDiveAnalysisSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
