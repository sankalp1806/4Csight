'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { TrendingUp, Construction } from 'lucide-react';
import { Button } from './ui/button';

interface MarketForecastDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MarketForecastDialog({ open, onOpenChange }: MarketForecastDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            Market Forecast
          </DialogTitle>
          <DialogDescription>
            AI-powered market projections and future trends.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center text-center py-8">
            <Construction className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Feature Under Construction</h3>
            <p className="text-sm text-muted-foreground mt-2">
                Our AI-powered market forecast tool is coming soon! Check back later for exciting updates.
            </p>
            <Button variant="outline" className="mt-6" onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
