
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Briefcase,
  CheckCircle,
  Plus,
  Search,
  Users,
  Lightbulb,
  List,
  Target,
  FileText,
  Star,
  TrendingUp,
  TrendingDown,
  PieChart,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import {
  generate4CsAnalysis
} from '@/ai/flows/generate-4cs-analysis';
import type { Competitor, Generate4CsAnalysisOutput } from '@/ai/schemas/4cs-analysis-schema';
import { Skeleton } from '@/components/ui/skeleton';

function CompetitiveAnalysisContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<Generate4CsAnalysisOutput | null>(
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
          const result = await generate4CsAnalysis({
            brandName,
            description,
            industry,
          });
          setAnalysis(result);
        } catch (error) {
          console.error('Failed to fetch analysis:', error);
          toast({
            title: 'Error',
            description: 'Failed to generate competitive analysis.',
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

  const counts = React.useMemo(() => {
    const direct =
      analysis?.competition.filter((c) => c.type === 'Direct').length || 0;
    const indirect =
      analysis?.competition.filter((c) => c.type === 'Indirect').length || 0;
    const substitute =
      analysis?.competition.filter((c) => c.type === 'Substitute').length || 0;
    return { direct, indirect, substitute };
  }, [analysis]);

  if (loading) {
    return <AnalysisSkeleton />;
  }

  if (!analysis) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">
          No analysis data available.
        </p>
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

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Competitive Analysis
          </h1>
          <p className="mt-1 text-muted-foreground">
            Analyze your competitive landscape and market positioning
          </p>
        </div>
        <div className="flex gap-2 shrink-0 w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto">
            <Search className="mr-2 h-4 w-4" /> AI Search
          </Button>
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add Competitor
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
        <CompetitorTypeCard
          title="Direct Competitors"
          description="Same products/services to same target market"
          count={counts.direct}
          icon={<Briefcase className="w-6 h-6" />}
          color="text-red-700"
          gradient="from-red-50 to-red-100"
        />
        <CompetitorTypeCard
          title="Indirect Competitors"
          description="Different products targeting same customers"
          count={counts.indirect}
          icon={<Users className="w-6 h-6" />}
          color="text-yellow-700"
          gradient="from-yellow-50 to-yellow-100"
        />
        <CompetitorTypeCard
          title="Substitute Competitors"
          description="Alternative solutions for same needs"
          count={counts.substitute}
          icon={<Lightbulb className="w-6 h-6" />}
          color="text-blue-700"
          gradient="from-blue-50 to-blue-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <List className="h-6 w-6 text-foreground" />
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
                  Identified Competitors
                </h2>
                <p className="text-sm text-muted-foreground">
                  Comprehensive competitor analysis and comparison
                </p>
              </div>
            </div>
            <div className="space-y-6">
              {analysis.competition.map((competitor, index) => (
                <IdentifiedCompetitorCard key={index} {...competitor} />
              ))}
            </div>
          </section>
        </div>
        <aside className="space-y-8 sticky top-8">
          <AddNewCompetitorCard />
          <AIPoweredResearchCard />
        </aside>
      </div>
    </>
  );
}

const CompetitorTypeCard = ({
  title,
  description,
  count,
  icon,
  color,
  gradient,
}: {
  title: string;
  description: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}) => (
  <Card className={`text-center p-6 flex flex-col items-center justify-center border-none bg-gradient-to-br ${gradient}`}>
    <div className={`p-3 rounded-full bg-white/50 ${color}`}>{icon}</div>
    <h3 className={`text-lg font-semibold mt-4 ${color}`}>{title}</h3>
    <p className="text-muted-foreground text-sm mt-1">{description}</p>
    <div className={`text-5xl font-bold mt-4 ${color}`}>{count}</div>
  </Card>
);

const IdentifiedCompetitorCard = (competitor: Competitor) => {
  const typeColors = {
    Direct: 'bg-red-100 text-red-700',
    Indirect: 'bg-yellow-100 text-yellow-700',
    Substitute: 'bg-blue-100 text-blue-700',
  };

  return (
    <Card className="border-none bg-gradient-to-br from-card to-muted/20">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{competitor.name}</h3>
                <div className="flex items-center gap-2 text-sm mt-1">
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-md ${
                      typeColors[competitor.type]
                    }`}
                  >
                    {competitor.type}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold">{competitor.rating}</span>
                  </div>
                </div>
              </div>
              <div className="text-left sm:text-right mt-2 sm:mt-0">
                <p className="text-3xl font-bold text-primary">
                  {competitor.marketShare}%
                </p>
                <p className="text-sm text-muted-foreground">Market Share</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="flex items-center gap-2 font-semibold text-green-600 mb-2">
                  <TrendingUp className="w-5 h-5" /> Strengths
                </h4>
                <ul className="space-y-1 list-disc list-inside text-sm text-muted-foreground">
                  {competitor.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="flex items-center gap-2 font-semibold text-red-600 mb-2">
                  <TrendingDown className="w-5 h-5" /> Weaknesses
                </h4>
                <ul className="space-y-1 list-disc list-inside text-sm text-muted-foreground">
                  {competitor.weaknesses.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm">
                <Target className="mr-1.5 h-4 w-4" /> Detailed Analysis
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="mr-1.5 h-4 w-4" /> SWOT Analysis
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AddNewCompetitorCard = () => (
  <Card className="border-none bg-gradient-to-br from-card to-muted/20">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Plus className="w-5 h-5" />
        Add New Competitor
      </CardTitle>
      <p className="text-sm text-muted-foreground">
        Manually add or search for competitors
      </p>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="competitor-name">Competitor Name</Label>
        <Input id="competitor-name" placeholder="Enter competitor name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="competitor-type">Competitor Type</Label>
        <Select>
          <SelectTrigger id="competitor-type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Direct">Direct</SelectItem>
            <SelectItem value="Indirect">Indirect</SelectItem>
            <SelectItem value="Substitute">Substitute</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="competitor-description">Description</Label>
        <Textarea
          id="competitor-description"
          placeholder="Brief description of competitor..."
        />
      </div>
      <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <Search className="mr-2 h-4 w-4" /> Research with AI
      </Button>
    </CardContent>
  </Card>
);

const AIPoweredResearchCard = () => (
  <div className="p-6 rounded-lg text-center bg-gradient-to-br from-primary via-purple-600 to-indigo-600 text-primary-foreground">
    <h3 className="text-lg sm:text-xl font-bold">AI-Powered Research</h3>
    <p className="mt-2 text-xs sm:text-sm opacity-90">
      Let Gemini AI help you discover and analyze competitors automatically
    </p>
    <Button
      variant="secondary"
      className="mt-4 bg-white/90 hover:bg-white text-primary font-semibold text-sm"
    >
      Start AI Analysis
    </Button>
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
        <Skeleton className="h-10 w-full sm:w-32" />
        <Skeleton className="h-10 w-full sm:w-36" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
      <Card className="p-6"><Skeleton className="h-40 w-full" /></Card>
      <Card className="p-6"><Skeleton className="h-40 w-full" /></Card>
      <Card className="p-6"><Skeleton className="h-40 w-full" /></Card>
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
          <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
          <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
        </div>
      </div>
      <aside className="space-y-8">
        <Card><CardContent className="p-6"><Skeleton className="h-80 w-full" /></CardContent></Card>
      </aside>
    </div>
  </>
);

export default function CompetitiveAnalysisPage() {
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
          <CompetitiveAnalysisContent />
        </Suspense>
      </main>
    </div>
  );
}
