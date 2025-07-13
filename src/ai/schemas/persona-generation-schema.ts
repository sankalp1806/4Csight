/**
 * @fileOverview Schemas and types for the Persona Generation functionality.
 */

import { z } from 'genkit';
import { CustomerSegmentSchema } from './consumer-analysis-schema';

export const GeneratePersonasInputSchema = z.object({
  brandName: z.string().describe("The user's brand name for context."),
  industry: z.string().describe('The industry the business operates in.'),
  customerSegments: z.array(CustomerSegmentSchema).describe('The list of customer segments to generate personas for.'),
});
export type GeneratePersonasInput = z.infer<typeof GeneratePersonasInputSchema>;

export const PersonaSchema = z.object({
  name: z.string().describe('A plausible fictional name for the persona.'),
  avatarDataUri: z.string().describe("An AI-generated, photorealistic portrait of the persona as a data URI. Must include MIME type and Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  story: z.string().describe("A short, narrative story about the persona's life, background, and how they relate to the brand's industry."),
  goals: z.array(z.string()).describe("A list of 3-4 key life or professional goals for this persona."),
  frustrations: z.array(z.string()).describe("A list of 3-4 key frustrations or pain points this persona experiences, especially related to the industry."),
  segmentName: z.string().describe('The name of the customer segment this persona belongs to.'),
});
export type Persona = z.infer<typeof PersonaSchema>;

export const GeneratePersonasOutputSchema = z.object({
  personas: z.array(PersonaSchema),
});
export type GeneratePersonasOutput = z.infer<typeof GeneratePersonasOutputSchema>;
