
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface AnalysisCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  href: string;
}

export function AnalysisCard({ title, description, icon, color, href }: AnalysisCardProps) {
  return (
    <Link href={href} className="block">
      <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
        <CardHeader className="p-4">
          <div className={cn("w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-white", color)}>
            {icon}
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <CardTitle className="text-base sm:text-lg font-semibold text-foreground mb-1">{title}</CardTitle>
          <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
