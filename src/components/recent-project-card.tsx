'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar, Eye, FileText, Tag } from 'lucide-react';

interface RecentProjectCardProps {
  title: string;
  description: string;
  tag: string;
  date: string;
  progress: number;
  status: 'completed' | 'in-progress';
}

export function RecentProjectCard({ title, description, tag, date, progress, status }: RecentProjectCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-3">{description}</p>
            <div className="flex items-center text-sm text-muted-foreground gap-2">
              <Tag className="h-4 w-4" />
              <span>{tag}</span>
            </div>
          </div>
          <div className="flex flex-col items-start sm:items-end shrink-0 gap-2">
            <Badge variant={status === 'completed' ? 'secondary' : 'default'}
              className={status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-primary'}
            >
              {status}
            </Badge>
            <div className="flex items-center text-sm text-muted-foreground gap-2">
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-muted-foreground">Progress</span>
            <span className="text-sm font-medium text-primary">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex items-center gap-4 mt-6">
          <Button variant="outline" size="sm">
            <Eye className="mr-2 h-4 w-4" /> View
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" /> Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
