
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { RecentProject } from '@/app/page';
import { ScrollArea } from './ui/scroll-area';
import { Skeleton } from './ui/skeleton';

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: RecentProject | null;
}

export function ReportDialog({ open, onOpenChange, project }: ReportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Executive Summary: {project?.title}</DialogTitle>
          <DialogDescription>
            A high-level overview of the 4Cs analysis and prioritized recommendations.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] p-1">
            <div className="prose prose-sm dark:prose-invert max-w-none pr-4">
            {project?.executiveSummary ? (
              <div dangerouslySetInnerHTML={{ __html: project.executiveSummary.replace(/\n/g, '<br />') }} />
            ) : (
                <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[80%]" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[90%]" />
                </div>
            )}
            </div>
        </ScrollArea>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button type="button">
            Export to PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
