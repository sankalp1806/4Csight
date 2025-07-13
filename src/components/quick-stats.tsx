
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import type { RecentProject } from '@/app/page';

interface QuickStatsProps {
  projects: RecentProject[];
}

export function QuickStats({ projects }: QuickStatsProps) {
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const inProgressProjects = projects.filter(p => p.status === 'in-progress').length;

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-center gap-3">
            <Eye className="h-6 w-6 text-foreground" />
            <CardTitle className="text-lg sm:text-xl font-semibold">Quick Stats</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-4">
        <div className="text-center">
          <p className="text-3xl sm:text-4xl font-bold text-primary">{totalProjects}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">Total Projects</p>
        </div>
        <div className="text-center">
          <p className="text-3xl sm:text-4xl font-bold text-green-500">{completedProjects}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">Completed</p>
        </div>
        <div className="text-center">
          <p className="text-3xl sm:text-4xl font-bold text-blue-500">{inProgressProjects}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">In Progress</p>
        </div>
      </CardContent>
    </Card>
  );
}
