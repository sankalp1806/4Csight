/**
 * @fileOverview Schemas and types for the cultural analysis functionality.
 */

import {z} from 'genkit';

export const GenerateCulturalAnalysisInputSchema = z.object({
  brandName: z.string().describe('The name of the brand or business to analyze.'),
  description: z.string().describe('A description of the project, business model, and objectives.'),
  industry: z.string().describe('The industry the business operates in.'),
});
export type GenerateCulturalAnalysisInput = z.infer<typeof GenerateCulturalAnalysisInputSchema>;

export const PrevailingTrendSchema = z.object({
  trend: z.string().describe('Name of the cultural trend (e.g., Sustainability Focus).'),
  description: z.string().describe('A short description of the trend.'),
  alignment: z.enum(['Strong Alignment', 'Moderate Alignment', 'Weak Alignment']).describe('The brand\'s alignment with this trend.'),
  relevance: z.enum(['High Relevance', 'Medium Relevance', 'Low Relevance']).describe('The relevance of this trend to the brand.'),
  impact: z.number().min(0).max(100).describe('The cultural impact score (0-100).'),
});
export type PrevailingTrend = z.infer<typeof PrevailingTrendSchema>;

export const CoreValueSchema = z.object({
  value: z.string().describe('Name of the core value (e.g., Authenticity).'),
  description: z.string().describe('A short description of the value.'),
  strength: z.enum(['Strong', 'Moderate', 'Weak']).describe('The strength of this value in the market.'),
  importance: z.number().min(0).max(100).describe('The importance of this value to consumers (0-100).'),
});
export type CoreValue = z.infer<typeof CoreValueSchema>;

export const CulturalOpportunitySchema = z.object({
    opportunity: z.string().describe('Name of the cultural opportunity (e.g., Sustainable Innovation).'),
    description: z.string().describe('A short description of the opportunity.'),
    potential: z.enum(['High Potential', 'Medium Potential', 'Low Potential']).describe('The potential of this opportunity.'),
    difficulty: z.enum(['High Difficulty', 'Medium Difficulty', 'Low Difficulty']).describe('The difficulty to implement this opportunity.'),
});
export type CulturalOpportunity = z.infer<typeof CulturalOpportunitySchema>;

export const RegionalInsightSchema = z.object({
    region: z.string().describe('Name of the region (e.g., North America).'),
    score: z.number().min(0).max(10).describe('The cultural alignment score for this region (0-10).'),
});
export type RegionalInsight = z.infer<typeof RegionalInsightSchema>;

export const GenerateCulturalAnalysisOutputSchema = z.object({
  prevailingTrends: z.array(PrevailingTrendSchema),
  coreValues: z.array(CoreValueSchema),
  culturalOpportunities: z.array(CulturalOpportunitySchema),
  culturalFitScore: z.object({
    overallScore: z.number().min(0).max(100).describe('The overall cultural fit score (0-100).'),
    brandAlignment: z.enum(['Strong', 'Moderate', 'Weak']).describe('The brand\'s overall alignment with cultural values.'),
    culturalRelevance: z.enum(['High', 'Moderate', 'Low']).describe('The overall cultural relevance for the brand.'),
    trendAdaptation: z.enum(['High', 'Moderate', 'Low']).describe('The brand\'s ability to adapt to new trends.'),
  }),
  regionalInsights: z.array(RegionalInsightSchema),
});
export type GenerateCulturalAnalysisOutput = z.infer<typeof GenerateCulturalAnalysisOutputSchema>;