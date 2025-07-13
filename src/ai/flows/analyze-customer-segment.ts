'use server';
/**
 * @fileOverview Analyzes a single customer segment based on user input.
 *
 * - analyzeCustomerSegment - A function that analyzes a single customer segment.
 * - AnalyzeCustomerSegmentInput - The input type for the analyzeCustomerSegment function.
 * - AnalyzeCustomerSegmentOutput - The return type for the analyzeCustomerSegment function (which is a CustomerSegment object).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { CustomerSegmentSchema, type CustomerSegment } from '@/ai/schemas/consumer-analysis-schema';

const AnalyzeCustomerSegmentInputSchema = z.object({
  brandName: z.string().describe('The name of the user\'s brand for context.'),
  industry: z.string().describe('The industry of the user\'s brand.'),
  segmentName: z.string().describe('The name of the customer segment to analyze.'),
  segmentDescription: z.string().describe('A description of the customer segment.'),
});

export type AnalyzeCustomerSegmentInput = z.infer<typeof AnalyzeCustomerSegmentInputSchema>;
export type AnalyzeCustomerSegmentOutput = CustomerSegment;

export async function analyzeCustomerSegment(input: AnalyzeCustomerSegmentInput): Promise<AnalyzeCustomerSegmentOutput> {
  return analyzeCustomerSegmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCustomerSegmentPrompt',
  input: { schema: AnalyzeCustomerSegmentInputSchema },
  output: { schema: CustomerSegmentSchema },
  prompt: `You are a market research expert. A user is analyzing their brand '{{{brandName}}}' in the '{{{industry}}}' industry.
  
  They have manually added a new customer segment and need you to research and provide a detailed analysis for it.

  Segment to Analyze:
  - Name: {{{segmentName}}}
  - Description: {{{segmentDescription}}}

  Instructions:
  1.  **Perform Web Searches:** Use your search capabilities to find up-to-date information about a segment with these characteristics in the '{{{industry}}}' industry.
  2.  **Synthesize Information:** Based on your research, generate a detailed analysis of this customer segment.
  3.  **Populate the analysis:** Fill out all fields for the customer segment based on your analysis. Provide rich, detailed lists for characteristics, needs, purchase drivers, and media consumption. Estimate the market size percentage and provide a confidence score for your analysis.
    - name: Use the name provided by the user.
    - description: Use the description provided by the user.
    - marketSize: Estimate the segment's market size as a percentage of the total market.
    - characteristics: List key demographic and psychographic characteristics.
    - keyNeeds: List the primary needs and pain points of this segment.
    - purchaseDrivers: List the main factors that influence their purchasing decisions.
    - mediaConsumption: List the primary media channels they use.
    - analysisConfidence: Provide a score (0-100) on how confident you are in this analysis based on available data.

  Return the result in the required JSON format.
  `,
});

const analyzeCustomerSegmentFlow = ai.defineFlow(
  {
    name: 'analyzeCustomerSegmentFlow',
    inputSchema: AnalyzeCustomerSegmentInputSchema,
    outputSchema: CustomerSegmentSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    // Ensure the name and description from the input are preserved in the output.
    return { 
        ...output!, 
        name: input.segmentName,
        description: input.segmentDescription,
    };
  }
);
