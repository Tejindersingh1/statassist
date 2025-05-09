'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StudyTypeSelector } from './components/StudyTypeSelector';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type StudyType = 'RCT' | 'DiagnosticAccuracy' | 'Cohort';

export default function NewStudyPage() {
  const [selectedType, setSelectedType] = useState<StudyType | null>(null);
  const [step, setStep] = useState<number>(1);
  const router = useRouter();

  const handleStudyTypeSelect = (type: StudyType) => {
    setSelectedType(type);
    setStep(2);
  };

  const handleCreateStudy = async () => {
    try {
      // In a real implementation, this would call the API to create a study
      const response = await fetch('/api/v1/studies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Uncomment if you implement auth
        },
        body: JSON.stringify({
          title: `New ${selectedType} Study`,
          description: 'Study created with Stat-Assist',
          design_type: selectedType
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create study');
      }

      const data = await response.json();
      router.push(`/studies/${data.id}/design`);
    } catch (error) {
      console.error('Error creating study:', error);
      // In a real implementation, this would show an error toast
      alert('Failed to create study. Please try again.');
    }
  };

  return (
    <div className="container max-w-6xl py-8">
      <Button 
        variant="ghost" 
        className="mb-6 pl-0 flex items-center gap-2"
        onClick={() => router.push('/dashboard')}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>

      {step === 1 && (
        <StudyTypeSelector 
          onSelect={handleStudyTypeSelect} 
          selectedType={selectedType} 
        />
      )}

      {step === 2 && (
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Create New {selectedType} Study</h1>
            <p className="text-muted-foreground">
              You're about to create a new {selectedType} study. Click continue to start designing your study.
            </p>
          </div>

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setStep(1)}
            >
              Back
            </Button>
            <Button 
              onClick={handleCreateStudy}
            >
              Create Study and Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
