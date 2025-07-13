
'use server';
/**
 * @fileOverview Generates actionable insights from a cultural analysis.
 *
 * - generateCulturalInsights - A function that generates insights.
 * - GenerateCulturalInsightsInput - The input type for the function.
 * - GenerateCulturalInsightsOutput - The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { GenerateCulturalAnalysisOutputSchema, GenerateCulturalInsightsInputSchema, GenerateCulturalInsightsOutputSchema, type GenerateCulturalInsightsInput, type GenerateCulturalInsightsOutput } from '@/ai/schemas/cultural-insights-schema';


export async function generateCulturalInsights(input: GenerateCulturalInsightsInput): Promise<GenerateCulturalInsightsOutput> {
  return generateCulturalInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCulturalInsightsPrompt',
  input: { schema: GenerateCulturalInsightsInputSchema },
  output: { schema: GenerateCulturalInsightsOutputSchema },
  prompt: `You are a strategic marketing expert. Based on the following cultural analysis data, generate 3-4 concise, actionable insights. For each insight, provide a title, a short description, and identify the related cultural trend or value.

  Cultural Analysis Data:
  - Prevailing Trends:
    {{#each analysis.prevailingTrends}}
    - {{{this.trend}}}: {{{this.description}}} (Alignment: {{{this.alignment}}}, Relevance: {{{this.relevance}}})
    {{/each}}
  - Core Values:
    {{#each analysis.coreValues}}
    - {{{this.value}}}: {{{this.description}}} (Strength: {{{this.strength}}}, Importance: {{{this.importance}}})
    {{/each}}
  - Cultural Opportunities:
     {{#each analysis.culturalOpportunities}}
    - {{{this.opportunity}}}: {{{this.description}}} (Potential: {{{this.potential}}}, Difficulty: {{{this.difficulty}}})
    {{/each}}

  Instructions:
  1.  Synthesize the provided data.
  2.  Identify the most critical patterns, opportunities, or risks.
  3.  Formulate 3-4 distinct strategic insights.
  4.  Return the insights in the required JSON format.
  `,
});

const generateCulturalInsightsFlow = ai.defineFlow(
  {
    name: 'generateCulturalInsightsFlow',
    inputSchema: GenerateCulturalInsightsInputSchema,
    outputSchema: GenerateCulturalInsightsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
