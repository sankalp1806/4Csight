'use server';

import { generate4CsAnalysis, Generate4CsAnalysisOutput } from '@/ai/flows/generate-4cs-analysis';
import { prioritizeActionableInsights, PrioritizeActionableInsightsOutput } from '@/ai/flows/prioritize-actionable-insights';
import { analysisFormSchema, AnalysisFormValues } from '@/lib/schema';

export type AnalysisResult = Generate4CsAnalysisOutput & PrioritizeActionableInsightsOutput;

export async function getAnalysis(values: AnalysisFormValues): Promise<{ data?: AnalysisResult; error?: string }> {
  const validatedFields = analysisFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid input.' };
  }

  const { brandName, emphasis } = validatedFields.data;

  try {
    const analysis4Cs = await generate4CsAnalysis({
      brandName,
      emphasis: emphasis === 'None' ? undefined : emphasis,
    });

    const priorities = await prioritizeActionableInsights({
      competitionAnalysis: analysis4Cs.competition,
      cultureAnalysis: analysis4Cs.culture,
      consumerAnalysis: analysis4Cs.consumer,
      categoryAnalysis: analysis4Cs.category,
    });

    return { data: { ...analysis4Cs, ...priorities } };
  } catch (e) {
    console.error(e);
    // This is a generic error message for the user.
    // The actual error is logged on the server.
    return { error: 'An unexpected error occurred while generating the analysis. Please try again later.' };
  }
}
