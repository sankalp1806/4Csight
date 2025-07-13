'use server';
/**
 * @fileOverview Generates detailed, AI-powered personas based on customer segments.
 *
 * - generatePersonas - A function that creates multiple personas.
 * - GeneratePersonasInput - The input type for the function.
 * - GeneratePersonasOutput - The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { GeneratePersonasInputSchema, GeneratePersonasOutputSchema, PersonaSchema } from '@/ai/schemas/persona-generation-schema';
import { CustomerSegmentSchema, type CustomerSegment } from '@/ai/schemas/consumer-analysis-schema';

export type GeneratePersonasInput = z.infer<typeof GeneratePersonasInputSchema>;
export type GeneratePersonasOutput = z.infer<typeof GeneratePersonasOutputSchema>;

export async function generatePersonas(input: GeneratePersonasInput): Promise<GeneratePersonasOutput> {
  return generatePersonasFlow(input);
}

const personaPrompt = ai.definePrompt({
    name: 'personaPrompt',
    input: { schema: CustomerSegmentSchema },
    output: { schema: PersonaSchema.omit({ avatarDataUri: true }) },
    prompt: `You are a world-class marketing researcher and storyteller. Your task is to create a single, compelling, and realistic persona based on the provided customer segment. The persona should feel like a real person. Use web search to ground your persona in real-world data and trends.

    Customer Segment to analyze:
    - Name: {{{name}}}
    - Description: {{{description}}}
    - Characteristics: {{#each characteristics}}- {{{this}}}{{/each}}
    - Key Needs: {{#each keyNeeds}}- {{{this}}}{{/each}}
    - Purchase Drivers: {{#each purchaseDrivers}}- {{{this}}}{{/each}}

    Instructions:
    1.  **Synthesize the Data**: Deeply analyze all the information for the "{{{name}}}" segment.
    2.  **Create a Persona Story**: Write a brief, engaging narrative. Give the persona a name, a backstory, and a personality that reflects the segment's characteristics and values.
    3.  **Define Goals**: List 3-4 specific, actionable goals that this persona has in their life or work. These should relate to their needs and aspirations.
    4.  **Identify Frustrations**: List 3-4 key frustrations or pain points they face, particularly those relevant to the industry. These should be derived from their key needs.
    5.  **Set Segment Name**: Ensure the 'segmentName' field in the output matches the input segment name: "{{{name}}}".

    Return a single, detailed persona in the required JSON format.
    `,
});

const generatePersonasFlow = ai.defineFlow(
  {
    name: 'generatePersonasFlow',
    inputSchema: GeneratePersonasInputSchema,
    outputSchema: GeneratePersonasOutputSchema,
  },
  async (input) => {
    const personaPromises = input.customerSegments.map(async (segment) => {
      // Generate persona text details
      const { output: personaDetails } = await personaPrompt(segment);
      if (!personaDetails) {
        throw new Error(`Failed to generate details for persona: ${segment.name}`);
      }

      // Generate avatar image
      const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `Generate a photorealistic, professional headshot of a person matching this description: ${personaDetails.story}. The person should look friendly and approachable.`,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });

      if (!media?.url) {
        throw new Error(`Failed to generate avatar for persona: ${personaDetails.name}`);
      }
      
      return {
        ...personaDetails,
        avatarDataUri: media.url,
      };
    });

    const personas = await Promise.all(personaPromises);
    
    return { personas };
  }
);
