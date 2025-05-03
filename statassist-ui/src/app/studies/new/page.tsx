'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StudyTypeSelector } from './components/StudyTypeSelector';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ChevronRight } from 'lucide-react';

type StudyType = 'RCT' | 'DiagnosticAccuracy' | 'Cohort' | 'CrossSectional' | 'CaseControl';

export default function NewStudyPage() {
  const [selectedType, setSelectedType] = useState<StudyType | null>(null);
  const [step, setStep] = useState<number>(1);
  const [studyTitle, setStudyTitle] = useState('');
  const [studyDescription, setStudyDescription] = useState('');
  const router = useRouter();

  const handleStudyTypeSelect = (type: StudyType) => {
    setSelectedType(type);
    setStep(2);
  };

  const handleCreateStudy = async () => {
    try {
      // For demo purposes, we'll just simulate creating a study
      // In a real implementation, this would call the API
      console.log('Creating study:', {
        title: studyTitle || `New ${selectedType} Study`,
        description: studyDescription || 'Study created with StatAssist',
        design_type: selectedType
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to the study design page
      // In a real app, this would use the returned study ID
      router.push(`/studies/new-study/design`);
    } catch (error) {
      console.error('Error creating study:', error);
      alert('Failed to create study. Please try again.');
    }
  };

  return (
    <div className="container max-w-6xl py-8">
      <Button 
        variant="ghost" 
        className="mb-6 pl-0 flex items-center gap-2 text-gray-600 hover:text-black hover:bg-transparent"
        onClick={() => router.push('/')}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Button>

      {step === 1 && (
        <StudyTypeSelector 
          onSelect={handleStudyTypeSelect} 
          selectedType={selectedType} 
        />
      )}

      {step === 2 && (
        <div className="space-y-8 max-w-2xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Create New {selectedType} Study</h1>
            <p className="text-gray-600">
              Provide basic information about your study to get started
            </p>
          </div>

          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="studyTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Study Title
                </label>
                <input
                  type="text"
                  id="studyTitle"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`New ${selectedType} Study`}
                  value={studyTitle}
                  onChange={(e) => setStudyTitle(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="studyDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  id="studyDescription"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Briefly describe the purpose of your study"
                  value={studyDescription}
                  onChange={(e) => setStudyDescription(e.target.value)}
                />
              </div>
            </div>
          </Card>

          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              className="border-gray-300 text-gray-700"
              onClick={() => setStep(1)}
            >
              Back to Study Types
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 gap-2"
              onClick={handleCreateStudy}
            >
              Create Study <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
