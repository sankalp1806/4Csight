
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
import { generateGlobalTrends } from '@/ai/flows/generate-global-trends';
import type { GenerateGlobalTrendsOutput } from '@/ai/schemas/global-trends-schema';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Globe, MapPin, TrendingUp, Zap } from 'lucide-react';

interface GlobalTrendsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brandName: string;
  industry: string;
}

export function GlobalTrendsDialog({ open, onOpenChange, brandName, industry }: GlobalTrendsDialogProps) {
  const { toast } = useToast();
  const [data, setData] = useState<GenerateGlobalTrendsOutput | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        setLoading(true);
        setData(null);
        try {
          const result = await generateGlobalTrends({ brandName, industry });
          setData(result);
        } catch (error) {
          console.error('Failed to generate global trends:', error);
          toast({
            title: 'Error',
            description: 'Failed to generate global trends data.',
            variant: 'destructive',
          });
          onOpenChange(false);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [open, brandName, industry, onOpenChange, toast]);
  
  const getOpportunityColor = (score: number) => {
    if (score >= 8) return 'bg-green-100 text-green-700';
    if (score >= 5) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Globe className="w-6 h-6 text-primary" />
            Global Cultural Trends
          </DialogTitle>
          <DialogDescription>
            AI-generated analysis of major global trends impacting the {industry} industry.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 max-h-[70vh] overflow-y-auto pr-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ))}
            </div>
          ) : data ? (
            <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
              {data.trends.map((trend, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5" />
                        {trend.name}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-6 pl-2">
                    <p className="text-sm text-muted-foreground">{trend.description}</p>
                    
                    <div>
                        <h4 className="font-semibold flex items-center gap-2 mb-2 text-primary">
                            <Zap className="w-4 h-4" />
                            Impact on {industry}
                        </h4>
                        <p className="text-sm text-muted-foreground">{trend.impactOnIndustry}</p>
                    </div>

                    <div>
                        <h4 className="font-semibold flex items-center gap-2 mb-3">
                            <MapPin className="w-4 h-4 text-primary" />
                            Regional Nuances
                        </h4>
                        <div className="space-y-3">
                            {trend.regionalVariations.map(variation => (
                                <div key={variation.region} className="text-sm">
                                    <span className="font-semibold">{variation.region}:</span>
                                    <span className="text-muted-foreground ml-2">{variation.nuance}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">Opportunity Score:</span>
                         <Badge className={getOpportunityColor(trend.opportunityScore)}>{trend.opportunityScore} / 10</Badge>
                    </div>

                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
