'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-4cs-analysis.ts';
import '@/ai/flows/prioritize-actionable-insights.ts';
import '@/ai/flows/generate-report-scores.ts';
import '@/ai/flows/generate-consumer-analysis.ts';
import '@/ai/flows/generate-cultural-analysis.ts';
import '@/ai/flows/generate-category-analysis.ts';
import '@/ai/flows/analyze-competitor.ts';
import '@/ai/flows/generate-detailed-analysis.ts';
import '@/ai/flows/generate-swot-analysis.ts';
import '@/ai/flows/generate-deep-dive-analysis.ts';
import '@/ai/flows/generate-journey-map.ts';
import '@/ai/flows/analyze-customer-segment.ts';
import '@/ai/flows/generate-market-research.ts';
import '@/ai/flows/generate-personas.ts';
import '@/ai/flows/generate-demographics.ts';
