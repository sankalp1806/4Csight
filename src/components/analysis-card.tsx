'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AnalysisCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export function AnalysisCard({ title, description, icon, color }: AnalysisCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center text-white", color)}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-lg font-semibold text-foreground mb-1">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
