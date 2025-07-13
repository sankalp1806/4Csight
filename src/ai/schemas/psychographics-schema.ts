/**
 * @fileOverview Schemas and types for the psychographic data generation.
 */

import { z } from 'genkit';

export const GeneratePsychographicsInputSchema = z.object({
  brandName: z.string().describe("The user's brand name for context."),
  industry: z.string().describe('The industry the business operates in.'),
});
export type GeneratePsychographicsInput = z.infer<typeof GeneratePsychographicsInputSchema>;

export const ValueDistributionSchema = z.object({
  name: z.string().describe('The name of the core value (e.g., "Security", "Tradition", "Achievement").'),
  score: z.number().describe('The importance score for this value (0-100).'),
});

export const InterestDistributionSchema = z.object({
  name: z.string().describe('The name of the interest category (e.g., "Technology", "Fashion", "Travel").'),
  percentage: z.number().describe('The percentage of consumers with this interest.'),
});

export const LifestyleDistributionSchema = z.object({
  name: z.string().describe('The name of the lifestyle category (e.g., "Active", "Homebody", "Socialite").'),
  percentage: z.number().describe('The percentage of consumers in this lifestyle category.'),
});

export const PersonalityDistributionSchema = z.object({
    trait: z.string().describe('The name of the personality trait from the Big Five model (Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism).'),
    score: z.number().min(0).max(100).describe('The average score for this trait within the target consumer base (0-100).'),
});


export const GeneratePsychographicsOutputSchema = z.object({
  valueDistribution: z.array(ValueDistributionSchema).describe('The distribution of core values among consumers. Should contain 5-6 values.'),
  interestDistribution: z.array(InterestDistributionSchema).describe('The distribution of key interests. Should contain 5-6 interests.'),
  lifestyleDistribution: z.array(LifestyleDistributionSchema).describe('The distribution of common lifestyles. Should contain 4-5 lifestyles.'),
  personalityDistribution: z.array(PersonalityDistributionSchema).describe('The distribution of the Big Five personality traits. Must contain all 5 traits.'),
});
export type GeneratePsychographicsOutput = z.infer<typeof GeneratePsychographicsOutputSchema>;
