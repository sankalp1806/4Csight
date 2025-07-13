/**
 * @fileOverview Schemas and types for the market research summary.
 */

import { z } from 'genkit';

export const MarketResearchInputSchema = z.object({
  brandName: z.string().describe("The user's brand name for context."),
  industry: z.string().describe('The industry the business operates in.'),
  description: z.string().describe('A description of the project, business model, and objectives.'),
});
export type MarketResearchInput = z.infer<typeof MarketResearchInputSchema>;

export const MarketResearchSchema = z.object({
  summary: z.string().describe("A concise summary of the market research findings, covering market size/trends, consumer behavior, and competitive environment."),
});
export type MarketResearch = z.infer<typeof MarketResearchSchema>;
