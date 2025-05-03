'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ChevronRight, CheckCircle, Users, Clipboard, Calculator, FileText } from 'lucide-react';

export default function StudyDesignPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    { id: 1, title: 'Research Question', icon: <Clipboard className="h-5 w-5" /> },
    { id: 2, title: 'Variables', icon: <Users className="h-5 w-5" /> },
    { id: 3, title: 'Sample Size', icon: <Calculator className="h-5 w-5" /> },
    { id: 4, title: 'Protocol', icon: <FileText className="h-5 w-5" /> }
  ];

  return (
    <div className="container py-8">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          className="pl-0 flex items-center gap-2 text-gray-600 hover:text-black hover:bg-transparent"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
        
        <div className="mt-6">
          <h1 className="text-3xl font-bold">Design Your Study</h1>
          <p className="text-gray-600 mt-2">Complete the following steps to design your clinical study</p>
        </div>
      </div>

      {/* Progress steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-3xl">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div 
                className={`flex flex-col items-center ${activeStep >= step.id ? 'text-blue-600' : 'text-gray-400'}`}
                onClick={() => setActiveStep(step.id)}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  activeStep > step.id 
                    ? 'bg-blue-100 text-blue-600' 
                    : activeStep === step.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-400'
                }`}>
                  {activeStep > step.id ? <CheckCircle className="h-5 w-5" /> : step.icon}
                </div>
                <span className="text-sm font-medium">{step.title}</span>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 ${activeStep > index + 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="mb-8">
        {activeStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Define Your Research Question</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Research Question
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What is the effect of [intervention] on [outcome] in [population]?"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Formulate a clear, focused question that your study aims to answer
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hypothesis
                </label>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center text-sm">
                      <input type="radio" name="hypothesis" className="mr-2" defaultChecked />
                      <span>Superiority (Treatment A is better than Treatment B)</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center text-sm">
                      <input type="radio" name="hypothesis" className="mr-2" />
                      <span>Non-inferiority (Treatment A is not worse than Treatment B)</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center text-sm">
                      <input type="radio" name="hypothesis" className="mr-2" />
                      <span>Equivalence (Treatment A is similar to Treatment B)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Study Population
                </label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the target population for your study"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Define Your Variables</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Outcome Variable
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Blood pressure reduction"
                />
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Continuous</option>
                      <option>Categorical</option>
                      <option>Binary</option>
                      <option>Time-to-event</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit of Measurement
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., mmHg"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Independent Variable / Intervention
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Drug treatment"
                />
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Categorical</option>
                      <option>Continuous</option>
                      <option>Binary</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Groups
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="2"
                      min="1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                  <span>Covariates / Control Variables</span>
                  <Button variant="outline" size="sm" className="text-xs h-7">+ Add Variable</Button>
                </label>
                <div className="border border-gray-200 rounded-md p-4">
                  <p className="text-sm text-gray-500">No covariates added yet</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Sample Size Calculation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="font-medium text-blue-800 mb-2">Recommended Statistical Test</h3>
                <p className="text-blue-700">Two-sample t-test</p>
                <p className="text-sm text-blue-600 mt-2">
                  Based on your study design and variables, we recommend using a two-sample t-test to analyze your primary outcome.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Effect Size
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.5"
                      step="0.1"
                    />
                    <div className="bg-gray-100 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md text-gray-500 text-sm flex items-center">
                      Cohen's d
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Power
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="80"
                      min="50"
                      max="99"
                    />
                    <div className="bg-gray-100 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md text-gray-500 text-sm flex items-center">
                      %
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Significance Level (α)
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.05"
                      step="0.01"
                      min="0.01"
                      max="0.1"
                    />
                    <div className="bg-gray-100 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md text-gray-500 text-sm flex items-center">
                      α
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Allocation Ratio
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1"
                      min="0.1"
                      step="0.1"
                    />
                    <div className="bg-gray-100 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md text-gray-500 text-sm flex items-center">
                      n₂:n₁
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Required Sample Size</h3>
                  <Button variant="outline" size="sm" className="text-xs">Recalculate</Button>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="text-sm text-gray-500">Group 1</p>
                    <p className="text-2xl font-bold text-blue-600">64</p>
                    <p className="text-xs text-gray-500">participants</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="text-sm text-gray-500">Group 2</p>
                    <p className="text-2xl font-bold text-blue-600">64</p>
                    <p className="text-xs text-gray-500">participants</p>
                  </div>
                </div>
                <div className="mt-2 bg-white p-3 rounded border border-gray-200">
                  <p className="text-sm text-gray-500">Total Sample Size</p>
                  <p className="text-2xl font-bold text-blue-600">128</p>
                  <p className="text-xs text-gray-500">participants</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Study Protocol</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 p-4 rounded-md">
                <h3 className="font-medium text-green-800 mb-2">Protocol Generated</h3>
                <p className="text-green-700">
                  Your study protocol has been generated based on the information you provided.
                </p>
              </div>

              <div className="border border-gray-200 rounded-md">
                <div className="border-b border-gray-200 p-4">
                  <h3 className="font-medium">Protocol Sections</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">1. Introduction</h4>
                      <p className="text-sm text-gray-500">Background and rationale</p>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">2. Methods</h4>
                      <p className="text-sm text-gray-500">Study design, participants, procedures</p>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">3. Statistical Analysis Plan</h4>
                      <p className="text-sm text-gray-500">Primary and secondary analyses</p>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">4. Data Management</h4>
                      <p className="text-sm text-gray-500">Collection, storage, and quality control</p>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline">Download Protocol (PDF)</Button>
                <Button variant="outline">Download Protocol (DOCX)</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button 
          variant="outline"
          onClick={() => setActiveStep(prev => Math.max(prev - 1, 1))}
          disabled={activeStep === 1}
        >
          Previous Step
        </Button>
        
        {activeStep < steps.length ? (
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setActiveStep(prev => Math.min(prev + 1, steps.length))}
          >
            Next Step
          </Button>
        ) : (
          <Link href="/">
            <Button className="bg-green-600 hover:bg-green-700">
              Complete Study Design
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
