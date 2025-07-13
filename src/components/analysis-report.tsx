'use client';

import type { AnalysisResult } from '@/app/actions';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, ChevronsUp, ChevronUp, ChevronDown, Globe, Printer, Scale, Shapes, UserRound } from 'lucide-react';
import { ReportCard } from './report-card';

interface AnalysisReportProps {
  data: AnalysisResult;
}

export function AnalysisReport({ data }: AnalysisReportProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 printable-area">
      <div className="flex justify-between items-start print-hidden">
        <h2 className="text-3xl font-bold tracking-tight">Analysis Report</h2>
        <Button onClick={handlePrint} variant="outline">
          <Printer className="mr-2 h-4 w-4" />
          Export to PDF
        </Button>
      </div>

      <ReportCard title="Executive Summary" icon={Briefcase}>
        {data.executiveSummary}
      </ReportCard>

      <Tabs defaultValue="competition" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto print-hidden">
          <TabsTrigger value="competition" className="gap-2"><Scale className="h-4 w-4" />Competition</TabsTrigger>
          <TabsTrigger value="culture" className="gap-2"><Globe className="h-4 w-4" />Culture</TabsTrigger>
          <TabsTrigger value="consumer" className="gap-2"><UserRound className="h-4 w-4" />Consumer</TabsTrigger>
          <TabsTrigger value="category" className="gap-2"><Shapes className="h-4 w-4" />Category</TabsTrigger>
        </TabsList>
        <TabsContent value="competition">
          <ReportCard title="Competition Analysis" icon={Scale}>
            {data.competition}
          </ReportCard>
        </TabsContent>
        <TabsContent value="culture">
          <ReportCard title="Culture Analysis" icon={Globe}>
            {data.culture}
          </ReportCard>
        </TabsContent>
        <TabsContent value="consumer">
          <ReportCard title="Consumer Analysis" icon={UserRound}>
            {data.consumer}
          </ReportCard>
        </TabsContent>
        <TabsContent value="category">
          <ReportCard title="Category Analysis" icon={Shapes}>
            {data.category}
          </ReportCard>
        </TabsContent>
      </Tabs>
      
      <div>
        <h3 className="text-2xl font-bold tracking-tight mb-4">Prioritized Actionable Insights</h3>
        <Accordion type="single" collapsible className="w-full" defaultValue="high-priority">
          <AccordionItem value="high-priority">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              <div className="flex items-center gap-2 text-destructive">
                <ChevronsUp className="h-5 w-5" /> High Priority Actions
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 text-base text-foreground/80 whitespace-pre-wrap">
              {data.highPriorityActions}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="medium-priority">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              <div className="flex items-center gap-2 text-primary">
                <ChevronUp className="h-5 w-5" /> Medium Priority Actions
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 text-base text-foreground/80 whitespace-pre-wrap">
               {data.mediumPriorityActions}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="low-priority">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              <div className="flex items-center gap-2 text-accent">
                <ChevronDown className="h-5 w-5" /> Low Priority Actions
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 text-base text-foreground/80 whitespace-pre-wrap">
              {data.lowPriorityActions}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

    </div>
  );
}
