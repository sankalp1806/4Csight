
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface AnalysisCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export function AnalysisCard({ title, description, icon, color }: AnalysisCardProps) {
  const cardContent = (
      <Card className="h-full">
        <CardHeader className="p-4">
          <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center text-white", color)}>
            {icon}
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <CardTitle className="text-lg font-semibold text-foreground mb-1 whitespace-pre-wrap">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
  );

  return cardContent;
}

    