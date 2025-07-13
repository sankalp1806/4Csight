/**
 * @fileOverview Schemas and types for the demographic data generation.
 */

import { z } from 'genkit';

export const GenerateDemographicsInputSchema = z.object({
  brandName: z.string().describe("The user's brand name for context."),
  industry: z.string().describe('The industry the business operates in.'),
});
export type GenerateDemographicsInput = z.infer<typeof GenerateDemographicsInputSchema>;

export const AgeDistributionSchema = z.object({
  range: z.string().describe('The age range, e.g., "18-24".'),
  percentage: z.number().describe('The percentage of consumers in this age range.'),
});

export const GenderDistributionSchema = z.object({
  gender: z.string().describe('The gender, e.g., "Male", "Female", "Other".'),
  percentage: z.number().describe('The percentage of consumers of this gender.'),
});

export const IncomeDistributionSchema = z.object({
  level: z.string().describe('The income level, e.g., "< $50K", "$50K - $100K".'),
  percentage: z.number().describe('The percentage of consumers in this income bracket.'),
});

export const LocationDistributionSchema = z.object({
    location: z.string().describe('The geographic location (country or region).'),
    percentage: z.number().describe('The percentage of consumers in this location.'),
});

export const GenerateDemographicsOutputSchema = z.object({
  ageDistribution: z.array(AgeDistributionSchema).describe('The distribution of consumers by age.'),
  genderDistribution: z.array(GenderDistributionSchema).describe('The distribution of consumers by gender.'),
  incomeDistribution: z.array(IncomeDistributionSchema).describe('The distribution of consumers by income level.'),
  locationDistribution: z.array(LocationDistributionSchema).describe('The geographic distribution of consumers.'),
});
export type GenerateDemographicsOutput = z.infer<typeof GenerateDemographicsOutputSchema>;
