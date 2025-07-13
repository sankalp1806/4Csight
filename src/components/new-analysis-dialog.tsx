
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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

const formSchema = z.object({
  brandName: z.string().min(1, { message: 'Brand name is required.' }),
  emphasis: z.enum(['Competition', 'Culture', 'Consumer', 'Category']).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface NewAnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: FormValues) => Promise<void>;
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
    },
  });

  const handleFormSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    await onSubmit(values);
    setIsSubmitting(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogHeader>
            <DialogTitle>New Analysis Project</DialogTitle>
            <DialogDescription>
              Enter the details for your new 4Cs analysis project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="brandName" className="text-right">
                Brand Name
              </Label>
              <Controller
                name="brandName"
                control={control}
                render={({ field }) => (
                  <Input id="brandName" {...field} className="col-span-3" />
                )}
              />
              {errors.brandName && (
                <p className="col-span-4 text-right text-destructive text-sm">{errors.brandName.message}</p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="emphasis" className="text-right">
                Emphasis
              </Label>
              <Controller
                name="emphasis"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select an emphasis (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Competition">Competition</SelectItem>
                      <SelectItem value="Culture">Culture</SelectItem>
                      <SelectItem value="Consumer">Consumer</SelectItem>
                      <SelectItem value="Category">Category</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Generating...' : 'Start Analysis'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
