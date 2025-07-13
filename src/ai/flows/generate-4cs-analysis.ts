'use server';
/**
 * @fileOverview Generates a comprehensive 4Cs analysis (Competition, Culture, Consumer, Category) for a given brand or business using an LLM.
 *
 * - generate4CsAnalysis - A function that generates the 4Cs analysis.
 * - Generate4CsAnalysisInput - The input type for the generate4CsAnalysis function.
 * - Generate4CsAnalysisOutput - The return type for the generate4CsAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const Generate4CsAnalysisInputSchema = z.object({
  brandName: z.string().describe('The name of the brand or business to analyze.'),
  description: z.string().describe('A description of the project, business model, and objectives.'),
  industry: z.string().describe('The industry the business operates in.'),
});
export type Generate4CsAnalysisInput = z.infer<typeof Generate4CsAnalysisInputSchema>;

const Generate4CsAnalysisOutputSchema = z.object({
  competition: z.string().describe('Analysis of the competitive landscape.'),
  culture: z.string().describe('Analysis of relevant cultural trends and alignment.'),
  consumer: z.string().describe('Analysis of the target consumer segments.'),
  category: z.string().describe('Analysis of the product or service category.'),
  executiveSummary: z.string().describe('Executive summary with prioritized action items.'),
});
export type Generate4CsAnalysisOutput = z.infer<typeof Generate4CsAnalysisOutputSchema>;

export async function generate4CsAnalysis(input: Generate4CsAnalysisInput): Promise<Generate4CsAnalysisOutput> {
  return generate4CsAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generate4CsAnalysisPrompt',
  input: {schema: Generate4CsAnalysisInputSchema},
  output: {schema: Generate4CsAnalysisOutputSchema},
  prompt: `You are a strategic marketing expert specializing in 4Cs analysis (Competition, Culture, Consumer, Category).

  Your task is to analyze the brand or business based on the provided information and supplement it with real-time web search to gather the most current and relevant data.

  Brand to Analyze: {{{brandName}}}
  Business Description: {{{description}}}
  Industry: {{{industry}}}

  Instructions:
  1.  **Perform Web Searches:** Use your search capabilities to find up-to-date information about the brand, its competitors, the specified industry, cultural trends, and consumer behavior.
  2.  **Synthesize Information:** Combine the information from your web searches with the user-provided description and industry.
  3.  **Generate 4Cs Analysis:** Provide a comprehensive analysis covering the following four areas:
      -   **Competition:** Analyze the competitive landscape, including direct and indirect competitors, their strategies, market share, strengths, and weaknesses. Use web search to identify key competitors if not provided.
      -   **Culture:** Examine prevailing cultural trends, societal values, and lifestyle shifts that could impact the brand. Use web search to identify recent and relevant cultural movements.
      -   **Consumer:** Understand the target audience segments, their needs, motivations, online behavior, and perceptions. Use web search to find recent consumer studies or articles.
      -   **Category:** Define and analyze the product or service category, including market size, growth trends, and key drivers of demand. Use web search for the latest market data and reports.
  4.  **Create Executive Summary:** After the analysis, create a concise **Executive Summary** with prioritized action items (High, Medium, and Low priority). These actions should be strategic recommendations derived directly from the 4Cs analysis.

  Return the result in the required JSON format.
  `,
});

const generate4CsAnalysisFlow = ai.defineFlow(
  {
    name: 'generate4CsAnalysisFlow',
    inputSchema: Generate4CsAnalysisInputSchema,
    outputSchema: Generate4CsAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
