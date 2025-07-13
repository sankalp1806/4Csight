'use client';

import { useState, useTransition } from 'react';
import { PageHeader } from '@/components/page-header';
import { AnalysisForm } from '@/components/analysis-form';
import { AnalysisReport } from '@/components/analysis-report';
import { getAnalysis, type AnalysisResult } from '@/app/actions';
import type { AnalysisFormValues } from '@/lib/schema';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
        </CardContent>
      </Card>
      
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Card>
          <CardContent className="p-6 space-y-4">
             <Skeleton className="h-6 w-1/4" />
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-9 w-1/3" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  );
}

export default function Home() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleFormSubmit = (values: AnalysisFormValues) => {
    setResult(null);
    startTransition(async () => {
      const { data, error } = await getAnalysis(values);
      if (error) {
        toast({
          variant: "destructive",
          title: "An error occurred",
          description: error,
        });
        return;
      }
      setResult(data || null);
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader />
      <main className="flex-grow container mx-auto py-8 px-4 md:px-6 space-y-12">
        <div className="print-hidden">
          <AnalysisForm onSubmit={handleFormSubmit} isPending={isPending} />
        </div>
        {isPending && <LoadingSkeleton />}
        {result && <AnalysisReport data={result} />}
      </main>
    </div>
  );
}
