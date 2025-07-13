'use server';
/**
 * @fileOverview Generates a comprehensive consumer analysis for a given brand or business.
 *
 * - generateConsumerAnalysis - A function that generates the consumer analysis.
 */

import {ai} from '@/ai/genkit';
import {
  GenerateConsumerAnalysisInputSchema,
  GenerateConsumerAnalysisOutputSchema,
  type GenerateConsumerAnalysisInput,
  type GenerateConsumerAnalysisOutput,
} from '@/ai/schemas/consumer-analysis-schema';

export async function generateConsumerAnalysis(
  input: GenerateConsumerAnalysisInput
): Promise<GenerateConsumerAnalysisOutput> {
  return generateConsumerAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateConsumerAnalysisPrompt',
  input: {schema: GenerateConsumerAnalysisInputSchema},
  output: {schema: GenerateConsumerAnalysisOutputSchema},
  prompt: `You are a market research and customer experience (CX) expert.
  Your task is to analyze the brand or business based on the provided information and supplement it with real-time web search to gather current data on consumer behavior, identify key customer segments, and map the customer journey.

  Brand to Analyze: {{{brandName}}}
  Business Description: {{{description}}}
  Industry: {{{industry}}}

  Instructions:
  1.  **Perform Web Searches:** Use your search capabilities to find up-to-date information about consumer demographics, psychographics, behavioral patterns, and customer journeys relevant to the specified industry and business.
  2.  **Generate Top-Level Metrics:** Provide a score (0-100) for the estimated completeness or confidence in the analysis for each of the following areas: Demographics, Psychographics, Behavioral Patterns, and Customer Journey.
  3.  **Identify and Detail Customer Segments:**
      - Identify 2-3 distinct customer segments.
      - For each segment, provide:
          - A descriptive name and a short description.
          - The estimated market size as a percentage.
          - A list of key characteristics.
          - A list of key needs or motivations.
          - A list of primary **purchase drivers** (e.g., 'Price', 'Quality', 'Brand Reputation', 'Convenience').
          - A list of primary **media consumption** channels (e.g., 'Social Media', 'News Websites', 'Podcasts', 'TV').
          - An "Analysis Confidence" score (0-100) representing how well this segment is understood based on available data.
  4.  **Extract Key Insights:**
      - Synthesize your findings into 3-4 actionable key insights.
      - For each insight, provide a title, a type (e.g., 'Primary Pain Point', 'Price Sensitivity', 'Brand Loyalty'), a short description, and a relevant metric or value.
  5.  **Construct Customer Journey Map:**
      - Create a typical customer journey map for the primary customer segment, consisting of 5 key stages: Awareness, Consideration, Purchase, Service, and Loyalty.
      - For each of the 5 stages, provide a detailed description of the customer's typical **actions**, key **touchpoints**, and likely **feelings**.

  Return the result in the required JSON format.
  `,
});

const generateConsumerAnalysisFlow = ai.defineFlow(
  {
    name: 'generateConsumerAnalysisFlow',
    inputSchema: GenerateConsumerAnalysisInputSchema,
    outputSchema: GenerateConsumerAnalysisOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
