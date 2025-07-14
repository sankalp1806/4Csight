
'use client';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface AnalysisCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
}

export function AnalysisCard({ title, description, icon, href }: AnalysisCardProps) {
  const cardContent = (
    <Card className={cn("h-full hover:shadow-lg transition-shadow duration-300 border bg-card")}>
      <CardContent className="p-6 flex flex-col items-center text-center gap-4">
        {icon}
        <div>
            <h3 className="text-lg font-semibold text-foreground mb-1 whitespace-nowrap">{title}</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{description}</p>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
