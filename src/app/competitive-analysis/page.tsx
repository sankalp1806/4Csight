
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
  Check,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generate4CsAnalysis } from '@/ai/flows/generate-4cs-analysis';
import { analyzeCompetitor } from '@/ai/flows/analyze-competitor';
import type { Competitor } from '@/ai/schemas/4cs-analysis-schema';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { generateDetailedAnalysis } from '@/ai/flows/generate-detailed-analysis';
import type { DetailedAnalysis } from '@/ai/schemas/detailed-analysis-schema';
import { generateSwotAnalysis } from '@/ai/flows/generate-swot-analysis';
import type { SwotAnalysis } from '@/ai/schemas/swot-analysis-schema';

const competitorFormSchema = z.object({
  name: z.string().min(1, 'Competitor name is required.'),
  type: z.enum(['Direct', 'Indirect', 'Substitute'], {
    required_error: 'Competitor type is required.',
  }),
  description: z.string().optional(),
});
type CompetitorFormValues = z.infer<typeof competitorFormSchema>;

type AnalysisType = 'detailed' | 'swot' | null;

function CompetitiveAnalysisContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAnalysisDialogOpen, setIsAnalysisDialogOpen] = useState(false);
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);
  const [analysisType, setAnalysisType] = useState<AnalysisType>(null);
  const [analysisResult, setAnalysisResult] = useState<DetailedAnalysis | SwotAnalysis | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);

  const brandName = searchParams.get('brandName') || '';

  useEffect(() => {
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
          setCompetitors(result.competition);
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
  }, [searchParams, toast, brandName]);

  const handleNewCompetitor = (newCompetitor: Competitor) => {
    setCompetitors((prev) => [newCompetitor, ...prev]);
  };

  const handleAnalysisClick = async (competitor: Competitor, type: NonNullable<AnalysisType>) => {
    setSelectedCompetitor(competitor);
    setAnalysisType(type);
    setIsAnalysisDialogOpen(true);
    setIsAnalysisLoading(true);
    setAnalysisResult(null);
    
    try {
      let result;
      if (type === 'detailed') {
        result = await generateDetailedAnalysis({ brandNameToAnalyze: brandName, competitorName: competitor.name });
      } else if (type === 'swot') {
        result = await generateSwotAnalysis({ brandNameToAnalyze: brandName, competitorName: competitor.name });
      }
      setAnalysisResult(result);
    } catch (error) {
      console.error(`Failed to generate ${type} analysis:`, error);
      toast({
        title: 'Error',
        description: `Failed to generate ${type} analysis.`,
        variant: 'destructive',
      });
      setIsAnalysisDialogOpen(false);
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  const counts = React.useMemo(() => {
    const direct = competitors.filter((c) => c.type === 'Direct').length;
    const indirect = competitors.filter((c) => c.type === 'Indirect').length;
    const substitute =
      competitors.filter((c) => c.type === 'Substitute').length;
    return { direct, indirect, substitute };
  }, [competitors]);

  if (loading) {
    return <AnalysisSkeleton />;
  }

  if (competitors.length === 0 && !loading) {
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
        <CompetitorTypeCard
          title="Direct Competitors"
          description="Same products/services to same target market"
          count={counts.direct}
          icon={<Briefcase className="w-6 h-6" />}
          color="text-red-700"
          gradient="from-red-50 to-red-100/10"
        />
        <CompetitorTypeCard
          title="Indirect Competitors"
          description="Different products targeting same customers"
          count={counts.indirect}
          icon={<Users className="w-6 h-6" />}
          color="text-yellow-700"
          gradient="from-yellow-50 to-yellow-100/10"
        />
        <CompetitorTypeCard
          title="Substitute Competitors"
          description="Alternative solutions for same needs"
          count={counts.substitute}
          icon={<Lightbulb className="w-6 h-6" />}
          color="text-blue-700"
          gradient="from-blue-50 to-blue-100/10"
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
              {competitors.map((competitor, index) => (
                <IdentifiedCompetitorCard 
                  key={index} 
                  competitor={competitor} 
                  onDetailedClick={() => handleAnalysisClick(competitor, 'detailed')}
                  onSwotClick={() => handleAnalysisClick(competitor, 'swot')}
                />
              ))}
            </div>
          </section>
        </div>
        <aside className="space-y-8 sticky top-8">
          <AddNewCompetitorCard
            brandNameToAnalyze={brandName}
            onCompetitorAdded={handleNewCompetitor}
          />
          <AIPoweredResearchCard />
        </aside>
      </div>
      <AnalysisDialog 
        isOpen={isAnalysisDialogOpen}
        setIsOpen={setIsAnalysisDialogOpen}
        isLoading={isAnalysisLoading}
        competitorName={selectedCompetitor?.name || ''}
        analysisType={analysisType}
        analysisResult={analysisResult}
      />
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
  <Card
    className={`text-center p-6 flex flex-col items-center justify-center border-none bg-gradient-to-br ${gradient}`}
  >
    <div className={`p-3 rounded-full bg-white/50 ${color}`}>{icon}</div>
    <h3 className={`text-lg font-semibold mt-4 ${color}`}>{title}</h3>
    <p className="text-muted-foreground text-sm mt-1">{description}</p>
    <div className={`text-5xl font-bold mt-4 ${color}`}>{count}</div>
  </Card>
);

const IdentifiedCompetitorCard = ({ competitor, onDetailedClick, onSwotClick }: { competitor: Competitor, onDetailedClick: () => void, onSwotClick: () => void }) => {
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
              <Button variant="outline" size="sm" onClick={onDetailedClick}>
                <Target className="mr-1.5 h-4 w-4" /> Detailed Analysis
              </Button>
              <Button variant="outline" size="sm" onClick={onSwotClick}>
                <FileText className="mr-1.5 h-4 w-4" /> SWOT Analysis
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface AddNewCompetitorCardProps {
  brandNameToAnalyze: string;
  onCompetitorAdded: (competitor: Competitor) => void;
}

function AddNewCompetitorCard({
  brandNameToAnalyze,
  onCompetitorAdded,
}: AddNewCompetitorCardProps) {
  const { toast } = useToast();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CompetitorFormValues>({
    resolver: zodResolver(competitorFormSchema),
    defaultValues: {
      name: '',
      type: undefined,
      description: '',
    },
  });

  const onSubmit = async (data: CompetitorFormValues) => {
    try {
      const result = await analyzeCompetitor({
        brandNameToAnalyze: brandNameToAnalyze,
        competitorName: data.name,
        competitorType: data.type,
        competitorDescription: data.description || undefined,
      });
      onCompetitorAdded(result);
      reset();
      toast({
        title: 'Success',
        description: `${data.name} has been analyzed and added to the list.`,
      });
    } catch (error) {
      console.error('Failed to analyze competitor:', error);
      toast({
        title: 'Error',
        description: 'Failed to analyze the new competitor.',
        variant: 'destructive',
      });
    }
  };

  return (
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
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="competitor-name">Competitor Name *</Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  id="competitor-name"
                  placeholder="Enter competitor name"
                  {...field}
                />
              )}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="competitor-type">Competitor Type *</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger id="competitor-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Direct">Direct</SelectItem>
                    <SelectItem value="Indirect">Indirect</SelectItem>
                    <SelectItem value="Substitute">Substitute</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="competitor-description">Description</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="competitor-description"
                  placeholder="Brief description of competitor..."
                  {...field}
                />
              )}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'Researching...'
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" /> Research with AI
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

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
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
      <Card className="p-6">
        <Skeleton className="h-40 w-full" />
      </Card>
      <Card className="p-6">
        <Skeleton className="h-40 w-full" />
      </Card>
      <Card className="p-6">
        <Skeleton className="h-40 w-full" />
      </Card>
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
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
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


function AnalysisDialog({ isOpen, setIsOpen, isLoading, competitorName, analysisType, analysisResult }: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isLoading: boolean;
  competitorName: string;
  analysisType: AnalysisType;
  analysisResult: DetailedAnalysis | SwotAnalysis | null;
}) {
  const isSwot = analysisType === 'swot' && analysisResult && 'strengths' in analysisResult;
  const isDetailed = analysisType === 'detailed' && analysisResult && 'companyBackground' in analysisResult;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {analysisType === 'detailed' ? 'Detailed Analysis' : 'SWOT Analysis'} for <span className="text-primary">{competitorName}</span>
          </DialogTitle>
          <DialogDescription>
            AI-generated analysis based on publicly available data.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-y-auto pr-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <>
              {isDetailed && <DetailedAnalysisContent analysis={analysisResult as DetailedAnalysis} />}
              {isSwot && <SwotAnalysisContent analysis={analysisResult as SwotAnalysis} />}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailedAnalysisContent({ analysis }: { analysis: DetailedAnalysis }) {
  const sections = [
    { title: 'Company Background', content: analysis.companyBackground },
    { title: 'Products & Services', content: analysis.productsAndServices },
    { title: 'Target Audience', content: analysis.targetAudience },
    { title: 'Marketing Strategy', content: analysis.marketingStrategy },
    { title: 'Key Differentiators', content: analysis.keyDifferentiators },
    { title: 'Recent News', content: analysis.recentNews },
  ];
  return (
    <div className="space-y-6">
      {sections.map(section => (
        <div key={section.title}>
          <h4 className="text-lg font-semibold mb-2">{section.title}</h4>
          <p className="text-sm text-muted-foreground">{section.content}</p>
        </div>
      ))}
    </div>
  );
}

function SwotAnalysisContent({ analysis }: { analysis: SwotAnalysis }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SwotCategory title="Strengths" items={analysis.strengths} icon={<Check className="w-5 h-5 text-green-500" />} color="bg-green-50" />
      <SwotCategory title="Weaknesses" items={analysis.weaknesses} icon={<X className="w-5 h-5 text-red-500" />} color="bg-red-50" />
      <SwotCategory title="Opportunities" items={analysis.opportunities} icon={<Lightbulb className="w-5 h-5 text-blue-500" />} color="bg-blue-50" />
      <SwotCategory title="Threats" items={analysis.threats} icon={<TrendingDown className="w-5 h-5 text-orange-500" />} color="bg-orange-50" />
    </div>
  );
}

function SwotCategory({ title, items, icon, color }: { title: string, items: string[], icon: React.ReactNode, color: string }) {
  return (
    <div className={`p-4 rounded-lg ${color}`}>
      <h4 className="flex items-center gap-2 font-semibold text-lg mb-3">
        {icon}
        {title}
      </h4>
      <ul className="space-y-2 list-disc list-inside text-sm text-muted-foreground">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}


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
