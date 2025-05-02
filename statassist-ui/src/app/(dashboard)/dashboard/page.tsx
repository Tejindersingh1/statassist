'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, BarChart2, FileText, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Study {
  id: string;
  title: string;
  design_type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function DashboardPage() {
  const [recentStudies, setRecentStudies] = useState<Study[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        // In a real implementation, this would fetch from the API
        // For demo purposes, we'll use mock data
        const mockStudies: Study[] = [
          {
            id: '1',
            title: 'Effect of Exercise on Blood Pressure',
            design_type: 'RCT',
            status: 'draft',
            created_at: '2025-04-28T10:30:00Z',
            updated_at: '2025-04-28T10:30:00Z'
          },
          {
            id: '2',
            title: 'Biomarker Study for Early Cancer Detection',
            design_type: 'DiagnosticAccuracy',
            status: 'active',
            created_at: '2025-04-25T14:15:00Z',
            updated_at: '2025-04-27T09:45:00Z'
          },
          {
            id: '3',
            title: 'Long-term Effects of Diet on Heart Disease',
            design_type: 'Cohort',
            status: 'draft',
            created_at: '2025-04-20T11:20:00Z',
            updated_at: '2025-04-22T16:30:00Z'
          }
        ];
        
        setRecentStudies(mockStudies);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching studies:', error);
        setIsLoading(false);
      }
    };

    fetchStudies();
  }, []);

  const getDesignTypeLabel = (type: string) => {
    switch (type) {
      case 'RCT':
        return 'Randomized Controlled Trial';
      case 'DiagnosticAccuracy':
        return 'Diagnostic Accuracy Study';
      case 'Cohort':
        return 'Cohort Study';
      default:
        return type;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome to Stat-Assist</h1>
          <p className="text-muted-foreground">
            Design, analyze, and report your clinical research with ease.
          </p>
        </div>
        <Link href="/studies/new">
          <Button className="mt-4 md:mt-0">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Study
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link href="/studies/new" className="flex items-center gap-3 rounded-md p-3 hover:bg-muted transition-colors">
              <PlusCircle className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Create New Study</div>
                <div className="text-sm text-muted-foreground">Start designing a new research study</div>
              </div>
            </Link>
            <Link href="/resources/power-calculator" className="flex items-center gap-3 rounded-md p-3 hover:bg-muted transition-colors">
              <BarChart2 className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Power Calculator</div>
                <div className="text-sm text-muted-foreground">Calculate sample size and statistical power</div>
              </div>
            </Link>
            <Link href="/resources/protocol-templates" className="flex items-center gap-3 rounded-md p-3 hover:bg-muted transition-colors">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Protocol Templates</div>
                <div className="text-sm text-muted-foreground">Access standard research protocol templates</div>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Studies</CardTitle>
            <CardDescription>
              Your recently created or updated studies
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center text-muted-foreground">Loading studies...</div>
            ) : recentStudies.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <p className="mb-4">You haven't created any studies yet.</p>
                <Link href="/studies/new">
                  <Button>Create Your First Study</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentStudies.map((study) => (
                  <Link href={`/studies/${study.id}`} key={study.id}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-md border hover:bg-muted/50 transition-colors">
                      <div>
                        <h3 className="font-medium">{study.title}</h3>
                        <div className="flex flex-col md:flex-row gap-2 md:gap-4 mt-1 text-sm text-muted-foreground">
                          <span>{getDesignTypeLabel(study.design_type)}</span>
                          <span className="hidden md:inline">•</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusBadgeClass(study.status)}`}>
                            {study.status.charAt(0).toUpperCase() + study.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center mt-2 md:mt-0 text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>Updated {formatDate(study.updated_at)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Link href="/studies" className="text-sm text-primary hover:underline">
              View all studies
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Educational Resources</CardTitle>
            <CardDescription>
              Learn more about clinical research design and statistics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border p-4">
              <h3 className="font-medium mb-1">Statistical Test Selection Guide</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Learn how to choose the right statistical test for your research question.
              </p>
              <Link href="/resources/statistical-tests">
                <Button variant="outline" size="sm">View Guide</Button>
              </Link>
            </div>
            <div className="rounded-md border p-4">
              <h3 className="font-medium mb-1">Sample Size Determination</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Understanding power analysis and sample size calculations.
              </p>
              <Link href="/resources/sample-size">
                <Button variant="outline" size="sm">Learn More</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              New to Stat-Assist? Follow these steps to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  1
                </div>
                <div>
                  <h3 className="font-medium">Create a new study</h3>
                  <p className="text-sm text-muted-foreground">
                    Start by creating a new study and selecting the study type.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  2
                </div>
                <div>
                  <h3 className="font-medium">Define your research question</h3>
                  <p className="text-sm text-muted-foreground">
                    Clearly define your research question and variables.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  3
                </div>
                <div>
                  <h3 className="font-medium">Get statistical recommendations</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive recommendations for statistical tests and sample size.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  4
                </div>
                <div>
                  <h3 className="font-medium">Generate your protocol</h3>
                  <p className="text-sm text-muted-foreground">
                    Export a complete study protocol based on your design.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/resources/tutorials">
              <Button variant="outline">View Tutorials</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
