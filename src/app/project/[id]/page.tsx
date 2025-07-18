
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { AnalysisCard } from '@/components/analysis-card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const analysisTypes = [
  {
    title: 'Competitive Analysis',
    description: 'Analyze your competition landscape',
    icon: (
      <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#4285F4] text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M3 3v18h18"/><path d="M7 16V7h4v9"/><path d="M12 16v-4h4v4"/><path d="M17 16v-2h4v2"/></svg>
      </div>
    ),
    href: '/competitive-analysis',
    gradient: 'from-blue-50 to-blue-100/10 dark:from-blue-900/40 dark:to-blue-950/10'
  },
  {
    title: 'Consumer Analysis',
    description: 'Understand your target audience',
    icon: (
      <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#34A853] text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      </div>
    ),
    href: '/consumer-analysis',
    gradient: 'from-green-50 to-green-100/10 dark:from-green-900/40 dark:to-green-950/10'
  },
  {
    title: 'Cultural Analysis',
    description: 'Examine cultural trends and alignment',
    icon: (
      <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#A555EC] text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>
      </div>
    ),
    href: '/cultural-analysis',
    gradient: 'from-purple-50 to-purple-100/10 dark:from-purple-900/40 dark:to-purple-950/10'
  },
  {
    title: 'Category Analysis',
    description: 'Define and analyze your category',
    icon: (
      <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#FBBC05] text-white">
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M21 10h-2.5a2 2 0 0 0-2 2v2.5a2 2 0 0 0 2 2H21"/><path d="M4 12V8a2 2 0 0 1 2-2h2.5a2 2 0 0 1 2 2v2.5a2 2 0 0 1-2 2H4z"/><path d="M12 21v-4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4"/><path d="M12 4V2.5a2 2 0 0 1 2-2h2.5a2 2 0 0 1 2 2V4"/></svg>
      </div>
    ),
    href: '/category-analysis',
    gradient: 'from-yellow-50 to-yellow-100/10 dark:from-yellow-900/40 dark:to-yellow-950/10'
  }
];

export default function ProjectPage() {
  const searchParams = useSearchParams();
  const brandName = searchParams.get('brandName');
  const description = searchParams.get('description');
  const industry = searchParams.get('industry');
  const location = searchParams.get('location');
  const title = searchParams.get('title');

  const createAnalysisLink = (baseHref: string) => {
    const params = new URLSearchParams();
    if (brandName) params.set('brandName', brandName);
    if (description) params.set('description', description);
    if (industry) params.set('industry', industry);
    if (location) params.set('location', location);
    return `${baseHref}?${params.toString()}`;
  };

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
        <h1 className="text-3xl font-bold mb-2">{title || 'Project Analysis'}</h1>
        <p className="text-muted-foreground mb-8">Choose an analysis to view for this project.</p>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {analysisTypes.map((item, index) => (
            <AnalysisCard key={index} {...item} href={createAnalysisLink(item.href || '')} />
          ))}
        </div>
      </main>
    </div>
  );
}

    