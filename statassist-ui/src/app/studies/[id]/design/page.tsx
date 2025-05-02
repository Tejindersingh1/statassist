'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Save, FileText, BarChart2 } from 'lucide-react';

// Define the steps in the study design wizard
const STEPS = [
  { id: 'research-question', title: 'Research Question', description: 'Define your research question' },
  { id: 'variables', title: 'Variables', description: 'Define your study variables' },
  { id: 'statistical-test', title: 'Statistical Test', description: 'Select appropriate statistical tests' },
  { id: 'power-calculation', title: 'Power Calculation', description: 'Calculate required sample size' },
  { id: 'review', title: 'Review', description: 'Review your study design' }
];

export default function StudyDesignPage({ params }: { params: { id: string } }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [study, setStudy] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Mock study data for demo
  useEffect(() => {
    const fetchStudy = async () => {
      try {
        // In a real implementation, this would fetch from the API
        // For demo purposes, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockStudy = {
          id: params.id,
          title: 'Effect of Exercise on Blood Pressure',
          description: 'A randomized controlled trial investigating the effects of regular exercise on blood pressure in adults with hypertension.',
          design_type: 'RCT',
          status: 'draft',
          research_question: {
            intervention: 'Moderate aerobic exercise (30 min, 5 days/week)',
            comparator: 'No exercise (usual care)',
            population: 'Adults with hypertension (140-159/90-99 mmHg)',
            outcome: 'Reduction in systolic blood pressure after 12 weeks'
          },
          variables: [
            {
              id: 'var-1',
              name: 'Systolic Blood Pressure',
              type: 'Continuous',
              role: 'Primary',
              constraints: { units: 'mmHg' }
            },
            {
              id: 'var-2',
              name: 'Diastolic Blood Pressure',
              type: 'Continuous',
              role: 'Secondary',
              constraints: { units: 'mmHg' }
            }
          ],
          statistical_test: {
            name: 'Independent t-test',
            alternatives: ['Mann-Whitney U test'],
            conditions: ['Normally distributed data in each group']
          },
          power_calculation: {
            effect_size: 0.5,
            alpha: 0.05,
            power: 0.8,
            sample_size: 64
          },
          created_at: '2025-04-28T10:30:00Z',
          updated_at: '2025-04-28T10:30:00Z'
        };
        
        setStudy(mockStudy);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching study:', error);
        setIsLoading(false);
      }
    };

    fetchStudy();
  }, [params.id]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    // In a real implementation, this would save to the API
    alert('Study design saved successfully!');
  };

  const handleGenerateProtocol = () => {
    // In a real implementation, this would generate and download a protocol
    alert('Protocol generation would be implemented here');
  };

  if (isLoading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading study...</h2>
          <p className="text-muted-foreground">Please wait while we load your study details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{study.title}</h1>
            <p className="text-muted-foreground">{study.design_type} • {study.status.charAt(0).toUpperCase() + study.status.slice(1)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button variant="outline" onClick={handleGenerateProtocol}>
            <FileText className="mr-2 h-4 w-4" />
            Generate Protocol
          </Button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {STEPS.map((step, index) => (
            <div 
              key={step.id}
              className={`flex flex-col items-center w-1/5 ${index === currentStep ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <div 
                className={`flex items-center justify-center w-8 h-8 rounded-full mb-2 ${
                  index === currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : index < currentStep 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {index + 1}
              </div>
              <span className="text-sm font-medium text-center">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-primary transition-all"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{STEPS[currentStep].title}</CardTitle>
          <CardDescription>{STEPS[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Intervention</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md"
                  value={study.research_question.intervention}
                  onChange={(e) => setStudy({
                    ...study,
                    research_question: {
                      ...study.research_question,
                      intervention: e.target.value
                    }
                  })}
                />
                <p className="text-xs text-muted-foreground">What intervention are you testing?</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Comparator</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md"
                  value={study.research_question.comparator}
                  onChange={(e) => setStudy({
                    ...study,
                    research_question: {
                      ...study.research_question,
                      comparator: e.target.value
                    }
                  })}
                />
                <p className="text-xs text-muted-foreground">What are you comparing the intervention to?</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Population</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md"
                  value={study.research_question.population}
                  onChange={(e) => setStudy({
                    ...study,
                    research_question: {
                      ...study.research_question,
                      population: e.target.value
                    }
                  })}
                />
                <p className="text-xs text-muted-foreground">Who is the target population for your study?</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Outcome</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md"
                  value={study.research_question.outcome}
                  onChange={(e) => setStudy({
                    ...study,
                    research_question: {
                      ...study.research_question,
                      outcome: e.target.value
                    }
                  })}
                />
                <p className="text-xs text-muted-foreground">What outcome are you measuring?</p>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Study Variables</h3>
                <Button variant="outline" size="sm">
                  Add Variable
                </Button>
              </div>
              
              {study.variables.map((variable: any) => (
                <div key={variable.id} className="p-4 border rounded-md">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium">{variable.name}</h4>
                      <div className="flex gap-2 mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {variable.type}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {variable.role} Outcome
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm">Delete</Button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Units:</span> {variable.constraints.units}
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="p-4 border rounded-md bg-muted/20">
                <h3 className="text-lg font-medium mb-2">Recommended Statistical Test</h3>
                <p className="mb-4">Based on your study design and variables, we recommend:</p>
                
                <div className="p-4 bg-white border rounded-md mb-4">
                  <h4 className="font-medium text-lg mb-2">{study.statistical_test.name}</h4>
                  
                  <div className="mb-4">
                    <h5 className="font-medium text-sm mb-1">Assumptions/Conditions:</h5>
                    <ul className="list-disc pl-5 text-sm">
                      {study.statistical_test.conditions.map((condition: string, index: number) => (
                        <li key={index}>{condition}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-sm mb-1">Alternative Tests:</h5>
                    <ul className="list-disc pl-5 text-sm">
                      {study.statistical_test.alternatives.map((alt: string, index: number) => (
                        <li key={index}>{alt}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  <strong>Why this matters:</strong> Choosing the appropriate statistical test ensures valid results and conclusions.
                </p>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline">Change Test</Button>
                <Button variant="outline">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Test Details
                </Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="p-4 border rounded-md bg-muted/20">
                <h3 className="text-lg font-medium mb-4">Power Calculation</h3>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Effect Size</label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded-md"
                      value={study.power_calculation.effect_size}
                      min={0.1}
                      max={2}
                      step={0.1}
                      onChange={(e) => setStudy({
                        ...study,
                        power_calculation: {
                          ...study.power_calculation,
                          effect_size: parseFloat(e.target.value)
                        }
                      })}
                    />
                    <p className="text-xs text-muted-foreground">Cohen's d (0.2 = small, 0.5 = medium, 0.8 = large)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Significance Level (α)</label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={study.power_calculation.alpha}
                      onChange={(e) => setStudy({
                        ...study,
                        power_calculation: {
                          ...study.power_calculation,
                          alpha: parseFloat(e.target.value)
                        }
                      })}
                    >
                      <option value={0.01}>0.01</option>
                      <option value={0.05}>0.05</option>
                      <option value={0.1}>0.10</option>
                    </select>
                    <p className="text-xs text-muted-foreground">Typically 0.05 (5%)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Desired Power</label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={study.power_calculation.power}
                      onChange={(e) => setStudy({
                        ...study,
                        power_calculation: {
                          ...study.power_calculation,
                          power: parseFloat(e.target.value)
                        }
                      })}
                    >
                      <option value={0.8}>0.80</option>
                      <option value={0.85}>0.85</option>
                      <option value={0.9}>0.90</option>
                      <option value={0.95}>0.95</option>
                    </select>
                    <p className="text-xs text-muted-foreground">Typically 0.80 (80%)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Required Sample Size</label>
                    <div className="w-full p-2 border rounded-md bg-muted/50 font-medium">
                      {study.power_calculation.sample_size} participants
                    </div>
                    <p className="text-xs text-muted-foreground">Total sample size needed</p>
                  </div>
                </div>
                
                <div className="p-4 bg-white border rounded-md">
                  <h4 className="font-medium mb-2">Power Curve</h4>
                  <div className="h-40 bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Power curve visualization would appear here</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium mb-4">Study Design Summary</h3>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h4 className="font-medium mb-2">Research Question</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Intervention:</p>
                      <p>{study.research_question.intervention}</p>
                    </div>
                    <div>
                      <p className="font-medium">Comparator:</p>
                      <p>{study.research_question.comparator}</p>
                    </div>
                    <div>
                      <p className="font-medium">Population:</p>
                      <p>{study.research_question.population}</p>
                    </div>
                    <div>
                      <p className="font-medium">Outcome:</p>
                      <p>{study.research_question.outcome}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="font-medium mb-2">Variables</h4>
                  <ul className="space-y-2">
                    {study.variables.map((variable: any) => (
                      <li key={variable.id} className="flex justify-between">
                        <span>{variable.name}</span>
                        <span className="text-muted-foreground">{variable.type} • {variable.role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="font-medium mb-2">Statistical Analysis</h4>
                  <p><span className="font-medium">Test:</span> {study.statistical_test.name}</p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="font-medium mb-2">Sample Size</h4>
                  <p><span className="font-medium">Required participants:</span> {study.power_calculation.sample_size}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on effect size {study.power_calculation.effect_size}, 
                    alpha {study.power_calculation.alpha}, 
                    power {study.power_calculation.power}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-center mt-8">
                <Button onClick={handleGenerateProtocol}>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Study Protocol
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          
          {currentStep < STEPS.length - 1 ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Complete Design
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
