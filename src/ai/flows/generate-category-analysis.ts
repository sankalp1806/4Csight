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
  Your task is to analyze the market category for the given business based on the provided information, supplementing it with real-time web searches for current data.

  Brand to Analyze: {{{brandName}}}
  Business Description: {{{description}}}
  Industry: {{{industry}}}

  Instructions:
  1.  **Perform Web Searches:** Use your search capabilities to find up-to-date information about the market category, including its size, growth trends, key segments, and competitive landscape.
  2.  **Generate Top-Level Metrics:** Provide key metrics for the category, including:
      - Market Size (e.g., "$12.5B") and its recent percentage change (e.g., "+15%").
      - Overall Growth Rate (e.g., "8.5%") and its recent percentage change (e.g., "+2.1%").
      - Estimated Number of Active Players and its recent change (e.g., "+12").
      - Market Concentration level (e.g., "Moderate") and a brief description (e.g., "Stable").
  3.  **Identify and Detail Market Segments:**
      - Identify 4-5 key market segments within the category.
      - For each segment, provide:
          - A descriptive name.
          - The estimated revenue in billions (e.g., "$5.6B").
          - The segment's growth rate as a percentage.
          - The segment's market share as a percentage.
          - The recent trend ('up', 'down', or 'stable').
  4.  **Assess Category Health:**
      - Provide an overall assessment (e.g., "Healthy", "Stagnant", "Declining").
      - Rate the 'Growth Potential', 'Competition Level', and 'Barriers to Entry' as 'High', 'Moderate', or 'Low'.
  5.  **Identify Demand Drivers:**
      - List 3-4 key factors influencing demand in this category.
      - For each driver, provide a name, a short description, its impact level ('High Impact', 'Medium Impact', 'Low Impact'), and its trend ('up' or 'down').

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
