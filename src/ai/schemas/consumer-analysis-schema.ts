/**
 * @fileOverview Schemas and types for the consumer analysis functionality.
 */

import {z} from 'genkit';

export const GenerateConsumerAnalysisInputSchema = z.object({
  brandName: z.string().describe('The name of the brand or business to analyze.'),
  description: z.string().describe('A description of the project, business model, and objectives.'),
  industry: z.string().describe('The industry the business operates in.'),
});
export type GenerateConsumerAnalysisInput = z.infer<typeof GenerateConsumerAnalysisInputSchema>;

export const TopLevelMetricSchema = z.object({
  demographics: z
    .number()
    .min(0)
    .max(100)
    .describe('Progress score for Demographics analysis.'),
  psychographics: z
    .number()
    .min(0)
    .max(100)
    .describe('Progress score for Psychographics analysis.'),
  behavioralPatterns: z
    .number()
    .min(0)
    .max(100)
    .describe('Progress score for Behavioral Patterns analysis.'),
  customerJourney: z
    .number()
    .min(0)
    .max(100)
    .describe('Progress score for Customer Journey analysis.'),
});
export type TopLevelMetric = z.infer<typeof TopLevelMetricSchema>;

export const CustomerSegmentSchema = z.object({
  name: z.string().describe('Descriptive name of the customer segment.'),
  description: z
    .string()
    .describe('A short description of the customer segment.'),
  marketSize: z.number().min(0).max(100).describe('Estimated market size percentage.'),
  characteristics: z.array(z.string()).describe('List of key characteristics of the segment.'),
  keyNeeds: z.array(z.string()).describe('List of key needs or motivations of the segment.'),
  purchaseDrivers: z.array(z.string()).describe('Key factors that influence their purchasing decisions (e.g., Price, Quality, Brand Reputation).'),
  mediaConsumption: z.array(z.string()).describe('Primary channels where this segment consumes media (e.g., Social Media, News Websites, Podcasts).'),
  analysisConfidence: z
    .number()
    .min(0)
    .max(100)
    .describe('Confidence score in the analysis of this segment.'),
});
export type CustomerSegment = z.infer<typeof CustomerSegmentSchema>;

export const KeyInsightSchema = z.object({
    title: z.string().describe("Title of the key insight."),
    type: z.string().describe("Type of insight (e.g., 'Primary Pain Point', 'Price Sensitivity')."),
    description: z.string().describe("A short description of the insight."),
    value: z.string().describe("A key metric or value associated with the insight (e.g., '67%', 'Moderate').")
});
export type KeyInsight = z.infer<typeof KeyInsightSchema>;

export const GenerateConsumerAnalysisOutputSchema = z.object({
  topLevelMetrics: TopLevelMetricSchema,
  customerSegments: z.array(CustomerSegmentSchema),
  keyInsights: z.array(KeyInsightSchema),
});
export type GenerateConsumerAnalysisOutput = z.infer<
  typeof GenerateConsumerAnalysisOutputSchema
>;
