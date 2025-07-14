/**
 * @fileOverview Schemas and types for the 4Cs analysis functionality.
 * This file defines the data structures used for input and output of the 4Cs analysis Genkit flow.
 *
 * - Generate4CsAnalysisInputSchema, Generate4CsAnalysisInput
 * - CompetitorSchema, Competitor
 * - ScoreSchema, Score
 * - Generate4CsAnalysisOutputSchema, Generate4CsAnalysisOutput
 */

import {z} from 'genkit';

export const Generate4CsAnalysisInputSchema = z.object({
  brandName: z.string().describe('The name of the brand or business to analyze.'),
  description: z.string().describe('A description of the project, business model, and objectives.'),
  industry: z.string().describe('The industry the business operates in.'),
});
export type Generate4CsAnalysisInput = z.infer<typeof Generate4CsAnalysisInputSchema>;

export const CompetitorSchema = z.object({
  name: z.string().describe('The name of the competitor.'),
  type: z.enum(['Direct', 'Indirect', 'Substitute']).describe('The type of competitor.'),
  marketShare: z.number().describe('Estimated market share percentage.'),
  rating: z.number().min(0).max(5).describe('A competitive rating from 1 to 5.'),
  strengths: z.array(z.string()).describe('A list of key strengths.'),
  weaknesses: z.array(z.string()).describe('A list of key weaknesses.'),
});
export type Competitor = z.infer<typeof CompetitorSchema>;

const ScoreSchema = z.object({
    score: z.number().min(0).max(10).describe('A score from 0 to 10 for the category.'),
    description: z.string().describe('A short, two-word description summarizing the score.'),
});
export type Score = z.infer<typeof ScoreSchema>;


export const Generate4CsAnalysisOutputSchema = z.object({
  competition: z.array(CompetitorSchema).describe('A list of competitors with their analysis.'),
  culture: z.string().describe('Analysis of relevant cultural trends and alignment.'),
  consumer: z.string().describe('Analysis of the target consumer segments.'),
  category: z.string().describe('Analysis of the product or service category.'),
  executiveSummary: z.string().describe('Executive summary with prioritized action items.'),
  scores: z.object({
      competition: ScoreSchema,
      consumer: ScoreSchema,
      culture: ScoreSchema,
      category: ScoreSchema,
  }).describe("Scores for each of the 4C categories.")
});
export type Generate4CsAnalysisOutput = z.infer<typeof Generate4CsAnalysisOutputSchema>;