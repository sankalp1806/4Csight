
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState, useRef } from 'react';
import type { GenerateReportScoresOutput } from '@/ai/schemas/report-scores-schema';
import Link from 'next/link';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';


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
  const [scores, setScores] = useState<GenerateReportScoresOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [executiveSummary, setExecutiveSummary] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const reportRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    setLoading(true);
    const summary = searchParams.get('summary') || '';
    const title = searchParams.get('title') || '4Cs Analysis Report';
    const scoresParam = searchParams.get('scores');
    
    setExecutiveSummary(summary);
    setProjectTitle(title);

    if (scoresParam) {
        try {
            const parsedScores = JSON.parse(scoresParam);
            setScores(parsedScores);
        } catch (error) {
            console.error("Failed to parse scores from URL", error);
            setScores(null);
        }
    } else {
        setScores(null);
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
      // This can happen if the user dismisses the share sheet or if there's another issue.
      // We can safely ignore this error or log it if needed.
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
      data: scores?.competition,
      color: 'text-green-500',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Consumer',
      data: scores?.consumer,
      color: 'text-green-500',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Culture',
      data: scores?.culture,
      color: 'text-green-500',
    },
    {
      icon: <Archive className="w-8 h-8" />,
      title: 'Category',
      data: scores?.category,
      color: 'text-green-500',
    },
  ];

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
        {loading || !scores
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
        <p className="text-muted-foreground mb-4">
          AI-generated strategic insights and recommendations
        </p>
        <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90">
          {loading ? (
             <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
             </div>
          ) : executiveSummary ? (
            <div
              dangerouslySetInnerHTML={{
                __html: executiveSummary.replace(/\\n/g, '<br />'),
              }}
            />
          ) : (
            <p>No executive summary available for this project.</p>
          )}
        </div>
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
