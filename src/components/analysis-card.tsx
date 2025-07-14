
'use client';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface AnalysisCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  href?: string;
  gradient?: string;
}

export function AnalysisCard({ title, description, icon, href, gradient }: AnalysisCardProps) {
  const cardContent = (
    <Card className={cn(
      "h-full hover:shadow-lg transition-shadow duration-300 border-none",
      gradient && `bg-gradient-to-br ${gradient}`
    )}>
      <CardContent className="p-6 flex flex-col items-center text-center gap-4">
        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center text-white bg-primary")}>
          {icon}
        </div>
        <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
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
