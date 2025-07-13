'use server';
/**
 * @fileOverview Generates actionable insights from a category analysis.
 *
 * - generateCategoryInsights - A function that generates insights.
 * - GenerateCategoryInsightsInput - The input type for the function.
 * - GenerateCategoryInsightsOutput - The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { GenerateCategoryInsightsInputSchema, GenerateCategoryInsightsOutputSchema, type GenerateCategoryInsightsInput, type GenerateCategoryInsightsOutput } from '@/ai/schemas/category-insights-schema';

export async function generateCategoryInsights(input: GenerateCategoryInsightsInput): Promise<GenerateCategoryInsightsOutput> {
  return generateCategoryInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCategoryInsightsPrompt',
  input: { schema: GenerateCategoryInsightsInputSchema },
  output: { schema: GenerateCategoryInsightsOutputSchema },
  prompt: `You are a strategic market analyst. Based on the following category analysis data, generate 3-4 concise, actionable insights. For each insight, provide a title, a short description, and identify the related data point (e.g., specific market segment, demand driver, or health metric).

  Category Analysis Data:
  - Top-Level Metrics:
    - Market Size: {{{analysis.topLevelMetrics.marketSize}}} ({{analysis.topLevelMetrics.marketSizeChange}})
    - Growth Rate: {{{analysis.topLevelMetrics.growthRate}}} ({{analysis.topLevelMetrics.growthRateChange}})
  - Market Segments:
    {{#each analysis.marketSegments}}
    - {{{this.name}}}: Revenue {{{this.revenue}}}, Growth {{{this.growthRate}}}%
    {{/each}}
  - Category Health:
    - Overall: {{{analysis.categoryHealth.overallAssessment}}}
    - Growth Potential: {{{analysis.categoryHealth.growthPotential}}}
    - Competition: {{{analysis.categoryHealth.competitionLevel}}}
  - Demand Drivers:
    {{#each analysis.demandDrivers}}
    - {{{this.name}}}: Impact - {{{this.impact}}}, Trend - {{{this.trend}}}
    {{/each}}

  Instructions:
  1.  Synthesize the provided data.
  2.  Identify the most critical patterns, opportunities, or risks.
  3.  Formulate 3-4 distinct strategic insights.
  4.  Return the insights in the required JSON format.
  `,
});

const generateCategoryInsightsFlow = ai.defineFlow(
  {
    name: 'generateCategoryInsightsFlow',
    inputSchema: GenerateCategoryInsightsInputSchema,
    outputSchema: GenerateCategoryInsightsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
