/**
 * @fileOverview Schemas and types for the detailed competitor analysis functionality.
 */

import { z } from 'genkit';

export const GenerateDetailedAnalysisInputSchema = z.object({
  brandNameToAnalyze: z.string().describe("The user's brand name for context."),
  competitorName: z.string().describe('The name of the competitor to analyze.'),
});
export type GenerateDetailedAnalysisInput = z.infer<typeof GenerateDetailedAnalysisInputSchema>;

export const DetailedAnalysisSchema = z.object({
  companyBackground: z.string().describe("A brief history and overview of the competitor."),
  productsAndServices: z.string().describe("Description of the competitor's main offerings and value proposition."),
  targetAudience: z.string().describe("Analysis of the competitor's primary customer base."),
  marketingStrategy: z.string().describe("Overview of the competitor's marketing channels and tactics."),
  keyDifferentiators: z.string().describe("What makes the competitor unique in the marketplace."),
  recentNews: z.string().describe("Any recent, relevant news or developments concerning the competitor."),
});
export type DetailedAnalysis = z.infer<typeof DetailedAnalysisSchema>;
