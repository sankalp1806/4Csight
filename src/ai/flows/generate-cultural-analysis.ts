'use server';
/**
 * @fileOverview Generates a comprehensive cultural analysis for a given brand or business.
 *
 * - generateCulturalAnalysis - A function that generates the cultural analysis.
 */

import {ai} from '@/ai/genkit';
import {
  GenerateCulturalAnalysisInputSchema,
  GenerateCulturalAnalysisOutputSchema,
  type GenerateCulturalAnalysisInput,
  type GenerateCulturalAnalysisOutput,
} from '@/ai/schemas/cultural-analysis-schema';

export async function generateCulturalAnalysis(
  input: GenerateCulturalAnalysisInput
): Promise<GenerateCulturalAnalysisOutput> {
  return generateCulturalAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCulturalAnalysisPrompt',
  input: {schema: GenerateCulturalAnalysisInputSchema},
  output: {schema: GenerateCulturalAnalysisOutputSchema},
  prompt: `You are a cultural strategist and market analyst. Your task is to conduct a detailed cultural analysis for the given brand based on the provided information, supplementing it with web searches for current trends and data.

  Brand to Analyze: {{{brandName}}}
  Business Description: {{{description}}}
  Industry: {{{industry}}}

  Instructions:
  1.  **Analyze Prevailing Cultural Trends:** Identify 4-5 current, major cultural movements and trends relevant to the brand's industry (e.g., Sustainability, Digital-First Lifestyle, Work-Life Balance, Health Consciousness). For each trend, provide:
      - A descriptive name and a short explanation.
      - An "alignment" assessment ('Strong Alignment', 'Moderate Alignment', 'Weak Alignment') indicating how well the brand currently aligns with this trend.
      - A "relevance" score ('High Relevance', 'Medium Relevance', 'Low Relevance').
      - A numerical "cultural impact" score (0-100).

  2.  **Identify Core Cultural Values:** Determine 4-5 fundamental values driving consumer behavior in this market (e.g., Authenticity, Innovation, Community, Convenience). For each value, provide:
      - A descriptive name and a short explanation.
      - A "strength" assessment ('Strong', 'Moderate', 'Weak').
      - A numerical "consumer importance" score (0-100).

  3.  **Calculate Cultural Fit Score:** Based on your analysis, generate a "Cultural Fit Score" with:
      - An "overallScore" (0-100).
      - A "brandAlignment" assessment ('Strong', 'Moderate', 'Weak').
      - A "culturalRelevance" assessment ('High', 'Moderate', 'Low').
      - A "trendAdaptation" assessment ('High', 'Moderate', 'Low').

  4.  **Identify Cultural Opportunities:** Suggest 2-3 strategic opportunities for the brand to better align with cultural trends. For each opportunity, provide:
      - A descriptive name and a short explanation.
      - A "potential" assessment ('High Potential', 'Medium Potential', 'Low Potential').
      - A "difficulty" assessment ('High Difficulty', 'Medium Difficulty', 'Low Difficulty').
  
  5. **Provide Regional Insights:** Give a cultural alignment score (0-10) for at least 3 major global regions (e.g., North America, Europe, Asia Pacific).

  Return the result in the required JSON format.
  `,
});

const generateCulturalAnalysisFlow = ai.defineFlow(
  {
    name: 'generateCulturalAnalysisFlow',
    inputSchema: GenerateCulturalAnalysisInputSchema,
    outputSchema: GenerateCulturalAnalysisOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
