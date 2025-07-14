/**
 * @fileOverview Schemas and types for the category analysis functionality.
 */

import {z} from 'genkit';

export const GenerateCategoryAnalysisInputSchema = z.object({
  brandName: z.string().describe('The name of the brand or business to analyze.'),
  description: z.string().describe('A description of the project, business model, and objectives.'),
  industry: z.string().describe('The industry the business operates in.'),
});
export type GenerateCategoryAnalysisInput = z.infer<typeof GenerateCategoryAnalysisInputSchema>;

export const TopLevelMetricSchema = z.object({
    marketSize: z.string().describe('The total market size, e.g., "$12.5B".'),
    marketSizeChange: z.string().optional().describe('The recent percentage change in market size, e.g., "+15%".'),
    isMarketSizeEstimated: z.boolean().optional().describe('True if the market size is an estimate or not from the current year.'),
    growthRate: z.string().describe('The overall market growth rate, e.g., "8.5%".'),
    growthRateChange: z.string().optional().describe('The recent change in growth rate, e.g., "+2.1%".'),
    isGrowthRateEstimated: z.boolean().optional().describe('True if the growth rate is an estimate or not from the current year.'),
    activePlayers: z.number().describe('The number of active players in the market.'),
    activePlayersChange: z.string().optional().describe('The recent change in the number of active players, e.g., "+12".'),
    isActivePlayersEstimated: z.boolean().optional().describe('True if the number of active players is an estimate.'),
    marketConcentration: z.string().describe('The level of market concentration, e.g., "Moderate".'),
    marketConcentrationDescription: z.string().describe('A brief description of the market concentration, e.g., "The market is dominated by a few major players...".'),
});
export type TopLevelMetric = z.infer<typeof TopLevelMetricSchema>;

export const MarketSegmentSchema = z.object({
    name: z.string().describe('Descriptive name of the market segment.'),
    revenue: z.string().describe('The estimated revenue for the segment, e.g., "$5.6B".'),
    growthRate: z.number().describe('The growth rate of the segment as a percentage.'),
    marketShare: z.number().describe('The market share of the segment as a percentage.'),
    trend: z.enum(['up', 'down', 'stable']).describe('The recent trend of the segment.'),
});
export type MarketSegment = z.infer<typeof MarketSegmentSchema>;

export const CategoryHealthSchema = z.object({
    overallAssessment: z.string().describe('The overall assessment of the category\'s health, e.g., "Healthy".'),
    growthPotential: z.enum(['High', 'Moderate', 'Low']).describe('The growth potential of the category.'),
    competitionLevel: z.enum(['High', 'Moderate', 'Low']).describe('The level of competition in the category.'),
    barriersToEntry: z.enum(['High', 'Moderate', 'Low']).describe('The barriers to entry for new competitors.'),
});
export type CategoryHealth = z.infer<typeof CategoryHealthSchema>;

export const DemandDriverSchema = z.object({
    name: z.string().describe('Name of the key demand driver.'),
    description: z.string().describe('A short description of the demand driver.'),
    impact: z.enum(['High Impact', 'Medium Impact', 'Low Impact']).describe('The impact level of the driver.'),
    trend: z.enum(['up', 'down']).describe('The trend of the demand driver\'s influence.'),
});
export type DemandDriver = z.infer<typeof DemandDriverSchema>;


export const GenerateCategoryAnalysisOutputSchema = z.object({
  topLevelMetrics: TopLevelMetricSchema,
  marketSegments: z.array(MarketSegmentSchema),
  categoryHealth: CategoryHealthSchema,
  demandDrivers: z.array(DemandDriverSchema),
});
export type GenerateCategoryAnalysisOutput = z.infer<typeof GenerateCategoryAnalysisOutputSchema>;