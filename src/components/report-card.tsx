import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ReportCardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export function ReportCard({ title, icon: Icon, children, className }: ReportCardProps) {
  return (
    <Card className={cn("printable-area w-full", className)}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Icon className="h-6 w-6 text-accent" />
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-base text-foreground/80 whitespace-pre-wrap">{children}</p>
      </CardContent>
    </Card>
  );
}
