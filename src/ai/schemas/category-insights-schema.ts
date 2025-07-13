/**
 * @fileOverview Schemas and types for the category insights generation.
 */

import { z } from 'genkit';
import { GenerateCategoryAnalysisOutputSchema } from './category-analysis-schema';

export const GenerateCategoryInsightsInputSchema = z.object({
  analysis: GenerateCategoryAnalysisOutputSchema.describe('The full category analysis output.'),
});
export type GenerateCategoryInsightsInput = z.infer<typeof GenerateCategoryInsightsInputSchema>;

export const InsightSchema = z.object({
  title: z.string().describe('The title of the insight.'),
  description: z.string().describe('A short, actionable description of the insight.'),
  relatedDataPoint: z.string().describe('The specific data point or area this insight is related to (e.g., a market segment or demand driver).'),
});

export const GenerateCategoryInsightsOutputSchema = z.object({
  insights: z.array(InsightSchema).describe('A list of 3-4 strategic insights.'),
});
export type GenerateCategoryInsightsOutput = z.infer<typeof GenerateCategoryInsightsOutputSchema>;
