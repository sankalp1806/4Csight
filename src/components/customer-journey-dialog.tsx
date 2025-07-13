
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { JourneyStage } from '@/ai/schemas/consumer-analysis-schema';

interface CustomerJourneyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  journeyMap: JourneyStage[];
  brandName: string;
}

export function CustomerJourneyDialog({ open, onOpenChange, journeyMap, brandName }: CustomerJourneyDialogProps) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Customer Journey Map</DialogTitle>
          <DialogDescription>
            A visual representation of the customer journey for {brandName}.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 max-h-[70vh] overflow-y-auto pr-4">
          <div className="space-y-6">
            {journeyMap.map((stage, index) => (
              <div key={index} className="border-l-2 border-primary pl-6 relative pb-6 last:pb-0">
                <div className="absolute -left-[11px] top-1 w-5 h-5 bg-primary rounded-full border-4 border-background"></div>
                <h4 className="font-semibold text-lg text-primary">{stage.stage}</h4>
                <div className="mt-2">
                    <h5 className="font-semibold text-sm">Customer Actions</h5>
                    <p className="text-sm text-muted-foreground">{stage.actions}</p>
                </div>
                  <div className="mt-2">
                    <h5 className="font-semibold text-sm">Touchpoints</h5>
                    <p className="text-sm text-muted-foreground">{stage.touchpoints}</p>
                </div>
                  <div className="mt-2">
                    <h5 className="font-semibold text-sm">Customer Feelings</h5>
                    <p className="text-sm text-muted-foreground">{stage.feelings}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
