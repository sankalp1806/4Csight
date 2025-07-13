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
import { generateMarketResearch } from '@/ai/flows/generate-market-research';
import type { MarketResearch } from '@/ai/schemas/market-research-schema';
import { Search } from 'lucide-react';

interface MarketResearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brandName: string;
  industry: string;
  description: string;
}

export function MarketResearchDialog({ open, onOpenChange, brandName, industry, description }: MarketResearchDialogProps) {
  const { toast } = useToast();
  const [data, setData] = useState<MarketResearch | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        setLoading(true);
        setData(null);
        try {
          const result = await generateMarketResearch({ brandName, industry, description });
          setData(result);
        } catch (error) {
          console.error('Failed to generate market research:', error);
          toast({
            title: 'Error',
            description: 'Failed to generate market research summary.',
            variant: 'destructive',
          });
          onOpenChange(false);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [open, brandName, industry, description, onOpenChange, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-6 h-6 text-primary" />
            Market Research Summary
          </DialogTitle>
          <DialogDescription>
            AI-generated summary for {brandName} in the {industry} industry.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 max-h-[70vh] overflow-y-auto pr-4">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full mt-4" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          ) : data ? (
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{data.summary}</p>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
