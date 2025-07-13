
'use client';

import {
  ArrowLeft,
  Search,
  Zap,
  DollarSign,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  ShieldCheck,
  ArrowDown,
  Globe,
  Briefcase,
  Users2
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
import { generateCategoryAnalysis } from '@/ai/flows/generate-category-analysis';
import type {
  GenerateCategoryAnalysisOutput,
  MarketSegment,
  DemandDriver,
} from '@/ai/schemas/category-analysis-schema';

function CategoryAnalysisContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<GenerateCategoryAnalysisOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const brandName = searchParams.get('brandName');
    const description = searchParams.get('description');
    const industry = searchParams.get('industry');

    if (brandName && description && industry) {
      const fetchAnalysis = async () => {
        setLoading(true);
        try {
          const result = await generateCategoryAnalysis({ brandName, description, industry });
          setAnalysis(result);
        } catch (error) {
          console.error('Failed to fetch category analysis:', error);
          toast({
            title: 'Error',
            description: 'Failed to generate category analysis.',
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
  }, [searchParams, toast]);

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

  const { topLevelMetrics, marketSegments, categoryHealth, demandDrivers } = analysis;

  const metrics = [
    {
      title: 'Market Size',
      value: topLevelMetrics.marketSize,
      change: topLevelMetrics.marketSizeChange,
      icon: <DollarSign className="w-6 h-6 text-blue-500" />,
      gradient: 'from-blue-50 to-blue-100/10'
    },
    {
      title: 'Growth Rate',
      value: topLevelMetrics.growthRate,
      change: topLevelMetrics.growthRateChange,
      icon: <TrendingUp className="w-6 h-6 text-green-500" />,
      gradient: 'from-green-50 to-green-100/10'
    },
    {
      title: 'Active Players',
      value: topLevelMetrics.activePlayers,
      change: topLevelMetrics.activePlayersChange,
      icon: <Users className="w-6 h-6 text-purple-500" />,
      gradient: 'from-purple-50 to-purple-100/10'
    },
    {
      title: 'Market Concentration',
      value: topLevelMetrics.marketConcentration,
      change: topLevelMetrics.marketConcentrationDescription,
      icon: <Target className="w-6 h-6 text-orange-500" />,
      gradient: 'from-orange-50 to-orange-100/10'
    },
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Category Analysis</h1>
          <p className="mt-1 text-muted-foreground">
            Understand market dynamics and category positioning
          </p>
        </div>
        <div className="flex gap-2 shrink-0 w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto">
            <Search className="mr-2 h-4 w-4" /> Market Research
          </Button>
          <Button className="w-full sm:w-auto">
            <Zap className="mr-2 h-4 w-4" /> AI Insights
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="h-6 w-6 text-foreground" />
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Market Segments</h2>
                <p className="text-sm text-muted-foreground">
                  Category breakdown by market segments and revenue
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {marketSegments.map((segment, index) => (
                <MarketSegmentCard key={index} segment={segment} />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Demand Drivers</h2>
                <p className="text-sm text-muted-foreground">
                  Key factors influencing category demand
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {demandDrivers.map((driver, index) => (
                <DemandDriverCard key={index} driver={driver} />
              ))}
            </div>
          </section>
        </div>
        
        <aside className="space-y-8 sticky top-8">
          <CategoryHealthCard health={categoryHealth} />
          <MarketForecastCard />
          <QuickAnalysisCard />
        </aside>
      </div>
    </>
  );
}

const MetricCard = ({ title, value, change, icon, gradient }: { title: string, value: string | number, change: string, icon: React.ReactNode, gradient: string }) => (
  <Card className={`border-none bg-gradient-to-br ${gradient}`}>
    <CardContent className="p-6">
      <div className="p-2 inline-block rounded-lg bg-white/50">{icon}</div>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <p className="text-muted-foreground text-sm">{title}</p>
      <p className={`text-sm font-medium mt-1 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{change}</p>
    </CardContent>
  </Card>
);

const MarketSegmentCard = ({ segment }: { segment: MarketSegment }) => (
  <Card className="border-none bg-gradient-to-br from-card to-muted/20">
    <CardContent className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold flex items-center">{segment.name} {segment.trend === 'up' ? <TrendingUp className="w-4 h-4 text-green-500 ml-1" /> : <ArrowDown className="w-4 h-4 text-red-500 ml-1" />}</h3>
        <p className="text-primary font-bold text-lg">{segment.marketShare}%</p>
      </div>
       <p className="text-xs text-muted-foreground mb-4">Market Share</p>
      <div className="grid grid-cols-2 gap-4 mb-2">
        <div>
          <p className="text-sm text-muted-foreground">Revenue</p>
          <p className="font-semibold">{segment.revenue}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Growth Rate</p>
          <p className={`font-semibold ${segment.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>{segment.growthRate}%</p>
        </div>
      </div>
      <Progress value={segment.marketShare} className="h-2" />
    </CardContent>
  </Card>
);

const DemandDriverCard = ({ driver }: { driver: DemandDriver }) => {
  const getImpactClass = (impact: string) => {
    switch (impact) {
      case 'High Impact': return 'bg-red-100 text-red-700';
      case 'Medium Impact': return 'bg-yellow-100 text-yellow-700';
      case 'Low Impact': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="border-none bg-gradient-to-br from-card to-muted/20">
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <h3 className="font-semibold">{driver.name}</h3>
          <p className="text-sm text-muted-foreground">{driver.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`${getImpactClass(driver.impact)}`}>{driver.impact}</Badge>
          {driver.trend === 'up' ? <TrendingUp className="w-5 h-5 text-green-500" /> : <ArrowDown className="w-5 h-5 text-red-500" />}
        </div>
      </CardContent>
    </Card>
  );
};

const CategoryHealthCard = ({ health }: { health: GenerateCategoryAnalysisOutput['categoryHealth'] }) => {
    const getHealthColor = (level: string) => {
        switch(level.toLowerCase()){
            case 'high': return 'text-green-500';
            case 'moderate': return 'text-yellow-500';
            case 'low': return 'text-red-500';
            default: return 'text-gray-500';
        }
    }
   return( <Card className="border-none bg-gradient-to-br from-card to-muted/20">
        <CardHeader>
             <CardTitle className="flex items-center gap-2 text-xl">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                Category Health
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-center mb-4">
                <p className="text-3xl font-bold text-green-500">{health.overallAssessment}</p>
                <p className="text-sm text-muted-foreground">Overall Assessment</p>
            </div>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Growth Potential</span>
                    <span className={`font-bold ${getHealthColor(health.growthPotential)}`}>{health.growthPotential}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Competition Level</span>
                    <span className={`font-bold ${getHealthColor(health.competitionLevel)}`}>{health.competitionLevel}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Barriers to Entry</span>
                    <span className={`font-bold ${getHealthColor(health.barriersToEntry)}`}>{health.barriersToEntry}</span>
                </div>
            </div>
        </CardContent>
    </Card>
   )
};

const MarketForecastCard = () => (
  <div className="p-6 rounded-lg text-center bg-gradient-to-br from-primary to-purple-600 text-primary-foreground">
    <h3 className="text-lg sm:text-xl font-bold">Market Forecast</h3>
    <p className="mt-2 text-xs sm:text-sm opacity-90">
      AI-powered 5-year market projections
    </p>
    <Button
      variant="secondary"
      className="mt-4 bg-white/90 hover:bg-white text-primary font-semibold text-sm"
    >
      Generate Forecast
    </Button>
  </div>
);

const QuickAnalysisCard = () => (
    <Card className="border-none bg-gradient-to-br from-card to-muted/20">
      <CardHeader>
        <CardTitle className="text-xl">Quick Analysis</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Button variant="ghost" className="justify-start"><Users2 className="mr-2 h-4 w-4"/>Customer Analysis</Button>
        <Button variant="ghost" className="justify-start"><Briefcase className="mr-2 h-4 w-4"/>Competitive Landscape</Button>
        <Button variant="ghost" className="justify-start"><Globe className="mr-2 h-4 w-4"/>Regulatory Environment</Button>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}><CardContent className="p-6"><Skeleton className="h-28 w-full" /></CardContent></Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {[...Array(2)].map((_, i) => (
            <section key={i}>
              <div className="flex items-center gap-3 mb-4">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <div>
                      <Skeleton className="h-7 w-52 mb-1" />
                      <Skeleton className="h-5 w-64" />
                  </div>
              </div>
              <div className="space-y-4">
                <Card><CardContent className="p-4"><Skeleton className="h-24 w-full" /></CardContent></Card>
                <Card><CardContent className="p-4"><Skeleton className="h-24 w-full" /></CardContent></Card>
              </div>
            </section>
          ))}
        </div>
        <aside className="space-y-8">
          <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
          <Card><CardContent className="p-6"><Skeleton className="h-32 w-full" /></CardContent></Card>
        </aside>
      </div>
    </>
  );

export default function CategoryAnalysisPage() {
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
          <CategoryAnalysisContent />
        </Suspense>
      </main>
    </div>
  );
}
