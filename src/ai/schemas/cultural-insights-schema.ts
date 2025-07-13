
/**
 * @fileOverview Schemas and types for the cultural insights generation.
 */

import { z } from 'genkit';
import { GenerateCulturalAnalysisOutputSchema } from './cultural-analysis-schema';

export { GenerateCulturalAnalysisOutputSchema };

export const GenerateCulturalInsightsInputSchema = z.object({
  analysis: GenerateCulturalAnalysisOutputSchema.describe('The full cultural analysis output.'),
});
export type GenerateCulturalInsightsInput = z.infer<typeof GenerateCulturalInsightsInputSchema>;

export const InsightSchema = z.object({
  title: z.string().describe('The title of the insight.'),
  description: z.string().describe('A short, actionable description of the insight.'),
  relatedTrendOrValue: z.string().describe('The specific cultural trend or value this insight is related to.'),
});

export const GenerateCulturalInsightsOutputSchema = z.object({
  insights: z.array(InsightSchema).describe('A list of 3-4 strategic insights.'),
});
export type GenerateCulturalInsightsOutput = z.infer<typeof GenerateCulturalInsightsOutputSchema>;
