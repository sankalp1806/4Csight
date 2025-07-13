/**
 * @fileOverview Schemas and types for the SWOT analysis functionality.
 */

import { z } from 'genkit';

export const GenerateSwotAnalysisInputSchema = z.object({
  brandNameToAnalyze: z.string().describe("The user's brand name for context."),
  competitorName: z.string().describe('The name of the competitor to analyze.'),
});
export type GenerateSwotAnalysisInput = z.infer<typeof GenerateSwotAnalysisInputSchema>;


export const SwotAnalysisSchema = z.object({
  strengths: z.array(z.string()).describe("A list of the competitor's key strengths."),
  weaknesses: z.array(z.string()).describe("A list of the competitor's key weaknesses."),
  opportunities: z.array(z.string()).describe("A list of potential opportunities for the competitor."),
  threats: z.array(z.string()).describe("A list of potential threats to the competitor."),
});
export type SwotAnalysis = z.infer<typeof SwotAnalysisSchema>;
