/**
 * @fileOverview Schemas and types for the behavioral patterns data generation.
 */

import { z } from 'genkit';

export const GenerateBehavioralPatternsInputSchema = z.object({
  brandName: z.string().describe("The user's brand name for context."),
  industry: z.string().describe('The industry the business operates in.'),
});
export type GenerateBehavioralPatternsInput = z.infer<typeof GenerateBehavioralPatternsInputSchema>;

export const DistributionSchema = z.object({
    name: z.string().describe('The name of the category or item.'),
    value: z.number().describe('The value or percentage for this item.'),
});

export const GenerateBehavioralPatternsOutputSchema = z.object({
  purchaseBehavior: z.object({
      frequency: z.array(DistributionSchema).describe('The distribution of purchase frequency (e.g., "Daily", "Weekly", "Monthly"). Percentages should sum to 100.'),
      channels: z.array(DistributionSchema).describe('The distribution of preferred purchase channels (e.g., "Online", "In-Store", "Mobile App"). Percentages should sum to 100.'),
  }),
  brandInteractions: z.array(DistributionSchema).describe('The distribution of how customers interact with the brand (e.g., "Social Media", "Email Newsletter", "Customer Support").'),
  usagePatterns: z.array(DistributionSchema).describe('The distribution of product/service usage patterns (e.g., "High Engagement", "Moderate Usage", "Low Usage").'),
});
export type GenerateBehavioralPatternsOutput = z.infer<typeof GenerateBehavioralPatternsOutputSchema>;
