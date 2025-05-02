import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

type StudyType = 'RCT' | 'DiagnosticAccuracy' | 'Cohort';

interface StudyTypeSelectorProps {
  onSelect: (type: StudyType) => void;
  selectedType: StudyType | null;
}

export function StudyTypeSelector({ onSelect, selectedType }: StudyTypeSelectorProps) {
  const studyTypes = [
    {
      id: 'RCT',
      title: 'Randomized Controlled Trial',
      description: 'Compare outcomes between intervention and control groups with random assignment.',
      examples: 'Drug efficacy, treatment comparison',
      icon: '🔄'
    },
    {
      id: 'DiagnosticAccuracy',
      title: 'Diagnostic Accuracy Study',
      description: 'Evaluate how well a diagnostic test identifies a target condition.',
      examples: 'Sensitivity/specificity, ROC analysis',
      icon: '🔍'
    },
    {
      id: 'Cohort',
      title: 'Cohort Study',
      description: 'Follow groups of people over time to study outcomes associated with exposures.',
      examples: 'Risk factors, prognostic studies',
      icon: '👥'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Select Study Type</h1>
        <p className="text-muted-foreground">
          Choose the type of study you want to design. This will determine the workflow and statistical methods.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {studyTypes.map((type) => (
          <Card 
            key={type.id}
            className={`cursor-pointer transition-all hover:border-primary ${
              selectedType === type.id ? 'border-2 border-primary' : ''
            }`}
            onClick={() => onSelect(type.id as StudyType)}
          >
            <CardHeader className="relative">
              {selectedType === type.id && (
                <div className="absolute top-4 right-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
              )}
              <div className="text-3xl mb-2">{type.icon}</div>
              <CardTitle>{type.title}</CardTitle>
              <CardDescription>{type.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                <span className="font-semibold">Examples:</span> {type.examples}
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                variant={selectedType === type.id ? "default" : "outline"} 
                className="w-full"
                onClick={() => onSelect(type.id as StudyType)}
              >
                {selectedType === type.id ? 'Selected' : 'Select'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-end mt-8">
        <Button 
          size="lg" 
          disabled={!selectedType}
          onClick={() => selectedType && onSelect(selectedType)}
        >
          Continue to Design
        </Button>
      </div>
    </div>
  );
}
