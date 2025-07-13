
/**
 * @fileOverview Schemas and types for the report scoring functionality.
 * This file defines the data structures used for input and output of the report scoring Genkit flow.
 */

import {z} from 'genkit';

export const GenerateReportScoresInputSchema = z.object({
  executiveSummary: z.string().describe('The executive summary of the 4Cs analysis.'),
});
export type GenerateReportScoresInput = z.infer<typeof GenerateReportScoresInputSchema>;


const ScoreSchema = z.object({
    score: z.number().min(0).max(10).describe('A score from 0 to 10 for the category.'),
    description: z.string().describe('A short, two-word description summarizing the score.'),
});

export const GenerateReportScoresOutputSchema = z.object({
  competition: ScoreSchema.describe('Score and description for the Competition category.'),
  consumer: ScoreSchema.describe('Score and description for the Consumer category.'),
  culture: ScoreSchema.describe('Score and description for the Culture category.'),
  category: ScoreSchema.describe('Score and description for the Category category.'),
});
export type GenerateReportScoresOutput = z.infer<typeof GenerateReportScoresOutputSchema>;
