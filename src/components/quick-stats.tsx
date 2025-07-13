'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';

export function QuickStats() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
            <Eye className="h-6 w-6 text-foreground" />
            <CardTitle className="text-xl font-semibold">Quick Stats</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-4xl font-bold text-primary">2</p>
          <p className="text-sm text-muted-foreground">Total Projects</p>
        </div>
        <div className="text-center">
          <p className="text-4xl font-bold text-green-500">1</p>
          <p className="text-sm text-muted-foreground">Completed</p>
        </div>
        <div className="text-center">
          <p className="text-4xl font-bold text-blue-500">1</p>
          <p className="text-sm text-muted-foreground">In Progress</p>
        </div>
      </CardContent>
    </Card>
  );
}
