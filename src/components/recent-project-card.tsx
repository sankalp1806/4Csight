
'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar, ChevronDown, ChevronUp, Eye, FileText, Globe, Tag, Trash2, AlertCircle } from 'lucide-react';
import type { RecentProject } from '@/app/page';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface RecentProjectCardProps {
  project: RecentProject;
  onDeleteClick: (project: RecentProject) => void;
}

export function RecentProjectCard({ project, onDeleteClick }: RecentProjectCardProps) {
  const router = useRouter();
  const { id, title, description, industry, date, progress, status, brandName, analysis, location, failureReason } = project;
  const [isExpanded, setIsExpanded] = useState(false);

  const params = new URLSearchParams({
    title,
    brandName,
    description: description || '',
    industry,
  });
  if (location) {
    params.set('location', location);
  }

  const viewLink = `/project/${id}?${params.toString()}`;

  const handleReportClick = () => {
    if (!analysis) return;
    const reportParams = new URLSearchParams({
        title: title,
        analysis: JSON.stringify(analysis),
    });
    router.push(`/report?${reportParams.toString()}`);
  };
  
  const canExpand = description && description.length > 100;
  
  const statusConfig = {
    completed: {
        badgeVariant: 'secondary',
        className: 'bg-green-100 text-green-700',
        text: 'Completed',
    },
    'in-progress': {
        badgeVariant: 'default',
        className: 'bg-blue-100 text-primary animate-pulse',
        text: 'In Progress',
    },
    failed: {
        badgeVariant: 'destructive',
        className: 'bg-red-100 text-destructive',
        text: 'Failed',
    },
  };
  
  const currentStatus = statusConfig[status];

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-foreground">{title}</h3>
            {description && !failureReason && (
                <>
                    <p className="text-sm text-muted-foreground mt-1 mb-3">
                    {isExpanded ? description : `${description.substring(0, 100)}${canExpand ? '...' : ''}`}
                    </p>
                    {canExpand && (
                    <Button variant="link" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="p-0 h-auto text-primary">
                        {isExpanded ? 'Show less' : 'Show more'}
                        {isExpanded ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
                    </Button>
                    )}
                </>
            )}
             {failureReason && (
                <div className="mt-2 text-sm text-destructive flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span><strong>Error:</strong> {failureReason}</span>
                </div>
            )}
            <div className="flex flex-wrap items-center text-xs sm:text-sm text-muted-foreground gap-x-4 gap-y-2 mt-3">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span>{industry}</span>
              </div>
              {location && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>{location}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-row sm:flex-col items-center sm:items-end shrink-0 gap-2">
            <Badge variant={currentStatus.badgeVariant as any} className={`text-xs ${currentStatus.className}`}>
              {currentStatus.text}
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
            <span className="text-xs sm:text-sm font-medium text-primary">{status === 'failed' ? '0' : progress}%</span>
          </div>
          <Progress value={status === 'failed' ? 0 : progress} className="h-2" />
        </div>

        <div className="flex items-center gap-2 sm:gap-4 mt-4 sm:mt-6">
          <Button asChild variant="outline" size="sm" disabled={status === 'failed'}>
            <Link href={viewLink}>
              <Eye className="mr-1.5 h-4 w-4" /> View
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReportClick}
            disabled={status !== 'completed' || !analysis}
          >
            <FileText className="mr-1.5 h-4 w-4" /> Report
          </Button>
           <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDeleteClick(project)}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="mr-1.5 h-4 w-4" /> Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
