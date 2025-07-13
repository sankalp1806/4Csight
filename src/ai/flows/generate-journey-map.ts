'use server';
/**
 * @fileOverview Generates a customer journey map for a single customer segment.
 *
 * - generateJourneyMap - A function that generates the journey map.
 * - GenerateJourneyMapInput - The input for the function.
 * - GenerateJourneyMapOutput - The output for the function (JourneyMap).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { GenerateJourneyMapInputSchema, JourneyMapSchema } from '@/ai/schemas/journey-map-schema';

export type GenerateJourneyMapInput = z.infer<typeof GenerateJourneyMapInputSchema>;
export type GenerateJourneyMapOutput = z.infer<typeof JourneyMapSchema>;

export async function generateJourneyMap(input: GenerateJourneyMapInput): Promise<GenerateJourneyMapOutput> {
  return generateJourneyMapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateJourneyMapPrompt',
  input: { schema: GenerateJourneyMapInputSchema },
  output: { schema: JourneyMapSchema },
  prompt: `You are a customer experience (CX) strategist. A user is analyzing their brand '{{{brandName}}}' in the '{{{industry}}}' industry and needs a customer journey map for a specific segment.

  Customer Segment:
  - Name: {{{segment.name}}}
  - Description: {{{segment.description}}}
  
  Business Description: {{{description}}}

  Instructions:
  1.  **Analyze Context:** Consider the brand, industry, and customer segment provided.
  2.  **Construct Journey Stages:** Create a typical customer journey map consisting of 5 key stages: Awareness, Consideration, Purchase, Service, and Loyalty.
  3.  **Detail Each Stage:** For each of the 5 stages, provide a detailed description for the following:
      -   **stage:** The name of the journey stage.
      -   **actions:** What is the customer doing during this stage? (e.g., 'Researching online', 'Comparing prices').
      -   **touchpoints:** Where does the customer interact with the brand or similar brands? (e.g., 'Social media ads', 'Company website', 'Retail store').
      -   **feelings:** What are the customer's likely emotions or thoughts at this stage? (e.g., 'Curious', 'Overwhelmed by choices', 'Confident in decision').

  Return the result as a JSON object with a 'stages' array, where each object in the array represents a stage in the journey.
  `,
});

const generateJourneyMapFlow = ai.defineFlow(
  {
    name: 'generateJourneyMapFlow',
    inputSchema: GenerateJourneyMapInputSchema,
    outputSchema: JourneyMapSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
