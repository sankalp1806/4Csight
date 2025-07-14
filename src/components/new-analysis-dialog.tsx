
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { Terminal } from 'lucide-react';
import type { Generate4CsAnalysisInput } from '@/ai/schemas/4cs-analysis-schema';

const formSchema = z.object({
  brandName: z.string().min(1, { message: 'Brand name is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
  industry: z.string().min(1, { message: 'Industry is required.' }),
  otherIndustry: z.string().optional(),
  location: z.string().optional(),
}).refine(data => {
    if (data.industry === 'Other') {
        return !!data.otherIndustry && data.otherIndustry.trim().length > 0;
    }
    return true;
}, {
    message: 'Please specify the industry.',
    path: ['otherIndustry'],
});


type FormValues = z.infer<typeof formSchema>;

interface NewAnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: Generate4CsAnalysisInput) => Promise<void>;
}

export function NewAnalysisDialog({ open, onOpenChange, onSubmit }: NewAnalysisDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brandName: '',
      description: '',
      industry: '',
      otherIndustry: '',
      location: '',
    },
  });

  const selectedIndustry = useWatch({
    control,
    name: "industry",
  });

  const handleFormSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    const submissionValues: Generate4CsAnalysisInput = {
        brandName: values.brandName,
        description: values.description,
        industry: values.industry === 'Other' ? values.otherIndustry || '' : values.industry,
        location: values.location,
    };
    await onSubmit(submissionValues);
    setIsSubmitting(false);
    reset();
    onOpenChange(false);
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogHeader>
            <DialogTitle>New Analysis Project</DialogTitle>
            <DialogDescription>
              Enter the details for your new 4Cs analysis project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="brandName">Brand Name *</Label>
              <Controller
                name="brandName"
                control={control}
                render={({ field }) => (
                  <Input id="brandName" {...field} placeholder="Enter brand name" />
                )}
              />
              {errors.brandName && (
                <p className="text-destructive text-sm">{errors.brandName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="description"
                    {...field}
                    placeholder="Describe your project, business model, and objectives"
                    className="min-h-[100px]"
                  />
                )}
              />
              {errors.description && (
                <p className="text-destructive text-sm">{errors.description.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="industry">Industry *</Label>
              <Controller
                name="industry"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Automotive">Automotive</SelectItem>
                      <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
               {errors.industry && !errors.otherIndustry && (
                <p className="text-destructive text-sm">{errors.industry.message}</p>
              )}
            </div>
            
            {selectedIndustry === 'Other' && (
                 <div className="space-y-2">
                    <Label htmlFor="otherIndustry">Please specify industry *</Label>
                     <Controller
                        name="otherIndustry"
                        control={control}
                        render={({ field }) => (
                        <Input id="otherIndustry" {...field} placeholder="Enter your industry" />
                        )}
                    />
                    {errors.otherIndustry && (
                        <p className="text-destructive text-sm">{errors.otherIndustry.message}</p>
                    )}
                 </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <Input id="location" {...field} placeholder="e.g., USA, London" />
                )}
              />
            </div>

            <Alert className="bg-muted/50">
                <Terminal className="h-4 w-4" />
                <AlertDescription className="text-xs text-muted-foreground space-y-1">
                <strong>What happens next?</strong>
                <ul className="list-disc pl-4">
                    <li>AI will analyze your industry and generate competitor insights</li>
                    <li>Cultural trends relevant to your business will be identified</li>
                    <li>Consumer segments will be defined based on market research</li>
                    <li>Category analysis with market size and growth projections</li>
                </ul>
                </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Generating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
