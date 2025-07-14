
'use server';
/**
 * @fileOverview Generates a comprehensive 4Cs analysis (Competition, Culture, Consumer, Category) for a given brand or business using an LLM.
 *
 * - generate4CsAnalysis - A function that generates the 4Cs analysis.
 */

import {ai} from '@/ai/genkit';
import { Generate4CsAnalysisInputSchema, Generate4CsAnalysisOutputSchema, type Generate4CsAnalysisInput, type Generate4CsAnalysisOutput } from '@/ai/schemas/4cs-analysis-schema';

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
  {{#if location}}
  Geographic Location for Analysis: {{{location}}}
  {{/if}}

  Instructions:
  1.  **Perform Web Searches:** Use your search capabilities to find up-to-date information about the brand, its competitors, the specified industry, cultural trends, and consumer behavior. {{#if location}}Focus the search on the '{{{location}}}' region where applicable.{{/if}}
  2.  **Synthesize Information:** Combine the information from your web searches with the user-provided description and industry.
  3.  **Generate 4Cs Analysis:** Provide a comprehensive analysis covering the following four areas:
      -   **Competition:** Analyze the competitive landscape. You must identify **between 8 and 10 direct competitors**, **at least 4-5 indirect competitors**, and **at least 3 substitute competitors**. For each competitor, provide their name, type, estimated market share, a competitive rating (1-5), and a list of their key strengths and weaknesses. Use web search extensively to identify key competitors and gather this information. {{#if location}}Tailor the competitor list to the '{{{location}}}' market.{{/if}}
      -   **Culture:** Examine prevailing cultural trends, societal values, and lifestyle shifts that could impact the brand. {{#if location}}Focus on trends relevant to '{{{location}}}'.{{/if}}
      -   **Consumer:** Understand the target audience segments, their needs, motivations, online behavior, and perceptions. {{#if location}}Analyze consumers within '{{{location}}}'.{{/if}}
      -   **Category:** Define and analyze the product or service category, including market size, growth trends, and key drivers of demand. {{#if location}}Provide data specific to the '{{{location}}}' market.{{/if}}
  4.  **Create Structured Executive Summary:** Based on the full analysis, create a structured **Executive Summary**.
      -   **Key Findings:**
          -   **Market Opportunities:** Clearly articulate growth opportunities based on the analysis in a single paragraph.
          -   **Competitive Positions:** Assess the brand's position relative to competitors in a single paragraph.
          -   **Cultural Alignment:** Evaluate brand-culture fit and opportunities in a single paragraph.
          -   **Target Market:** Provide a refined understanding of priority customer segments in a single paragraph.
      -   **Strategic Recommendations:**
          -   **High Priority:** List 2-3 critical initiatives requiring immediate attention (high impact or quick wins).
          -   **Medium Priority:** List 2-3 important initiatives for medium-term growth.
          -   **Low Priority:** List 1-2 long-term strategic initiatives or improvements with uncertain returns.
  5.  **Generate Scores:** Based on the full analysis, generate a score (out of 10) and a brief, two-word descriptive summary for each of the four categories: Competition, Consumer, Culture, and Category. The score should reflect the brand's strength or opportunity in that area. A higher score indicates a stronger position or more favorable conditions.

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
