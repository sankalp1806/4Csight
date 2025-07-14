
'use client';

import {
  BarChart,
  Users,
  TrendingUp,
  Archive,
  Share,
  Download,
  FileText,
  ArrowLeft,
  Loader2,
  Lightbulb,
  Award,
  CircleDot,
  Mountain,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState, useRef } from 'react';
import type { Generate4CsAnalysisOutput } from '@/ai/schemas/4cs-analysis-schema';
import Link from 'next/link';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';


interface ScoreCardProps {
  icon: React.ReactNode;
  score: number;
  title: string;
  description: string;
  color: string;
}

function ScoreCard({
  icon,
  score,
  title,
  description,
  color,
}: ScoreCardProps) {
  return (
    <Card className="flex-1 min-w-[200px] shadow-lg border-none bg-card">
      <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-2">
        <div className="text-blue-500">{icon}</div>
        <p className="text-4xl font-bold text-blue-500">{score.toFixed(1)}</p>
        <p className="font-semibold text-foreground">{title}</p>
        <p className={`text-sm font-medium ${color}`}>{description}</p>
      </CardContent>
    </Card>
  );
}

function ReportContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<Generate4CsAnalysisOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const reportRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    setLoading(true);
    const title = searchParams.get('title') || '4Cs Analysis Report';
    const analysisParam = searchParams.get('analysis');
    
    setProjectTitle(title);

    if (analysisParam) {
        try {
            const parsedAnalysis = JSON.parse(analysisParam);
            setAnalysis(parsedAnalysis);
        } catch (error) {
            console.error("Failed to parse analysis from URL", error);
            setAnalysis(null);
        }
    } else {
        setAnalysis(null);
    }
    setLoading(false);
  }, [searchParams]);

  const fallbackCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Report link has been copied to your clipboard.",
      });
    } catch (err) {
      console.error("Fallback copy failed:", err);
      toast({
        title: "Error",
        description: "Could not share or copy the report link.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: projectTitle,
      text: `Check out the 4Cs Analysis Report for ${projectTitle}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await fallbackCopy();
      }
    } catch (error) {
      console.log("Share action was cancelled or failed:", error);
    }
  };

  const handleExportPdf = async () => {
    const reportElement = reportRef.current;
    if (!reportElement) return;

    setIsExporting(true);
    try {
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${projectTitle.replace(/\s/g, '_')}.pdf`);
    } catch (error) {
      console.error("Failed to export PDF:", error);
      toast({
        title: "Error",
        description: "Failed to export the report as PDF.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };


  const scoreData = [
    {
      icon: <BarChart className="w-8 h-8" />,
      title: 'Competition',
      data: analysis?.scores?.competition,
      color: 'text-green-500',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Consumer',
      data: analysis?.scores?.consumer,
      color: 'text-green-500',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Culture',
      data: analysis?.scores?.culture,
      color: 'text-green-500',
    },
    {
      icon: <Archive className="w-8 h-8" />,
      title: 'Category',
      data: analysis?.scores?.category,
      color: 'text-green-500',
    },
  ];

  const keyFindings = analysis?.executiveSummary?.keyFindings ? [
      { title: "Market Opportunities", content: analysis.executiveSummary.keyFindings.marketOpportunities, icon: <Mountain className="w-5 h-5 text-primary"/> },
      { title: "Competitive Positions", content: analysis.executiveSummary.keyFindings.competitivePositions, icon: <Award className="w-5 h-5 text-primary"/> },
      { title: "Cultural Alignment", content: analysis.executiveSummary.keyFindings.culturalAlignment, icon: <TrendingUp className="w-5 h-5 text-primary"/> },
      { title: "Target Market", content: analysis.executiveSummary.keyFindings.targetMarket, icon: <CircleDot className="w-5 h-5 text-primary"/> },
  ] : [];

  const recommendations = analysis?.executiveSummary?.strategicRecommendations;

  return (
    <div ref={reportRef} className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 bg-background">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
           <Link href="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-primary" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{projectTitle}</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive strategic analysis summary and recommendations
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <Button variant="outline" onClick={handleShare}>
            <Share className="mr-2 h-4 w-4" /> Share
          </Button>
          <Button onClick={handleExportPdf} disabled={isExporting}>
            {isExporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            {isExporting ? "Exporting..." : "Export PDF"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {loading || !analysis
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="flex-1 min-w-[200px] shadow-lg border-none bg-card">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-2">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="h-10 w-16 mt-2" />
                  <Skeleton className="h-6 w-24 mt-1" />
                  <Skeleton className="h-5 w-20 mt-1" />
                </CardContent>
              </Card>
            ))
          : scoreData.map((item, index) => (
              <ScoreCard
                key={index}
                icon={item.icon}
                score={item.data?.score || 0}
                title={item.title}
                description={item.data?.description || 'N/A'}
                color={item.color}
              />
            ))}
      </div>

      <div className="bg-card p-6 sm:p-8 rounded-xl shadow-lg border-none">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">
            Executive Summary
          </h2>
        </div>
        
        {loading || !analysis ? (
             <div className="space-y-6">
                <Skeleton className="h-6 w-1/3 mb-4" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-6 w-1/3 mt-6 mb-4" />
                <Skeleton className="h-32 w-full" />
             </div>
        ) : analysis?.executiveSummary ? (
            <div className="space-y-10">
                {/* Key Findings */}
                <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">Key Findings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {keyFindings.map((finding, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <div className="p-2 bg-primary/10 rounded-full mt-1">
                                    {finding.icon}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground">{finding.title}</h4>
                                    <p className="text-sm text-muted-foreground">{finding.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Strategic Recommendations */}
                <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">Strategic Recommendations Framework</h3>
                    <div className="space-y-6">
                        {recommendations && (
                        <>
                            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                                <h4 className="font-semibold flex items-center gap-2 mb-2">
                                <Badge className="bg-red-500 text-white">High</Badge> High Priority Actions
                                </h4>
                                <ul className="list-disc list-inside space-y-1 text-sm text-red-900">
                                {recommendations.highPriority.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                            <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                                <h4 className="font-semibold flex items-center gap-2 mb-2">
                                <Badge className="bg-yellow-500 text-white">Medium</Badge> Medium Priority Actions
                                </h4>
                                <ul className="list-disc list-inside space-y-1 text-sm text-yellow-900">
                                {recommendations.mediumPriority.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                                <h4 className="font-semibold flex items-center gap-2 mb-2">
                                <Badge className="bg-green-500 text-white">Low</Badge> Low Priority Actions
                                </h4>
                                <ul className="list-disc list-inside space-y-1 text-sm text-green-900">
                                {recommendations.lowPriority.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                        </>
                        )}
                    </div>
                </div>
            </div>
        ) : (
            <p className="text-muted-foreground">No executive summary available for this project.</p>
        )}

      </div>
    </div>
  );
}


export default function ReportPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="flex-grow">
        <Suspense fallback={<div>Loading...</div>}>
          <ReportContent />
        </Suspense>
      </main>
    </div>
  );
}
