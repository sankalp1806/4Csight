import { z } from 'zod';

export const analysisFormSchema = z.object({
  brandName: z.string().min(2, {
    message: "Brand name must be at least 2 characters.",
  }),
  emphasis: z.enum(['None', 'Competition', 'Culture', 'Consumer', 'Category']).default('None'),
});

export type AnalysisFormValues = z.infer<typeof analysisFormSchema>;
