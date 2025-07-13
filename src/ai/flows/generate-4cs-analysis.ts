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

  Analyze the brand or business: {{{brandName}}}.
  Business Description: {{{description}}}
  Industry: {{{industry}}}

  Provide a comprehensive 4Cs analysis, including actionable insights and a deep understanding of the brand's current market position and potential opportunities. The analysis should include:

  - **Competition:** Analyzing the competitive landscape, including direct and indirect competitors, their strategies, strengths, and weaknesses.
  - **Culture:** Examining prevailing cultural trends, values, and how the brand aligns with or diverges from these cultural elements.
  - **Consumer:** Understanding the target audience segments, their needs, motivations, behaviors, and perceptions.
  - **Category:** Defining and analyzing the product or service category, including market size, growth trends, and key drivers of demand.

  Finally, create an **Executive Summary** with prioritized action items (High, Medium, and Low priority) based on the 4Cs analysis.

  Return the result in JSON format.
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
