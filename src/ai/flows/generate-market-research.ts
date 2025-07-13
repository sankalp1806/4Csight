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
  prompt: `You are a market research analyst. Provide a concise, high-level market research summary for the brand '{{{brandName}}}' which operates in the '{{{industry}}}' industry.
  
  Business Description: {{{description}}}

  Instructions:
  1.  **Perform Web Searches:** Use your search capabilities to find current data on the market.
  2.  **Synthesize Findings:** Generate a brief, easy-to-read summary that covers the most critical aspects of the market relevant to the user's business. This should touch upon market size/trends, key consumer behaviors, and the competitive environment.
  3.  **Keep it Concise:** The summary should be a few paragraphs long.

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
