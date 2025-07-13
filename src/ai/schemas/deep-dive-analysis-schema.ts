/**
 * @fileOverview Schemas and types for the deep dive customer segment analysis.
 */

import { z } from 'genkit';
import { CustomerSegmentSchema } from './consumer-analysis-schema';

export const GenerateDeepDiveAnalysisInputSchema = z.object({
  brandName: z.string().describe("The user's brand name for context."),
  industry: z.string().describe('The industry the business operates in.'),
  description: z.string().describe('A description of the project, business model, and objectives.'),
  segment: CustomerSegmentSchema.describe('The customer segment to analyze in detail.'),
});
export type GenerateDeepDiveAnalysisInput = z.infer<typeof GenerateDeepDiveAnalysisInputSchema>;

export const DeepDiveAnalysisSchema = z.object({
  detailedCharacteristics: z.string().describe("An elaborated description of the segment's demographics, psychographics, lifestyle, and values."),
  inDepthKeyNeeds: z.string().describe("An in-depth analysis of the segment's core needs, pain points, and desires."),
  primaryPurchaseDrivers: z.string().describe("A detailed explanation of the most influential factors driving their purchasing decisions."),
  preferredMediaConsumption: z.string().describe("A detailed description of their media habits, including specific platforms, websites, or influencers."),
});
export type DeepDiveAnalysis = z.infer<typeof DeepDiveAnalysisSchema>;
