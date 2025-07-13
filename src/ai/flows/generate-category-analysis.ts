
'use server';
/**
 * @fileOverview Generates a comprehensive category analysis for a given brand or business.
 *
 * - generateCategoryAnalysis - A function that generates the category analysis.
 */

import {ai} from '@/ai/genkit';
import {
  GenerateCategoryAnalysisInputSchema,
  GenerateCategoryAnalysisOutputSchema,
  type GenerateCategoryAnalysisInput,
  type GenerateCategoryAnalysisOutput,
} from '@/ai/schemas/category-analysis-schema';

export async function generateCategoryAnalysis(
  input: GenerateCategoryAnalysisInput
): Promise<GenerateCategoryAnalysisOutput> {
  return generateCategoryAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCategoryAnalysisPrompt',
  input: {schema: GenerateCategoryAnalysisInputSchema},
  output: {schema: GenerateCategoryAnalysisOutputSchema},
  prompt: `You are a market research expert specializing in category analysis.
  Your task is to analyze the market category for the given business based on the provided information, supplementing it with **real-time web searches for the latest and most accurate data available.**

  Brand to Analyze: {{{brandName}}}
  Business Description: {{{description}}}
  Industry: {{{industry}}}

  Instructions:
  1.  **Perform Real-Time Web Searches:** Use your search capabilities to find the most current and accurate data for all requested metrics. Prioritize official reports, financial statements, and reputable market analysis sources.
  2.  **Generate Top-Level Metrics:** Provide key metrics for the category, including:
      -   **marketSize:** A precise, current market size value (e.g., "$12.5B"). If a real-time figure is unavailable, use the most recent available data and set 'isMarketSizeEstimated' to true.
      -   **isMarketSizeEstimated:** A boolean set to true if the market size is an estimate or not from the current year, otherwise false.
      -   **growthRate:** A precise, current growth rate (e.g., "8.5%"). If a real-time figure is unavailable, use the most recent data and set 'isGrowthRateEstimated' to true.
      -   **isGrowthRateEstimated:** A boolean set to true if the growth rate is an estimate or not from the current year, otherwise false.
      -   **activePlayers:** The number of active players. If the exact number isn't available, provide a well-reasoned estimate and set 'isActivePlayersEstimated' to true.
      -   **isActivePlayersEstimated:** A boolean set to true if the number of active players is an estimate, otherwise false.
      -   **marketConcentration:** The level of market concentration (e.g., "Moderate").
      -   **marketConcentrationDescription:** A one-sentence summary explaining the concentration.
  3.  **Identify and Detail Market Segments:**
      - Identify 4-5 key market segments.
      - For each, provide a name, revenue, growth rate, market share, and trend.
  4.  **Assess Category Health:**
      - Provide an overall assessment and rate potential, competition, and barriers to entry.
  5.  **Identify Demand Drivers:**
      - List 3-4 key demand drivers with descriptions, impact, and trends.

  Return the result in the required JSON format.
  `,
});

const generateCategoryAnalysisFlow = ai.defineFlow(
  {
    name: 'generateCategoryAnalysisFlow',
    inputSchema: GenerateCategoryAnalysisInputSchema,
    outputSchema: GenerateCategoryAnalysisOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
