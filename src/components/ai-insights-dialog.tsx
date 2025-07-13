
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { generateCulturalInsights } from '@/ai/flows/generate-cultural-insights';
import type { GenerateCulturalAnalysisOutput } from '@/ai/schemas/cultural-analysis-schema';
import type { GenerateCulturalInsightsOutput } from '@/ai/schemas/cultural-insights-schema';
import { Lightbulb, Zap } from 'lucide-react';

interface AiInsightsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analysis: GenerateCulturalAnalysisOutput | null;
}

export function AiInsightsDialog({ open, onOpenChange, analysis }: AiInsightsDialogProps) {
  const { toast } = useToast();
  const [data, setData] = useState<GenerateCulturalInsightsOutput | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && analysis) {
      const fetchData = async () => {
        setLoading(true);
        setData(null);
        try {
          const result = await generateCulturalInsights({ analysis });
          setData(result);
        } catch (error) {
          console.error('Failed to generate AI insights:', error);
          toast({
            title: 'Error',
            description: 'Failed to generate AI insights.',
            variant: 'destructive',
          });
          onOpenChange(false);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [open, analysis, onOpenChange, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            AI-Powered Strategic Insights
          </DialogTitle>
          <DialogDescription>
            Key takeaways and actionable recommendations from your cultural analysis.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 max-h-[70vh] overflow-y-auto pr-4">
          {loading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : data ? (
            <div className="space-y-6">
              {data.insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                   <div className="p-2 bg-primary/10 rounded-full">
                        <Lightbulb className="w-5 h-5 text-primary" />
                    </div>
                  <div>
                    <h3 className="font-semibold">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                    <p className="text-xs text-primary font-medium mt-2">Related to: {insight.relatedTrendOrValue}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
