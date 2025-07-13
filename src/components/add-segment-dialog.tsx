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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Search } from 'lucide-react';
import type { CustomerSegment } from '@/ai/schemas/consumer-analysis-schema';
import { analyzeCustomerSegment } from '@/ai/flows/analyze-customer-segment';


const formSchema = z.object({
  name: z.string().min(1, 'Segment name is required.'),
  description: z.string().min(1, 'Description is required.'),
});

type FormValues = z.infer<typeof formSchema>;

interface AddSegmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSegmentAdded: (segment: CustomerSegment) => void;
  brandName: string;
  industry: string;
}

export function AddSegmentDialog({ open, onOpenChange, onSegmentAdded, brandName, industry }: AddSegmentDialogProps) {
  const { toast } = useToast();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const result = await analyzeCustomerSegment({
        brandName,
        industry,
        segmentName: data.name,
        segmentDescription: data.description,
      });
      onSegmentAdded(result);
      reset();
      onOpenChange(false);
      toast({
        title: 'Success',
        description: `Segment '${data.name}' has been analyzed and added.`,
      });
    } catch (error) {
      console.error('Failed to analyze segment:', error);
      toast({
        title: 'Error',
        description: 'Failed to analyze the new segment.',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New Customer Segment</DialogTitle>
            <DialogDescription>
              Provide details for the new segment to be analyzed by AI.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="segment-name">Segment Name *</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input id="segment-name" placeholder="e.g., 'Tech-Savvy Millennials'" {...field} />
                )}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="segment-description">Description *</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="segment-description"
                    placeholder="Describe this segment's key characteristics..."
                    className="min-h-[100px]"
                    {...field}
                  />
                )}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Analyzing...' : <><Search className="mr-2 h-4 w-4" />Analyze Segment</>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
