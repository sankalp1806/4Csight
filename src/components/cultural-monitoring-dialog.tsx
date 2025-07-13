
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
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import type { PrevailingTrend } from '@/ai/schemas/cultural-analysis-schema';
import { Bell, Check } from 'lucide-react';
import { useState } from 'react';

interface CulturalMonitoringDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trends: PrevailingTrend[];
}

export function CulturalMonitoringDialog({ open, onOpenChange, trends }: CulturalMonitoringDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTrends, setSelectedTrends] = useState<Record<string, boolean>>({});

  const handleToggle = (trendName: string) => {
    setSelectedTrends(prev => ({
      ...prev,
      [trendName]: !prev[trendName]
    }));
  };

  const handleSave = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
        toast({
            title: 'Alerts Configured',
            description: `You will now be notified of major shifts in the selected cultural trends.`,
            action: <Check className="h-5 w-5 text-green-500" />
        });
        setIsSubmitting(false);
        onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-6 h-6" />
            Cultural Trend Monitoring
          </DialogTitle>
          <DialogDescription>
            Select the cultural trends you want to monitor for significant shifts. You'll receive alerts when notable changes occur.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-6">
          <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
            {trends.map(trend => (
              <div key={trend.trend} className="flex items-center justify-between p-3 rounded-md border bg-muted/20">
                <Label htmlFor={trend.trend} className="font-medium">
                  {trend.trend}
                </Label>
                <Switch
                  id={trend.trend}
                  checked={!!selectedTrends[trend.trend]}
                  onCheckedChange={() => handleToggle(trend.trend)}
                />
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="button" onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Preferences'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
