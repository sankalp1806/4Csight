
'use server';
/**
 * @fileOverview Generates scores and short descriptions for a 4Cs analysis report based on an executive summary.
 *
 * - generateReportScores - A function that generates the scores.
 */
import {ai} from '@/ai/genkit';
import { GenerateReportScoresInputSchema, GenerateReportScoresOutputSchema, type GenerateReportScoresInput, type GenerateReportScoresOutput } from '@/ai/schemas/report-scores-schema';

export async function generateReportScores(input: GenerateReportScoresInput): Promise<GenerateReportScoresOutput> {
  return generateReportScoresFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReportScoresPrompt',
  input: {schema: GenerateReportScoresInputSchema},
  output: {schema: GenerateReportScoresOutputSchema},
  prompt: `You are a strategic marketing analyst. Based on the following executive summary of a 4Cs analysis, your task is to generate a score (out of 10) and a brief, two-word descriptive summary for each of the four categories: Competition, Consumer, Culture, and Category.

  - The score should reflect the brand's strength or opportunity in that area. A higher score indicates a stronger position or more favorable conditions.
  - The description should be a concise, positive, or neutral summary (e.g., "Strong Position", "Good Understanding", "Well Aligned", "Growth Market").

  Executive Summary:
  {{{executiveSummary}}}

  Provide the scores and descriptions in the required JSON format.
  `,
});

const generateReportScoresFlow = ai.defineFlow(
  {
    name: 'generateReportScoresFlow',
    inputSchema: GenerateReportScoresInputSchema,
    outputSchema: GenerateReportScoresOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
