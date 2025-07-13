'use server';
/**
 * @fileOverview Generates a high-level market research summary.
 *
 * - generateMarketResearch - A function that generates the summary.
 * - MarketResearchInput - The input type for the function.
 * - MarketResearch - The output for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { MarketResearchInputSchema, MarketResearchSchema } from '@/ai/schemas/market-research-schema';

export type MarketResearchInput = z.infer<typeof MarketResearchInputSchema>;
export type MarketResearch = z.infer<typeof MarketResearchSchema>;

export async function generateMarketResearch(input: MarketResearchInput): Promise<MarketResearch> {
  return generateMarketResearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMarketResearchPrompt',
  input: { schema: MarketResearchInputSchema },
  output: { schema: MarketResearchSchema },
  prompt: `You are a market research analyst. Provide a concise, high-level category analysis summary for the brand '{{{brandName}}}' which operates in the '{{{industry}}}' industry.
  
  Business Description: {{{description}}}

  Instructions:
  1.  **Perform Web Searches:** Use your search capabilities to find current data on the specified market category.
  2.  **Synthesize Findings:** Generate a brief, easy-to-read summary that covers the most critical aspects of the category relevant to the user's business. This should include:
      -   A brief overview of the category's definition and scope.
      -   Key market size and growth trends.
      -   A mention of the most significant market segments.
      -   The primary factors driving demand within the category.
  3.  **Keep it Concise:** The summary should be a few paragraphs long, providing a quick snapshot of the category's landscape.

  Return the result in the required JSON format.
  `,
});

const generateMarketResearchFlow = ai.defineFlow(
  {
    name: 'generateMarketResearchFlow',
    inputSchema: MarketResearchInputSchema,
    outputSchema: MarketResearchSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
