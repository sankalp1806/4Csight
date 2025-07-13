
/**
 * @fileOverview Schemas and types for the global trends analysis.
 */

import { z } from 'genkit';

export const GenerateGlobalTrendsInputSchema = z.object({
  brandName: z.string().describe("The user's brand name for context."),
  industry: z.string().describe('The industry the business operates in.'),
});
export type GenerateGlobalTrendsInput = z.infer<typeof GenerateGlobalTrendsInputSchema>;

export const RegionalVariationSchema = z.object({
    region: z.string().describe('The name of the global region (e.g., "North America").'),
    nuance: z.string().describe('A brief description of how the trend manifests in this region.'),
});

export const GlobalTrendSchema = z.object({
  name: z.string().describe('The name of the global trend.'),
  description: z.string().describe('A detailed description of the trend.'),
  impactOnIndustry: z.string().describe('How the trend is impacting the specified industry.'),
  regionalVariations: z.array(RegionalVariationSchema).describe('Variations of the trend across different global regions.'),
  opportunityScore: z.number().min(1).max(10).describe('An opportunity score from 1 to 10.'),
});

export const GenerateGlobalTrendsOutputSchema = z.object({
  trends: z.array(GlobalTrendSchema).describe('A list of 3 major global cultural trends.'),
});
export type GenerateGlobalTrendsOutput = z.infer<typeof GenerateGlobalTrendsOutputSchema>;
