'use client';

import {
  ArrowLeft,
  Search,
  Users,
  Heart,
  BarChart2,
  Map,
  Lightbulb,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Target,
  FileText,
  Rocket,
  UserPlus,
  Puzzle,
  ShoppingCart,
  Radio,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { generateConsumerAnalysis } from '@/ai/flows/generate-consumer-analysis';
import type {
  GenerateConsumerAnalysisOutput,
  CustomerSegment,
  KeyInsight,
} from '@/ai/schemas/consumer-analysis-schema';

function ConsumerAnalysisContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<GenerateConsumerAnalysisOutput | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const brandName = searchParams.get('brandName');
    const description = searchParams.get('description');
    const industry = searchParams.get('industry');

    if (brandName && description && industry) {
      const fetchAnalysis = async () => {
        setLoading(true);
        try {
          const result = await generateConsumerAnalysis({
            brandName,
            description,
            industry,
          });
          setAnalysis(result);
        } catch (error) {
          console.error('Failed to fetch consumer analysis:', error);
          toast({
            title: 'Error',
            description: 'Failed to generate consumer analysis.',
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

  const metrics = [
    {
      title: 'Demographics',
      description: 'Age, income, location, education',
      progress: analysis.topLevelMetrics.demographics,
      icon: <Users className="h-6 w-6" />,
      color: 'text-blue-500 bg-blue-50',
    },
    {
      title: 'Psychographics',
      description: 'Values, interests, lifestyle, personality',
      progress: analysis.topLevelMetrics.psychographics,
      icon: <Puzzle className="h-6 w-6" />,
      color: 'text-purple-500 bg-purple-50',
    },
    {
      title: 'Behavioral Patterns',
      description: 'Purchase behavior, usage patterns',
      progress: analysis.topLevelMetrics.behavioralPatterns,
      icon: <BarChart2 className="h-6 w-6" />,
      color: 'text-green-500 bg-green-50',
    },
    {
      title: 'Customer Journey',
      description: 'Touchpoints and decision process',
      progress: analysis.topLevelMetrics.customerJourney,
      icon: <Map className="h-6 w-6" />,
      color: 'text-orange-500 bg-orange-50',
    },
  ];

  const getInsightIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'primary pain point':
        return <Clock className="w-5 h-5 text-primary" />;
      case 'price sensitivity':
        return <DollarSign className="w-5 h-5 text-primary" />;
      case 'brand loyalty':
        return <TrendingUp className="w-5 h-5 text-primary" />;
      default:
        return <Lightbulb className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Consumer Analysis</h1>
          <p className="mt-1 text-muted-foreground">
            Deep dive into your target audience and customer segments
          </p>
        </div>
        <div className="flex gap-2 shrink-0 w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto">
            <Search className="mr-2 h-4 w-4" /> Market Research
          </Button>
          <Button className="w-full sm:w-auto">
            <UserPlus className="mr-2 h-4 w-4" /> New Segment
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
              <Target className="h-6 w-6 text-foreground" />
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
                  Customer Segments
                </h2>
                <p className="text-sm text-muted-foreground">
                  Identified target customer segments and their characteristics
                </p>
              </div>
            </div>
            <div className="space-y-6">
              {analysis.customerSegments.map((segment, index) => (
                <CustomerSegmentCard key={index} segment={segment} />
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-8 sticky top-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5" /> Key Insights
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                AI-generated consumer insights
              </p>
              <div className="space-y-6">
                {analysis.keyInsights.map((insight, index) => (
                  <KeyInsightItem key={index} insight={insight} icon={getInsightIcon(insight.type)} />
                ))}
              </div>
            </CardContent>
          </Card>
          <div className="p-6 rounded-lg text-center bg-gradient-to-br from-primary to-purple-600 text-primary-foreground">
            <h3 className="text-lg sm:text-xl font-bold">Persona Generator</h3>
            <p className="mt-2 text-xs sm:text-sm opacity-90">
              Create detailed customer personas with AI assistance
            </p>
            <Button
              variant="secondary"
              className="mt-4 bg-white/90 hover:bg-white text-primary font-semibold text-sm"
            >
              <Rocket className="mr-2 h-4 w-4" /> Generate Personas
            </Button>
          </div>
           <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                Quick Actions
              </h3>
              <div className="flex flex-col gap-2">
                <Button variant="ghost" className="justify-start"><Search className="mr-2 h-4 w-4"/>Survey Analysis</Button>
                <Button variant="ghost" className="justify-start"><BarChart2 className="mr-2 h-4 w-4"/>Behavior Tracking</Button>
                <Button variant="ghost" className="justify-start"><Map className="mr-2 h-4 w-4"/>Journey Mapping</Button>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </>
  );
}

const MetricCard = ({
  title,
  description,
  progress,
  icon,
  color,
}: {
  title: string;
  description: string;
  progress: number;
  icon: React.ReactNode;
  color: string;
}) => (
  <Card>
    <CardContent className="p-4">
      <div className={`p-2 inline-block rounded-lg ${color}`}>{icon}</div>
      <h3 className="text-md font-semibold mt-4">{title}</h3>
      <p className="text-muted-foreground text-sm mt-1">{description}</p>
      <div className="flex items-center gap-2 mt-4">
        <span className="text-sm text-muted-foreground">Progress</span>
        <Progress value={progress} className="h-2 flex-1" />
        <span className="text-sm font-bold">{progress}%</span>
      </div>
    </CardContent>
  </Card>
);

const CustomerSegmentCard = ({ segment }: { segment: CustomerSegment }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{segment.name}</h3>
          <p className="text-sm text-muted-foreground">{segment.description}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-primary">{segment.marketSize}%</p>
          <p className="text-sm text-muted-foreground">Market Size</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mb-6">
        <div>
          <h4 className="flex items-center gap-2 font-semibold text-foreground mb-2">
            <Users className="w-5 h-5 text-primary" /> Characteristics
          </h4>
          <ul className="space-y-1 list-disc list-inside text-sm text-muted-foreground">
            {segment.characteristics.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="flex items-center gap-2 font-semibold text-foreground mb-2">
            <Heart className="w-5 h-5 text-primary" /> Key Needs
          </h4>
          <ul className="space-y-1 list-disc list-inside text-sm text-muted-foreground">
            {segment.keyNeeds.map((k, i) => (
              <li key={i}>{k}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="flex items-center gap-2 font-semibold text-foreground mb-2">
            <ShoppingCart className="w-5 h-5 text-primary" /> Purchase Drivers
          </h4>
          <ul className="space-y-1 list-disc list-inside text-sm text-muted-foreground">
            {segment.purchaseDrivers.map((pd, i) => (
              <li key={i}>{pd}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="flex items-center gap-2 font-semibold text-foreground mb-2">
            <Radio className="w-5 h-5 text-primary" /> Media Consumption
          </h4>
          <ul className="space-y-1 list-disc list-inside text-sm text-muted-foreground">
            {segment.mediaConsumption.map((mc, i) => (
              <li key={i}>{mc}</li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Analysis Confidence</label>
        <div className="flex items-center gap-2 mt-1">
          <Progress value={segment.analysisConfidence} className="h-2" />
          <span className="text-sm font-bold">{segment.analysisConfidence}%</span>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-6">
        <Button variant="outline" size="sm">
          <FileText className="mr-1.5 h-4 w-4" /> Deep Dive
        </Button>
        <Button variant="outline" size="sm">
          <Map className="mr-1.5 h-4 w-4" /> Journey Map
        </Button>
      </div>
    </CardContent>
  </Card>
);

const KeyInsightItem = ({ insight, icon }: { insight: KeyInsight, icon: React.ReactNode }) => (
  <div className="flex items-start gap-4">
    {icon}
    <div>
      <p className="text-sm font-semibold text-muted-foreground">{insight.title}</p>
      <p className="font-bold text-foreground">{insight.value}</p>
      <p className="text-sm text-muted-foreground">{insight.description}</p>
    </div>
  </div>
);

const AnalysisSkeleton = () => (
  <>
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
      <div>
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-5 w-80" />
      </div>
      <div className="flex gap-2 shrink-0 w-full sm:w-auto">
        <Skeleton className="h-10 w-full sm:w-40" />
        <Skeleton className="h-10 w-full sm:w-36" />
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-6 w-6 rounded-full" />
          <div>
            <Skeleton className="h-7 w-52 mb-1" />
            <Skeleton className="h-5 w-64" />
          </div>
        </div>
        <div className="space-y-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-48 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <aside className="space-y-8">
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>
      </aside>
    </div>
  </>
);

export default function ConsumerAnalysisPage() {
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
          <ConsumerAnalysisContent />
        </Suspense>
      </main>
    </div>
  );
}
