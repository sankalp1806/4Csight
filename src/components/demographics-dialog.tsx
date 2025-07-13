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
import { generateDemographics } from '@/ai/flows/generate-demographics';
import type { GenerateDemographicsOutput } from '@/ai/schemas/demographics-schema';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface DemographicsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brandName: string;
  industry: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


export function DemographicsDialog({ open, onOpenChange, brandName, industry }: DemographicsDialogProps) {
  const { toast } = useToast();
  const [data, setData] = useState<GenerateDemographicsOutput | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        setLoading(true);
        setData(null);
        try {
          const result = await generateDemographics({ brandName, industry });
          setData(result);
        } catch (error) {
          console.error('Failed to generate demographics:', error);
          toast({
            title: 'Error',
            description: 'Failed to generate demographic data.',
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

  const genderData = data?.genderDistribution.map(item => ({name: item.gender, value: item.percentage}));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Demographics Visualizer</DialogTitle>
          <DialogDescription>
            AI-generated demographic analysis for {brandName} in the {industry} industry.
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-4 text-center">Age Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.ageDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="percentage" fill="#8884d8" name="Percentage" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4 text-center">Gender Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.genderDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                     <Tooltip />
                     <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4 text-center">Income Levels</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.incomeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="level" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="percentage" fill="#82ca9d" name="Percentage" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4 text-center">Top Locations</h3>
                 <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.locationDistribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="location" type="category" width={80} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="percentage" fill="#ffc658" name="Percentage" />
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
