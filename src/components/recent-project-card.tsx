
'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar, Eye, FileText, Tag } from 'lucide-react';
import type { RecentProject } from '@/app/page';
import Link from 'next/link';

interface RecentProjectCardProps {
  project: RecentProject;
  onReportClick: (project: RecentProject) => void;
}

export function RecentProjectCard({ project, onReportClick }: RecentProjectCardProps) {
  const { title, description, industry, date, progress, status } = project;

  const viewLink = `/project/${project.id}?${new URLSearchParams({
    title,
    brandName: project.brandName,
    description,
    industry,
  }).toString()}`;

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-3">{description}</p>
            <div className="flex items-center text-xs sm:text-sm text-muted-foreground gap-2">
              <Tag className="h-4 w-4" />
              <span>{industry}</span>
            </div>
          </div>
          <div className="flex flex-row sm:flex-col items-center sm:items-end shrink-0 gap-2">
            <Badge variant={status === 'completed' ? 'secondary' : 'default'}
              className={`text-xs ${status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-primary'}`}
            >
              {status}
            </Badge>
            <div className="flex items-center text-xs sm:text-sm text-muted-foreground gap-2">
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">Progress</span>
            <span className="text-xs sm:text-sm font-medium text-primary">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex items-center gap-2 sm:gap-4 mt-4 sm:mt-6">
          <Link href={viewLink}>
            <Button variant="outline" size="sm" asChild>
              <a>
                <Eye className="mr-1.5 h-4 w-4" /> View
              </a>
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onReportClick(project)}
            disabled={status !== 'completed'}
          >
            <FileText className="mr-1.5 h-4 w-4" /> Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
