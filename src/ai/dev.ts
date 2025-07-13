'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-4cs-analysis.ts';
import '@/ai/flows/prioritize-actionable-insights.ts';
import '@/ai/flows/generate-report-scores.ts';
import '@/ai/flows/generate-consumer-analysis.ts';
import '@/ai/flows/generate-cultural-analysis.ts';
import '@/ai/flows/generate-category-analysis.ts';
