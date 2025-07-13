
'use client';

import {
  ArrowLeft,
  ArrowUp,
  Globe,
  Zap,
  TrendingUp,
  Heart,
  Lightbulb,
  Star,
  AreaChart,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { generateCulturalAnalysis } from '@/ai/flows/generate-cultural-analysis';
import type {
  GenerateCulturalAnalysisOutput,
  PrevailingTrend,
  CoreValue,
  CulturalOpportunity,
} from '@/ai/schemas/cultural-analysis-schema';
import { GlobalTrendsDialog } from '@/components/global-trends-dialog';
import { AiInsightsDialog } from '@/components/ai-insights-dialog';
import { CulturalMonitoringDialog } from '@/components/cultural-monitoring-dialog';


function CulturalAnalysisContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<GenerateCulturalAnalysisOutput | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [isGlobalTrendsOpen, setIsGlobalTrendsOpen] = useState(false);
  const [isAiInsightsOpen, setIsAiInsightsOpen] = useState(false);
  const [isMonitoringOpen, setIsMonitoringOpen] = useState(false);


  const brandName = searchParams.get('brandName') || '';
  const industry = searchParams.get('industry') || '';

  useEffect(() => {
    const description = searchParams.get('description');
    
    if (brandName && description && industry) {
      const fetchAnalysis = async () => {
        setLoading(true);
        try {
          const result = await generateCulturalAnalysis({
            brandName,
            description,
            industry,
          });
          setAnalysis(result);
        } catch (error) {
          console.error('Failed to fetch cultural analysis:', error);
          toast({
            title: 'Error',
            description: 'Failed to generate cultural analysis.',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      };
      fetchAnalysis();
    } else {
      setLoading(false);
    }
  }, [searchParams, toast, brandName, industry]);

  if (loading) {
    return <AnalysisSkeleton />;
  }

  if (!analysis) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No analysis data available.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Go back to the dashboard to start a new analysis.
        </p>
        <Link href="/">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }
  
  const getBadgeClass = (value: string): string => {
    const lowerValue = value.toLowerCase();
    if (lowerValue.includes('strong') || lowerValue.includes('high'))
      return 'bg-green-100 text-green-700';
    if (lowerValue.includes('moderate') || lowerValue.includes('medium'))
      return 'bg-yellow-100 text-yellow-700';
    if (lowerValue.includes('weak') || lowerValue.includes('low'))
      return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };
  

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cultural Analysis</h1>
          <p className="mt-1 text-muted-foreground">
            Examine cultural trends and brand alignment opportunities
          </p>
        </div>
        <div className="flex gap-2 shrink-0 w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => setIsGlobalTrendsOpen(true)}>
            <Globe className="mr-2 h-4 w-4" /> Global Trends
          </Button>
          <Button className="w-full sm:w-auto" onClick={() => setIsAiInsightsOpen(true)}>
            <Zap className="mr-2 h-4 w-4" /> AI Insights
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-6 w-6 text-foreground" />
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
                  Prevailing Cultural Trends
                </h2>
                <p className="text-sm text-muted-foreground">
                  Current cultural movements and their impact on your market
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {analysis.prevailingTrends.map((trend, index) => (
                <PrevailingTrendCard key={index} trend={trend} getBadgeClass={getBadgeClass}/>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Heart className="h-6 w-6 text-foreground" />
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
                  Core Cultural Values
                </h2>
                <p className="text-sm text-muted-foreground">
                  Fundamental values driving consumer behavior
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {analysis.coreValues.map((value, index) => (
                <CoreValueCard key={index} value={value} getBadgeClass={getBadgeClass}/>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="h-6 w-6 text-foreground" />
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
                  Cultural Opportunities
                </h2>
                <p className="text-sm text-muted-foreground">
                  Strategic opportunities for cultural alignment
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {analysis.culturalOpportunities.map((opportunity, index) => (
                <CulturalOpportunityCard
                  key={index}
                  opportunity={opportunity}
                  getBadgeClass={getBadgeClass}
                />
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-8 sticky top-8">
          <CulturalFitScoreCard
            score={analysis.culturalFitScore}
            getBadgeClass={getBadgeClass}
          />
          <CulturalMonitoringCard onSetupClick={() => setIsMonitoringOpen(true)} />
          <RegionalInsightsCard insights={analysis.regionalInsights} />
        </aside>
      </div>

      <GlobalTrendsDialog 
        open={isGlobalTrendsOpen}
        onOpenChange={setIsGlobalTrendsOpen}
        brandName={brandName}
        industry={industry}
      />
      <AiInsightsDialog
        open={isAiInsightsOpen}
        onOpenChange={setIsAiInsightsOpen}
        analysis={analysis}
      />
       <CulturalMonitoringDialog
        open={isMonitoringOpen}
        onOpenChange={setIsMonitoringOpen}
        trends={analysis.prevailingTrends}
      />
    </>
  );
}

const PrevailingTrendCard = ({
  trend,
  getBadgeClass
}: {
  trend: PrevailingTrend;
  getBadgeClass: (value: string) => string;
}) => (
  <Card className="border-none bg-gradient-to-br from-card to-muted/20">
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold flex items-center">
          {trend.trend} <ArrowUp className="w-4 h-4 text-green-500 ml-1" />
        </h3>
        <div className="flex gap-2">
          <Badge className={getBadgeClass(trend.alignment)}>{trend.alignment}</Badge>
          <Badge className={getBadgeClass(trend.relevance)}>{trend.relevance}</Badge>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{trend.description}</p>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
          Cultural Impact
        </span>
        <Progress value={trend.impact} className="h-2 flex-1" />
        <span className="text-sm font-bold">{trend.impact}%</span>
      </div>
    </CardContent>
  </Card>
);

const CoreValueCard = ({ value, getBadgeClass }: { value: CoreValue, getBadgeClass: (value: string) => string; }) => (
  <Card className="border-none bg-gradient-to-br from-card to-muted/20">
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold">{value.value}</h3>
        <Badge className={getBadgeClass(value.strength)}>{value.strength}</Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{value.description}</p>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
          Consumer Importance
        </span>
        <Progress value={value.importance} className="h-2 flex-1" />
        <span className="text-sm font-bold">{value.importance}%</span>
      </div>
    </CardContent>
  </Card>
);

const CulturalOpportunityCard = ({
  opportunity,
  getBadgeClass
}: {
  opportunity: CulturalOpportunity;
  getBadgeClass: (value: string) => string;
}) => (
  <Card className="border-none bg-gradient-to-br from-card to-muted/20">
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold">{opportunity.opportunity}</h3>
        <div className="flex gap-2">
          <Badge className={getBadgeClass(opportunity.potential)}>{opportunity.potential}</Badge>
          <Badge className={getBadgeClass(opportunity.difficulty)}>{opportunity.difficulty}</Badge>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{opportunity.description}</p>
    </CardContent>
  </Card>
);

const CulturalFitScoreCard = ({ score, getBadgeClass }: { score: GenerateCulturalAnalysisOutput['culturalFitScore'], getBadgeClass: (value: string) => string }) => (
  <Card className="border-none bg-gradient-to-br from-card to-muted/20">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <AreaChart className="w-5 h-5" />
        Cultural Fit Score
      </CardTitle>
    </CardHeader>
    <CardContent className="text-center">
      <p className="text-6xl font-bold text-primary">{score.overallScore}</p>
      <p className="text-muted-foreground font-medium">Overall Score</p>
      <div className="space-y-2 text-sm mt-6 text-left">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Brand Alignment</span>
          <span className={`font-bold ${getBadgeClass(score.brandAlignment).split(' ')[1]}`}>{score.brandAlignment}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Cultural Relevance</span>
          <span className={`font-bold ${getBadgeClass(score.culturalRelevance).split(' ')[1]}`}>{score.culturalRelevance}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Trend Adaptation</span>
          <span className={`font-bold ${getBadgeClass(score.trendAdaptation).split(' ')[1]}`}>{score.trendAdaptation}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const CulturalMonitoringCard = ({ onSetupClick }: { onSetupClick: () => void }) => (
  <div className="p-6 rounded-lg text-center bg-gradient-to-br from-primary to-purple-600 text-primary-foreground">
    <h3 className="text-lg sm:text-xl font-bold">Cultural Monitoring</h3>
    <p className="mt-2 text-xs sm:text-sm opacity-90">
      Real-time cultural trend tracking and alerts
    </p>
    <Button
      variant="secondary"
      className="mt-4 bg-white/90 hover:bg-white text-primary font-semibold text-sm"
      onClick={onSetupClick}
    >
      Setup Alerts
    </Button>
  </div>
);

const RegionalInsightsCard = ({ insights }: { insights: GenerateCulturalAnalysisOutput['regionalInsights'] }) => (
  <Card className="border-none bg-gradient-to-br from-card to-muted/20">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Globe className="w-5 h-5" />
        Regional Insights
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-3">
        {insights.map((insight, index) => (
          <li key={index} className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">{insight.region}</span>
            <div className="flex items-center gap-1 font-bold">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>{insight.score.toFixed(1)}</span>
            </div>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);


const AnalysisSkeleton = () => (
  <>
    <div className="flex justify-between items-center mb-8">
      <div>
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-5 w-80" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        {[...Array(3)].map((_, i) => (
          <section key={i}>
            <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-6 w-6 rounded-full" />
                <div>
                    <Skeleton className="h-7 w-52 mb-1" />
                    <Skeleton className="h-5 w-64" />
                </div>
            </div>
            <div className="space-y-4">
              <Card><CardContent className="p-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
              <Card><CardContent className="p-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
            </div>
          </section>
        ))}
      </div>
      <aside className="space-y-8">
        <Card><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
        <Card><CardContent className="p-6"><Skeleton className="h-32 w-full" /></CardContent></Card>
        <Card><CardContent className="p-6"><Skeleton className="h-40 w-full" /></CardContent></Card>
      </aside>
    </div>
  </>
);


export default function CulturalAnalysisPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow container mx-auto py-6 sm:py-8 px-4 md:px-6">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <Suspense fallback={<AnalysisSkeleton />}>
          <CulturalAnalysisContent />
        </Suspense>
      </main>
    </div>
  );
}
