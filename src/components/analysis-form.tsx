'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { analysisFormSchema, type AnalysisFormValues } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface AnalysisFormProps {
  onSubmit: (values: AnalysisFormValues) => void;
  isPending: boolean;
}

export function AnalysisForm({ onSubmit, isPending }: AnalysisFormProps) {
  const form = useForm<AnalysisFormValues>({
    resolver: zodResolver(analysisFormSchema),
    defaultValues: {
      brandName: '',
      emphasis: 'None',
    },
  });

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Generate 4Cs Analysis</CardTitle>
        <CardDescription>Enter a brand or business to analyze and get actionable insights.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="brandName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand / Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Nike, Starbucks" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emphasis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emphasize a 'C' (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a pillar to emphasize" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Competition">Competition</SelectItem>
                      <SelectItem value="Culture">Culture</SelectItem>
                      <SelectItem value="Consumer">Consumer</SelectItem>
                      <SelectItem value="Category">Category</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Analysis
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
