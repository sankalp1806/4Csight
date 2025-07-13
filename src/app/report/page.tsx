
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import { generateReportScores } from '@/ai/flows/generate-report-scores';
import type { GenerateReportScoresOutput } from '@/ai/schemas/report-scores-schema';
import Link from 'next/link';

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
  const [scores, setScores] = useState<GenerateReportScoresOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [executiveSummary, setExecutiveSummary] = useState('');
  const [projectTitle, setProjectTitle] = useState('');

  useEffect(() => {
    const summary = searchParams.get('summary') || '';
    const title = searchParams.get('title') || '4Cs Analysis Report';
    setExecutiveSummary(summary);
    setProjectTitle(title);

    if (summary) {
      const fetchScores = async () => {
        setLoading(true);
        try {
          const result = await generateReportScores({ executiveSummary: summary });
          setScores(result);
        } catch (error) {
          console.error('Failed to fetch report scores:', error);
          // Set default scores on error
          setScores({
            competition: { score: 0, description: "Error" },
            consumer: { score: 0, description: "Error" },
            culture: { score: 0, description: "Error" },
            category: { score: 0, description: "Error" },
          });
        } finally {
          setLoading(false);
        }
      };
      fetchScores();
    } else {
        setLoading(false);
    }
  }, [searchParams]);

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
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
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
          <Button variant="outline">
            <Share className="mr-2 h-4 w-4" /> Share
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {loading
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
                __html: executiveSummary.replace(/\n/g, '<br />'),
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
