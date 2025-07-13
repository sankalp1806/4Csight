
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';

export function QuickStats() {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-center gap-3">
            <Eye className="h-6 w-6 text-foreground" />
            <CardTitle className="text-lg sm:text-xl font-semibold">Quick Stats</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-4">
        <div className="text-center">
          <p className="text-3xl sm:text-4xl font-bold text-primary">2</p>
          <p className="text-xs sm:text-sm text-muted-foreground">Total Projects</p>
        </div>
        <div className="text-center">
          <p className="text-3xl sm:text-4xl font-bold text-green-500">1</p>
          <p className="text-xs sm:text-sm text-muted-foreground">Completed</p>
        </div>
        <div className="text-center">
          <p className="text-3xl sm:text-4xl font-bold text-blue-500">1</p>
          <p className="text-xs sm:text-sm text-muted-foreground">In Progress</p>
        </div>
      </CardContent>
    </Card>
  );
}
