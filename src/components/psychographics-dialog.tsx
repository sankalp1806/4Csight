'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { generatePsychographics } from '@/ai/flows/generate-psychographics';
import type { GeneratePsychographicsOutput } from '@/ai/schemas/psychographics-schema';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

interface PsychographicsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brandName: string;
  industry: string;
}

export function PsychographicsDialog({ open, onOpenChange, brandName, industry }: PsychographicsDialogProps) {
  const { toast } = useToast();
  const [data, setData] = useState<GeneratePsychographicsOutput | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        setLoading(true);
        setData(null);
        try {
          const result = await generatePsychographics({ brandName, industry });
          setData(result);
        } catch (error) {
          console.error('Failed to generate psychographics:', error);
          toast({
            title: 'Error',
            description: 'Failed to generate psychographic data.',
            variant: 'destructive',
          });
          onOpenChange(false);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [open, brandName, industry, onOpenChange, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Psychographics Visualizer</DialogTitle>
          <DialogDescription>
            AI-generated psychographic analysis for {brandName} in the {industry} industry.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 max-h-[70vh] overflow-y-auto pr-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Skeleton className="h-80 w-full" />
              <Skeleton className="h-80 w-full" />
              <Skeleton className="h-80 w-full" />
              <Skeleton className="h-80 w-full" />
            </div>
          ) : data ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
              <div>
                <h3 className="font-semibold text-lg mb-4 text-center">Personality Traits (Big 5)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.personalityDistribution}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="trait" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name="Score" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                        <Tooltip />
                    </RadarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4 text-center">Core Values</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.valueDistribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]}/>
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#82ca9d" name="Importance Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4 text-center">Key Interests</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.interestDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="percentage" fill="#ffc658" name="Percentage" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
               <div>
                <h3 className="font-semibold text-lg mb-4 text-center">Lifestyle</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.lifestyleDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="percentage" fill="#FF8042" name="Percentage" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
