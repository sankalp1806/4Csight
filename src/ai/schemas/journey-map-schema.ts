/**
 * @fileOverview Schemas and types for the customer journey map generation.
 */

import { z } from 'genkit';
import { CustomerSegmentSchema } from './consumer-analysis-schema';

export const GenerateJourneyMapInputSchema = z.object({
  brandName: z.string().describe("The user's brand name for context."),
  industry: z.string().describe('The industry the business operates in.'),
  description: z.string().describe('A description of the project, business model, and objectives.'),
  segment: CustomerSegmentSchema.pick({ name: true, description: true }).describe('The customer segment to create a journey map for.'),
});
export type GenerateJourneyMapInput = z.infer<typeof GenerateJourneyMapInputSchema>;

export const JourneyStageSchema = z.object({
    stage: z.string().describe("The name of the journey stage (e.g., 'Awareness', 'Consideration')."),
    actions: z.string().describe("What the customer is doing during this stage."),
    touchpoints: z.string().describe("Where the customer interacts with the brand or similar brands."),
    feelings: z.string().describe("The customer's likely emotions or thoughts at this stage.")
});
export type JourneyStage = z.infer<typeof JourneyStageSchema>;

export const JourneyMapSchema = z.object({
  stages: z.array(JourneyStageSchema).describe('An array of objects, each representing a stage in the customer journey.'),
});
export type JourneyMap = z.infer<typeof JourneyMapSchema>;
