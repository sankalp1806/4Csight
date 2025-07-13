'use server';
/**
 * @fileOverview Generates psychographic data for visualization.
 *
 * - generatePsychographics - A function that generates psychographic data.
 * - GeneratePsychographicsInput - The input type for the function.
 * - GeneratePsychographicsOutput - The output for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { GeneratePsychographicsInputSchema, GeneratePsychographicsOutputSchema } from '@/ai/schemas/psychographics-schema';

export type GeneratePsychographicsInput = z.infer<typeof GeneratePsychographicsInputSchema>;
export type GeneratePsychographicsOutput = z.infer<typeof GeneratePsychographicsOutputSchema>;

export async function generatePsychographics(input: GeneratePsychographicsInput): Promise<GeneratePsychographicsOutput> {
  return generatePsychographicsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePsychographicsPrompt',
  input: { schema: GeneratePsychographicsInputSchema },
  output: { schema: GeneratePsychographicsOutputSchema },
  prompt: `You are a market research expert specializing in consumer psychology. A user wants to understand the psychographics for their brand '{{{brandName}}}' which operates in the '{{{industry}}}' industry.

  Instructions:
  1.  **Perform Web Searches:** Use your search capabilities to find current market research data, articles, and studies about consumer psychographics in the '{{{industry}}}' industry.
  2.  **Synthesize and Estimate:** Based on your research, generate estimated distributions for the following psychographic categories.
      -   **valueDistribution:** Provide a list of 5-6 core values (e.g., "Security", "Tradition", "Achievement") and their importance score (0-100) for the average consumer in this industry.
      -   **interestDistribution:** Provide a list of 5-6 key consumer interests (e.g., "Technology", "Fashion", "Travel") and the estimated percentage of consumers who share that interest. The percentages do not need to sum to 100.
      -   **lifestyleDistribution:** Provide a list of 4-5 common lifestyles (e.g., "Active", "Homebody", "Socialite") and the estimated percentage of consumers in each. Percentages in this category should sum to 100.
      -   **personalityDistribution:** Provide an analysis based on the Big Five personality traits (Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism). For each of the five traits, provide an average score (0-100) for the target consumer.

  Return the result in the required JSON format.
  `,
});

const generatePsychographicsFlow = ai.defineFlow(
  {
    name: 'generatePsychographicsFlow',
    inputSchema: GeneratePsychographicsInputSchema,
    outputSchema: GeneratePsychographicsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
