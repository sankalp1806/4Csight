
'use client';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AnalysisCard } from "@/components/analysis-card";
import { RecentProjectCard } from "@/components/recent-project-card";
import { QuickStats } from "@/components/quick-stats";
import { AIPoweredInsights } from "@/components/ai-powered-insights";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from 'lucide-react';
import React, { useState, useEffect, useRef } from "react";
import { NewAnalysisDialog } from "@/components/new-analysis-dialog";
import { useRouter } from "next/navigation";
import type { Generate4CsAnalysisInput, Generate4CsAnalysisOutput } from "@/ai/schemas/4cs-analysis-schema";
import { generate4CsAnalysis } from "@/ai/flows/generate-4cs-analysis";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const analysisTypes = [
  {
    title: 'Competitive\nAnalysis',
    description: 'Analyze your competition landscape',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M3 3v18h18"/><path d="M7 16V7h4v9"/><path d="M12 16v-4h4v4"/><path d="M17 16v-2h4v2"/></svg>,
    color: 'bg-blue-500',
  },
  {
    title: 'Consumer\nAnalysis',
    description: 'Understand your target audience',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    color: 'bg-green-500',
  },
  {
    title: 'Cultural\nAnalysis',
    description: 'Examine cultural trends and alignment',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>,
    color: 'bg-purple-500',
  },
  {
    title: 'Category\nAnalysis',
    description: 'Define and analyze your category',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M21 10h-2.5a2 2 0 0 0-2 2v2.5a2 2 0 0 0 2 2H21"/><path d="M4 12V8a2 2 0 0 1 2-2h2.5a2 2 0 0 1 2 2v2.5a2 2 0 0 1-2 2H4z"/><path d="M12 21v-4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4"/><path d="M12 4V2.5a2 2 0 0 1 2-2h2.5a2 2 0 0 1 2 2V4"/></svg>,
    color: 'bg-orange-500',
  }
];

export interface RecentProject extends Generate4CsAnalysisInput {
  id: string;
  title: string;
  date: string;
  progress: number;
  status: 'completed' | 'in-progress';
  analysis?: Generate4CsAnalysisOutput;
}

export default function DashboardPage() {
  const router = useRouter();
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [isNewAnalysisDialogOpen, setIsNewAnalysisDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<RecentProject | null>(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    try {
      const savedProjects = localStorage.getItem('recentProjects');
      if (savedProjects) {
        setRecentProjects(JSON.parse(savedProjects));
      }
    } catch (error) {
      console.error("Failed to load projects from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isInitialLoad.current) {
        isInitialLoad.current = false;
        return;
    }
    try {
      localStorage.setItem('recentProjects', JSON.stringify(recentProjects));
    } catch (error) {
      console.error("Failed to save projects to localStorage", error);
    }
  }, [recentProjects]);

  const handleNewProject = async (values: Generate4CsAnalysisInput) => {
    const projectId = new Date().toISOString();
    const newProject: RecentProject = {
      id: projectId,
      title: `${values.brandName} 4Cs Analysis`,
      description: values.description,
      industry: values.industry,
      brandName: values.brandName,
      date: new Date().toLocaleDateString(),
      progress: 10,
      status: 'in-progress',
    };
    setRecentProjects(prev => [newProject, ...prev]);
    setIsNewAnalysisDialogOpen(false);
    
    try {
      const result = await generate4CsAnalysis(values);
      setRecentProjects(prev => prev.map(p => 
        p.id === projectId ? { ...p, status: 'completed', progress: 100, analysis: result } : p
      ));
    } catch (error) {
      console.error("Failed to run analysis:", error);
      setRecentProjects(prev => prev.map(p => 
        p.id === projectId ? { ...p, status: 'in-progress', description: `Failed to analyze: ${p.description}` } : p
      ));
    }
  };
  
  const handleDeleteClick = (project: RecentProject) => {
    setProjectToDelete(project);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      setRecentProjects(prev => prev.filter(p => p.id !== projectToDelete.id));
      setProjectToDelete(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow container mx-auto py-6 sm:py-8 px-4 md:px-6 space-y-8 sm:space-y-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>Dashboard</DropdownMenuItem>
                  <DropdownMenuItem>Projects</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                4Cs Analysis Dashboard
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Comprehensive strategic analysis tool for your business
              </p>
            </div>
          </div>
          <Button className="hidden sm:flex bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" onClick={() => setIsNewAnalysisDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Analysis Project
          </Button>
        </header>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {analysisTypes.map((item, index) => (
            <AnalysisCard key={index} {...item} />
          ))}
        </div>

        <div className="grid gap-8 lg:gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-foreground"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Recent Projects</h2>
                  <p className="text-sm text-muted-foreground">Your latest 4Cs analysis projects</p>
                </div>
              </div>
              <div className="space-y-4 sm:space-y-6">
                {recentProjects.length > 0 ? (
                  recentProjects.map((project) => (
                    <RecentProjectCard 
                      key={project.id} 
                      project={project} 
                      onDeleteClick={handleDeleteClick}
                    />
                  ))
                ) : (
                  <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">No recent projects.</p>
                    <p className="text-sm text-muted-foreground mt-2">Click "New Analysis Project" to get started.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
          
          <aside className="space-y-8">
             <QuickStats projects={recentProjects} />
             <AIPoweredInsights />
          </aside>
        </div>
      </main>
      <NewAnalysisDialog
        open={isNewAnalysisDialogOpen}
        onOpenChange={setIsNewAnalysisDialogOpen}
        onSubmit={handleNewProject}
      />
       <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              project "{projectToDelete?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProjectToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
